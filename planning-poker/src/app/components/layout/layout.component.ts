import { Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CardDeckComponent } from '../card-deck/card-deck.component';
import { UserService } from '../../services/user.service';
import { User } from '../../models/player';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CardDeckComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnDestroy {
  private userService = inject(UserService);
  
  currentUser = this.userService.getCurrentUser();
  currentYear = new Date().getFullYear();
  copied = false;
  private copyTimeout: any;

  async copyGameId() {
    if (!this.currentUser?.gameId) return;

    try {
      await navigator.clipboard.writeText(this.currentUser.gameId);
      this.copied = true;

      // Reset the copied state after 2 seconds
      if (this.copyTimeout) {
        clearTimeout(this.copyTimeout);
      }
      this.copyTimeout = setTimeout(() => {
        this.copied = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy game ID:', err);
    }
  }

  ngOnDestroy() {
    if (this.copyTimeout) {
      clearTimeout(this.copyTimeout);
    }
  }
}
