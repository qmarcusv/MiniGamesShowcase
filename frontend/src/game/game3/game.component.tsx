import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	CircularProgressbarWithChildren,
	buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./game.component.scss";
import Conclusion3 from "./game-conclusion.component";
import { useNavigate } from "react-router-dom";
import {
	FaSkull,
	FaAnchor,
	FaCompass,
	FaShip,
	FaCrown,
	FaHome,
	FaCog,
	FaSyncAlt,
	FaArrowRight,
	FaTimes,
	FaCheck,
} from "react-icons/fa";

import correctSound from "/sound/correct.mp3";
import wrongSound from "/sound/wrong.mp3";
import tickSound from "/sound/tick.mp3";
import endSound from "/sound/end.mp3";
import victorySound from "/sound/victory.mp3";

// Hình ảnh cho 4 thẻ 2x2
const pirateCards: Record<number, { word: string; hint: string }> = {
	1: { word: "PIRATE", hint: "Cướp biển" },
	2: { word: "SWORD", hint: "Vũ khí chiến đấu" },
	3: { word: "TREASURE", hint: "Kho báu" },
	4: { word: "CAPTAIN", hint: "Người chỉ huy" },
};

const maxFails = 5;
const roundDuration = 30;

export default function Game3() {
	const navigate = useNavigate();
	const [selectedCard, setSelectedCard] = useState<number | null>(null);
	const [guessed, setGuessed] = useState<string[]>([]);
	const [fails, setFails] = useState(0);
	const [removedCards, setRemovedCards] = useState<number[]>([]);
	const [timer, setTimer] = useState(roundDuration);
	const [isRunning, setIsRunning] = useState(false);
	const [gameOver, setGameOver] = useState(false);
	const [timeUsed, setTimeUsed] = useState(0);
	const [showSettings, setShowSettings] = useState(false);
	const [showSword, setShowSword] = useState(false);
	const [backgroundImage, setBackgroundImage] = useState(
		"/game/game3/nosword.png"
	);

	const word = selectedCard ? pirateCards[selectedCard].word : "";
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
			setTimeUsed((prev) => prev + 1);
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

	// Game over check và hiển thị thanh kiếm
	useEffect(() => {
		if (removedCards.length === 4) {
			// Hiển thị thanh kiếm
			setShowSword(true);

			// Sau 3 giây, làm kiếm biến mất và đổi background
			setTimeout(() => {
				// Biến mất từ từ
				const swordElement = document.querySelector(".sword-effect");
				if (swordElement) {
					swordElement.classList.add("fade-out");
				}

				// Đợi hiệu ứng fade out hoàn thành rồi đổi background
				setTimeout(() => {
					setShowSword(false);
					setBackgroundImage("/game/game3/withsword.png");

					// Hiệu ứng sáng lóe lên toàn màn hình
					const flashElement = document.createElement("div");
					flashElement.className = "screen-flash";
					document.body.appendChild(flashElement);

					// Sau 1.5 giây, chuyển sang màn hình chiến thắng
					setTimeout(() => {
						new Audio(victorySound).play();
						setGameOver(true);
						// Loại bỏ flash element
						document.body.removeChild(flashElement);
					}, 1500);
				}, 1000); // 1 giây để kiếm biến mất
			}, 3000); // 3 giây để hiển thị kiếm
		}
	}, [removedCards]);

	if (gameOver) {
		return (
			<Conclusion3
				timeUsed={timeUsed}
				matchedCards={removedCards.length}
				totalCards={4}
				win={removedCards.length === 4}
			/>
		);
	}

	const getIconForCard = (index: number) => {
		switch (index) {
			case 1:
				return <FaSkull className="text-4xl text-amber-400" />;
			case 2:
				return <FaCrown className="text-4xl text-amber-400" />;
			case 3:
				return <FaAnchor className="text-4xl text-amber-400" />;
			case 4:
				return <FaCompass className="text-4xl text-amber-400" />;
			default:
				return null;
		}
	};

	return (
		<div
			className="game-zone h-full flex flex-col items-center bg-cover bg-center py-8 px-6 relative"
			style={{
				backgroundImage: `url('${backgroundImage}')`,
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			{/* Lớp overlay tối */}
			<div className="absolute inset-0 bg-[#0c1e35]/40"></div>

			{/* Hiệu ứng thanh kiếm khi mở khóa cả 4 thẻ */}
			{showSword && (
				<motion.div
					className="absolute inset-0 z-20 flex items-center justify-center sword-effect"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 1 }}
				>
					<motion.div
						className="relative"
						initial={{ scale: 0, rotate: -45 }}
						animate={{ scale: 1.5, rotate: 0 }}
						transition={{ duration: 1.5, type: "spring" }}
					>
						<img
							src="/game/game3/sword.png"
							alt="Legendary Sword"
							className="max-h-[70vh] object-contain"
							style={{ filter: "drop-shadow(0 0 30px #ffd700)" }}
						/>
						<div className="absolute inset-0 bg-amber-500/30 animate-pulse rounded-full blur-3xl"></div>
					</motion.div>
				</motion.div>
			)}

			{/* Header với nút cài đặt */}
			<div className="absolute top-4 right-4 z-50">
				<div className="relative">
					<button
						onClick={() => setShowSettings(!showSettings)}
						className="w-12 h-12 bg-[#1a3d65]/80 hover:bg-[#0c2a4e] rounded-full flex items-center justify-center text-amber-200 shadow-lg border-2 border-amber-500/40"
					>
						<FaCog className="w-6 h-6" />
					</button>

					{showSettings && (
						<div className="absolute top-full right-0 mt-2 bg-[#0a1e3a]/95 backdrop-blur-sm border-2 border-amber-600/60 rounded-lg shadow-xl p-2 w-48">
							<ul className="space-y-2">
								<li>
									<button
										onClick={() => navigate("/")}
										className="w-full text-left px-3 py-2 hover:bg-[#1a3d65]/80 rounded flex items-center gap-2 text-amber-200"
									>
										<FaHome /> Trang chính
									</button>
								</li>
								<li>
									<button
										onClick={() => window.location.reload()}
										className="w-full text-left px-3 py-2 hover:bg-[#1a3d65]/80 rounded flex items-center gap-2 text-amber-200"
									>
										<FaSyncAlt /> Chơi lại
									</button>
								</li>
								<li>
									<button
										onClick={() => navigate("/game3")}
										className="w-full text-left px-3 py-2 hover:bg-[#1a3d65]/80 rounded flex items-center gap-2 text-amber-200"
									>
										<FaArrowRight /> Quay lại
									</button>
								</li>
							</ul>
						</div>
					)}
				</div>
			</div>

			<div className="relative z-10 flex flex-col items-center w-full mt-4">
				{/* Tiêu đề trò chơi */}
				<h1 className="text-4xl font-bold text-amber-300 mb-6 text-center drop-shadow-lg">
					⚔️ Trận chiến hải tặc ⚔️
				</h1>

				{/* Main container */}
				<div className="w-full max-w-6xl flex flex-col md:flex-row gap-8 items-center md:items-start">
					{/* Left: 2x2 Grid */}
					<div className="flex-1 flex flex-col items-center">
						<h2 className="text-2xl font-bold text-amber-200 mb-6">
							Lật thẻ và đoán từ
						</h2>
						<div className="grid grid-cols-2 gap-6 max-w-lg">
							{[1, 2, 3, 4].map((index) => {
								const isRemoved = removedCards.includes(index);
								const isSelected = selectedCard === index;

								return (
									<motion.div
										key={index}
										layout
										className={`aspect-square flex items-center justify-center text-2xl font-bold transition rounded-xl border-4 shadow-lg ${
											isRemoved
												? "bg-transparent border-transparent pointer-events-none"
												: isSelected
												? "bg-amber-600/80 border-amber-300 text-white cursor-default"
												: "bg-[#1a3d65]/80 hover:bg-[#1a3d65] border-amber-600/60 hover:border-amber-500 text-white cursor-pointer"
										}`}
										onClick={() => {
											if (!isRemoved && !isSelected) handleCardClick(index);
										}}
										initial={{ rotateY: isRemoved ? 180 : 0 }}
										animate={{
											rotateY: isRemoved ? 180 : 0,
											scale: isSelected ? 1.05 : 1,
										}}
										transition={{ duration: 0.5 }}
									>
										{isRemoved ? (
											<div className="transform -scale-x-100">
												Đã hoàn thành
											</div>
										) : (
											<>
												{isSelected ? (
													<div className="text-3xl">{display}</div>
												) : (
													getIconForCard(index)
												)}
											</>
										)}
									</motion.div>
								);
							})}
						</div>

						{/* Progress indicator */}
						<div className="mt-8 flex justify-center gap-4">
							{[1, 2, 3, 4].map((idx) => (
								<div
									key={idx}
									className={`w-4 h-4 rounded-full ${
										removedCards.includes(idx)
											? "bg-amber-500"
											: "bg-amber-900/40 border border-amber-700/50"
									}`}
								/>
							))}
						</div>
					</div>

					{/* Right: Game Controls */}
					<div className="flex-1 flex flex-col items-center mt-4 md:mt-0">
						{/* Timer */}
						<div className="w-32 h-32 relative mb-6">
							<CircularProgressbarWithChildren
								value={(timer / roundDuration) * 100}
								strokeWidth={6}
								styles={buildStyles({
									pathColor: timer <= 5 ? "#ef4444" : "#f59e0b",
									trailColor: "#0c1e35",
									pathTransitionDuration: 0.5,
								})}
							>
								<div className="flex flex-col items-center">
									<div
										className={`text-5xl font-bold ${
											timer <= 5 ? "text-red-500" : "text-amber-300"
										}`}
									>
										{timer}
									</div>
									<div className="text-sm text-amber-200/80">giây</div>
								</div>
							</CircularProgressbarWithChildren>
						</div>

						{selectedCard ? (
							<div className="bg-[#0c1e35]/70 backdrop-blur-sm p-6 rounded-xl border-2 border-amber-600/30 w-full max-w-md">
								{/* Flowerman status */}
								<div className="mb-6">
									<h3 className="text-lg font-bold text-amber-200 mb-2">
										Trạng thái:
									</h3>
									<div className="flex justify-center gap-2">
										{[...Array(maxFails)].map((_, i) => (
											<div
												key={i}
												className={`w-8 h-8 rounded-full ${
													i < fails ? "bg-red-500" : "bg-amber-600/40"
												} flex items-center justify-center`}
											>
												{i < fails ? <FaTimes /> : i + 1}
											</div>
										))}
									</div>
								</div>

								{/* Show hint */}
								<div className="mb-4">
									<p className="text-amber-200 text-sm mb-1">Gợi ý:</p>
									<p className="text-white text-lg">
										{pirateCards[selectedCard].hint}
									</p>
								</div>

								{/* Alphabet keyboard */}
								<div className="grid grid-cols-7 gap-2">
									{"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => {
										const isGuessed = guessed.includes(letter);
										const isCorrect = word.includes(letter) && isGuessed;

										return (
											<button
												key={letter}
												disabled={isGuessed || fails >= maxFails}
												onClick={() => handleGuess(letter)}
												className={`w-9 h-9 rounded font-bold transition ${
													isGuessed
														? isCorrect
															? "bg-green-600 text-white"
															: "bg-red-600/60 text-white/60"
														: "bg-amber-600 hover:bg-amber-500 text-white"
												}`}
											>
												{letter}
											</button>
										);
									})}
								</div>
							</div>
						) : (
							<div className="bg-[#0c1e35]/70 backdrop-blur-sm p-6 rounded-xl border-2 border-amber-600/30 w-full max-w-md">
								<div className="text-center space-y-4">
									<FaShip className="text-amber-400 text-5xl mx-auto" />
									<h3 className="text-xl font-bold text-amber-200">
										Chọn một thẻ để bắt đầu
									</h3>
									<p className="text-amber-100/70">
										Hãy đoán đúng từ và thu thập đủ 4 thẻ để nhận được thanh
										gươm truyền thuyết!
									</p>
									<div className="w-full max-w-xs mx-auto border-t border-amber-600/30 pt-4 mt-4">
										<div className="text-amber-200 flex items-center">
											<FaCheck className="text-green-500 mr-2" /> Lật và đoán
											đúng các từ
										</div>
										<div className="text-amber-200 flex items-center">
											<FaCheck className="text-green-500 mr-2" /> Thắng cả 4 thẻ
										</div>
										<div className="text-amber-200 flex items-center">
											<FaCheck className="text-green-500 mr-2" /> Nhận thanh
											gươm truyền thuyết
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* CSS cho hiệu ứng flash toàn màn hình và fade-out */}
			<style>
				{`
				.screen-flash {
					position: fixed;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background-color: white;
					z-index: 100;
					animation: flash 1.5s forwards;
				}

				@keyframes flash {
					0% { opacity: 0; }
					50% { opacity: 1; }
					100% { opacity: 0; }
				}

				.sword-effect.fade-out {
					animation: fade-out 1s forwards;
				}

				@keyframes fade-out {
					from { opacity: 1; }
					to { opacity: 0; }
				}
				`}
			</style>
		</div>
	);
}
