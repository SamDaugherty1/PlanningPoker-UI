import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokerCard } from '../../models/poker-card';
import { AppStateService } from '../../services/app-state.service';
import { UserService } from '../../services/user.service';
import { Subscription, combineLatest } from 'rxjs';
import { HelpModalComponent } from '../help-modal/help-modal.component';

interface CardOption {
  value: PokerCard;
  selected: boolean;
}

@Component({
  selector: 'app-card-deck',
  standalone: true,
  imports: [CommonModule, HelpModalComponent],
  templateUrl: './card-deck.component.html',
  styleUrls: ['./card-deck.component.scss']
})
export class CardDeckComponent implements OnInit, OnDestroy {
  private appState = inject(AppStateService);
  private userService = inject(UserService);
  private subscriptions = new Subscription();

  infinity = PokerCard.Infinity;
  coffee = PokerCard.Coffee;
  showHelpModal = false;

  cards: CardOption[] = [
    { value: PokerCard.Zero, selected: false },
    { value: PokerCard.One, selected: false },
    { value: PokerCard.Two, selected: false },
    { value: PokerCard.Three, selected: false },
    { value: PokerCard.Five, selected: false },
    { value: PokerCard.Eight, selected: false },
    { value: PokerCard.Thirteen, selected: false },
    { value: PokerCard.TwentyOne, selected: false },
    { value: PokerCard.Infinity, selected: false },
    { value: PokerCard.Coffee, selected: false },
  ];

  ngOnInit() {
    // Subscribe to both current user and show cards state
    this.subscriptions.add(
      combineLatest([
        this.userService.currentUser$,
        this.appState.showCards$
      ]).subscribe(([player, showCards]) => {
        // Reset selection when cards are shown
        if (showCards) {
          this.cards.forEach(card => card.selected = false);
        }
        // Update selected card based on current user's card
        else if (player) {
          this.cards.forEach(card => {
            card.selected = card.value === player.card;
          });
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  selectCard(selectedCard: CardOption) {
    const currentUser = this.userService.getCurrentUser();
    if (!currentUser || selectedCard.selected) return;

    // Update selection in UI
    this.cards.forEach(card => {
      card.selected = card === selectedCard;
    });

    // Update user's card and notify server
    this.userService.updateCard(selectedCard.value);
    this.appState.selectCard(selectedCard.value);
  }

  toggleHelpModal() {
    this.showHelpModal = !this.showHelpModal;
  }
}
