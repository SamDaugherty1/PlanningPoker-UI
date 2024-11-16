import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { PokerCard } from '../../models/poker-card';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card/card.component';
import { AppStateService } from '../../services/app-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-card-deck',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './card-deck.component.html',
  styleUrl: './card-deck.component.scss'
})
export class CardDeckComponent implements OnInit, OnDestroy {
  cards = [
    {text: PokerCard.One, value: PokerCard.One, selected: false},
    {text: PokerCard.Two,value: PokerCard.Two, selected: false},
    {text: PokerCard.Three,value: PokerCard.Three, selected: false},
    {text: PokerCard.Five,value: PokerCard.Five, selected: false},
    {text: PokerCard.Eight,value: PokerCard.Eight, selected: false},
    {text: PokerCard.Thirteen,value: PokerCard.Thirteen, selected: false},
    {text: 'infintiy', value: PokerCard.Infinity, selected: false, class: 'infinity'}
  ];

  private readonly appState = inject(AppStateService);
  private subscription: Subscription = new Subscription();

  ngOnInit() {
    // Subscribe to current player changes to sync card selection state
    this.subscription.add(
      this.appState.currentPlayer$.subscribe(player => {
        this.cards.forEach(card => {
          card.selected = card.value === player.card;
        });
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSelected(value: number) {
    const card = this.cards.find(c => c.value === value);
    if (card) {
      // Toggle the selected state
      card.selected = !card.selected;
      // Update the app state
      this.appState.selectCard(card.selected ? value : null);
    }
  }

  resetCards() {
    this.cards.forEach(card => card.selected = false);
  }
}
