import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { PokerTableComponent } from "./components/poker-table/poker-table.component";
import { CardDeckComponent } from './components/card-deck/card-deck.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, PokerTableComponent, CardDeckComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'planning-poker';
}
