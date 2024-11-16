import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CardDeckComponent } from './components/card-deck/card-deck.component';
import { PokerTableComponent } from './components/poker-table/poker-table.component';
import { PokerService } from './services/poker.service';
import { PokerHubConnectionService } from './services/poker-hub-connection.service';
import { AppStateService } from './services/app-state.service';
import { UserService } from './services/user.service';
import { LayoutComponent } from './components/layout/layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    CardDeckComponent,
    PokerTableComponent,
    LayoutComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private hubConnection = inject(PokerHubConnectionService);
  private userService = inject(UserService);

  currentUser = this.userService.getCurrentUser();

  ngOnInit(): void {
  }
}
