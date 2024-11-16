import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { UserService } from '../services/user.service';
import { PokerHubConnectionService } from '../services/poker-hub-connection.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const hubConnection = inject(PokerHubConnectionService);

  if (userService.isLoggedIn()) {
    // join game
    const currentUser = userService.getCurrentUser();
    if (currentUser) {
      console.log('Joining game...');
      hubConnection.invoke('joinGame', currentUser.name, false);
    }
    return true;
  }

  // Redirect to login page
  router.navigate(['/login']);
  return false;
};
