import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-container">
      <div class="stat-item">
        <span class="stat-label">Average:</span>
        <span class="stat-value">{{ average || '-' }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Participation:</span>
        <span class="stat-value">{{ participation }}%</span>
      </div>
    </div>
  `,
  styles: [`
    .stats-container {
      display: flex;
      gap: 2rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .stat-label {
      color: #666;
      font-size: 0.9rem;
    }

    .stat-value {
      font-weight: 500;
      color: #1976d2;
      font-size: 1.1rem;
    }
  `]
})
export class StatsDisplayComponent {
  @Input() average: string | null = null;
  @Input() participation: number = 0;
}
