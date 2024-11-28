import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConnectionManagerService {
  private hubConnection: HubConnection;
  private isConnected = false;

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/api/connect`)
      .withAutomaticReconnect()
      .build();
  }

  getConnection(): HubConnection {
    return this.hubConnection;
  }

  async ensureConnection(): Promise<void> {
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

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      try {
        await this.hubConnection.stop();
        this.isConnected = false;
        console.log('Disconnected from SignalR Hub');
      } catch (error) {
        console.error('Error disconnecting from SignalR Hub:', error);
        throw error;
      }
    }
  }
}
