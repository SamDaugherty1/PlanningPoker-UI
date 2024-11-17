import { PokerCard } from './poker-card';

export interface BasePlayer {
    name: string;
    card: PokerCard | null;
    viewOnly: boolean;
    gameId: string;
    id: string;
}

export interface Player extends BasePlayer {
}

export interface User extends BasePlayer {
    
}