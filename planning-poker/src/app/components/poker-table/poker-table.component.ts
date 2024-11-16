import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { CardComponent } from '../card-deck/card/card.component';
import { UserService } from '../../services/user.service';
import { AppStateService } from '../../services/app-state.service';
import { map } from 'rxjs';
import { PokerCard } from '../../models/poker-card';
import { StatsDisplayComponent } from '../stats-display/stats-display.component';

@Component({
  selector: 'app-poker-table',
  standalone: true,
  imports: [CommonModule, CardComponent, StatsDisplayComponent],
  templateUrl: './poker-table.component.html',
  styleUrls: ['./poker-table.component.scss']
})
export class PokerTableComponent implements OnInit {
  private readonly appState = inject(AppStateService);
  players$ = this.appState.allPlayers$;
  showCards$ = this.appState.showCards$;

  // Calculate average of valid card values
  average$ = this.players$.pipe(
    map(players => {
      const validCards = players
        .map(p => p.card)
        .filter(card => 
          card !== undefined && 
          card !== null && 
          card !== PokerCard.Coffee && 
          card !== PokerCard.Infinity
        );

      if (validCards.length === 0) return null;

      const sum = validCards.reduce((acc, curr) => acc + curr, 0);
      return (sum / validCards.length).toFixed(1);
    })
  );

  // Calculate percentage of players who have selected cards
  participation$ = this.players$.pipe(
    map(players => {
      const totalPlayers = players.length;
      const playersWithCards = players.filter(p => p.card !== undefined && p.card !== null).length;
      return Math.round((playersWithCards / totalPlayers) * 100);
    })
  );

  toggleCards() {
    this.appState.toggleCards();
  }

  resetTable() {
    this.appState.resetTable();
  }

  ngOnInit(): void {}

  getPlayerPosition(index: number, totalPlayers: number) {
    // Start from bottom (90 degrees) and distribute players clockwise
    // In mathematics, 90 degrees points upward, but in our coordinate system it points downward
    const startAngle = 90;
    const angleStep = 360 / totalPlayers;
    const angle = startAngle - (angleStep * index); // Subtract to go clockwise
    const radius = 150; // Distance from the center
  
    // Convert angle to radians and calculate position
    const angleInRadians = (angle * Math.PI) / 180;
    const x = 200 + radius * Math.cos(angleInRadians);
    const y = 200 + radius * Math.sin(angleInRadians);
  
    return {
      left: `${x}px`,
      top: `${y}px`,
    };
  }
}
