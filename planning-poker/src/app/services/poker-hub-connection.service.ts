import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PokerHubConnectionService {
  private hubConnection!: signalR.HubConnection;
  private connectionPromise: Promise<void> | null = null;
  private readonly maxRetries = 3;
  private readonly retryIntervalMs = 2000;

  constructor() {
    this.startConnection();
  }

  private async startConnection() {
    console.log('Initializing SignalR connection');

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/api/connect`)
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000]) // Retry with increasing intervals up to 30 seconds
      .build();

    this.hubConnection.onclose(async () => {
      console.log('Connection closed, attempting to reconnect...');
      await this.connect();
    });

    this.hubConnection.onreconnected(() => {
      console.log('Connection reestablished');
    });

    this.hubConnection.onreconnecting(() => {
      console.log('Attempting to reconnect...');
    });

    this.hubConnection.on('connect', () => {
      console.log('Connected to SignalR hub');
    });

    await this.connect();
  }

  private async connect() {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise<void>(async (resolve, reject) => {
      let retryCount = 0;

      while (retryCount < this.maxRetries) {
        try {
          if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
            resolve();
            return;
          }

          if (this.hubConnection.state === signalR.HubConnectionState.Disconnected) {
            await this.hubConnection.start();
            console.log(`Connection established successfully - State: ${this.hubConnection.state}`);
            resolve();
            return;
          }
        } catch (error) {
          console.error(`Connection attempt ${retryCount + 1} failed:`, error);
          retryCount++;
          
          if (retryCount === this.maxRetries) {
            reject(new Error(`Failed to connect after ${this.maxRetries} attempts`));
            return;
          }

          await new Promise(r => setTimeout(r, this.retryIntervalMs));
        }
      }
    }).finally(() => {
      this.connectionPromise = null;
    });

    return this.connectionPromise;
  }

  public async invoke(method: string, ...args: any[]) {
    if (this.hubConnection.state !== signalR.HubConnectionState.Connected) {
      try {
        await this.connect();
      } catch (error) {
        throw new Error(`Failed to establish connection: ${error}`);
      }
    }

    try {
      return await this.hubConnection.invoke(method, ...args);
    } catch (error) {
      console.error(`Error invoking method ${method}:`, error);
      throw error;
    }
  }

  public on(methodName: string, callback: (...args: any[]) => void) {
    this.hubConnection.on(methodName, callback);
  }

  public off(methodName: string, callback: (...args: any[]) => void) {
    this.hubConnection.off(methodName, callback);
  }
}
