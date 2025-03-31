import { createContext } from "react";

export type GameStatus = "default" | "locked" | "completed" | "taken";

export interface Game {
  id?: number | string;
  name: string;
  path?: string;
  icon?: string;
  status?: GameStatus;
}

export interface GameContextType {
  games: Game[];
  setGames: React.Dispatch<React.SetStateAction<Game[]>>;
  completeGame: (index: number) => void;
}

export const GameContext = createContext<GameContextType | undefined>(undefined);
