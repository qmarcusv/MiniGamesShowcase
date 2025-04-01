import "./home.component.scss";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useGameContext } from "../../shared/context/game.hook";
// import { motion, AnimatePresence } from "framer-motion";

import correctSound from "/sound/correct.mp3";
import wrongSound from "/sound/wrong.mp3";
import { Game } from "../../shared/context/game.context";

// 🌫️ Cloud config
const CLOUD_CONFIG = {
  count: 30,
  minOpacity: 0.6,
  maxOpacity: 0.9,
  minScale: 2,
  maxScale: 3,
  minWidth: 120,
  maxWidth: 200,
  minHeight: 120,
  maxHeight: 200,
  minDuration: 10,
  maxDuration: 40,
};

// 🗺️ Game safe zone
const SAFE_ZONE = {
  topMin: 10,
  topMax: 75,
  leftMin: 10,
  leftMax: 80,
};

interface Bounds {
  topMin: number;
  topMax: number;
  leftMin: number;
  leftMax: number;
}

interface Position {
  top: number;
  left: number;
}

const generateNonOverlappingPositions = (count: number, bounds: Bounds, minDistance: number = 12): Position[] => {
  const positions: Position[] = [];

  while (positions.length < count) {
    const top = bounds.topMin + Math.random() * (bounds.topMax - bounds.topMin);
    const left = bounds.leftMin + Math.random() * (bounds.leftMax - bounds.leftMin);
    const newPos: Position = { top, left };

    if (
      !positions.some((p) => {
        const dx = p.left - newPos.left;
        const dy = p.top - newPos.top;
        return Math.sqrt(dx * dx + dy * dy) < minDistance;
      })
    ) {
      positions.push(newPos);
    }
  }
  return positions;
};

const Home = () => {
  const { t } = useTranslation();
  const { games } = useGameContext();
  const [showIntro, setShowIntro] = useState(true);

  const [gameCoordinates] = useState(() => generateNonOverlappingPositions(games.length - 1, SAFE_ZONE, 12));

  const dummyStory = `
  🗓️ In the year 1800, a legendary crew of six daring pirates set sail across uncharted waters in search of the fabled Magic Stone
  ⚔️ After years of storms and betrayal, they found it. 
  But greed consumed them. 
  In the struggle, 
  the stone shattered into six powerful shards.💥 


  🧩 Goodluck ! 🧩
  `;

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 100);
    return () => clearTimeout(timer);
  }, []);

  // useEffect(() => {
  //   if (!showIntro && index < dummyStory.length) {
  //     const interval = setInterval(() => {
  //       setStoryText((prev) => prev + dummyStory[index]);
  //       setIndex((prev) => prev + 1);
  //     }, 5);
  //     return () => clearInterval(interval);
  //   }
  // }, [index, showIntro]);

  const selectGame = (game: Game) => {
    if (game.status === "locked") {
      // new Audio(wrongSound).play();
    } else {
      new Audio(correctSound).play();
      window.location.href = game.path!;
    }
  };

  // const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

  return (
    <div className="home-page">
      {/* <AnimatePresence>
        {showIntro && (
          <motion.div
            className="book-overlay"
            initial={{ scale: 1.5, rotateY: 0 }}
            animate={{ scale: 1, rotateY: 180 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: "easeInOut" }}>
            <img src="/image/book-open.png" alt="Book Opening" />
          </motion.div>
        )}
      </AnimatePresence> */}

      {!showIntro && (
        <div className="treasure-hunt-page ">
          <div className="left-panel">
            {/* Render games (without last element: the treasure) */}
            {games.slice(0, -1).map((game, idx) => {
              const pos = gameCoordinates[idx];

              return (
                <div
                  key={game.id}
                  className={`game-coordinate ${game.status === "locked" ? "locked" : "unlocked"}`}
                  style={{
                    top: `${pos.top}%`,
                    left: `${pos.left}%`,
                  }}
                  onClick={() => selectGame(game)}>
                  <div className="game">
                    <img src={game.image} className="game-img" />
                    <div className="label">
                      🏴‍☠️
                      <p>{t(`games.${game.id}`)}</p>
                    </div>

                    <img src={game.icon} className="game-icon"></img>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="right-panel">
            <h1 className="title ">☠️ {t("app.title")} ☠️</h1>
            <p className="subtitle">{t("app.select_game")}</p>
            <div className="story-box hidden-scroll">
              <span className="story-text typing-multiline" style={{ "--n": dummyStory.length + 5 }}>
                {dummyStory}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
