import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PokerHubConnectionService } from '../../services/poker-hub-connection.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private hubConnection = inject(PokerHubConnectionService);

  playerName = '';
  gameId = '';
  viewOnly = false;
  gameIdFromUrl: string | null = null;

  ngOnInit() {
    // Check for game ID in both route params and query params
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.gameIdFromUrl = params['id'];
        this.gameId = params['id'];
      }
    });

    // Also check query params for backward compatibility
    this.route.queryParams.subscribe(params => {
      if (params['id'] && !this.gameIdFromUrl) {
        this.gameIdFromUrl = params['id'];
        this.gameId = params['id'];
      }
    });

    // Try to get last used name from localStorage
    const lastUser = this.userService.getCurrentUser();
    if (lastUser) {
      this.playerName = lastUser.name;
      this.viewOnly = lastUser.viewOnly || false;
    }
  }

  async login() {
    if (this.playerName.trim()) {
      const finalGameId = this.gameIdFromUrl || this.gameId.trim() || crypto.randomUUID();
      
      // Set user in service
      this.userService.setCurrentUser({
        name: this.playerName.trim(),
        gameId: finalGameId,
        viewOnly: this.viewOnly
      });

      // Navigate to game with ID in URL
      this.router.navigate(['/game', finalGameId]);
    }
  }
}
