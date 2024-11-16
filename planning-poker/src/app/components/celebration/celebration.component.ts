import { Component, EventEmitter, Input, Output, ChangeDetectorRef, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-celebration',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="show" class="celebration-container">
      <div class="confetti-container">
        <div *ngFor="let confetti of confettiPieces" 
             class="confetti"
             [style.--left]="confetti.left + '%'"
             [style.--delay]="confetti.delay + 's'"
             [style.--color]="confetti.color">
        </div>
      </div>
      <div class="celebration-content">
        <h2>🎉 Everyone Agrees! 🎉</h2>
        <p>The team selected: <strong>{{ selectedValue }}</strong></p>
        <button (click)="onNewRound()" class="new-round-button">
          Start New Round
        </button>
      </div>
    </div>
  `,
  styles: [`
    .celebration-container {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(0, 0, 0, 0.7);
      z-index: 1000;
      animation: fadeIn 0.3s ease-out;
      overflow: hidden;
    }

    .confetti-container {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
    }

    .confetti {
      position: absolute;
      top: -10px;
      left: calc(var(--left) * 1%);
      width: 10px;
      height: 20px;
      background: var(--color);
      opacity: 0;
      transform-origin: center bottom;
      animation: confetti 3s ease-in-out var(--delay) forwards;
    }

    .celebration-content {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      animation: slideIn 0.3s ease-out;
      z-index: 1;
    }

    h2 {
      margin: 0 0 1rem;
      color: #2c7a51;
    }

    p {
      margin: 0 0 1.5rem;
      font-size: 1.1rem;
      color: #666;
    }

    strong {
      color: #2c7a51;
      font-size: 1.2rem;
    }

    .new-round-button {
      background: #2c7a51;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 0.75rem 1.5rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #235f3e;
        transform: translateY(-2px);
      }

      &:active {
        transform: translateY(0);
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes confetti {
      0% {
        opacity: 1;
        transform: translateY(0) rotateZ(0);
      }
      100% {
        opacity: 0;
        transform: translateY(100vh) rotateZ(720deg);
      }
    }
  `]
})
export class CelebrationComponent implements OnChanges {
  @Input() show = false;
  @Input() selectedValue: string | number = '';
  @Output() newRound = new EventEmitter<void>();

  confettiPieces: { left: number; delay: number; color: string }[] = [];
  private colors = ['#2196f3', '#4caf50', '#f44336', '#ff9800', '#9c27b0', '#e91e63'];
  private confettiCount = 100;
  private maxDelay = 2;

  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

  private getRandomColor(): string {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['show'] && changes['show'].currentValue) {
      this.ngZone.runOutsideAngular(() => {
        // Generate confetti pieces outside of Angular's change detection
        this.confettiPieces = Array.from({ length: this.confettiCount }, () => ({
          left: Math.random() * 100,
          delay: Math.random() * this.maxDelay,
          color: this.getRandomColor()
        }));

        // Manually trigger change detection once after generating confetti
        this.cdr.detectChanges();
      });
    } else {
      this.confettiPieces = [];
    }
  }

  onNewRound() {
    this.newRound.emit();
  }
}
