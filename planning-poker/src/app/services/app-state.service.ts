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
    // Initialize with current user
    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      this._players.next([currentUser]);
    }

    // Set up SignalR handlers
    this.registerHandlers();
  }

  private registerHandlers() {
    this.hubConnection.on('updatePlayers', (players: Player[]) => {
      this._players.next(players);
    });

    this.hubConnection.on('updateShowCards', (showCards: boolean) => {
      this._showCards.next(showCards);
    });

    this.hubConnection.on('playerJoined', (player: Player) => {
      const currentPlayers = this._players.value;
      this._players.next([...currentPlayers, player]);
    });

    this.hubConnection.on('playerLeft', (playerName: string) => {
      const currentPlayers = this._players.value;
      this._players.next(currentPlayers.filter(p => p.name !== playerName));
    });

    this.hubConnection.on('cardSelected', (playerName: string, card: number | null) => {
      const currentPlayers = this._players.value;
      this._players.next(currentPlayers.map(p => 
        p.name === playerName ? { ...p, card } : p
      ));
    });
  }

  public async showCards() {
    await this.hubConnection.invoke('showCards');
  }

  public async resetCards() {
    await this.hubConnection.invoke('resetCards');
  }

  public async selectCard(card: number | null) {
    await this.hubConnection.invoke('selectCard', card);
  }
}
