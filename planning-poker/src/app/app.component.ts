import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CardDeckComponent } from './components/card-deck/card-deck.component';
import { PokerTableComponent } from './components/poker-table/poker-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    CardDeckComponent,
    PokerTableComponent
  ],
  template: `
    <div class="app-container">
      <header class="header">
        <h1>Planning Poker</h1>
      </header>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <footer class="footer">
        <app-card-deck></app-card-deck>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
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
      text-align: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      z-index: 1;

      h1 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 500;
      }
    }

    .main-content {
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

    .footer {
      flex-shrink: 0;
      background-color: #fff;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
      z-index: 1;
    }
  `]
})
export class AppComponent {
  title = 'planning-poker';
}
