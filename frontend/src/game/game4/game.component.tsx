import { useEffect, useState } from "react";
import { mapComparisons, MapComparison } from "./game4-maps";
import foundSound from "/sound/correct.mp3";
import tickSound from "/sound/tick.mp3";
import hurrySound from "/sound/hurry.mp3";
import endSound from "/sound/end.mp3";
import { playSoundRepeatedly } from "../../feature/environment-sound/environment-sound.component";

export default function Game4() {
  const [selectedMap, setSelectedMap] = useState<MapComparison | null>(null);
  const [foundSpots, setFoundSpots] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(180);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [clickCount, setClickCount] = useState(0);
  const [showConclusion, setShowConclusion] = useState(false);

  useEffect(() => {
    if (!selectedMap || showConclusion) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setShowConclusion(true);
          playSoundRepeatedly(endSound, 1);
          return 0;
        }
        if (prev <= 3) playSoundRepeatedly(hurrySound, 1);
        else playSoundRepeatedly(tickSound, 1);
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedMap, showConclusion]);

  const handleClick = (e: React.MouseEvent, imageRef: HTMLDivElement, map: MapComparison) => {
    if (!startTime) setStartTime(Date.now());
    setClickCount((prev) => prev + 1);

    const rect = imageRef.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const tolerance = 0.05;
    const found = map.differences.find(
      (spot) => !foundSpots.includes(spot.id) && Math.abs(spot.position.x - x) < tolerance && Math.abs(spot.position.y - y) < tolerance
    );

    if (found) {
      new Audio(foundSound).play();
      setFoundSpots((prev) => [...prev, found.id]);
    }
  };

  const allFound = selectedMap && foundSpots.length === selectedMap.differences.length;

  if (!selectedMap) {
    return (
      <div className="game-zone h-full bg-slate-900 text-white flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl font-bold mb-4">Chọn bản đồ để bắt đầu</h1>
        <select
          className="bg-white/10 text-white px-4 py-2 rounded mb-6"
          onChange={(e) => {
            const found = mapComparisons.find((m) => m.id === e.target.value);
            if (found) {
              setSelectedMap(found);
              setFoundSpots([]);
              setClickCount(0);
              setTimeLeft(180);
              setStartTime(null);
              setShowConclusion(false);
            }
          }}
          defaultValue="">
          <option value="" disabled>
            -- Chọn bản đồ --
          </option>
          {mapComparisons.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (showConclusion || timeLeft <= 0) {
    const timePlayed = startTime ? Math.floor((Date.now() - startTime) / 1000) : 180;

    return (
      <div className="game-zone bg-slate-900 text-white flex flex-col items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur rounded-xl p-8 max-w-xl w-full text-center space-y-4">
          <h2 className="text-2xl font-bold text-emerald-400">{allFound ? "🎉 Hoàn thành!" : "⏰ Hết giờ!"}</h2>
          <p>
            🧠 Số điểm tìm thấy: {foundSpots.length} / {selectedMap.differences.length}
          </p>
          <p>⏱️ Thời gian chơi: {timePlayed}s</p>
          <p>🖱️ Số lần click: {clickCount}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-zone  bg-slate-900 text-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">⏱️ Thời gian còn lại: {timeLeft}s</h2>
        <h3>
          ✅ {foundSpots.length}/{selectedMap.differences.length} điểm đã tìm thấy
        </h3>
        {allFound && (
          <button onClick={() => setShowConclusion(true)} className="bg-emerald-500 px-4 py-2 rounded shadow hover:bg-emerald-600">
            Xem kết quả
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Past Image */}
        <div className="relative w-full aspect-[3/2] rounded-xl overflow-hidden" onClick={(e) => handleClick(e, e.currentTarget, selectedMap)}>
          <img src={selectedMap.pastImage} alt="past" className="object-cover w-full h-full" />
          {selectedMap.differences.map((spot) =>
            foundSpots.includes(spot.id) ? (
              <div
                key={`past-${spot.id}`}
                className="absolute border-2 border-green-400 rounded-full"
                style={{
                  left: `${spot.position.x * 100}%`,
                  top: `${spot.position.y * 100}%`,
                  width: "30px",
                  height: "30px",
                  marginLeft: "-15px",
                  marginTop: "-15px",
                }}
              />
            ) : null
          )}
        </div>

        {/* Current Image */}
        <div className="relative w-full aspect-[3/2] rounded-xl overflow-hidden" onClick={(e) => handleClick(e, e.currentTarget, selectedMap)}>
          <img src={selectedMap.currentImage} alt="current" className="object-cover w-full h-full" />
          {selectedMap.differences.map((spot) =>
            foundSpots.includes(spot.id) ? (
              <div
                key={`current-${spot.id}`}
                className="absolute border-2 border-green-400 rounded-full"
                style={{
                  left: `${spot.position.x * 100}%`,
                  top: `${spot.position.y * 100}%`,
                  width: "30px",
                  height: "30px",
                  marginLeft: "-15px",
                  marginTop: "-15px",
                }}
              />
            ) : null
          )}
        </div>

        {/* Explanation Column */}
        <div className="bg-white/5 rounded-xl p-4 overflow-y-auto max-h-[80vh]">
          <h3 className="text-lg font-semibold mb-2">📌 Giải thích các điểm đã tìm thấy:</h3>
          {selectedMap.differences
            .filter((s) => foundSpots.includes(s.id))
            .map((spot) => (
              <div key={spot.id} className="mb-4 p-2 bg-white/10 rounded">
                <h4 className="font-bold text-emerald-400">{spot.title}</h4>
                <p className="text-sm text-slate-100">{spot.description}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
