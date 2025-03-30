import { useEffect, useState } from "react";
import { places } from "./game1-places";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import { motion } from "framer-motion";
import "react-circular-progressbar/dist/styles.css";
import mapImage from "/places/map.jpg";
import correctSound from "/sound/correct.mp3";
import wrongSound from "/sound/wrong.mp3";
import tickSound from "/sound/tick.mp3";
import hurrySound from "/sound/hurry.mp3";

interface Place {
  id: string;
  name: string;
  position: { x: number; y: number };
  builtYear: number;
  architect: string;
  age: number;
  image: string;
  history: string;
}

export default function Game1() {
  //   const { setGames } = useGameContext();

  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionSet, setQuestionSet] = useState<Place[]>([]);
  const [selectedDot, setSelectedDot] = useState<Place | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [timer, setTimer] = useState(10);
  const [timeUsed, setTimeUsed] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [swapping, setSwapping] = useState(false);
  const [showConclusion, setShowConclusion] = useState(false);
  const [shuffledPositions, setShuffledPositions] = useState<{
    [id: string]: { x: number; y: number };
  }>({});
  useEffect(() => {
    document.body.classList.add("hide-navbar-footer");
    return () => {
      document.body.classList.remove("hide-navbar-footer");
    };
  }, []);
  useEffect(() => {
    if (!started || showConclusion) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          nextQuestion();
          return 10;
        }

        if (prev <= 4) {
          new Audio(hurrySound).play();
        } else {
          new Audio(tickSound).play();
        }

        return prev - 1;
      });
      setTimeUsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [started, showConclusion, currentIndex]);

  useEffect(() => {
    const shuffled = [...places].sort(() => 0.5 - Math.random());
    setQuestionSet(shuffled.slice(0, 5));
    setShuffledPositions(generateShuffledPositions());
  }, []);

  const generateShuffledPositions = () => {
    const shuffled = [...places].map((p) => p.id);
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const newPos: { [id: string]: { x: number; y: number } } = {};
    shuffled.forEach((id, i) => {
      newPos[places[i].id] = places.find((p) => p.id === id)?.position || {
        x: 0,
        y: 0,
      };
    });
    return newPos;
  };

  const startShuffle = () => {
    setSwapping(true);
    setShuffledPositions(generateShuffledPositions());
    setTimeout(() => setSwapping(false), 3000);
  };

  const handleStart = () => {
    setStarted(true);
    setHighlightId(questionSet[0].id);
    setTimer(10);
    startShuffle();
  };

  const handleDotClick = (place: Place) => {
    setSelectedDot(place);
    if (started) {
      setClickCount((c) => c + 1);
      if (place.id === highlightId) {
        new Audio(correctSound).play();
        setCorrectCount((c) => c + 1);
        nextQuestion();
      } else {
        new Audio(wrongSound).play();
      }
    }
  };

  const nextQuestion = () => {
    setSelectedDot(null);
    if (currentIndex < 4) {
      const next = currentIndex + 1;
      setCurrentIndex(next);
      setHighlightId(questionSet[next].id);
      setTimer(10);
      startShuffle();
    } else {
      setShowConclusion(true);
    }
  };

  if (showConclusion) {
    const accuracy = clickCount > 0 ? Math.round((correctCount / clickCount) * 100) : 0;

    return (
      <div className="p-6 text-center text-white min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur p-8 rounded-xl max-w-xl w-full space-y-4">
          <h2 className="text-2xl font-bold text-emerald-400">🎉 Kết quả</h2>
          <p>
            ✅ Đúng: {correctCount} / {clickCount} lần click
          </p>
          <p>⏱️ Thời gian chơi: {timeUsed}s</p>
          <p>🎯 Độ chính xác: {accuracy}%</p>
        </div>
      </div>
    );
  }

  const currentPlace = questionSet[currentIndex];

  return (
    <div className="flex w-[80%] mx-auto min-h-screen gap-4 pt-2">
      {/* Map Column */}
      <div className="relative flex-1 bg-gray-100 rounded-lg shadow overflow-hidden">
        <img src={mapImage} alt="Vietnam map" className="w-full h-full object-cover" />
        {places.map((place) => (
          <motion.div
            key={place.id}
            animate={{
              left: `${(shuffledPositions[place.id]?.x ?? place.position.x) * 100}%`,
              top: `${(shuffledPositions[place.id]?.y ?? place.position.y) * 100}%`,
            }}
            transition={{
              duration: swapping ? 3 : 0,
              ease: [0.0, 1, 0, 1],
            }}
            className={`absolute w-6 h-6 bg-red-500 rounded-full cursor-pointer border-2 ${
              started && place.id === highlightId ? "border-yellow-400" : swapping && started ? "opacity-50" : "opacity-100"
            }`}
            style={{ transform: "translate(-50%, -50%)" }}
            onClick={() => handleDotClick(place)}
          />
        ))}
      </div>

      {/* Right Column */}
      <div className="flex flex-col gap-4 w-[320px] text-white">
        {/* Top Box: Question + Timer */}
        <div className="bg-slate-800 p-4 rounded-lg shadow text-center">
          {started ? (
            <>
              <h2 className="text-lg font-semibold mb-2">
                🧭 Tìm: <span className="text-emerald-400">{currentPlace.name}</span>
              </h2>
              <CircularProgressbarWithChildren
                value={(timer / 10) * 100}
                styles={buildStyles({
                  pathColor: timer <= 3 ? "#ef4444" : "#3b82f6",
                  trailColor: "#334155",
                })}>
                <div className="text-white text-sm font-bold">{timer}s</div>
              </CircularProgressbarWithChildren>
            </>
          ) : (
            <button onClick={handleStart} className="bg-emerald-500 px-6 py-2 rounded hover:bg-emerald-600">
              Bắt đầu
            </button>
          )}
        </div>

        {/* Info Box */}
        {selectedDot && (
          <div className="bg-slate-800 p-4 rounded-lg shadow overflow-y-auto max-h-[60vh] space-y-2">
            <h3 className="text-xl font-bold text-emerald-400">{selectedDot.name}</h3>
            <img src={selectedDot.image} alt={selectedDot.name} className="rounded w-full" />
            <p className="text-sm text-slate-300">🛠️ Kiến trúc sư: {selectedDot.architect}</p>
            <p className="text-sm text-slate-300">📆 Năm xây: {selectedDot.builtYear}</p>
            <p className="text-sm text-slate-300">📏 Tuổi: {selectedDot.age} năm</p>
            <p className="text-sm text-slate-300 whitespace-pre-line">{selectedDot.history}</p>
          </div>
        )}
      </div>
    </div>
  );
}
