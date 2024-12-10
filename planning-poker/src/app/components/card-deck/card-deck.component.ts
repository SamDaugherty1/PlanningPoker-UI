import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokerCard } from '../../models/poker-card';
import { AppStateService } from '../../services/app-state.service';
import { Subscription } from 'rxjs';
import { HelpModalComponent } from '../help-modal/help-modal.component';
import { CardComponent } from './card/card.component';

interface CardOption {
  value: PokerCard;
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
  private subscription?: Subscription;

  infinity = PokerCard.Infinity;
  coffee = PokerCard.Coffee;
  showHelpModal = false;

  cards: CardOption[] = [
    { value: PokerCard.One },
    { value: PokerCard.Two },
    { value: PokerCard.Three },
    { value: PokerCard.Five },
    { value: PokerCard.Eight },
    { value: PokerCard.Thirteen },
    { value: PokerCard.TwentyOne },
    { value: PokerCard.ThirtyFour },
    { value: PokerCard.Coffee },
    { value: PokerCard.Infinity }
  ];

  ngOnInit() {
    // No need to subscribe to user changes since we'll get server state
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  async selectCard(selectedCard: CardOption) {
    const currentUser = this.appStateService.getCurrentUser();
    if (!currentUser || currentUser.viewOnly) return;

    // If clicking the currently selected card, deselect it
    if (currentUser.card === selectedCard.value) {
      await this.appStateService.selectCard(null);
    } else {
      await this.appStateService.selectCard(selectedCard.value);
    }
  }

  isCardSelected(card: CardOption): boolean {
    const currentUser = this.appStateService.getCurrentUser();
    return currentUser?.card === card.value;
  }

  toggleHelpModal() {
    console.log('Toggling help modal, current state:', this.showHelpModal);
    this.showHelpModal = !this.showHelpModal;
    console.log('New help modal state:', this.showHelpModal);
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
