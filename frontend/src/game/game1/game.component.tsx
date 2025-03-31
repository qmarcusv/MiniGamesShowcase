import { useEffect, useState } from "react";
import { places } from "./game1-places";
import {
	CircularProgressbarWithChildren,
	buildStyles,
} from "react-circular-progressbar";
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
	const [waitingToFinish, setWaitingToFinish] = useState(false);
	const [showPopup, setShowPopup] = useState(false);
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
		let interval: number;

		if (started && !showConclusion && !waitingToFinish) {
			interval = window.setInterval(() => {
				setTimer((prev) => {
					if (prev <= 1) {
						nextQuestion();
						return 10;
					}
					if (prev <= 4) new Audio(hurrySound).play();
					else new Audio(tickSound).play();
					return prev - 1;
				});
				setTimeUsed((prev) => prev + 1);
			}, 1000);
		}

		return () => clearInterval(interval);
	}, [started, showConclusion, waitingToFinish, currentIndex]);

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
			setWaitingToFinish(true); // wait for user to confirm
		}
	};

	const restartGame = () => {
		window.location.reload();
	};

	if (showConclusion) {
		const accuracy =
			clickCount > 0 ? Math.round((correctCount / clickCount) * 100) : 0;

		return (
			<div className="p-6 text-center text-yellow-100 min-h-screen bg-[url('/image/pirate-wood.jpg')] bg-cover flex items-center justify-center font-pirate">
				<div className="bg-black/60 backdrop-blur p-8 rounded-xl max-w-xl w-full space-y-4 border-4 border-yellow-600 shadow-xl">
					<h2 className="text-3xl font-bold text-yellow-300">
						🎉 Kết quả của cuộc truy tìm!
					</h2>
					<p>
						✅ Đúng: {correctCount} / {clickCount} lần click
					</p>
					<p>⏱️ Thời gian chơi: {timeUsed}s</p>
					<p>🎯 Độ chính xác: {accuracy}%</p>
					<button
						onClick={restartGame}
						className="mt-4 bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg text-white shadow"
					>
						🏁 Tiếp tục
					</button>
				</div>
			</div>
		);
	}

	const currentPlace = questionSet[currentIndex];
	const hiddenProgress = (correctCount / 5) * 100;

	return (
		<div className="flex w-full min-h-screen gap-4 pt-4 px-6 bg-[#1e293b] font-pirate text-yellow-100">
			{/* Map Column */}
			<div className="relative flex-1 rounded-xl border-4 border-yellow-600 shadow-lg overflow-hidden bg-black/20">
				<img
					src={mapImage}
					alt="Vietnam map"
					className="absolute w-full h-full object-cover"
				/>
				{places.map((place) => (
					<motion.div
						key={place.id}
						animate={{
							left: `${
								(shuffledPositions[place.id]?.x ?? place.position.x) * 100
							}%`,
							top: `${
								(shuffledPositions[place.id]?.y ?? place.position.y) * 100
							}%`,
						}}
						transition={{
							duration: swapping ? 3 : 0,
							ease: [0.0, 1, 0, 1],
						}}
						className={`absolute w-5 h-5 rounded-full cursor-pointer border-2
							${
								started && place.id === highlightId
									? "bg-yellow-300 ring-2 ring-yellow-300 border-yellow-900"
									: "bg-red-600 border-yellow-100"
							}
							${swapping && started ? "opacity-50" : "opacity-100"}`}
						style={{ transform: "translate(-50%, -50%)" }}
						onClick={() => handleDotClick(place)}
					/>
				))}
			</div>

			{/* Right Panel */}
			<div className="flex flex-col gap-4 w-[360px]">
				{/* Hidden Object Tracker – moved to top */}
				<div className="bg-[#1e293b]/90 border-4 border-yellow-600 p-4 rounded-lg shadow text-center">
					<h2 className="text-lg font-bold text-yellow-300 mb-2">
						🪙 Mảnh ghép cổ vật
					</h2>
					<div className="w-24 h-24 mx-auto relative">
						<CircularProgressbarWithChildren
							value={hiddenProgress}
							styles={buildStyles({
								pathColor: "#facc15",
								trailColor: "#1e293b",
							})}
						>
							{hiddenProgress >= 100 ? (
								<button
									onClick={() => setShowPopup(true)}
									className="w-12 h-12 rounded-full bg-transparent hover:scale-110 transition"
								>
									<img
										src="/image/hidden-artifact.png"
										alt="Hidden Object"
										className="w-full h-full"
									/>
								</button>
							) : (
								<span className="text-yellow-200 text-sm font-bold">
									{Math.round(hiddenProgress)}%
								</span>
							)}
						</CircularProgressbarWithChildren>
					</div>
				</div>

				{/* Question Box */}
				<div className="bg-[#1e293b]/90 border-4 border-yellow-600 p-4 rounded-lg shadow text-center">
					{started ? (
						<>
							<h2 className="text-lg font-bold mb-2 text-yellow-300">
								🧭 Tìm:{" "}
								<span className="text-emerald-400">{currentPlace.name}</span>
							</h2>
							<CircularProgressbarWithChildren
								value={(timer / 10) * 100}
								styles={buildStyles({
									pathColor: timer <= 3 ? "#ef4444" : "#facc15",
									trailColor: "#334155",
								})}
							>
								<div className="text-white text-sm font-bold">{timer}s</div>
							</CircularProgressbarWithChildren>
						</>
					) : (
						<button
							onClick={handleStart}
							className="bg-yellow-600 hover:bg-yellow-700 px-6 py-2 rounded-lg text-white shadow"
						>
							🏴‍☠️ Bắt đầu săn báu vật!
						</button>
					)}
					{waitingToFinish && (
						<button
							onClick={() => setShowConclusion(true)}
							className="mt-4 bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg text-white shadow"
						>
							🏁 Xem kết quả
						</button>
					)}
				</div>

				{/* Info Box */}
				{selectedDot && (
					<div className="bg-[#1e293b]/90 border-4 border-yellow-600 p-4 rounded-lg shadow overflow-y-auto max-h-[65vh] space-y-2">
						<h3 className="text-xl font-bold text-emerald-400">
							{selectedDot.name}
						</h3>
						<img
							src={selectedDot.image}
							alt={selectedDot.name}
							className="rounded w-full"
						/>
						<p className="text-sm text-yellow-200">
							🛠️ Kiến trúc sư: {selectedDot.architect}
						</p>
						<p className="text-sm text-yellow-200">
							📆 Năm xây: {selectedDot.builtYear}
						</p>
						<p className="text-sm text-yellow-200">
							📏 Tuổi: {selectedDot.age} năm
						</p>
						<p className="text-sm text-yellow-100 whitespace-pre-line">
							{selectedDot.history}
						</p>
					</div>
				)}
			</div>
			{showPopup && (
				<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
					<div className="bg-yellow-100 text-center text-black rounded-2xl p-6 max-w-sm w-full border-4 border-yellow-500 shadow-xl space-y-4">
						<h2 className="text-3xl font-bold text-green-700">🎉 Chúc mừng!</h2>
						<p className="text-lg font-semibold">Bạn đã tìm đủ 5 địa điểm!</p>
						<div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-yellow-500">
							<img
								src="/image/hidden-artifact.png"
								alt="Hidden Treasure"
								className="w-full h-full object-cover"
							/>
						</div>
						<button
							onClick={() => setShowPopup(false)}
							className="mt-4 bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg text-white shadow"
						>
							Đóng
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
