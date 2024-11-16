import { Component, inject, signal } from '@angular/core';
import { PokerCard } from '../../models/poker-card';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card/card.component';
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'app-card-deck',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './card-deck.component.html',
  styleUrl: './card-deck.component.scss'
})
export class CardDeckComponent {
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

  onSelected(value: number) {
    console.log('selected value ' + value)

    this.cards.forEach(card => {
      card.selected = card.value == value && !card.selected;
    });

    this.appState.selectCard(value);
  }
}
