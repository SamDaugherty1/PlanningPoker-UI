import { Injectable } from '@angular/core';
import { PokerHubConnectionService } from './poker-hub-connection.service';

@Injectable({
  providedIn: 'root'
})
export class PokerService {
  constructor(private pokerHubConnection: PokerHubConnectionService) {}

  async showCards(): Promise<void> {
    await this.pokerHubConnection.showCards();
  }

  async resetCards(): Promise<void> {
    await this.pokerHubConnection.resetCards();
  }
}
