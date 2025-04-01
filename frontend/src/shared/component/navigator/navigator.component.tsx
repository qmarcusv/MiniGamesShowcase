
import "./navigator.component.scss";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../ui/button/button";
import { useGameContext } from "../../context/game.hook";

export default function Navigator() {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const { games } = useGameContext();
  const navigate = useNavigate();

  // Dynamically unlock "Treasure" if all other games are completed
  const completedCount = games.filter((g) => g.status === "completed" && typeof g.id === "number").length;
  const allCompleted = completedCount === 6;

  const playableGames = games.map((game, index) => {
    // Unlock treasure if all completed
    if (game.id === "treasure" && allCompleted) {
      return { ...game, status: "completed" };
    }

    // Unlock games 3, 4, 5 if at least 3 completed
    if ([3, 4, 5].includes(index) && completedCount >= 3 && game.status === "locked") {
      return { ...game, status: "default" };
    }

    return game;
  });

  const goToGame = (index: number) => {
    const game = playableGames[index];
    if (!game?.path) return;
    setCurrentIndex(index);
    navigate(game.path);
  };

  const handlePrev = () => {
    if (currentIndex > 0) goToGame(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < playableGames.length - 1) goToGame(currentIndex + 1);
  };

  return (
    <div className="navigator w-full flex flex-col items-center">
      {/* Game buttons with connectors */}
      <div className="navigator-buttons flex justify-center items-center flex-wrap gap-0">
        {playableGames.map((game, index) => {
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
                color = "bg-gray-400 text-gray-400  cursor-not-allowed";
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
                className={`game-item px-4 py-2 rounded-full text-sm font-medium transition-all ${color}`}>
                <img src={game.icon} />
              </button>

              {index < playableGames.length - 1 && <div className="connector-line h-0.5 w-6 bg-gray-300" />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="steps flex space-x-4">
        {currentIndex > 0 ? (
          <Button onClick={handlePrev} disabled={currentIndex <= 0}>
            ← Previous
          </Button>
        ) : (
          <div className=""></div>
        )}

        {currentIndex < playableGames.length - 2 ? (
          <Button onClick={handleNext} disabled={playableGames[currentIndex + 1].status === "locked"}>
            Next →
          </Button>
        ) : (
          <div className=""></div>
        )}
      </div>
    </div>
  );
}
