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
		image: "/places/halong.jpg",
		description: "Mảnh thân tàu chính - phần quan trọng nhất của con tàu!",
	},
	{
		name: "Buồm",
		image: "/places/nhathoducba.jpg",
		description: "Cánh buồm giúp tàu di chuyển nhanh trên biển",
	},
	{
		name: "Mỏ neo",
		image: "/places/hoian.jpg",
		description: "Mỏ neo giúp tàu đậu an toàn khi cần",
	},
	{
		name: "Bánh lái",
		image: "/places/dalat.jpg",
		description: "Bánh lái điều khiển hướng đi của con tàu",
	},
	{
		name: "Súng thần công",
		image: "/places/nharong.jpg",
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

export default function Game1() {
	const navigate = useNavigate();
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
		// Tạo mảng vị trí riêng biệt từ places
		const uniquePositions = places.map((place) => ({ ...place.position }));

		// Trộn mảng vị trí
		for (let i = uniquePositions.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[uniquePositions[i], uniquePositions[j]] = [
				uniquePositions[j],
				uniquePositions[i],
			];
		}

		// Tạo bản đồ vị trí mới với kiểu dữ liệu hợp lý
		const newPositions: { [id: string]: { x: number; y: number } } = {};

		// Gán vị trí mới cho từng điểm, đảm bảo không trùng lặp
		places.forEach((place, index) => {
			// Lấy vị trí từ mảng đã trộn, đảm bảo không trùng lặp
			const newPos = uniquePositions[index % uniquePositions.length];

			// Thêm độ nhiễu nhỏ để tránh trùng lặp hoàn toàn (không vượt quá biên)
			const jitterX = Math.random() * 0.04 - 0.02; // +/- 2%
			const jitterY = Math.random() * 0.04 - 0.02; // +/- 2%

			// Đảm bảo tọa độ trong khoảng [0.05, 0.95] để không bị ra ngoài viền
			const newX = Math.min(0.95, Math.max(0.05, newPos.x + jitterX));
			const newY = Math.min(0.95, Math.max(0.05, newPos.y + jitterY));

			newPositions[place.id] = {
				x: newX,
				y: newY,
			};
		});

		return newPositions;
	};

	const startShuffle = () => {
		// Đánh dấu đang swap để thực hiện hiệu ứng
		setSwapping(true);

		// Tạo vị trí mới và áp dụng ngay lập tức
		const newPositions = generateShuffledPositions();
		setShuffledPositions(newPositions);

		// Đặt timeout để kết thúc hiệu ứng swap
		setTimeout(() => setSwapping(false), 1200);
	};

	const handleStart = () => {
		setStarted(true);
		setHighlightId(questionSet[0].id);
		setTimer(10);
		startShuffle();
	};

	const togglePause = () => {
		setIsPaused(!isPaused);
	};

	const handleDotClick = (place: Place) => {
		setSelectedDot(place);
		if (correctCount >= 5) return;

		if (started && !isPaused) {
			setClickCount((c) => c + 1);
			if (place.id === highlightId) {
				new Audio(correctSound).play();
				const newCount = correctCount + 1;
				setCorrectCount(newCount);

				// Thêm mảnh tàu mới
				if (!collectedParts.includes(correctCount)) {
					setCollectedParts((prev) => [...prev, correctCount]);
					setLastCollectedPart(correctCount);
					setShowNewPartInfo(true);
					setSelectedDot(null); // Đóng info box nếu đang mở
				}

				// Chỉ chuyển sang câu hỏi tiếp theo nếu chưa đủ 5 điểm đúng
				if (newCount < 5) {
					nextQuestion();
				}
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
		return (
			<Conclusion1
				timeUsed={timeUsed}
				matchedCards={correctCount}
				totalCards={5}
				win={correctCount > 0}
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
							duration: swapping ? 1.2 : 0,
							ease: "easeInOut",
							type: "spring", // Thay đổi từ tween sang spring để có chuyển động tự nhiên hơn
							damping: 25, // Tăng damping để giảm hiệu ứng rung
							stiffness: 180, // Tăng stiffness để chuyển động nhanh hơn
							mass: 0.8, // Giảm mass để làm cho chuyển động nhẹ nhàng
						}}
						className={`absolute w-8 h-8 rounded-full cursor-pointer border-2
							${
								started && place.id === highlightId && correctCount < 5
									? flickerHighlight
										? "bg-amber-700 border-amber-400" // Hiệu ứng nhấp nháy - trở về màu mặc định
										: "bg-yellow-300 ring-4 ring-yellow-500 border-amber-800 animate-pulse"
									: "bg-amber-700 border-amber-400"
							}
							${swapping && started ? "opacity-70" : "opacity-100"}`}
						style={{
							transform: "translate(-50%, -50%)",
							willChange: "transform, left, top",
							x: 0,
							y: 0,
							position: "absolute",
							zIndex: place.id === highlightId ? 10 : 1, // Điểm cần chọn hiển thị trên cùng
						}}
						layoutId={place.id}
						onClick={() => handleDotClick(place)}
					/>
				))}

				{/* Hiển thị mảnh tàu thu thập được ở dưới cùng */}
				<div className="absolute bottom-4 left-4 right-4 bg-[#0c1e35]/80 border-2 border-amber-600 rounded-lg p-2 backdrop-blur-sm">
					<div className="flex items-center gap-2">
						<div className="w-12 h-12 relative">
							<CircularProgressbarWithChildren
								value={shipProgress}
								styles={buildStyles({
									pathColor: "#f59e0b",
									trailColor: "#1e293b",
									strokeLinecap: "butt",
								})}
							>
								{shipProgress >= 100 ? (
									<div className="w-8 h-8 rounded-full">
										<img
											src="/places/halong.jpg"
											alt="Completed Ship"
											className="w-full h-full object-cover rounded-full"
										/>
									</div>
								) : (
									<span className="text-amber-200 text-xs font-bold">
										{Math.round(shipProgress)}%
									</span>
								)}
							</CircularProgressbarWithChildren>
						</div>

						<div className="flex-1">
							<h3 className="text-sm font-bold text-amber-300">
								⚓ Mảnh tàu thu thập
							</h3>
							{/* Ship parts collection display */}
							{collectedParts.length > 0 ? (
								<div className="flex gap-1 mt-1">
									{collectedParts.map((partIndex) => (
										<div
											key={partIndex}
											className="w-6 h-6 bg-amber-800/50 rounded border border-amber-500"
											title={shipParts[partIndex].name}
										>
											<img
												src={shipParts[partIndex].image}
												alt={shipParts[partIndex].name}
												className="w-full h-full object-cover rounded"
											/>
										</div>
									))}
								</div>
							) : (
								<p className="text-xs text-amber-200/80">Chưa có mảnh nào</p>
							)}
						</div>

						{!started && (
							<button
								onClick={handleStart}
								className="bg-amber-600 hover:bg-amber-700 px-4 py-1 rounded-lg text-white shadow text-sm font-bold ml-auto"
							>
								🏴‍☠️ Săn báu vật!
							</button>
						)}
					</div>
				</div>
			</div>

			{/* Right Panel */}
			<div className="flex flex-col gap-4 w-[360px]">
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
						<div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-amber-500 bg-amber-800/30 p-1">
							<img
								src={shipParts[lastCollectedPart].image}
								alt={shipParts[lastCollectedPart].name}
								className="w-full h-full object-cover"
							/>
						</div>
						<p className="text-amber-200">
							{shipParts[lastCollectedPart].description}
						</p>
						<p className="text-sm text-amber-300 mt-1">
							Còn {5 - collectedParts.length} mảnh tàu để tìm!
						</p>
					</div>
				) : (
					<div className="bg-[#0c1e35]/90 border-4 border-amber-600 p-4 rounded-lg shadow text-center">
						{started ? (
							<>
								<div className="w-32 h-32 mx-auto">
									<CircularProgressbarWithChildren
										value={(timer / 10) * 100}
										styles={buildStyles({
											pathColor: timer <= 3 ? "#ef4444" : "#f59e0b",
											trailColor: "#334155",
										})}
										strokeWidth={8}
									>
										<div className="text-white text-3xl font-bold">
											{timer}s
										</div>
									</CircularProgressbarWithChildren>
								</div>
							</>
						) : (
							<div className="py-12 text-center">
								<h2 className="text-2xl font-bold text-amber-300 mb-4">
									Săn tìm kho báu
								</h2>
								<p className="text-amber-200 mb-4">
									Tìm 5 địa điểm bí mật để thu thập các mảnh tàu cướp biển!
								</p>
								<button
									onClick={handleStart}
									className="bg-amber-600 hover:bg-amber-700 px-6 py-2 rounded-lg text-white shadow font-bold text-lg mx-auto"
								>
									🏴‍☠️ Bắt đầu săn báu vật!
								</button>
							</div>
						)}
					</div>
				)}

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
			</div>
		</div>
	);
}
