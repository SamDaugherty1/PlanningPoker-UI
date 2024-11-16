import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class PokerHubConnectionService {

  private hubConnection!: signalR.HubConnection;
  constructor() {
    this.startConnection();
   }

  private async startConnection() {
    console.log('starting connection 1')

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('api/connect')
      .build();

    this.hubConnection.onclose(async () => {
      console.log('disconnected... reconecting')
      await this.connect();
    });

    this.connect();
  }

  private  async connect() {
    console.log('conecting... fetch')
    await this.hubConnection.start().then(x => console.log('finished')).catch(e => console.error(e));
    console.log(this.hubConnection.state)
  }

  public async invoke(method: string, ...args:any[]) {
    return await this.hubConnection.invoke(method, args);
  }
}
