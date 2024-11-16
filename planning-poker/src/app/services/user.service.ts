import { Injectable } from '@angular/core';
import { Player } from '../models/player';
import { BehaviorSubject } from 'rxjs';

export interface UserState extends Player{

}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  public currentUser$ = new BehaviorSubject<UserState>({
    name: 'Sam'
  });

  constructor() { }
  
}
