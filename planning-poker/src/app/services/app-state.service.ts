import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Player } from '../models/player';
import { UserService } from './user.service';
import { PokerCard } from '../models/poker-card';
import { PokerService } from './poker.service';


@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  constructor() { }

  private userService = inject(UserService);
  private pokerService = inject(PokerService);
  public currentPlayer$ = new BehaviorSubject<Player>({
    name: 'Sam'
  });

  public showCards = new BehaviorSubject<boolean>(false);

  private readonly _players = new BehaviorSubject<Player[]>([
    {
      name:'Bob',
      card: PokerCard.Five
      
    },
    {
      name: 'Susan',
      card: PokerCard.Coffee
    },
    {
      name: 'Jim',
      card: PokerCard.Thirteen
    }
  ]);

  public allPlayers$ = combineLatest([this.currentPlayer$, this._players]).pipe(map(([player, players]) => {
    return [player, ...players];
  }));

  selectCard(card: PokerCard) {
    this.currentPlayer$.next({
      ...this.currentPlayer$.value,
      card: this.currentPlayer$.value.card === card ? null : card
    });
  }

  showAllCards() {
    this.pokerService.showCards();
  }
}
