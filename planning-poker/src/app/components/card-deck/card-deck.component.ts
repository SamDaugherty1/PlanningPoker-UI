import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokerCard } from '../../models/poker-card';
import { AppStateService } from '../../services/app-state.service';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
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
    { value: PokerCard.One, selected: false },
    { value: PokerCard.Two, selected: false },
    { value: PokerCard.Three, selected: false },
    { value: PokerCard.Five, selected: false },
    { value: PokerCard.Eight, selected: false },
    { value: PokerCard.Thirteen, selected: false },
    { value: PokerCard.TwentyOne, selected: false },
    { value: PokerCard.ThirtyFour, selected: false },
    { value: PokerCard.Coffee, selected: false },
    { value: PokerCard.Infinity, selected: false }
  ];

  ngOnInit() {
    // Update card selection when user changes
    this.subscriptions.add(
      this.userService.currentUser$.subscribe(user => {
        this.cards.forEach(card => {
          card.selected = card.value === user?.card;
        });
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  async selectCard(selectedCard: CardOption) {
    const currentUser = this.userService.getCurrentUser();
    if (!currentUser || currentUser.viewOnly) return;

    // If clicking the currently selected card, deselect it
    if (currentUser.card === selectedCard.value) {
      this.cards.forEach(card => card.selected = false);
      this.userService.updateCard(null);
      await this.appState.selectCard(null);
    } else {
      // Update selection in UI
      this.cards.forEach(card => {
        card.selected = card === selectedCard;
      });

      // Update user's card and notify server
      this.userService.updateCard(selectedCard.value);
      await this.appState.selectCard(selectedCard.value);
    }
  }

  toggleHelpModal() {
    this.showHelpModal = !this.showHelpModal;
  }
}
