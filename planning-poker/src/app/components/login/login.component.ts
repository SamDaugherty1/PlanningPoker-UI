import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PokerHubConnectionService } from '../../services/poker-hub-connection.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-box">
        <h2>Welcome to Planning Poker</h2>
        <div class="form-group">
          <input 
            type="text" 
            [(ngModel)]="playerName" 
            placeholder="Your name"
            (keyup.enter)="login()"
            class="form-control">
        </div>
        <div class="form-group">
          <input 
            type="text" 
            [(ngModel)]="gameId" 
            placeholder="Game ID (leave empty to create new game)"
            (keyup.enter)="login()"
            class="form-control">
        </div>
        <div class="form-group checkbox-group">
          <label>
            <input 
              type="checkbox" 
              [(ngModel)]="viewOnly">
            Join as observer
          </label>
        </div>
        <button 
          (click)="login()" 
          [disabled]="!playerName || !playerName.trim()"
          class="login-button">
          {{ gameId ? 'Join Game' : 'Create Game' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      background-color: #f5f5f5;
    }
    .login-box {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
      max-width: 400px;
      width: 90%;
    }
    h2 {
      margin-bottom: 1.5rem;
      color: #333;
    }
    .form-group {
      margin-bottom: 1rem;
      text-align: left;
    }
    .checkbox-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #666;
        cursor: pointer;
      }

      input[type="checkbox"] {
        width: 1rem;
        height: 1rem;
        cursor: pointer;
      }
    }
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.2s;

      &:focus {
        outline: none;
        border-color: #007bff;
      }

      &::placeholder {
        color: #999;
      }
    }
    .login-button {
      width: 100%;
      padding: 0.75rem;
      border: none;
      border-radius: 4px;
      background-color: #007bff;
      color: white;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover:not(:disabled) {
        background-color: #0056b3;
      }

      &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
      }
    }
  `]
})
export class LoginComponent {
  private router = inject(Router);
  private userService = inject(UserService);
  private hubConnection = inject(PokerHubConnectionService);

  playerName = '';
  gameId = '';
  viewOnly = false;

  async login() {
    if (this.playerName.trim()) {
      // Set user in service
      this.userService.setCurrentUser({
        name: this.playerName.trim(),
        gameId: this.gameId.trim() || crypto.randomUUID(),
        viewOnly: this.viewOnly
      });

      // Navigate to game
      this.router.navigate(['/game']);
    }
  }
}
