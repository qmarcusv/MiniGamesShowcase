import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import {
	CircularProgressbarWithChildren,
	buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./game.component.scss";
import Conclusion6 from "./game-conclusion.component";

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
			className="w-full aspect-square perspective cursor-pointer hover:scale-105 transition-transform duration-200"
			onClick={onClick}
		>
			<div
				className={`relative w-full h-full transform-style-preserve-3d will-change-transform ${
					card.flipped || card.matched ? "rotate-y-180" : ""
				}`}
				style={{
					transformStyle: "preserve-3d",
					backfaceVisibility: "hidden",
					transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
					transform:
						card.flipped || card.matched ? "rotateY(180deg)" : "rotateY(0deg)",
				}}
			>
				<div
					className={`absolute inset-0 pirate-card ${
						card.matched ? "matched" : ""
					}`}
					style={{ backfaceVisibility: "hidden" }}
				/>
				<div
					className="absolute inset-0 rotate-y-180 backface-hidden"
					style={{ backfaceVisibility: "hidden" }}
				>
					<img
						src={card.image}
						alt={card.name}
						loading="lazy"
						onLoad={() => setIsLoaded(true)}
						className={`w-full h-full object-cover rounded-lg shadow-lg transition-opacity duration-300 ${
							isLoaded ? "opacity-100" : "opacity-0"
						}`}
					/>
					{!isLoaded && (
						<div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
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
			setIsComplete(true);
		}
	}, [cards]);

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

				requestAnimationFrame(() => {
					setTimeout(() => {
						const first = updated[firstIndex];
						const second = updated[secondIndex];

						if (first.name === second.name) {
							updated[firstIndex].matched = true;
							updated[secondIndex].matched = true;
							AudioManager.play("correct");
						} else {
							updated[firstIndex].flipped = false;
							updated[secondIndex].flipped = false;
							AudioManager.play("wrong");
						}

						setCards([...updated]);
						setSelected([]);
						setIsLocked(false);
					}, 400);
				});
			}
		},
		[cards, isLocked, selected, isComplete, timer]
	);

	const gridClass = gridSize === "4x4" ? "grid-cols-4" : "grid-cols-6";

	if (isComplete || timer <= 0) {
		const timeUsed = startTime
			? Math.floor((Date.now() - startTime) / 1000)
			: 0;
		const win = isComplete && timer > 0;

		return (
			<Conclusion6
				timeUsed={timeUsed}
				matchedCards={cards.filter((c) => c.matched).length}
				totalCards={cards.length}
				win={win}
			/>
		);
	}

	return (
		<div className="game-zone relative p-6 max-w-6xl mx-auto pirate-game min-h-screen">
			<div className="wave-effect" />

			<div className="flex flex-col h-full min-h-[calc(100vh-3rem)]">
				{/* Timer section */}
				<div className="flex justify-center mb-6">
					<div className="w-20 h-20 pirate-timer flex items-center justify-center">
						<CircularProgressbarWithChildren
							value={(timer / initialTimer) * 100}
							styles={buildStyles({
								pathColor: timer <= 3 ? "#ef4444" : "#3b82f6",
								trailColor: "transparent",
							})}
						>
							<div
								className={`text-lg font-bold ${
									timer <= 3 ? "text-red-600" : "text-amber-400"
								}`}
							>
								{timer}
							</div>
						</CircularProgressbarWithChildren>
					</div>
				</div>

				{/* Game grid section */}
				<div className={`grid ${gridClass} gap-3 pirate-frame p-4 flex-grow`}>
					{cards.map((card, index) => (
						<Card
							key={card.id}
							card={card}
							onClick={() => handleFlip(index)}
							isLocked={isLocked}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
