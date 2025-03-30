import "./navigator.component.scss";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/button/button";
import { useGameContext } from "../../context/game.context";

export default function Navigator() {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const { games } = useGameContext();
  const navigate = useNavigate();

  // Dynamically unlock "Treasure" if all other games are completed
  const allCompleted = games.filter((game) => game.id !== "treasure").every((game) => game.status === "completed");

  const visibleGames = games.map((game) => {
    if (game.id === "treasure" && allCompleted) {
      return { ...game, status: "completed" };
    }
    return game;
  });

  const goToGame = (index: number) => {
    setCurrentIndex(index);
    navigate(visibleGames[index].path);
  };

  const handlePrev = () => {
    if (currentIndex > 0) goToGame(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < visibleGames.length - 1) goToGame(currentIndex + 1);
  };

  return (
    <div className="navigator w-full flex flex-col items-center">
      {/* Game buttons with connectors */}
      <div className="navigator-buttons  flex justify-center items-center flex-wrap gap-2">
        {visibleGames.map((game, index) => {
          const isActive = index === currentIndex;

          let color = "";
          if (isActive) {
            color = "bg-blue-500 text-white";
          } else {
            switch (game.status) {
              case "default":
                color = "bg-gray-50 text-gray-700 hover:bg-blue-100 cursor-pointer";
                break;
              case "locked":
                color = "bg-gray-300 text-gray-400 border border-gray-300 cursor-not-allowed";
                break;
              case "completed":
                color = "bg-green-400 text-white cursor-pointer";
                break;
              case "taken":
                color = "bg-yellow-400 text-white";
                break;
            }
          }

          return (
            <React.Fragment key={game.id}>
              <button
                disabled={game.status === "locked" && !isActive}
                onClick={() => game.status !== "locked" && goToGame(index)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${color}`}>
                {game.name === "Treasure" ? <img src="/image/treasure-chest.png" /> : game.name}
              </button>

              {index < visibleGames.length - 1 && <div className="connector-line h-0.5 w-6 bg-gray-300" />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="steps flex space-x-4">
        <Button onClick={handlePrev} disabled={currentIndex <= 0}>
          ← Previous
        </Button>
        <Button onClick={handleNext} disabled={currentIndex === visibleGames.length - 1}>
          Next →
        </Button>
      </div>
    </div>
  );
}
