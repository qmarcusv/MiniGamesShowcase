import React, { useState } from "react";
import { GameContext, Game } from "./game.context";

// Game Status:  "default" | "locked" | "completed" | "taken";

const initialGames: Game[] = [
  { id: 1, name: "Game 1", path: "/game1", icon: "/game/icon/boat.png", image: "/game/image/map-game.jpg", status: "default" },
  { id: 2, name: "Game 2", path: "/game2", icon: "/game/icon/captain.png", image: "/game/image/million-game.jpg", status: "default" },
  { id: 3, name: "Game 3", path: "/game3", icon: "/game/icon/money.png", image: "/game/image/treasure-game.jpg", status: "default" },
  { id: 4, name: "Game 4", path: "/game4", icon: "/game/icon/steering-wheel.png", image: "/game/image/difference-game.jpg", status: "locked" },
  { id: 5, name: "Game 5", path: "/game5", icon: "/game/icon/sword.png", image: "/game/image/document-game.png", status: "locked" },
  { id: 6, name: "Game 6", path: "/game6", icon: "/game/icon/key.png", image: "/game/image/question.png", status: "locked" },
  { id: "treasure", name: "Treasure", path: "/treasure", icon: "/game/icon/treasure-chest.png", image: "/game/image/question.png", status: "locked" },
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
