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
    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      this.hubConnection.invoke('joinGame', currentUser.name, false);
    }
  }

  private registerHandlers() {
    this.hubConnection.on('updatePlayers', (players: Player[]) => {
      console.log('Received players update:', players);
      const currentUser = this.userService.getCurrentUser();
      if (!currentUser) {
        console.log('No current user, using server list');
        this._players.next(players);
        return;
      }

      // Get server's version of current user
      const serverCurrentUser = players.find(p => p.name === currentUser.name);
      // Get other players
      const otherPlayers = players.filter(p => p.name !== currentUser.name);
      
      // Update current user's card if it changed on server
      if (serverCurrentUser && serverCurrentUser.card !== currentUser.card) {
        console.log('Updating current user card:', serverCurrentUser.card);
        this.userService.updateCard(serverCurrentUser.card);
        currentUser.card = serverCurrentUser.card;
      }

      // Update player list with current user first
      console.log('Updating player list - Current User:', currentUser, 'Other Players:', otherPlayers);
      this._players.next([currentUser, ...otherPlayers]);
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
