import "./navigator.component.scss";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button/button";

const games = [
  { id: 1, name: "Game 1", path: "/game1", status: "completed" },
  { id: 2, name: "Game 2", path: "/game2", status: "locked" },
  { id: 3, name: "Game 3", path: "/game3", status: "locked" },
  { id: 4, name: "Game 4", path: "/game4", status: "locked" },
  { id: 5, name: "Game 5", path: "/game5", status: "locked" },
  { id: 6, name: "Game 6", path: "/game6", status: "locked" },
  { id: "treasure", name: "Treasure", path: "/treasure" },
];

export default function Navigator() {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const navigate = useNavigate();

  const goToGame = (index: number) => {
    setCurrentIndex(index);
    navigate(games[index].path);
  };

  const handlePrev = () => {
    if (currentIndex > 0) goToGame(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < games.length - 1) goToGame(currentIndex + 1);
  };

  return (
    <div className="navigator w-full">
      <div className="navigator-buttons flex justify-center items-center space-x-2">
        {games.map((game, index) => {
          const isActive = index === currentIndex;

          let color = "";
          if (isActive) {
            color = "bg-blue-500 text-white";
          } else {
            switch (game.status) {
              case "completed":
                color = "bg-green-500 text-white";
                break;
              case "locked":
                color = "bg-gray-100 text-gray-400 cursor-not-allowed";
                break;
            }
          }

          return (
            <React.Fragment key={game.id}>
              <button
                disabled={game.status === "locked" && !isActive}
                onClick={() => game.status !== "locked" && goToGame(index)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${color}`}>
                {game.name}
              </button>

              {index < games.length - 1 && <div className="connector-line" />}
            </React.Fragment>
          );
        })}
      </div>

      <div className="steps flex space-x-4">
        <Button onClick={handlePrev} disabled={currentIndex <= 0}>
          ← Previous
        </Button>
        <Button onClick={handleNext} disabled={currentIndex === games.length - 1}>
          Next →
        </Button>
      </div>
    </div>
  );
}
