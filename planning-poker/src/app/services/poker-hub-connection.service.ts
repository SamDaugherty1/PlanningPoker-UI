import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from '../../environments/environment';
import { Player } from '../models/player';
import { PokerCard } from '../models/poker-card';
import { GameEventService } from './game-event.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PokerHubConnectionService {
  private hubConnection: HubConnection;
  private isConnected = false;

  constructor(
    private gameEvents: GameEventService,
    private userService: UserService
  ) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/api/connect`)
      .withAutomaticReconnect()
      .build();

    this.setupHubCallbacks();
  }

  public async ensureConnection(): Promise<void> {
    if (!this.isConnected) {
      try {
        await this.hubConnection.start();
        this.isConnected = true;
        console.log('Connected to SignalR Hub');
      } catch (error) {
        console.error('Error connecting to SignalR Hub:', error);
        throw error;
      }
    }
  }

  public async joinGame(gameId: string, playerName: string, viewOnly = false): Promise<void> {
    await this.ensureConnection();
    try {
      await this.hubConnection.invoke('JoinGame', gameId, playerName, viewOnly);
      console.log('Joined game:', gameId);
    } catch (error) {
      console.error('Error joining game:', error);
      throw error;
    }
  }

  public async selectCard(card: PokerCard | null): Promise<void> {
    await this.ensureConnection();
    try {
      await this.hubConnection.invoke('SelectCard', card);
    } catch (error) {
      console.error('Error selecting card:', error);
      throw error;
    }
  }

  public async showCards(): Promise<void> {
    await this.ensureConnection();
    try {
      await this.hubConnection.invoke('ShowCards');
    } catch (error) {
      console.error('Error showing cards:', error);
      throw error;
    }
  }

  public async resetCards(): Promise<void> {
    await this.ensureConnection();
    try {
      await this.hubConnection.invoke('ResetCards');
    } catch (error) {
      console.error('Error resetting cards:', error);
      throw error;
    }
  }

  public on(methodName: string, callback: (...args: any[]) => void): void {
    this.hubConnection.on(methodName, callback);
  }

  private setupHubCallbacks(): void {
    this.hubConnection.on('UpdatePlayers', (players: Player[]) => {
      this.gameEvents.emitUpdatePlayers(players);
    });

    this.hubConnection.on('ShowCards', () => {
      this.gameEvents.emitShowCards();
    });

    this.hubConnection.on('ResetCards', () => {
      this.gameEvents.emitResetCards();
    });

    this.hubConnection.onreconnected(() => {
      console.log('Reconnected to SignalR Hub');
      const currentUser = this.userService.getCurrentUser();
      if (currentUser) {
        this.joinGame(currentUser.gameId, currentUser.name,  currentUser.viewOnly).catch(console.error);
      }
    });
  }
}
