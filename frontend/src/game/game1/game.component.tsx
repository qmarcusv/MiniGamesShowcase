import { useEffect, useState, useRef } from "react";
import { places } from "./game1-places";
import {
	CircularProgressbarWithChildren,
	buildStyles,
} from "react-circular-progressbar";
import { motion } from "framer-motion";
import "react-circular-progressbar/dist/styles.css";
import correctSound from "/sound/correct.mp3";
import wrongSound from "/sound/wrong.mp3";
import tickSound from "/sound/tick.mp3";
import hurrySound from "/sound/hurry.mp3";
import Conclusion1 from "./game-conclusion.component";
import { FaHome, FaCog, FaPause, FaArrowLeft, FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Mảng chứa thông tin về các mảnh tàu
const shipParts = [
	{
		name: "Thân tàu",
		image: "/game/game1/ship_hull.png",
		placeImage: "/places/halong.jpg",
		placeName: "Vịnh Hạ Long",
		description: "Mảnh thân tàu chính - phần quan trọng nhất của con tàu!",
	},
	{
		name: "Buồm",
		image: "/game/game1/ship_sail.png",
		placeImage: "/places/nhathoducba.jpg",
		placeName: "Nhà thờ Đức Bà",
		description: "Cánh buồm giúp tàu di chuyển nhanh trên biển",
	},
	{
		name: "Mỏ neo",
		image: "/game/game1/ship_anchor.png",
		placeImage: "/places/hoian.jpg",
		placeName: "Phố cổ Hội An",
		description: "Mỏ neo giúp tàu đậu an toàn khi cần",
	},
	{
		name: "Bánh lái",
		image: "/game/game1/ship_wheel.png",
		placeImage: "/places/dalat.jpg",
		placeName: "Ga Đà Lạt",
		description: "Bánh lái điều khiển hướng đi của con tàu",
	},
	{
		name: "Súng thần công",
		image: "/game/game1/ship_cannon.png",
		placeImage: "/places/nharong.jpg",
		placeName: "Nhà Rồng",
		description: "Súng thần công - vũ khí mạnh mẽ của cướp biển!",
	},
];

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

interface MathQuestion {
	a: number;
	b: number;
	c: number;
	operation1: "+" | "-";
	operation2: "+" | "-";
	result: number;
	expression: string;
}

// Hàm tạo số ngẫu nhiên trong khoảng min-max
function getRandomNumber(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Hàm tạo câu hỏi toán học với kết quả từ 1-20
function generateMathQuestion(): MathQuestion {
	let a: number, b: number, c: number;
	let operation1: "+" | "-";
	let operation2: "+" | "-";
	let result: number;

	do {
		// Tạo 3 số ngẫu nhiên từ 1-99
		a = getRandomNumber(1, 99);
		b = getRandomNumber(1, 99);
		c = getRandomNumber(1, 99);

		// Chọn ngẫu nhiên phép toán
		operation1 = Math.random() < 0.5 ? "+" : "-";
		operation2 = Math.random() < 0.5 ? "+" : "-";

		// Tính kết quả
		result =
			operation1 === "+"
				? operation2 === "+"
					? a + b + c
					: a + b - c
				: operation2 === "+"
				? a - b + c
				: a - b - c;
	} while (result < 1 || result > 20); // Lặp lại nếu kết quả không nằm trong 1-20

	// Tạo chuỗi biểu thức để hiển thị
	const expression = `${a} ${operation1} ${b} ${operation2} ${c}`;

	return {
		a,
		b,
		c,
		operation1,
		operation2,
		result,
		expression,
	};
}

// Hàm kiểm tra câu trả lời
function checkAnswer(question: MathQuestion, selectedNumber: number): boolean {
	return question.result === selectedNumber;
}

export default function Game1() {
	const navigate = useNavigate();
	const [started, setStarted] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [questionSet, setQuestionSet] = useState<Place[]>([]);
	const [selectedDot, setSelectedDot] = useState<Place | null>(null);
	const [highlightId, setHighlightId] = useState<string | null>(null);
	const [timer, setTimer] = useState(20);
	const [timeUsed, setTimeUsed] = useState(0);
	const [correctCount, setCorrectCount] = useState(0);
	const [clickCount, setClickCount] = useState(0);
	const [swapping, setSwapping] = useState(false);
	const [showConclusion, setShowConclusion] = useState(false);
	const [waitingToFinish, setWaitingToFinish] = useState(false);
	const [showPopup, setShowPopup] = useState(false);
	const [collectedParts, setCollectedParts] = useState<number[]>([]);
	const [lastCollectedPart, setLastCollectedPart] = useState<number | null>(
		null
	);
	const [showNewPartInfo, setShowNewPartInfo] = useState(false);
	const [autoFinishTimer, setAutoFinishTimer] = useState<number | null>(null);
	const [partInfoTimer, setPartInfoTimer] = useState<number | null>(null);
	const [showSettings, setShowSettings] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [flickerHighlight, setFlickerHighlight] = useState(false);
	const flickerTimerRef = useRef<number | null>(null);
	const [shuffledPositions, setShuffledPositions] = useState<{
		[id: string]: { x: number; y: number };
	}>({});
	const [currentQuestion, setCurrentQuestion] = useState<MathQuestion | null>(
		null
	);
	const [selectedPlaceInfo, setSelectedPlaceInfo] = useState<Place | null>(
		null
	);

	// Thêm state cho điểm số
	const [score, setScore] = useState(0);
	const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
	const [timeoutCount, setTimeoutCount] = useState(0);

	// Hiệu ứng nhấp nháy cho điểm cần chọn
	useEffect(() => {
		if (
			started &&
			!showConclusion &&
			!waitingToFinish &&
			!showNewPartInfo &&
			!isPaused
		) {
			if (flickerTimerRef.current) {
				clearInterval(flickerTimerRef.current);
			}

			// Tạo hiệu ứng nhấp nháy ngẫu nhiên
			flickerTimerRef.current = window.setInterval(() => {
				// 15% cơ hội nhấp nháy
				if (Math.random() < 0.15) {
					setFlickerHighlight(true);
					setTimeout(
						() => setFlickerHighlight(false),
						200 + Math.random() * 300
					);
				}
			}, 1500);
		}

		return () => {
			if (flickerTimerRef.current) {
				clearInterval(flickerTimerRef.current);
			}
		};
	}, [started, showConclusion, waitingToFinish, showNewPartInfo, isPaused]);

	useEffect(() => {
		let interval: number;

		if (
			started &&
			!showConclusion &&
			!waitingToFinish &&
			!showNewPartInfo &&
			!isPaused &&
			correctCount < 5
		) {
			interval = window.setInterval(() => {
				setTimer((prev) => {
					if (prev <= 1) {
						setTimeoutCount((count) => count + 1);
						if (!collectedParts.includes(correctCount)) {
							setCollectedParts((prev) => [...prev, correctCount]);
							setLastCollectedPart(correctCount);
							setShowNewPartInfo(true);
						}
						setCorrectCount((count) => count + 1);
						nextQuestion();
						return 20;
					}
					if (prev <= 4) new Audio(hurrySound).play();
					else new Audio(tickSound).play();
					return prev - 1;
				});
				setTimeUsed((prev) => prev + 1);
			}, 1000);
		}

		return () => clearInterval(interval);
	}, [
		started,
		showConclusion,
		waitingToFinish,
		showNewPartInfo,
		isPaused,
		currentIndex,
		correctCount,
	]);

	// Thêm useEffect để tự động kết thúc game sau khi tìm đủ 5 mảnh
	useEffect(() => {
		if (correctCount >= 5) {
			// Dừng các timer hiện tại
			if (autoFinishTimer) {
				clearTimeout(autoFinishTimer);
			}

			// Xóa highlight của điểm hiện tại nếu có
			setHighlightId(null);

			// Thiết lập timer để tự động chuyển sang kết luận sau 3 giây
			const timer = setTimeout(() => {
				setShowConclusion(true);
			}, 3000);

			setAutoFinishTimer(timer);
		}

		return () => {
			if (autoFinishTimer) {
				clearTimeout(autoFinishTimer);
			}
		};
	}, [correctCount]);

	// Thêm useEffect để tự động ẩn thông báo mảnh tàu mới sau 2 giây
	useEffect(() => {
		if (showNewPartInfo && lastCollectedPart !== null) {
			if (partInfoTimer) {
				clearTimeout(partInfoTimer);
			}

			const timer = setTimeout(() => {
				setShowNewPartInfo(false);
			}, 2000);

			setPartInfoTimer(timer);
		}

		return () => {
			if (partInfoTimer) {
				clearTimeout(partInfoTimer);
			}
		};
	}, [showNewPartInfo, lastCollectedPart]);

	useEffect(() => {
		// Tạo bộ câu hỏi và vị trí ban đầu một lần duy nhất khi component được tạo
		const shuffled = [...places].sort(() => 0.5 - Math.random());
		setQuestionSet(shuffled.slice(0, 5));

		// Tạo sẵn các vị trí ban đầu cho tất cả các điểm
		const initialPositions = generateShuffledPositions();
		setShuffledPositions(initialPositions);
	}, []);

	const generateShuffledPositions = () => {
		const newPositions: { [id: string]: { x: number; y: number } } = {};

		// Chia bản đồ thành lưới 5x4
		const gridCols = 5;
		const gridRows = 4;
		const cells: { x: number; y: number }[] = [];

		// Tạo các ô trong lưới
		for (let row = 0; row < gridRows; row++) {
			for (let col = 0; col < gridCols; col++) {
				cells.push({
					x: 0.15 + (col * 0.7) / (gridCols - 1), // 0.15 đến 0.85
					y: 0.15 + (row * 0.7) / (gridRows - 1), // 0.15 đến 0.85
				});
			}
		}

		// Trộn ngẫu nhiên các ô
		for (let i = cells.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[cells[i], cells[j]] = [cells[j], cells[i]];
		}

		// Thêm độ ngẫu nhiên nhỏ cho mỗi vị trí
		places.forEach((place, index) => {
			if (index < cells.length) {
				const jitterX = (Math.random() - 0.5) * 0.06; // ±3%
				const jitterY = (Math.random() - 0.5) * 0.06; // ±3%

				newPositions[place.id] = {
					x: Math.min(0.85, Math.max(0.15, cells[index].x + jitterX)),
					y: Math.min(0.85, Math.max(0.15, cells[index].y + jitterY)),
				};
			}
		});

		return newPositions;
	};

	const startShuffle = () => {
		setSwapping(true);
		const newPositions = generateShuffledPositions();
		setShuffledPositions(newPositions);
		setTimeout(() => setSwapping(false), 400); // Giảm thời gian animation xuống 400ms
	};

	const handleStart = () => {
		setSelectedPlaceInfo(null);
		setStarted(true);
		setTimer(20);
		setScore(0);
		setConsecutiveCorrect(0);
		setCurrentQuestion(generateMathQuestion());
		startShuffle();
	};

	const togglePause = () => {
		setIsPaused(!isPaused);
	};

	const handleDotClick = (place: Place) => {
		if (!started) {
			setSelectedPlaceInfo(place);
			return;
		}

		if (correctCount >= 5) {
			return;
		}

		if (
			!waitingToFinish &&
			!showNewPartInfo &&
			!isPaused &&
			!showConclusion &&
			currentQuestion
		) {
			const selectedNumber = places.findIndex((p) => p.id === place.id) + 1;
			const isCorrect = checkAnswer(currentQuestion, selectedNumber);

			if (isCorrect) {
				new Audio(correctSound).play();
				const newCount = correctCount + 1;
				setCorrectCount(newCount);

				// Tính điểm cơ bản và thưởng thời gian
				const timeBonus = timer >= 8 ? 10 : timer >= 5 ? 5 : 0;
				setScore((prev) => prev + 20 + timeBonus);

				// Thêm mảnh tàu mới
				if (!collectedParts.includes(correctCount)) {
					setCollectedParts((prev) => [...prev, correctCount]);
					setLastCollectedPart(correctCount);
					setShowNewPartInfo(true);
				}

				// Chuyển sang câu hỏi tiếp theo nếu chưa đủ 5 điểm đúng
				if (newCount < 5) {
					nextQuestion();
				}
			} else {
				new Audio(wrongSound).play();
			}
		}
	};

	const nextQuestion = () => {
		if (currentIndex < 4) {
			// Đặt trạng thái swapping trước
			setSwapping(true);

			// Tạo vị trí mới trước
			const newPositions = generateShuffledPositions();

			// Sử dụng setTimeout để đảm bảo các thao tác được thực hiện tuần tự
			setTimeout(() => {
				setShuffledPositions(newPositions);

				// Cập nhật câu hỏi và index sau khi animation bắt đầu
				setTimeout(() => {
					const next = currentIndex + 1;
					setCurrentIndex(next);
					setCurrentQuestion(generateMathQuestion());
					setTimer(20);

					// Kết thúc animation
					setTimeout(() => {
						setSwapping(false);
					}, 300);
				}, 50);
			}, 50);
		} else {
			setWaitingToFinish(true);
		}
	};

	const restartGame = () => {
		window.location.reload();
	};

	if (showConclusion) {
		return (
			<Conclusion1
				timeUsed={timeUsed}
				matchedCards={correctCount}
				totalCards={5}
				win={correctCount > 0}
				timeoutCount={timeoutCount}
			/>
		);
	}

	const currentPlace = questionSet[currentIndex];
	const shipProgress = (correctCount / 5) * 100;

	return (
		<div className="game-zone flex w-full h-full gap-4 pt-4 px-6 bg-[#0c1e35] font-pirate text-yellow-100">
			{/* Header với nút cài đặt */}
			<div className="absolute top-4 right-4 z-50">
				<div className="relative">
					<button
						onClick={() => setShowSettings(!showSettings)}
						className="w-12 h-12 bg-amber-600/80 hover:bg-amber-600 rounded-full flex items-center justify-center text-white shadow-lg"
					>
						<FaCog className="w-6 h-6" />
					</button>

					{showSettings && (
						<div className="absolute top-full right-0 mt-2 bg-[#0f172a]/90 backdrop-blur-sm border-2 border-amber-600/80 rounded-lg shadow-xl p-2 w-48">
							<ul className="space-y-2">
								<li>
									<button
										onClick={() => navigate("/")}
										className="w-full text-left px-3 py-2 hover:bg-amber-800/50 rounded flex items-center gap-2 text-amber-200"
									>
										<FaHome /> Trang chính
									</button>
								</li>
								<li>
									<button
										onClick={togglePause}
										className="w-full text-left px-3 py-2 hover:bg-amber-800/50 rounded flex items-center gap-2 text-amber-200"
									>
										{isPaused ? <FaPlay /> : <FaPause />}{" "}
										{isPaused ? "Tiếp tục" : "Tạm dừng"}
									</button>
								</li>
								<li>
									<button
										onClick={() => navigate("/game1")}
										className="w-full text-left px-3 py-2 hover:bg-amber-800/50 rounded flex items-center gap-2 text-amber-200"
									>
										<FaArrowLeft /> Quay lại
									</button>
								</li>
							</ul>
						</div>
					)}
				</div>
			</div>

			{/* Map Column */}
			<div className="relative flex-1 rounded-xl border-4 border-amber-600 shadow-lg overflow-hidden bg-[#0c1e35]">
				{isPaused && (
					<div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
						<div className="text-center bg-[#0f172a]/80 p-6 rounded-xl border-2 border-amber-600">
							<h2 className="text-3xl font-bold text-amber-300 mb-4">
								Đã tạm dừng
							</h2>
							<button
								onClick={togglePause}
								className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg text-white"
							>
								<FaPlay className="inline mr-2" /> Tiếp tục chơi
							</button>
						</div>
					</div>
				)}

				<img
					src="/places/map.jpg"
					alt="Treasure Map"
					className="absolute w-full h-full object-cover opacity-90"
				/>
				{places.map((place, index) => (
					<motion.div
						key={place.id}
						initial={false}
						animate={{
							left: `${(
								(shuffledPositions[place.id]?.x ?? place.position.x) * 100
							).toFixed(2)}%`,
							top: `${(
								(shuffledPositions[place.id]?.y ?? place.position.y) * 100
							).toFixed(2)}%`,
						}}
						transition={{
							duration: swapping ? 0.3 : 0,
							type: "tween",
							ease: "easeOut",
						}}
						className={`absolute w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-lg transform -translate-x-1/2 -translate-y-1/2
							${correctCount >= 5 ? "cursor-default opacity-50" : "cursor-pointer"}
							${
								started && place.id === highlightId && correctCount < 5
									? flickerHighlight
										? "bg-amber-700 border-amber-400 text-amber-200"
										: "bg-yellow-300 ring-4 ring-yellow-500 border-amber-800 animate-pulse text-amber-900"
									: "bg-amber-700 border-amber-400 text-amber-200"
							}
							${swapping && started ? "opacity-70" : "opacity-100"}`}
						style={{
							position: "absolute",
							willChange: "transform",
							zIndex: place.id === highlightId ? 10 : 1,
						}}
						onClick={() => handleDotClick(place)}
					>
						{index + 1}
					</motion.div>
				))}
			</div>

			{/* Right Panel */}
			<div className="flex flex-col gap-4 w-[360px]">
				{/* Score Display */}
				<div className="bg-[#0c1e35]/90 border-4 border-amber-600 p-4 rounded-lg shadow">
					<div className="text-center">
						<h3 className="text-xl font-bold text-amber-300">
							Điểm số: {score}
						</h3>
						{timeoutCount > 0 && (
							<p className="text-sm text-red-400">
								Hết giờ: {timeoutCount} lần (-{timeoutCount * 15} điểm)
							</p>
						)}
					</div>
				</div>

				{/* Ship Parts Collection Box */}
				<div className="bg-[#0c1e35]/90 border-4 border-amber-600 p-4 rounded-lg shadow">
					<div className="flex flex-col gap-3 h-[120px]">
						<div className="flex items-center justify-between">
							<div className="w-8 h-8 relative">
								<CircularProgressbarWithChildren
									value={shipProgress}
									styles={buildStyles({
										pathColor: "#f59e0b",
										trailColor: "#1e293b",
										strokeLinecap: "butt",
									})}
								>
									<span className="text-amber-200 text-[10px] font-bold">
										{Math.round(shipProgress)}%
									</span>
								</CircularProgressbarWithChildren>
							</div>
						</div>

						<div className="flex-1 flex flex-wrap items-center justify-center gap-2">
							{!started ? (
								<button
									onClick={handleStart}
									className="bg-amber-600 hover:bg-amber-700 px-6 py-2 rounded-lg text-white shadow text-lg font-bold"
								>
									🏴‍☠️ Bắt đầu!
								</button>
							) : collectedParts.length > 0 ? (
								collectedParts.map((partIndex) => (
									<div
										key={partIndex}
										className="w-12 h-12 bg-amber-800/50 rounded border border-amber-500"
										title={shipParts[partIndex].name}
									>
										<img
											src={shipParts[partIndex].image}
											alt={shipParts[partIndex].name}
											className="w-full h-full object-contain p-1"
										/>
									</div>
								))
							) : (
								<p className="text-xs text-amber-200/80">Chưa có mảnh nào</p>
							)}
						</div>
					</div>
				</div>

				{/* Question Box */}
				{started && currentQuestion && !showNewPartInfo ? (
					<div className="bg-[#0c1e35]/90 border-4 border-amber-600 p-4 rounded-lg shadow text-center">
						<div className="mb-4">
							<h3 className="text-xl font-bold text-amber-300 mb-2">
								Câu hỏi {currentIndex + 1}/5
							</h3>
							<p className="text-2xl font-bold text-amber-100">
								{currentQuestion.expression} = ?
							</p>
						</div>
						<div className="w-32 h-32 mx-auto">
							<CircularProgressbarWithChildren
								value={(timer / 20) * 100}
								styles={buildStyles({
									pathColor: timer <= 3 ? "#ef4444" : "#f59e0b",
									trailColor: "#334155",
								})}
								strokeWidth={8}
							>
								<div className="text-white text-3xl font-bold">{timer}s</div>
							</CircularProgressbarWithChildren>
						</div>
					</div>
				) : null}

				{/* Ship Building Progress */}
				{shipProgress >= 100 && (
					<div className="bg-[#0c1e35]/90 border-4 border-amber-600 p-4 rounded-lg shadow text-center">
						<h3 className="text-xl font-bold text-amber-300">🎉 Chúc mừng!</h3>
						<p className="text-md font-semibold text-amber-200">
							Bạn đã hoàn thành con tàu cướp biển!
						</p>
						<p className="text-sm text-amber-100 mt-1">
							Đang chuyển đến kết quả...
						</p>
					</div>
				)}

				{/* Question Box hoặc Part Info Box */}
				{showNewPartInfo && lastCollectedPart !== null ? (
					<div className="bg-[#1a3d65] border-4 border-amber-600 p-4 rounded-lg shadow text-center space-y-2">
						<h2 className="text-2xl font-bold text-amber-300">🎯 Tuyệt vời!</h2>
						<p className="text-lg font-semibold text-amber-100">
							Bạn đã tìm thấy {shipParts[lastCollectedPart].name}!
						</p>
						<div className="flex gap-4 justify-center items-center">
							<div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-amber-500 bg-amber-800/30 p-2">
								<img
									src={shipParts[lastCollectedPart].image}
									alt={shipParts[lastCollectedPart].name}
									className="w-full h-full object-contain"
								/>
							</div>
							<div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-amber-500">
								<img
									src={shipParts[lastCollectedPart].placeImage}
									alt={shipParts[lastCollectedPart].placeName}
									className="w-full h-full object-cover"
								/>
							</div>
						</div>
						<p className="text-amber-200">
							{shipParts[lastCollectedPart].description}
						</p>
						<p className="text-sm text-amber-200">
							Tìm thấy tại: {shipParts[lastCollectedPart].placeName}
						</p>
						<p className="text-sm text-amber-300 mt-1">
							Còn {5 - collectedParts.length} mảnh tàu để tìm!
						</p>
					</div>
				) : null}

				{/* Info Box */}
				{selectedDot ? (
					<div className="bg-[#0c1e35]/90 border-4 border-amber-600 p-4 rounded-lg shadow overflow-y-auto max-h-[65vh] space-y-2">
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
				) : null}

				{!started && selectedPlaceInfo && (
					<div className="bg-[#0c1e35]/90 border-4 border-amber-600 p-4 rounded-lg shadow">
						<h3 className="text-xl font-bold text-amber-300 mb-3 text-center">
							Thông tin địa điểm: {selectedPlaceInfo.name}
						</h3>
						<div className="mb-4">
							<img
								src={selectedPlaceInfo.image}
								alt={selectedPlaceInfo.name}
								className="w-full h-48 object-cover rounded-lg border-2 border-amber-500"
							/>
						</div>
						<div className="text-left">
							<p className="text-sm text-amber-200 mb-2">
								<strong>Năm xây dựng:</strong> {selectedPlaceInfo.builtYear}
							</p>
							<p className="text-sm text-amber-200 mb-2">
								<strong>Kiến trúc sư:</strong> {selectedPlaceInfo.architect}
							</p>
							<p className="text-sm text-amber-200 mb-2">
								<strong>Tuổi:</strong> {selectedPlaceInfo.age} năm
							</p>
							<p className="text-sm text-amber-200">
								<strong>Lịch sử:</strong> {selectedPlaceInfo.history}
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
