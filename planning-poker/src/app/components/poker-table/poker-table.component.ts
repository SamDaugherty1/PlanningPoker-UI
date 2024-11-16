import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CardComponent } from '../card-deck/card/card.component';
import { UserService } from '../../services/user.service';
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'app-poker-table',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './poker-table.component.html',
  styleUrl: './poker-table.component.scss'
})
export class PokerTableComponent implements OnInit{

  private readonly appState = inject(AppStateService);

  players$ = this.appState.allPlayers$;

  ngOnInit(): void {
    
  }

  showCards = false;

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
