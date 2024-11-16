import { Component, ContentChild, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() highlight = false;
  @Input() hidden = false;
  @Input() placeholder = false;
  @Input() hasValue = false; // New input to indicate if card has a value
  @Input() value?: number | null;
  @Output() onSelected = new EventEmitter<number | null>();

  select() {
    if (!this.placeholder) {
      this.onSelected.emit(this.value);
    }
  }
}
