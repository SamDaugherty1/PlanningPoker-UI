import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/player';
import { PokerCard } from '../models/poker-card';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly storageKey = 'poker_user';
  private currentUserSubject = new BehaviorSubject<User | null>(this.loadUser());
  currentUser$ = this.currentUserSubject.asObservable();

  private loadUser(): User | null {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      const user = JSON.parse(stored);
      // Always reset card when loading from storage
      user.card = null;
      return user;
    }
    return null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  setCurrentUser(userData: { name: string; gameId: string; viewOnly?: boolean }) {

    localStorage.setItem(this.storageKey, JSON.stringify(userData));
    this.currentUserSubject.next(userData as User);
  }

  clearCurrentUser() {
    localStorage.removeItem(this.storageKey);
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  isInGame(gameId: string): boolean {
    const user = this.getCurrentUser();
    return !!user && user.gameId === gameId;
  }

  updateCard(card: PokerCard | null) {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, card };
      // Don't store card in localStorage
      const storageUser = { ...updatedUser, card: null };
      localStorage.setItem(this.storageKey, JSON.stringify(storageUser));
      this.currentUserSubject.next(updatedUser);
    }
  }
}
