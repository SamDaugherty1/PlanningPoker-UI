import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Player } from '../models/player';

@Injectable({
  providedIn: 'root'
})
export class GameEventService {
  private showCardsSubject = new Subject<void>();
  private resetCardsSubject = new Subject<void>();
  private updatePlayersSubject = new Subject<Player[]>();

  showCards$ = this.showCardsSubject.asObservable();
  resetCards$ = this.resetCardsSubject.asObservable();
  updatePlayers$ = this.updatePlayersSubject.asObservable();

  emitShowCards() {
    this.showCardsSubject.next();
  }

  emitResetCards() {
    this.resetCardsSubject.next();
  }

  emitUpdatePlayers(players: Player[]) {
    this.updatePlayersSubject.next(players);
  }
}
