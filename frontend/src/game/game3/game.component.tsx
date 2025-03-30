import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	CircularProgressbarWithChildren,
	buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./game.component.scss";

import correctSound from "/sound/correct.mp3";
import wrongSound from "/sound/wrong.mp3";
import tickSound from "/sound/tick.mp3";
import endSound from "/sound/end.mp3";

const dummyData: Record<number, string> = {
	1: "VIETNAM",
	2: "HANOI",
	3: "FLOWER",
	4: "UNITY",
	5: "NATURE",
	6: "BRIDGE",
	7: "CULTURE",
	8: "TEMPLE",
	9: "RIVER",
};

const maxFails = 5;
const roundDuration = 20;

export default function Game3() {
	useEffect(() => {
		document.body.classList.add("hide-navbar-footer");
		return () => {
			document.body.classList.remove("hide-navbar-footer");
		};
	}, []);
	const [selectedCard, setSelectedCard] = useState<number | null>(null);
	const [guessed, setGuessed] = useState<string[]>([]);
	const [fails, setFails] = useState(0);
	const [removedCards, setRemovedCards] = useState<number[]>([]);
	const [timer, setTimer] = useState(roundDuration);
	const [isRunning, setIsRunning] = useState(false);

	const word = selectedCard ? dummyData[selectedCard] : "";
	const upperWord = word.toUpperCase();
	const display = upperWord
		.split("")
		.map((char) => (guessed.includes(char) ? char : "_"))
		.join(" ");

	const handleCardClick = (num: number) => {
		if (removedCards.includes(num) || selectedCard !== null) return;
		setSelectedCard(num);
		setGuessed([]);
		setFails(0);
		setTimer(roundDuration);
		setIsRunning(true);
	};

	const handleGuess = (letter: string) => {
		if (guessed.includes(letter) || !selectedCard) return;

		setGuessed((prev) => [...prev, letter]);

		if (!word.includes(letter)) {
			new Audio(wrongSound).play();
			setFails((f) => f + 1);
		} else {
			new Audio(correctSound).play();
		}
	};

	const endRound = () => {
		const won = word.split("").every((c) => guessed.includes(c));
		if (selectedCard && won) {
			setRemovedCards((prev) => [...prev, selectedCard]);
		}
		setSelectedCard(null);
		setGuessed([]);
		setFails(0);
		setTimer(roundDuration);
		setIsRunning(false);
	};

	// Timer
	useEffect(() => {
		if (!isRunning || !selectedCard) return;

		const interval = setInterval(() => {
			setTimer((prev) => {
				if (prev <= 1) {
					new Audio(endSound).play();
					clearInterval(interval);
					endRound();
					return 0;
				} else {
					new Audio(tickSound).play();
					return prev - 1;
				}
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [isRunning, selectedCard]);

	// Auto win/loss check
	useEffect(() => {
		if (!selectedCard) return;

		const won = word.split("").every((c) => guessed.includes(c));
		const lost = fails >= maxFails;

		if (won || lost) {
			setTimeout(() => endRound(), 1500);
		}
	}, [guessed, fails]);

	return (
		<div className="game3-container bg-slate-900 text-white min-h-screen flex p-6 gap-6 items-stretch">
			{/* Left: Timer + 3x3 Grid */}
			<div className="flex flex-col flex-[1.2] max-w-[800px] h-full gap-4">
				{/* Timer */}
				<div className="w-full flex-1 rounded-lg bg-white/10 shadow flex items-center justify-center p-4 min-h-[72px]">
					{selectedCard ? (
						<CircularProgressbarWithChildren
							value={(timer / roundDuration) * 100}
							styles={buildStyles({
								pathColor: timer <= 3 ? "#ef4444" : "#3b82f6",
								trailColor: "#1e293b",
							})}
						>
							<div
								className={`text-sm font-bold ${
									timer <= 3 ? "text-red-500" : "text-blue-300"
								}`}
							>
								{timer}s
							</div>
						</CircularProgressbarWithChildren>
					) : (
						<span className="text-sm text-slate-400 text-center">
							⏳ Sẵn sàng
						</span>
					)}
				</div>

				{/* Grid */}
				<div className="grid grid-cols-3 gap-4">
					{[...Array(9)].map((_, i) => {
						const index = i + 1;
						const isRemoved = removedCards.includes(index);

						return (
							<motion.div
								key={index}
								layout
								className={`aspect-square flex items-center justify-center text-2xl font-bold transition ${
									isRemoved
										? "bg-transparent text-transparent pointer-events-none"
										: "bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow rounded-lg"
								}`}
								onClick={() => {
									if (!isRemoved) handleCardClick(index);
								}}
							>
								{index}
							</motion.div>
						);
					})}
				</div>
			</div>

			{/* Right: Flowerman */}
			<div className="flex-1 bg-white/10 rounded-lg p-6 flex flex-col items-center justify-start space-y-6 relative">
				<h2 className="text-xl font-bold">🌼 Flowerman Game</h2>

				{/* Flower Visualization */}
				<div className="relative w-40 h-40">
					{[...Array(maxFails - fails)].map((_, i) => (
						<motion.div
							key={i}
							className="absolute w-8 h-8 bg-pink-400 rounded-full"
							style={{
								top: `${80 - 60 * Math.cos((i * 2 * Math.PI) / 5)}px`,
								left: `${80 + 60 * Math.sin((i * 2 * Math.PI) / 5)}px`,
							}}
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							exit={{ scale: 0 }}
						/>
					))}
					<div className="absolute top-[72px] left-[72px] w-10 h-10 bg-yellow-300 rounded-full z-10" />
				</div>

				{/* Word Display */}
				<div className="text-3xl tracking-widest font-mono">
					{selectedCard ? display : "_ _ _ _"}
				</div>

				{/* Letters */}
				<div className="grid grid-cols-9 gap-2 max-w-xl">
					{"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
						<button
							key={letter}
							disabled={
								guessed.includes(letter) || !selectedCard || fails >= maxFails
							}
							onClick={() => handleGuess(letter)}
							className={`px-2 py-1 rounded ${
								guessed.includes(letter)
									? "bg-gray-600 text-white"
									: "bg-blue-500 hover:bg-blue-600"
							}`}
						>
							{letter}
						</button>
					))}
				</div>

				{/* Hint */}
				{selectedCard && (
					<div className="text-sm text-blue-300 text-center mt-4">
						Gợi ý: {dummyData[selectedCard]}
					</div>
				)}
			</div>
		</div>
	);
}
