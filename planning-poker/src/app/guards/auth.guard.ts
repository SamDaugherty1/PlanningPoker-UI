import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { PokerHubConnectionService } from '../services/poker-hub-connection.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const hubConnection = inject(PokerHubConnectionService);

  const user = userService.getCurrentUser();
  
  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  try {
    // Ensure SignalR connection and join game
    await hubConnection.ensureConnection();
    await hubConnection.joinGame(user.gameId, user.name, user.viewOnly);
    
    return true;
  } catch (error) {
    console.error('Failed to join game:', error);
    userService.clearCurrentUser();
    router.navigate(['/login']);
    return false;
  }
};
