import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CardDeckComponent } from './components/card-deck/card-deck.component';
import { PokerTableComponent } from './components/poker-table/poker-table.component';
import { PokerService } from './services/poker.service';
import { PokerHubConnectionService } from './services/poker-hub-connection.service';
import { AppStateService } from './services/app-state.service';
import { UserService } from './services/user.service';

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
      <header>
        <h1>Planning Poker</h1>
        <div class="user-info">
          {{ currentUser?.name }}
        </div>
      </header>
      <main>
        <router-outlet></router-outlet>
      </main>
      <footer>
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

    header {
      background-color: #2196f3;
      color: white;
      padding: 0.75rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      z-index: 1;
      flex-shrink: 0;

      h1 {
        margin: 0;
        font-size: 1.5rem;
      }

      .user-info {
        font-size: 1rem;
        font-weight: 500;
        padding: 0.25rem 0.5rem;
        background-color: rgba(255,255,255,0.1);
        border-radius: 4px;
      }
    }

    main {
      flex: 1;
      overflow: hidden;
      position: relative;
      min-height: 0;
      display: flex;
      flex-direction: column;

      ::ng-deep router-outlet {
        display: none;
      }

      ::ng-deep router-outlet ~ * {
        flex: 1;
        min-height: 0;
      }
    }

    footer {
      background-color: #f5f5f5;
      padding: 0.75rem;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
      z-index: 1;
      flex-shrink: 0;
    }
  `]
})
export class AppComponent implements OnInit {
  private hubConnection = inject(PokerHubConnectionService);
  private userService = inject(UserService);

  currentUser = this.userService.getCurrentUser();

  ngOnInit(): void {
  }
}
