import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-box">
        <h2>Welcome to Planning Poker</h2>
        <p>Enter your name to join a game</p>
        <div class="form-group">
          <input 
            type="text" 
            [(ngModel)]="playerName" 
            placeholder="Your name"
            (keyup.enter)="login()"
            class="form-control">
        </div>
        <button 
          (click)="login()" 
          [disabled]="!playerName || !playerName.trim()"
          class="login-button">
          Join Game
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
      margin-bottom: 1rem;
      color: #333;
    }
    p {
      color: #666;
      margin-bottom: 1.5rem;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    .login-button {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .login-button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
    .login-button:hover:not(:disabled) {
      background-color: #0056b3;
    }
  `]
})
export class LoginComponent {
  playerName: string = '';
  private router = inject(Router);
  private userService = inject(UserService);

  login() {
    if (this.playerName && this.playerName.trim()) {
      this.userService.setCurrentUser(this.playerName.trim());
      this.router.navigate(['/game']);
    }
  }
}
