import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="layout-container">
      <header class="header">
        <div class="header-content">
          <h1>Planning Poker</h1>
        </div>
      </header>

      <div class="main-container">
        <ng-content select="router-outlet"></ng-content>
      </div>

      <div class="card-deck-container">
        <ng-content select="app-card-deck"></ng-content>
      </div>

      <footer class="footer">
        <div class="footer-content">
          <p> 2024 Planning Poker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .layout-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }

    .header {
      flex-shrink: 0;
      background-color: #1976d2;
      color: white;
      padding: 0.75rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      z-index: 1;

      .header-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;

        h1 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 500;
        }
      }
    }

    .main-container {
      flex: 1;
      min-height: 0;
      position: relative;
      overflow: hidden;

      ::ng-deep router-outlet {
        display: none;
      }

      ::ng-deep router-outlet ~ * {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }

    .card-deck-container {
      flex-shrink: 0;
      background-color: #fff;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
      z-index: 1;
    }

    .footer {
      flex-shrink: 0;
      background-color: #f5f5f5;
      color: #666;
      padding: 0.75rem;
      border-top: 1px solid #e0e0e0;
      z-index: 1;

      .footer-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
        text-align: center;

        p {
          margin: 0;
          font-size: 0.875rem;
        }
      }
    }
  `]
})
export class LayoutComponent {}
