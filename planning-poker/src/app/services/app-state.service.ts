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

      if (serverCurrentUser && serverCurrentUser.card !== currentUser.card) {
        this.userService.updateCard(serverCurrentUser.card);
      }

      this._players.next([currentUser, ...otherPlayers]);
    });

    this.gameEvents.showCards$.subscribe(() => {
      this._showCards.next(true);
    });

    this.gameEvents.resetCards$.subscribe(() => {
      this._showCards.next(false);
      const currentUser = this.userService.getCurrentUser();
      if (currentUser && currentUser.card !== null) {
        this.userService.updateCard(null);
      }
    });
  }

  public async showCards(): Promise<void> {
    await this.hubConnection.showCards();
  }

  public async resetCards(): Promise<void> {
    await this.hubConnection.resetCards();
  }

  public async selectCard(card: PokerCard | null): Promise<void> {
    const currentUser = this.userService.getCurrentUser();
    if (!currentUser) return;

    try {
      await this.hubConnection.selectCard(card);
      this.userService.updateCard(card);

      const otherPlayers = this._players.value.filter(p => p.name !== currentUser.name);
      this._players.next([currentUser, ...otherPlayers]);
    } catch (error) {
      console.error('Error selecting card:', error);
    }
  }

  public getCurrentUser(): Player | null {
    const user = this.userService.getCurrentUser();
    if (!user) return null;
    return {...user};
  }
}
