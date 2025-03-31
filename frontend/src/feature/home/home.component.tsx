import "./home.component.scss";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useGameContext } from "../../shared/context/game.context";
// import { motion, AnimatePresence } from "framer-motion";

import correctSound from "/sound/correct.mp3";
import wrongSound from "/sound/wrong.mp3";

import mapGame from "../../assets/images/map-game.jpg";
import millionGame from "../../assets/images/million-game.jpg";
import treasureGame from "../../assets/images/treasure-game.jpg";
import differenceGame from "../../assets/images/difference-game.jpg";
import documentGame from "../../assets/images/document-game.png";
import question from "../../assets/images/question.png";

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

const GAMES = [
  { id: "game1", image: mapGame, path: "/game1" },
  { id: "game2", image: millionGame, path: "/game2" },
  { id: "game3", image: treasureGame, path: "/game3" },
  { id: "game4", image: differenceGame, path: "/game4" },
  { id: "game5", image: documentGame, path: "/game5" },
  { id: "game6", image: question, path: "/game6" },
];

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
  const { games: gameStatuses } = useGameContext();

  const [storyText, setStoryText] = useState("");
  const [index, setIndex] = useState(0);
  const [showIntro, setShowIntro] = useState(true);

  const [gamePositions] = useState(() => generateNonOverlappingPositions(GAMES.length, SAFE_ZONE, 12));
  const [cloudPositions] = useState(() =>
    generateNonOverlappingPositions(
      CLOUD_CONFIG.count,
      {
        topMin: 0,
        topMax: 90,
        leftMin: 0,
        leftMax: 90,
      },
      15
    )
  );

  const dummyStory = `
  🗓️ In the year 1800, a legendary crew of six daring pirates set sail across uncharted waters in search of the fabled Magic Stone — a mythical gem said to unlock the hidden passage to the Fortune Islands. ⚔️ After years of storms and betrayal, they found it. But greed consumed them. In the struggle, the stone shattered into six powerful shards. 💥 Each pirate took one shard and disappeared, hiding it in secret places and forging deadly games to protect it.
  🧭 Now in 2025, you — the last descendant of the sixth pirate — are called to restore what was broken. 🧩 Only by conquering all six pirate trials can you reforge the Magic Stone and uncover the Fortune Islands... once and for all. 🗓️ In the year 1800, a legendary crew of six daring pirates set sail across uncharted waters in search of the fabled Magic Stone — a mythical gem said to unlock the hidden passage to the Fortune Islands.
  ⚔️ After years of storms and betrayal, they found it. But greed consumed them. In the struggle, the stone shattered into six powerful shards.💥 Each pirate took one shard and disappeared, hiding it in secret places and forging deadly games to protect it.
  🧭 Now in 2025, you — the last descendant of the sixth pirate — are called to restore what was broken. 🧩 Only by conquering all six pirate trials can you reforge the Magic Stone and uncover the Fortune Islands... once and for all.  🗓️ In the year 1800, a legendary crew of six daring pirates set sail across uncharted waters in search of the fabled Magic Stone — a mythical gem said to unlock the hidden passage to the Fortune Islands.
  ⚔️ After years of storms and betrayal, they found it. But greed consumed them. In the struggle, the stone shattered into six powerful shards.
  💥 Each pirate took one shard and disappeared, hiding it in secret places and forging deadly games to protect it.
  🧭 Now in 2025, you — the last descendant of the sixth pirate — are called to restore what was broken.
  🧩 Only by conquering all six pirate trials can you reforge the Magic Stone and uncover the Fortune Islands... once and for all.
  `;

  useEffect(() => {
    // const timer = setTimeout(() => setShowIntro(false), 3200);
    // return () => clearTimeout(timer);
  }, []);

  // useEffect(() => {
  //   if (!showIntro && index < dummyStory.length) {
  //     const interval = setInterval(() => {
  //       setStoryText((prev) => prev + dummyStory[index]);
  //       setIndex((prev) => prev + 1);
  //     }, 35);
  //     return () => clearInterval(interval);
  //   }
  // }, [index, showIntro]);

  const handleClick = (gameId: string, path: string, status: string) => {
    if (status === "locked") {
      new Audio(wrongSound).play();
    } else {
      new Audio(correctSound).play();
      window.location.href = path;
    }
  };

  const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

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
        <div className="treasure-hunt-page">
          <div className="left-panel">
            <div className="map-overlay">
              {/* <div className="cloud-group">
								{cloudPositions.map((pos, i) => {
									const opacity = randomBetween(
										CLOUD_CONFIG.minOpacity,
										CLOUD_CONFIG.maxOpacity
									);
									const scale = CLOUD_CONFIG.minScale;
									// randomBetween(
									// 	CLOUD_CONFIG.maxScale
									// );
									const width = CLOUD_CONFIG.minWidth;
									// randomBetween(
									// 	CLOUD_CONFIG.maxWidth
									// );
									const height = CLOUD_CONFIG.minHeight;
									// randomBetween(
									// 	CLOUD_CONFIG.maxHeight
									// );
									const duration = CLOUD_CONFIG.minDuration;
									// randomBetween(
									// 	CLOUD_CONFIG.maxDuration
									// );

									return (
										<div
											key={i}
											className="floating-cloud"
											style={
												{
													top: `${pos.top}%`,
													left: `${pos.left}%`,
													width: `${width}px`,
													height: `${height}px`,
													opacity,
													animationDuration: `${duration}s`,
													"--cloud-scale": scale.toString(),
												} as React.CSSProperties
											}
										/>
									);
								})}
							</div> */}

              {GAMES.map((game, idx) => {
                const gameStatus = gameStatuses.find((g) => g.path === game.path)?.status ?? "default";
                const isLocked = gameStatus === "locked";
                const pos = gamePositions[idx];

                return (
                  <div
                    key={game.id}
                    className={`game-icon ${isLocked ? "locked" : "unlocked"}`}
                    style={{
                      top: `${pos.top}%`,
                      left: `${pos.left}%`,
                    }}
                    onClick={() => handleClick(game.id, game.path, gameStatus)}>
                    <img src={game.image} alt={game.id} />
                    <div className="label">🏴‍☠️ {t(`games.${game.id}`)}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="right-panel">
            <h1 className="title">📖 {t("app.title")} 📖</h1>
            <p className="subtitle">🗺️ {t("app.select_game")}</p>

            <div className="story-box">
              <p className="story-text">{storyText}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
