import { inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { PokerHubConnectionService } from './poker-hub-connection.service';

@Injectable({
  providedIn: 'root'
})
export class PokerService {

  private readonly pokerHubConnection = inject(PokerHubConnectionService);
  constructor() { }

  public async showCards() {
    return await this.pokerHubConnection.invoke('showCards');
  }  
}
