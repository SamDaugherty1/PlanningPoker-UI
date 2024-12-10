import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Player } from '../models/player';
import { UserService } from './user.service';
import { PokerHubConnectionService } from './poker-hub-connection.service';
import { PokerCard } from '../models/poker-card';
import { GameEventService } from './game-event.service';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private userService = inject(UserService);
  private hubConnection = inject(PokerHubConnectionService);
  private gameEvents = inject(GameEventService);

  private _players = new BehaviorSubject<Player[]>([]);
  private _showCards = new BehaviorSubject<boolean>(false);

  players$ = this._players.asObservable();
  showCards$ = this._showCards.asObservable();

  constructor() {
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.gameEvents.updatePlayers$.subscribe(players => {
      const currentUser = this.userService.getCurrentUser();
      if (!currentUser) return;

      const serverCurrentUser = players.find(p => p.name === currentUser.name);
      const otherPlayers = players.filter(p => p.name !== currentUser.name);

      if (serverCurrentUser) {
        // Use server state directly
        this._players.next([serverCurrentUser, ...otherPlayers]);
      }
    });

    this.gameEvents.showCards$.subscribe(() => {
      this._showCards.next(true);
    });

    this.gameEvents.resetCards$.subscribe(() => {
      this._showCards.next(false);
      // Update players to ensure their cards are reset
      const players = this._players.value;
      const updatedPlayers = players.map(player => ({
        ...player,
        card: null
      }));
      this._players.next(updatedPlayers);
    });
  }

  public async showCards(): Promise<void> {
    await this.hubConnection.showCards();
  }

  public async resetCards(): Promise<void> {
    try {
      await this.hubConnection.resetCards();
      this.userService.resetUserCard();
    } catch (error) {
      console.error('Error resetting cards:', error);
    }
  }

  public async selectCard(card: PokerCard | null): Promise<void> {
    const currentUser = this.userService.getCurrentUser();
    if (!currentUser) return;

    try {
      await this.hubConnection.selectCard(card);
    } catch (error) {
      console.error('Error selecting card:', error);
    }
  }

  public async joinGame(gameId: string, name: string, viewOnly: boolean = false) {
    try {
      await this.hubConnection.ensureConnection();
      await this.hubConnection.joinGame(gameId, name, viewOnly);
      
      // Set initial user state - ID will be updated when server state is received
      this.userService.setCurrentUser({ name, gameId, viewOnly });
      
      // Subscribe to server state updates
      this.gameEvents.updatePlayers$.subscribe(players => {
        const currentUser = this.userService.getCurrentUser();
        if (currentUser) {
          // Find the current user in the server state and update the ID
          const serverUser = players.find(p => p.name === currentUser.name);
          if (serverUser && (!currentUser.id || currentUser.id !== serverUser.id)) {
            this.userService.updateUserId(serverUser.id);
          }
        }
      });
    } catch (error) {
      console.error('Error joining game:', error);
    }
  }

  public getCurrentUser(): Player | null {
    // Get current user from players list to ensure we have server state
    const currentUser = this.userService.getCurrentUser();
    if (!currentUser) return null;

    const serverPlayer = this._players.value.find(p => p.name === currentUser.name);
    return serverPlayer || null;
  }
}
