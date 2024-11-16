import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Player } from '../models/player';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUser = new BehaviorSubject<Player | null>(null);
  currentUser$ = this.currentUser.asObservable();

  constructor() {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUser.next(user);
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        localStorage.removeItem('currentUser');
      }
    }
  }

  setCurrentUser(username: string) {
    const player: Player = {
      name: username,
      card: null,
      viewOnly: false
    };
    localStorage.setItem('currentUser', JSON.stringify(player));
    this.currentUser.next(player);
  }

  getCurrentUser(): Player | null {
    return this.currentUser.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUser.value;
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUser.next(null);
  }

  updateCard(card: number | null) {
    const currentUser = this.currentUser.value;
    if (currentUser) {
      const updatedUser = { ...currentUser, card };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      this.currentUser.next(updatedUser);
    }
  }
}
