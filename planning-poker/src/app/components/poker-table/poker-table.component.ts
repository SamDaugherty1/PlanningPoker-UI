import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CardComponent } from '../card-deck/card/card.component';

@Component({
  selector: 'app-poker-table',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './poker-table.component.html',
  styleUrl: './poker-table.component.scss'
})
export class PokerTableComponent {

  showCards = false;

  players = [
    { name: 'Alice', selected:false },
    { name: 'Bob', selected:false },
    { name: 'Charlie', selected:false },
    { name: 'David', selected:false },
    { name: 'Eva', selected:false },
    { name: 'Frank', selected:false },
    { name: 'Grace', selected:false },
    { name: 'Hank', selected:false }
  ];

  getPlayerPosition(index: number, totalPlayers: number) {
    const angle = (360 / totalPlayers) * index; // Angle for each player
    const radius = 150; // Distance from the center
  
    const x = 200 + radius * Math.cos((angle * Math.PI) / 180); // X-position
    const y = 200 + radius * Math.sin((angle * Math.PI) / 180); // Y-position
  
    return {
      left: `${x}px`,
      top: `${y}px`,
    };
  }
  
  
}
