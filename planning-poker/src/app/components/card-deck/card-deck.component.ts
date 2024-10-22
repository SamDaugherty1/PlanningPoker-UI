import { Component, signal } from '@angular/core';
import { PokerCard } from '../../models/poker-card';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card/card.component';

@Component({
  selector: 'app-card-deck',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './card-deck.component.html',
  styleUrl: './card-deck.component.scss'
})
export class CardDeckComponent {
  cards: PokerCard[] = [
    {value: 1, selected: false},
    {value: 3, selected: false},
    {value: 5, selected: false},
    {value: 8, selected: false},
    {value: 13, selected: false},
    {value: 21, selected: false},
  ]

  onSelected(value: number) {
    console.log('selected value ' + value)

    this.cards.forEach(card => {
      card.selected = card.value == value;
    });
  }
}
