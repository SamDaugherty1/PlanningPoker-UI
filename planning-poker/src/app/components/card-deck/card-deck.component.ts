import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokerCard } from '../../models/poker-card';
import { AppStateService } from '../../services/app-state.service';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { HelpModalComponent } from '../help-modal/help-modal.component';
import { CardComponent } from './card/card.component';

interface CardOption {
  value: PokerCard;
  selected: boolean;
}

@Component({
  selector: 'app-card-deck',
  standalone: true,
  imports: [CommonModule, HelpModalComponent, CardComponent],
  templateUrl: './card-deck.component.html',
  styleUrls: ['./card-deck.component.scss']
})
export class CardDeckComponent implements OnInit, OnDestroy {
  private appStateService = inject(AppStateService);
  private userService = inject(UserService);
  private subscription?: Subscription;

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
    this.subscription = this.userService.currentUser$.subscribe(user => {
      this.cards.forEach(card => {
        card.selected = card.value === user?.card;
      });
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  async selectCard(selectedCard: CardOption) {
    const currentUser = this.userService.getCurrentUser();
    if (!currentUser || currentUser.viewOnly) return;

    // If clicking the currently selected card, deselect it
    if (currentUser.card === selectedCard.value) {
      this.cards.forEach(card => card.selected = false);
      this.userService.updateCard(null);
      await this.appStateService.selectCard(null);
    } else {
      // Update selection in UI
      this.cards.forEach(card => {
        card.selected = card === selectedCard;
      });

      // Update user's card and notify server
      this.userService.updateCard(selectedCard.value);
      await this.appStateService.selectCard(selectedCard.value);
    }
  }

  toggleHelpModal() {
    this.showHelpModal = !this.showHelpModal;
  }

  hasSelectedCard(): boolean {
    return this.cards.some(card => card.selected);
  }

  getDisplayValue(value: PokerCard): string {
    switch (value) {
      case PokerCard.Infinity:
        return '∞';
      case PokerCard.Coffee:
        return '☕';
      default:
        return value.toString();
    }
  }

  isSpecialCard(value: PokerCard, type: 'infinity' | 'coffee'): boolean {
    return type === 'infinity' ? value === PokerCard.Infinity : value === PokerCard.Coffee;
  }
}
