import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Player } from '../models/player';
import { UserService } from './user.service';
import { PokerHubConnectionService } from './poker-hub-connection.service';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private userService = inject(UserService);
  private hubConnection = inject(PokerHubConnectionService);

  private _players = new BehaviorSubject<Player[]>([]);
  private _showCards = new BehaviorSubject<boolean>(false);

  public players$ = this._players.asObservable();
  public showCards$ = this._showCards.asObservable();

  constructor() {
    // Set up SignalR handlers before initializing with current user
    this.registerHandlers();
  }

  private registerHandlers() {
    this.hubConnection.on('updatePlayers', (players: Player[]) => {
      console.log('Received players update:', players);
      const currentUser = this.userService.getCurrentUser();
      if (currentUser) {
        // Find current user in server list
        const serverCurrentUser = players.find(p => p.name === currentUser.name);
        // Get other players
        const otherPlayers = players.filter(p => p.name !== currentUser.name);
        
        if (serverCurrentUser) {
          // Update current user's card if it changed on server
          if (serverCurrentUser.card !== currentUser.card) {
            this.userService.updateCard(serverCurrentUser.card);
            currentUser.card = serverCurrentUser.card;
          }
          // Update player list with current user first
          this._players.next([currentUser, ...otherPlayers]);
        } else {
          // Current user not in server list, add them first
          this._players.next([currentUser, ...otherPlayers]);
        }
      } else {
        // No current user, just use server list
        this._players.next(players);
      }
      console.log('Updated player list:', this._players.value);
    });

    this.hubConnection.on('updateShowCards', (showCards: boolean) => {
      console.log('Received show cards update:', showCards);
      this._showCards.next(showCards);
      if (!showCards) {
        // When hiding cards (reset), clear the current user's card
        const currentUser = this.userService.getCurrentUser();
        if (currentUser && currentUser.card !== null) {
          this.userService.updateCard(null);
          // Update player list to reflect card reset
          const currentPlayers = this._players.value;
          const otherPlayers = currentPlayers.filter(p => p.name !== currentUser.name);
          this._players.next([{ ...currentUser, card: null }, ...otherPlayers]);
        }
      }
    });

    this.hubConnection.on('playerJoined', (player: Player) => {
      console.log('Player joined:', player);
      const currentUser = this.userService.getCurrentUser();
      const currentPlayers = this._players.value;
      
      if (currentUser && player.name === currentUser.name) {
        // If it's us joining, update our card if needed
        if (player.card !== currentUser.card) {
          this.userService.updateCard(player.card);
          currentUser.card = player.card;
        }
        this._players.next([currentUser, ...currentPlayers.filter(p => p.name !== currentUser.name)]);
      } else {
        // Add new player to the list
        this._players.next([...currentPlayers, player]);
      }
      console.log('Updated player list after join:', this._players.value);
    });

    this.hubConnection.on('playerLeft', (playerName: string) => {
      console.log('Player left:', playerName);
      const currentPlayers = this._players.value;
      const currentUser = this.userService.getCurrentUser();
      
      if (currentUser && playerName === currentUser.name) {
        // If we're leaving, clear the list
        this._players.next([]);
      } else {
        // Remove the player who left
        this._players.next(currentPlayers.filter(p => p.name !== playerName));
      }
      console.log('Updated player list after leave:', this._players.value);
    });

    this.hubConnection.on('cardSelected', (playerName: string, card: number | null) => {
      console.log('Card selected:', playerName, card);
      const currentUser = this.userService.getCurrentUser();
      const currentPlayers = this._players.value;
      
      if (currentUser && playerName === currentUser.name) {
        // Update our card
        this.userService.updateCard(card);
        currentUser.card = card;
        this._players.next([
          currentUser,
          ...currentPlayers.filter(p => p.name !== currentUser.name)
        ]);
      } else {
        // Update other player's card
        this._players.next(currentPlayers.map(p => 
          p.name === playerName ? { ...p, card } : p
        ));
      }
      console.log('Updated player list after card selection:', this._players.value);
    });
  }

  public async showCards() {
    console.log('Showing cards');
    await this.hubConnection.invoke('showCards');
  }

  public async resetCards() {
    console.log('Resetting cards');
    await this.hubConnection.invoke('resetCards');
  }

  public async selectCard(card: number | null) {
    console.log('Selecting card:', card);
    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      // Update local state immediately for better UX
      currentUser.card = card;
      const currentPlayers = this._players.value;
      this._players.next([
        currentUser,
        ...currentPlayers.filter(p => p.name !== currentUser.name)
      ]);
      // Then notify server
      await this.hubConnection.invoke('selectCard', card);
    }
  }
}
