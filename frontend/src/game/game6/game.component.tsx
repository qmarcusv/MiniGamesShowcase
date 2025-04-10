import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import {
	CircularProgressbarWithChildren,
	buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./game.component.scss";
import Conclusion6 from "./game-conclusion.component";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCog, FaHome, FaArrowLeft } from "react-icons/fa";

import halong from "/places/halong.jpg";
import hoian from "/places/hoian.jpg";
import myson from "/places/myson.jpg";
import hue from "/places/hue.jpg";
import phongnha from "/places/phongnha.jpg";
import dalat from "/places/dalat.jpg";
import hcm from "/places/hcm.jpg";
import hanoi from "/places/hanoi.jpg";
import ninhbinh from "/places/ninhbinh.jpg";
import sapa from "/places/sapa.jpg";
import taynguyen from "/places/taynguyen.jpg";
import nhatrang from "/places/nhatrang.jpg";
import phuquoc from "/places/phuquoc.jpg";
import condao from "/places/condao.jpg";
import cuchi from "/places/cuchi.jpg";
import thienmu from "/places/thienmu.jpg";
import nhathoducba from "/places/nhathoducba.jpg";
import nharong from "/places/nharong.jpg";

import flipSound from "/sound/flipcard.mp3";
import tickSound from "/sound/tick.mp3";
import hurrySound from "/sound/hurry.mp3";
import endSound from "/sound/end.mp3";
import correctSound from "/sound/correct.mp3";
import wrongSound from "/sound/wrong.mp3";

import pirateBg from "/game/image/description/pirate-bg.jpg";
import oldPaper from "/game/image/description/old-paper.png";
import woodenFrame from "/game/image/description/wooden-frame.png";
import treasureMap from "/game/image/description/treasure-map.png";
import sandClock from "/game/image/description/sand-clock.png";
import compass from "/game/image/description/compass.png";
import wave from "/game/image/description/wave.png";

import { playSoundRepeatedly } from "../../feature/environment-sound/environment-sound.component";

import cardBack from "/game/game6/card.png";

interface Game6Props {
	gridSize: "4x4" | "6x6";
	timer: number;
}

const Card = ({
	card,
	onClick,
	isLocked,
}: {
	card: any;
	onClick: () => void;
	isLocked: boolean;
}) => {
	const [isLoaded, setIsLoaded] = useState(false);

	return (
		<div
			className="w-full h-full perspective cursor-pointer group"
			onClick={onClick}
		>
			<div
				className={`relative w-full h-full transform-style-preserve-3d ${
					card.flipped || card.matched ? "rotate-y-180" : ""
				} transition-all duration-700 hover:scale-[1.02] ${
					card.matched ? "opacity-80" : ""
				}`}
				style={{
					transformStyle: "preserve-3d",
					backfaceVisibility: "hidden",
					transition:
						"transform 0.7s cubic-bezier(0.4, 0, 0.2, 1), scale 0.3s ease-in-out",
					transform:
						card.flipped || card.matched ? "rotateY(180deg)" : "rotateY(0deg)",
				}}
			>
				<div
					className={`absolute inset-0 rounded-lg overflow-hidden ${
						card.matched ? "matched" : ""
					}`}
					style={{
						backfaceVisibility: "hidden",
						backgroundImage: `url(${cardBack})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
					}}
				/>
				<div
					className="absolute inset-0 rotate-y-180 backface-hidden rounded-lg overflow-hidden"
					style={{ backfaceVisibility: "hidden" }}
				>
					<img
						src={card.image}
						alt={card.name}
						loading="eager"
						onLoad={() => setIsLoaded(true)}
						className={`w-full h-full object-cover transition-all duration-700 ${
							isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
						} ${card.matched ? "brightness-90" : ""}`}
					/>
					{!isLoaded && (
						<div className="absolute inset-0 bg-blue-900/20 animate-pulse rounded-lg" />
					)}
				</div>
			</div>
		</div>
	);
};

type SoundType = "flip" | "correct" | "wrong" | "tick" | "hurry" | "end";

const AudioManager: Record<SoundType, HTMLAudioElement> & {
	play: (sound: SoundType) => void;
} = {
	flip: new Audio(flipSound),
	correct: new Audio(correctSound),
	wrong: new Audio(wrongSound),
	tick: new Audio(tickSound),
	hurry: new Audio(hurrySound),
	end: new Audio(endSound),

	play(sound: SoundType) {
		this[sound].currentTime = 0;
		this[sound].play().catch(() => {});
	},
};

export default function Game6({ gridSize, timer: initialTimer }: Game6Props) {
	const navigate = useNavigate();
	const [cards, setCards] = useState<
		{
			id: number;
			name: string;
			image: string;
			flipped: boolean;
			matched: boolean;
		}[]
	>([]);
	const [selected, setSelected] = useState<number[]>([]);
	const [isLocked, setIsLocked] = useState(false);
	const [timer, setTimer] = useState(initialTimer);
	const [startTime, setStartTime] = useState<number | null>(null);
	const [isComplete, setIsComplete] = useState(false);
	const [timeLeft, setTimeLeft] = useState(60);
	const [showSettings, setShowSettings] = useState(false);
	const [gameOver, setGameOver] = useState(false);
	const [score, setScore] = useState(0);
	const [totalPairs, setTotalPairs] = useState(0);
	const [matchedPairs, setMatchedPairs] = useState(0);
	const [wrongAttempts, setWrongAttempts] = useState(0);

	const totalCards = gridSize === "4x4" ? 16 : 36;
	const places = [
		{ name: "Vịnh Hạ Long", image: halong },
		{ name: "Phố cổ Hội An", image: hoian },
		{ name: "Thánh địa Mỹ Sơn", image: myson },
		{ name: "Cố đô Huế", image: hue },
		{ name: "Phong Nha - Kẻ Bàng", image: phongnha },
		{ name: "Đà Lạt", image: dalat },
		{ name: "TP. Hồ Chí Minh", image: hcm },
		{ name: "Hà Nội", image: hanoi },
		{ name: "Ninh Bình", image: ninhbinh },
		{ name: "Sapa", image: sapa },
		{ name: "Tây Nguyên", image: taynguyen },
		{ name: "Nha Trang", image: nhatrang },
		{ name: "Phú Quốc", image: phuquoc },
		{ name: "Côn Đảo", image: condao },
		{ name: "Địa đạo Củ Chi", image: cuchi },
		{ name: "Chùa Thiên Mụ", image: thienmu },
		{ name: "Nhà thờ Đức Bà", image: nhathoducba },
		{ name: "Bến Nhà Rồng", image: nharong },
	];

	const deck = useMemo(() => {
		const selectedPlaces = places.slice(0, totalCards / 2);
		return [...selectedPlaces, ...selectedPlaces]
			.map((card, i) => ({
				id: i,
				...card,
				flipped: false,
				matched: false,
			}))
			.sort(() => Math.random() - 0.5);
	}, [gridSize]);

	useEffect(() => {
		setCards(deck);
		const start = Date.now();
		setStartTime(start);
		setTotalPairs(totalCards / 2);

		let currentTime = initialTimer;
		setTimer(currentTime);

		const interval = setInterval(() => {
			currentTime--;
			setTimer(currentTime);

			if (currentTime === 0) {
				AudioManager.play("end");
				clearInterval(interval);
			} else if (currentTime <= 3) {
				AudioManager.play("hurry");
			} else {
				AudioManager.play("tick");
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [deck, initialTimer]);

	useEffect(() => {
		if (cards.length > 0 && cards.every((c) => c.matched)) {
			setTimeout(() => {
				setGameOver(true);
				AudioManager.tick.pause();
				AudioManager.tick.currentTime = 0;
				AudioManager.hurry.pause();
				AudioManager.hurry.currentTime = 0;
			}, 1000);
		}
	}, [cards]);

	useEffect(() => {
		if (!gameOver) {
			const interval = setInterval(() => {
				setTimeLeft((prev) => {
					if (prev <= 1) {
						setGameOver(true);
						new Audio(endSound).play();
						return 0;
					}
					if (prev <= 10) {
						new Audio(hurrySound).play();
					} else {
						new Audio(tickSound).play();
					}
					return prev - 1;
				});
			}, 1000);

			return () => {
				clearInterval(interval);
				AudioManager.tick.pause();
				AudioManager.tick.currentTime = 0;
				AudioManager.hurry.pause();
				AudioManager.hurry.currentTime = 0;
			};
		}
	}, [gameOver]);

	const handleFlip = useCallback(
		(index: number) => {
			if (
				isLocked ||
				cards[index].flipped ||
				cards[index].matched ||
				isComplete ||
				timer <= 0
			)
				return;

			const updated = [...cards];
			updated[index].flipped = true;
			setCards(updated);
			setSelected((prev) => [...prev, index]);

			AudioManager.play("flip");

			if (selected.length === 1) {
				const [firstIndex] = selected;
				const secondIndex = index;

				setIsLocked(true);

				setTimeout(() => {
					const first = updated[firstIndex];
					const second = updated[secondIndex];

					if (first.name === second.name) {
						updated[firstIndex].matched = true;
						updated[secondIndex].matched = true;
						AudioManager.play("correct");
						setMatchedPairs(matchedPairs + 1);
						setCards([...updated]);
						setSelected([]);
						setIsLocked(false);
					} else {
						setTimeout(() => {
							updated[firstIndex].flipped = false;
							updated[secondIndex].flipped = false;
							AudioManager.play("wrong");
							setWrongAttempts((prev) => prev + 1);
							setCards([...updated]);
							setSelected([]);
							setIsLocked(false);
						}, 600);
					}
				}, 600);
			}
		},
		[cards, isLocked, selected, isComplete, timer, matchedPairs]
	);

	const gridClass =
		gridSize === "4x4" ? "grid-cols-4 grid-rows-4" : "grid-cols-6 grid-rows-6";

	if (gameOver) {
		const timeUsed = startTime
			? Math.floor((Date.now() - startTime) / 1000)
			: 0;
		const win = isComplete && timer > 0;

		return (
			<Conclusion6
				score={matchedPairs}
				timeUsed={60 - timeLeft}
				totalPairs={totalPairs}
				matchedPairs={matchedPairs}
				win={win}
				wrongAttempts={wrongAttempts}
			/>
		);
	}

	return (
		<div
			className="relative w-full h-screen overflow-hidden"
			style={{
				backgroundImage: "url('/game/game6/gameplay.png')",
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			{!gameOver ? (
				<div className="w-full h-full flex flex-col">
					{/* Header with Timer and Score */}
					<div className="flex justify-between items-center p-4 z-20">
						{/* Timer and Score */}
						<div className="flex items-center gap-4">
							{/* Timer */}
							<div className="relative">
								<div className="w-[72px] h-[72px] rounded-full border-4 border-amber-900/50 flex items-center justify-center bg-gradient-to-b from-amber-800/90 to-amber-950/90 shadow-[0_4px_12px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(0,0,0,0.3)]">
									<div className="absolute inset-[6px]">
										<svg className="w-full h-full -rotate-90">
											<circle
												className="text-amber-900/30"
												strokeWidth="4"
												stroke="currentColor"
												fill="transparent"
												r="28"
												cx="30"
												cy="30"
											/>
											<circle
												className="text-amber-500"
												strokeWidth="4"
												strokeDasharray={175}
												strokeDashoffset={175 - (timeLeft / 60) * 175}
												strokeLinecap="round"
												stroke="currentColor"
												fill="transparent"
												r="28"
												cx="30"
												cy="30"
											/>
										</svg>
									</div>
									<div className="relative text-center">
										<div className="text-2xl font-bold text-amber-200 leading-none mb-1">
											{timeLeft}
										</div>
										<div className="text-[10px] text-amber-400/80 uppercase tracking-wider">
											giây
										</div>
									</div>
								</div>
							</div>

							{/* Score */}
							<div className="bg-gradient-to-b from-amber-800/90 to-amber-950/90 px-5 py-3 rounded-xl border border-amber-900/50 shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
								<div className="text-[10px] text-amber-400/80 uppercase tracking-wider mb-1">
									Số thẻ đã ghép
								</div>
								<div className="text-2xl font-bold text-amber-200">
									{matchedPairs * 2}/{totalCards}
								</div>
							</div>
						</div>

						{/* Settings Menu */}
						<div className="relative">
							<button
								onClick={() => setShowSettings(!showSettings)}
								className="w-11 h-11 rounded-full bg-gradient-to-b from-amber-800/90 to-amber-950/90 hover:from-amber-700/90 hover:to-amber-900/90 text-amber-300 flex items-center justify-center transition-all border border-amber-900/50 shadow-lg"
							>
								<FaCog
									className={`transition-transform duration-300 ${
										showSettings ? "rotate-180" : ""
									}`}
								/>
							</button>

							{showSettings && (
								<div className="absolute top-full right-0 mt-2 bg-gradient-to-b from-amber-800/90 to-amber-950/90 rounded-xl border border-amber-900/50 p-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.3)] z-30 min-w-[160px]">
									<button
										onClick={() => {
											navigate("/");
											setShowSettings(false);
										}}
										className="w-full px-4 py-2.5 bg-amber-900/40 hover:bg-amber-800/40 text-amber-200 rounded-lg transition-all flex items-center gap-2 text-sm font-medium mb-2"
									>
										<FaHome /> Trang chủ
									</button>
									<button
										onClick={() => {
											navigate(-1);
											setShowSettings(false);
										}}
										className="w-full px-4 py-2.5 bg-amber-900/40 hover:bg-amber-800/40 text-amber-200 rounded-lg transition-all flex items-center gap-2 text-sm font-medium"
									>
										<FaArrowLeft /> Quay lại
									</button>
								</div>
							)}
						</div>
					</div>

					{/* Game Board */}
					<div className="flex-1 flex items-center justify-center p-4">
						<div className="grid grid-cols-4 gap-4 max-w-[800px] w-full aspect-square p-8 pirate-frame">
							{cards.map((card, index) => (
								<div key={card.id} className="relative pb-[100%]">
									<div className="absolute inset-0">
										<Card
											card={card}
											onClick={() => handleFlip(index)}
											isLocked={isLocked}
										/>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			) : (
				<Conclusion6
					score={matchedPairs}
					timeUsed={60 - timeLeft}
					totalPairs={totalPairs}
					matchedPairs={matchedPairs}
					wrongAttempts={wrongAttempts}
				/>
			)}
		</div>
	);
}
