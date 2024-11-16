import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../services/app-state.service';
import { PokerCard } from '../../models/poker-card';

@Component({
  selector: 'app-help-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './help-modal.component.html',
  styleUrls: ['./help-modal.component.scss']
})
export class HelpModalComponent {
  @Output() close = new EventEmitter<void>();
  private readonly appState = inject(AppStateService);

  onClose() {
    console.log('Closing modal');
    this.close.emit();
  }

  selectCard(points: string) {
    let value: number | null = null;
    
    switch(points) {
      case '1': value = PokerCard.One; break;
      case '2': value = PokerCard.Two; break;
      case '3': value = PokerCard.Three; break;
      case '5': value = PokerCard.Five; break;
      case '8': value = PokerCard.Eight; break;
      case '13': value = PokerCard.Thirteen; break;
      case '21': value = 21; break;
      case '∞': value = PokerCard.Infinity; break;
      case '☕': value = PokerCard.Coffee; break;
    }

    if (value !== null) {
      this.appState.selectCard(value);
      this.close.emit();
    }
  }

  pointGuide = [
    { 
      points: '1', 
      description: 'Very simple change, well-understood, minimal risk',
      timeEstimate: '2-4 hours'
    },
    { 
      points: '2', 
      description: 'Simple change, clear path to completion',
      timeEstimate: '4-8 hours'
    },
    { 
      points: '3', 
      description: 'Well understood but involves multiple components',
      timeEstimate: '1-2 days'
    },
    { 
      points: '5', 
      description: 'Clear requirements but complex implementation',
      timeEstimate: '2-3 days'
    },
    { 
      points: '8', 
      description: 'Complex task with some unknowns',
      timeEstimate: '3-5 days'
    },
    { 
      points: '13', 
      description: 'Large, complex task with significant unknowns',
      timeEstimate: '5-10 days'
    },
    { 
      points: '21', 
      description: 'Very large task, should probably be broken down',
      timeEstimate: '2+ weeks'
    },
    { 
      points: '∞', 
      description: 'Too large or complex to estimate',
      timeEstimate: 'Unknown/needs breakdown'
    },
    { 
      points: '☕', 
      description: 'Need a break or more discussion',
      timeEstimate: 'N/A'
    }
  ];
}
