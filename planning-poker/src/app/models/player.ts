import { PokerCard } from "./poker-card";

export interface Player {
    name: string;
    card?: PokerCard | null;
}