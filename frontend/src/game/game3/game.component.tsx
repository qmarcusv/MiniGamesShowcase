import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./game.component.scss";

const dummyData = {
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

export default function Game3() {
	const [selectedCard, setSelectedCard] = useState<number | null>(null);
	const [guessed, setGuessed] = useState<string[]>([]);
	const [fails, setFails] = useState(0);
	const [removedCards, setRemovedCards] = useState<number[]>([]);

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
	};

	const handleGuess = (letter: string) => {
		if (guessed.includes(letter) || !selectedCard) return;

		setGuessed((prev) => [...prev, letter]);

		if (!word.includes(letter)) {
			setFails((f) => f + 1);
		}
	};

	useEffect(() => {
		if (!selectedCard) return;

		const won = word.split("").every((c) => guessed.includes(c));
		const lost = fails >= maxFails;

		if (won || lost) {
			setTimeout(() => {
				if (won) {
					setRemovedCards((prev) => [...prev, selectedCard]);
				}
				setSelectedCard(null);
				setGuessed([]);
				setFails(0);
			}, 1500);
		}
	}, [guessed, fails]);

	return (
		<div className="game3-container bg-slate-900 text-white min-h-screen flex p-6 gap-6">
			{/* Left: 3x3 Grid */}
			<div className="grid grid-cols-3 gap-4 w-[400px]">
				{[...Array(9)].map((_, i) => {
					const index = i + 1;
					return (
						<AnimatePresence key={index}>
							{!removedCards.includes(index) && (
								<motion.div
									initial={{ opacity: 1 }}
									exit={{ opacity: 0, scale: 0.5 }}
									className="bg-emerald-600 rounded-lg aspect-square flex items-center justify-center text-2xl font-bold shadow cursor-pointer hover:bg-emerald-500 transition"
									onClick={() => handleCardClick(index)}
								>
									{index}
								</motion.div>
							)}
						</AnimatePresence>
					);
				})}
			</div>

			{/* Right: Flowerman */}
			<div className="flex-1 bg-white/10 rounded-lg p-6 flex flex-col items-center justify-start space-y-6">
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

				{/* Word display */}
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
			</div>
		</div>
	);
}
