import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardDeckComponent } from '../card-deck/card-deck.component';
import { AppStateService } from '../../services/app-state.service';
import { UserService } from '../../services/user.service';
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
  private userService = inject(UserService);
  private subscriptions = new Subscription();

  players$ = this.appState.players$;
  showCards$ = this.appState.showCards$;
  currentUser$ = this.userService.currentUser$;
  
  // Enable Show Cards button when at least one non-view-only player has selected a card
  canShowCards$ = this.players$.pipe(
    map(players => {
      const nonViewOnlyPlayers = players.filter(p => !p.viewOnly);
      return nonViewOnlyPlayers.length > 0 && 
             nonViewOnlyPlayers.some(p => p.card !== null);
    })
  );

  infinity = PokerCard.Infinity;
  coffee = PokerCard.Coffee;

  averageEstimate$ = this.players$.pipe(
    map(players => {
      const estimates = players
        .filter(p => !p.viewOnly && p.card !== null)
        .map(p => p.card)
        .filter(card => 
          card !== null && 
          card !== PokerCard.Coffee && 
          card !== PokerCard.Infinity
        ) as number[];

      if (estimates.length === 0) return null;
      return estimates.reduce((a, b) => a + b, 0) / estimates.length;
    })
  );

  ngOnInit() {
    // No need to watch for matching cards anymore
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
