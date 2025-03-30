import React, { createContext, useContext, useState } from "react";

export type GameStatus = "default" | "locked" | "completed" | "taken";

export interface Game {
  id: number | string;
  name: string;
  path: string;
  status: GameStatus;
}

const initialGames: Game[] = [
  { id: 1, name: "Game 1", path: "/game1", status: "completed" },
  { id: 2, name: "Game 2", path: "/game2", status: "completed" },
  { id: 3, name: "Game 3", path: "/game3", status: "completed" },
  { id: 4, name: "Game 4", path: "/game4", status: "completed" },
  { id: 5, name: "Game 5", path: "/game5", status: "completed" },
  { id: 6, name: "Game 6", path: "/game6", status: "default" },
  { id: "treasure", name: "Treasure", path: "/treasure", status: "locked" },
];

const GameContext = createContext<{
  games: Game[];
  setGames: React.Dispatch<React.SetStateAction<Game[]>>;
  completeGame: (index: number) => void;
}>({
  games: initialGames,
  setGames: () => {},
  completeGame: () => {},
});

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [games, setGames] = useState<Game[]>(initialGames);

  const completeGame = (index: number) => {
    setGames((prevGames) => prevGames.map((game, i) => (i === index ? { ...game, status: "completed" } : game)));
  };

  return <GameContext.Provider value={{ games, setGames, completeGame }}>{children}</GameContext.Provider>;
};

export const useGameContext = () => useContext(GameContext);
