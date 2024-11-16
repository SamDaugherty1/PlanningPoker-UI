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

  private readonly _showCards = new BehaviorSubject<boolean>(false);
  public showCards$ = this._showCards.asObservable();

  private readonly _selectedCard = new BehaviorSubject<PokerCard | null>(null);
  public selectedCard$ = this._selectedCard.asObservable();

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

  public allPlayers$ = combineLatest([this.currentPlayer$, this._players]).pipe(
    map(([player, players]) => {
      return [player, ...players];
    })
  );

  // Helper function to get random card for testing
  private getRandomCard(): PokerCard {
    const cards = [
      PokerCard.Zero,
      PokerCard.One,
      PokerCard.Two,
      PokerCard.Three,
      PokerCard.Five,
      PokerCard.Eight,
      PokerCard.Thirteen,
      PokerCard.TwentyOne,
      PokerCard.Coffee,
      PokerCard.Infinity
    ];
    return cards[Math.floor(Math.random() * cards.length)];
  }

  selectCard(card: PokerCard | null) {
    this._selectedCard.next(card);
    this.currentPlayer$.next({
      ...this.currentPlayer$.value,
      card: card
    });
  }

  toggleCards() {
    this._showCards.next(!this._showCards.value);
  }

  resetTable() {
    // First, hide the cards to prevent any flashing of old values
    this._showCards.next(false);

    // Reset current player's card and selected card state
    this._selectedCard.next(null);
    this.currentPlayer$.next({
      ...this.currentPlayer$.value,
      card: null
    });

    // Small delay to ensure UI updates before resetting cards
    setTimeout(() => {
      // TODO: Remove this section after testing - it's only for simulating other players selecting cards
      const resetPlayers = this._players.value.map(player => ({
        ...player,
        card: null // First clear all cards
      }));
      this._players.next(resetPlayers);

      // Then, after a small delay, assign new random cards
      setTimeout(() => {
        const playersWithRandomCards = this._players.value.map(player => ({
          ...player,
          // 70% chance to assign a random card, 30% chance to have no card
          card: Math.random() < 0.7 ? this.getRandomCard() : null
        }));
        this._players.next(playersWithRandomCards);
      }, 100);
    }, 0);
  }

  showAllCards() {
    this.pokerService.showCards();
  }
}
