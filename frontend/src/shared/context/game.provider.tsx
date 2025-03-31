import React, { useState } from "react";
import { GameContext, Game, GameStatus } from "./game.context";

// "default" | "locked" | "completed" | "taken";

const initialGames: Game[] = [
  { id: 1, name: "Game 1", path: "/game1", icon: "/icon/boat.png", status: "default" },
  { id: 2, name: "Game 2", path: "/game2", icon: "/icon/captain.png", status: "default" },
  { id: 3, name: "Game 3", path: "/game3", icon: "/icon/money.png", status: "default" },
  { id: 4, name: "Game 4", path: "/game4", icon: "/icon/steering-wheel.png", status: "locked" },
  { id: 5, name: "Game 5", path: "/game5", icon: "/icon/sword.png", status: "locked" },
  { id: 6, name: "Game 6", path: "/game6", icon: "/icon/key.png", status: "locked" },
  { id: "treasure", name: "Treasure", path: "/treasure", icon: "/icon/treasure-chest.png", status: "locked" },
];

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [games, setGames] = useState<Game[]>(initialGames);

  const resetGames = () => {
    setGames((prev) =>
      prev.map((game, index) => {
        if (typeof game.id === "string") return { ...game, status: "locked" }; // treasure
        if ([0, 1, 2].includes(index)) return { ...game, status: "default" };
        return { ...game, status: "locked" };
      })
    );
  };

  const completeGame = (index: number) => {
    setGames((prevGames) => prevGames.map((game, i) => (i === index ? { ...game, status: "completed" } : game)));
  };

  return <GameContext.Provider value={{ games, setGames, completeGame }}>{children}</GameContext.Provider>;
};
