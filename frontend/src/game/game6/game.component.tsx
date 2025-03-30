import { useEffect, useState } from "react";
import {
	CircularProgressbarWithChildren,
	buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

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

import { playSoundRepeatedly } from "../../feature/environment-sound/environment-sound.component";

interface Game6Props {
	gridSize: "4x4" | "6x6";
	timer: number;
}

export default function Game6({ gridSize, timer: initialTimer }: Game6Props) {
	useEffect(() => {
		document.body.classList.add("hide-navbar-footer");
		return () => {
			document.body.classList.remove("hide-navbar-footer");
		};
	}, []);

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

	useEffect(() => {
		const selectedPlaces = places.slice(0, totalCards / 2);
		const deck = [...selectedPlaces, ...selectedPlaces]
			.map((card, i) => ({
				id: i,
				...card,
				flipped: false,
				matched: false,
			}))
			.sort(() => Math.random() - 0.5);

		setCards(deck);
		const start = Date.now();
		setStartTime(start);

		let currentTime = initialTimer;
		setTimer(currentTime);

		const interval = setInterval(() => {
			currentTime--;
			setTimer(currentTime);

			if (currentTime === 0) {
				playSoundRepeatedly(endSound, 1);
				clearInterval(interval);
			} else if (currentTime <= 3) {
				playSoundRepeatedly(hurrySound, 1);
			} else {
				playSoundRepeatedly(tickSound, 1);
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [gridSize]);

	useEffect(() => {
		if (cards.length > 0 && cards.every((c) => c.matched)) {
			setIsComplete(true);
		}
	}, [cards]);

	const handleFlip = (index: number) => {
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

		new Audio(flipSound).play();

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
					new Audio(correctSound).play();
				} else {
					updated[firstIndex].flipped = false;
					updated[secondIndex].flipped = false;
					new Audio(wrongSound).play();
				}

				setCards([...updated]);
				setSelected([]);
				setIsLocked(false);
			}, 1000);
		}
	};

	const gridClass = gridSize === "4x4" ? "grid-cols-4" : "grid-cols-6";

	if (isComplete || timer <= 0) {
		const timeUsed = startTime
			? Math.floor((Date.now() - startTime) / 1000)
			: 0;
		const win = isComplete && timer > 0;

		return (
			<div className="p-6 text-center">
				<div className="bg-white rounded-xl shadow p-8 max-w-xl mx-auto">
					<h2 className="text-2xl font-bold mb-4">
						{win ? "🎉 Bạn đã hoàn thành trò chơi!" : "⏰ Hết giờ!"}
					</h2>
					<p className="text-lg">⏱️ Thời gian sử dụng: {timeUsed} giây</p>
					<p className="text-lg">
						✅ Số thẻ đã ghép đúng: {cards.filter((c) => c.matched).length}/
						{cards.length}
					</p>
					<p className="text-lg mt-2">
						{win
							? "🎯 Bạn đã ghép đúng tất cả các cặp thẻ!"
							: "💡 Hãy thử lại để hoàn thành tất cả các cặp thẻ nhé!"}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="hide-navbar-footer relative p-6 max-w-6xl mx-auto bg-gradient-to-b from-slate-800 to-slate-700 min-h-screen rounded-xl shadow-lg">
			<div className="absolute top-4 left-4 w-16 h-16 z-10 bg-white rounded-full shadow-lg flex items-center justify-center">
				<CircularProgressbarWithChildren
					value={(timer / initialTimer) * 100}
					styles={buildStyles({
						pathColor: timer <= 3 ? "#ef4444" : "#3b82f6",
						trailColor: "#e5e7eb",
					})}
				>
					<div
						className={`text-sm font-bold ${
							timer <= 3 ? "text-red-600" : "text-blue-600"
						}`}
					>
						{timer}s
					</div>
				</CircularProgressbarWithChildren>
			</div>

			<div className={`grid ${gridClass} gap-3 pt-0`}>
				{cards.map((card, index) => (
					<div
						key={card.id}
						className="w-full aspect-square perspective"
						onClick={() => handleFlip(index)}
					>
						<div
							className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
								card.flipped || card.matched ? "rotate-y-180" : ""
							}`}
						>
							<div className="absolute inset-0 bg-gray-300 rounded-lg backface-hidden" />
							<div className="absolute inset-0 rotate-y-180 backface-hidden">
								<img
									src={card.image}
									alt={card.name}
									loading="lazy"
									className="w-full h-full object-cover rounded-lg"
								/>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
