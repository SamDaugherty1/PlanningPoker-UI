import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/player';
import { ConnectionManagerService } from './connection-manager.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly storageKey = 'poker_user';
  private currentUserSubject = new BehaviorSubject<User | null>(this.loadUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private connectionManager: ConnectionManagerService) {}

  private loadUser(): User | null {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      const userData = JSON.parse(stored);
      // Always start with no card selected
      return {
        ...userData,
        card: null
      };
    }
    return null;
  }

  getCurrentUser(): User | null {
    const user = this.currentUserSubject.value;
    if (user) {
      // Always ensure card is null in local state
      return { ...user, card: null };
    }
    return null;
  }

  setCurrentUser(userData: { name: string; gameId: string; viewOnly?: boolean; id?: string }) {
    // Create user with null card
    const user: User = {
      ...userData,
      card: null,
      id: userData.id || '', // ID will be assigned by server
      viewOnly: userData.viewOnly || false
    };
    
    localStorage.setItem(this.storageKey, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  resetUserCard() {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, card: null };
      localStorage.setItem(this.storageKey, JSON.stringify(updatedUser));
      this.currentUserSubject.next(updatedUser);
    }
  }

  updateUserId(id: string) {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, id };
      localStorage.setItem(this.storageKey, JSON.stringify(updatedUser));
      this.currentUserSubject.next(updatedUser);
    }
  }

  async clearCurrentUser() {
    await this.connectionManager.disconnect();
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
}
