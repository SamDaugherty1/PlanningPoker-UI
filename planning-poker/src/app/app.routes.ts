import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PokerTableComponent } from './components/poker-table/poker-table.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'game',
    component: PokerTableComponent,
    canActivate: [authGuard]
  }
];
