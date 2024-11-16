import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardDeckComponent } from '../card-deck/card-deck.component';
import { AppStateService } from '../../services/app-state.service';
import { PokerCard } from '../../models/poker-card';
import { Player } from '../../models/player';
import { Subscription, map, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-poker-table',
  standalone: true,
  imports: [CommonModule, CardDeckComponent],
  templateUrl: './poker-table.component.html',
  styleUrls: ['./poker-table.component.scss']
})
export class PokerTableComponent implements OnInit, OnDestroy {
  private appState = inject(AppStateService);
  private subscriptions = new Subscription();

  players$ = this.appState.players$;
  showCards$ = this.appState.showCards$;
  allCardsSubmitted$ = this.appState.players$.pipe(
    map(players => players.some((p: Player) => !p.viewOnly && p.card !== null))
  );

  infinity = PokerCard.Infinity;
  coffee = PokerCard.Coffee;

  averageEstimate$ = this.appState.players$.pipe(
    map(players => {
      const estimates = players
        .filter((p: Player) => !p.viewOnly)
        .map(p => p.card)
        .filter(card => card !== null && card !== PokerCard.Coffee && card !== PokerCard.Infinity) as number[];

      if (estimates.length === 0) return null;

      return estimates.reduce((a, b) => a + b, 0) / estimates.length;
    })
  );

  ngOnInit() {
    // Watch for all cards submitted
    this.subscriptions.add(
      this.appState.players$.pipe(
        distinctUntilChanged((prev, curr) => {
          if (prev.length !== curr.length) return false;

          const prevPlayers = prev as Player[];
          const currPlayers = curr as Player[];

          return JSON.stringify(prevPlayers.map(p => p.card)) ===
                 JSON.stringify(currPlayers.map(p => p.card));
        })
      ).subscribe(players => {
        // Check if all non-view-only players have submitted cards
        const participatingPlayers = players.filter((p: Player) => !p.viewOnly && p.card !== null);
        
        if (participatingPlayers.length > 1) {
          const firstCard = participatingPlayers[0].card;
          const allSame = participatingPlayers.every(p => p.card === firstCard);

          if (allSame) {
            setTimeout(() => {
              this.appState.showCards();
            }, 500);
          }
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  showCards() {
    this.appState.showCards();
  }

  resetCards() {
    this.appState.resetCards();
  }
}
