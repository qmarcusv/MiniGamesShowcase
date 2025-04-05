import { useEffect, useState, useRef } from "react";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import correctSound from "/sound/correct.mp3";
import wrongSound from "/sound/wrong.mp3";
import tickSound from "/sound/tick.mp3";
import hurrySound from "/sound/hurry.mp3";
import GameConclusion from "../../shared/component/game-conclusion/game-conclusion.component";
import {
	GameStats,
	Artifact,
} from "../../shared/component/game-conclusion/game-conclusion.types";
import "./game.component.scss";

interface Document {
	id: string;
	type: "text" | "audio" | "history" | "nom" | "han";
	color: string;
	colorName: string;
	text?: string;
}

const DOCUMENT_TYPES = {
	text: { name: "Kho tài liệu", color: "#FF0000", colorName: "Đỏ" },
	audio: { name: "Kho âm thanh", color: "#FF69B4", colorName: "Hồng" },
	history: {
		name: "Kho văn kiện lịch sử",
		color: "#0000FF",
		colorName: "Xanh dương",
	},
	nom: { name: "Kho chữ Nôm", color: "#00FF00", colorName: "Xanh lá" },
	han: { name: "Kho chữ Hán", color: "#FFFF00", colorName: "Vàng" },
};

const SAMPLE_DOCUMENTS: Document[] = [
	{
		id: "1",
		type: "text",
		color: "#FF0000",
		colorName: "Đỏ",
		text: "Kho tài liệu",
	},
	{
		id: "2",
		type: "audio",
		color: "#FF69B4",
		colorName: "Hồng",
		text: "Kho âm thanh",
	},
	{
		id: "3",
		type: "history",
		color: "#0000FF",
		colorName: "Xanh dương",
		text: "Kho văn kiện lịch sử",
	},
	{
		id: "4",
		type: "nom",
		color: "#00FF00",
		colorName: "Xanh lá",
		text: "Kho chữ Nôm",
	},
	{
		id: "5",
		type: "han",
		color: "#FFFF00",
		colorName: "Vàng",
		text: "Kho chữ Hán",
	},
	{
		id: "6",
		type: "text",
		color: "#FF69B4",
		colorName: "Hồng",
		text: "Kho tài liệu",
	},
	{
		id: "7",
		type: "audio",
		color: "#FF0000",
		colorName: "Đỏ",
		text: "Kho âm thanh",
	},
	{
		id: "8",
		type: "history",
		color: "#00FF00",
		colorName: "Xanh lá",
		text: "Kho văn kiện lịch sử",
	},
	{
		id: "9",
		type: "nom",
		color: "#0000FF",
		colorName: "Xanh dương",
		text: "Kho chữ Nôm",
	},
	{
		id: "10",
		type: "han",
		color: "#FF69B4",
		colorName: "Hồng",
		text: "Kho chữ Hán",
	},
];

const BASE_DROP_SPEED = 50;
const SPEED_INCREASE_FACTOR = 1.2;
const MAX_SPEED_MULTIPLIER = 5;
const PIXELS_PER_FRAME = 1;
const ANIMATION_FRAME_RATE = 1000 / 60;

const ARTIFACT: Artifact = {
	name: "Mảnh ghép cổ vật",
	description: "Một mảnh ghép bí ẩn từ kho báu cổ đại",
	requirements: {
		score: 10,
		accuracy: 60,
	},
	image: "/image/artifact-placeholder.png",
};

const generateDocument = (): Document => {
	return SAMPLE_DOCUMENTS[Math.floor(Math.random() * SAMPLE_DOCUMENTS.length)];
};

// Hàm tính độ tương phản giữa hai màu
const getContrastRatio = (color1: string, color2: string): number => {
	const getLuminance = (color: string): number => {
		const r = parseInt(color.slice(1, 3), 16) / 255;
		const g = parseInt(color.slice(3, 5), 16) / 255;
		const b = parseInt(color.slice(5, 7), 16) / 255;
		const [rs, gs, bs] = [r, g, b].map((c) =>
			c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
		);
		return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
	};

	const l1 = getLuminance(color1);
	const l2 = getLuminance(color2);
	const lighter = Math.max(l1, l2);
	const darker = Math.min(l1, l2);
	return (lighter + 0.05) / (darker + 0.05);
};

// Hàm chọn màu chữ phù hợp với màu nền
const getTextColor = (backgroundColor: string): string => {
	const whiteContrast = getContrastRatio(backgroundColor, "#FFFFFF");
	const blackContrast = getContrastRatio(backgroundColor, "#000000");
	return whiteContrast > blackContrast ? "#FFFFFF" : "#000000";
};

export default function Game7() {
	const [started, setStarted] = useState(false);
	const [timer, setTimer] = useState(60);
	const [score, setScore] = useState(0);
	const [currentDoc, setCurrentDoc] = useState<Document | null>(null);
	const [currentX, setCurrentX] = useState(2);
	const [gameOver, setGameOver] = useState(false);
	const [fallingY, setFallingY] = useState(0);
	const [isDropping, setIsDropping] = useState(false);
	const [dropSpeed, setDropSpeed] = useState(BASE_DROP_SPEED);
	const [showCurrent, setShowCurrent] = useState(true);
	const [totalMoves, setTotalMoves] = useState(0);
	const [correctMoves, setCorrectMoves] = useState(0);
	const [showArtifactPopup, setShowArtifactPopup] = useState(false);
	const [gameStats, setGameStats] = useState<GameStats | null>(null);
	const animationFrameRef = useRef<number | undefined>(undefined);
	const lastUpdateTimeRef = useRef<number>(0);

	useEffect(() => {
		startGame();
	}, []);

	useEffect(() => {
		if (started && !gameOver) {
			const interval = setInterval(() => {
				setTimer((prev) => {
					if (prev <= 1) {
						setGameOver(true);
						return 0;
					}
					if (prev <= 10) new Audio(hurrySound).play();
					else new Audio(tickSound).play();
					return prev - 1;
				});
			}, 1000);
			return () => clearInterval(interval);
		}
	}, [started, gameOver]);

	const animate = (timestamp: number) => {
		if (!lastUpdateTimeRef.current) {
			lastUpdateTimeRef.current = timestamp;
		}

		const deltaTime = timestamp - lastUpdateTimeRef.current;

		if (deltaTime >= ANIMATION_FRAME_RATE) {
			setFallingY((prev) => {
				if (prev >= 400) {
					handleLanding();
					return 0;
				}
				const distance = (PIXELS_PER_FRAME * BASE_DROP_SPEED) / dropSpeed;
				return prev + distance;
			});
			lastUpdateTimeRef.current = timestamp;
		}

		if (started && !gameOver && !isDropping && currentDoc) {
			animationFrameRef.current = requestAnimationFrame(animate);
		}
	};

	useEffect(() => {
		if (started && !gameOver && !isDropping && currentDoc) {
			lastUpdateTimeRef.current = 0;
			animationFrameRef.current = requestAnimationFrame(animate);

			const handleKeyPress = (e: KeyboardEvent) => {
				if (e.key === "ArrowLeft") {
					setCurrentX((prev) => {
						const newX = Math.max(0, prev - 1);
						console.info("Di chuyển sang trái, currentX mới:", newX);
						return newX;
					});
				} else if (e.key === "ArrowRight") {
					setCurrentX((prev) => {
						const newX = Math.min(4, prev + 1);
						console.info("Di chuyển sang phải, currentX mới:", newX);
						return newX;
					});
				} else if (e.key === "ArrowDown") {
					console.info("Nhấn phím xuống, currentX hiện tại:", currentX);
					if (animationFrameRef.current) {
						cancelAnimationFrame(animationFrameRef.current);
					}
					handleLanding();
				}
			};

			window.addEventListener("keydown", handleKeyPress);
			return () => {
				if (animationFrameRef.current) {
					cancelAnimationFrame(animationFrameRef.current);
				}
				window.removeEventListener("keydown", handleKeyPress);
			};
		}
	}, [started, gameOver, isDropping, currentDoc, dropSpeed, currentX]);

	const handleMoveLeft = () => {
		setCurrentX((prev) => {
			const newX = Math.max(0, prev - 1);
			console.info("Di chuyển sang trái, currentX mới:", newX);
			return newX;
		});
	};

	const handleMoveRight = () => {
		setCurrentX((prev) => {
			const newX = Math.min(4, prev + 1);
			console.info("Di chuyển sang phải, currentX mới:", newX);
			return newX;
		});
	};

	const handleDrop = () => {
		console.info("Nhấn nút xuống, currentX hiện tại:", currentX);
		if (animationFrameRef.current) {
			cancelAnimationFrame(animationFrameRef.current);
		}
		handleLanding();
	};

	const startGame = () => {
		if (animationFrameRef.current) {
			cancelAnimationFrame(animationFrameRef.current);
		}
		setStarted(true);
		setTimer(60);
		setScore(0);
		setGameOver(false);
		setCurrentX(2);
		setFallingY(0);
		setCurrentDoc(generateDocument());
		setIsDropping(false);
		setDropSpeed(BASE_DROP_SPEED);
		setShowCurrent(true);
		setTotalMoves(0);
		setCorrectMoves(0);
		setShowArtifactPopup(false);
		setGameStats(calculateGameStats());
		lastUpdateTimeRef.current = 0;
	};

	const handleLanding = () => {
		if (!currentDoc) return;

		setTotalMoves((prev) => prev + 1);

		// Lấy thông tin kho đã đặt dựa trên vị trí currentX
		const targetType = Object.keys(DOCUMENT_TYPES)[
			currentX
		] as keyof typeof DOCUMENT_TYPES;
		console.info("=== Debug handleLanding ===");
		console.info("currentX khi handleLanding:", currentX);
		console.info("Loại kho đã chọn:", targetType);

		const targetInfo = DOCUMENT_TYPES[targetType];
		const targetName = targetInfo.name;
		const targetColor = targetInfo.color;
		const targetColorName = targetInfo.colorName;

		// Tìm kho expected dựa trên màu sắc và chữ
		let expectedType = null;
		if (currentDoc.text) {
			// Nếu có chữ, tìm kho có tên trùng với chữ
			expectedType = Object.entries(DOCUMENT_TYPES).find(
				([_, info]) => info.name === currentDoc.text
			)?.[0];
		} else {
			// Nếu không có chữ, tìm kho có màu trùng
			expectedType = Object.entries(DOCUMENT_TYPES).find(
				([_, info]) => info.color === currentDoc.color
			)?.[0];
		}

		// Kiểm tra theo logic mới: ưu tiên chữ hơn màu
		let isCorrect = false;

		if (currentDoc.text) {
			// Nếu có chữ, phải khớp với tên kho
			isCorrect = currentDoc.text === targetName;

			// Nếu chữ không khớp, kiểm tra thêm xem màu sắc và chữ có khớp với kho đó không
			if (!isCorrect) {
				const matchingType = Object.entries(DOCUMENT_TYPES).find(
					([_, info]) => info.name === currentDoc.text
				);
				if (matchingType) {
					const [type, info] = matchingType;
					isCorrect = currentDoc.color === info.color && type === targetType;
				}
			}
		} else {
			// Nếu không có chữ, chỉ kiểm tra màu sắc
			isCorrect = currentDoc.color === targetColor;
		}

		// In thông tin ra terminal
		console.info("=== Thông tin object ===");
		console.info("Màu sắc object:", currentDoc.colorName);
		console.info("Nội dung:", currentDoc.text || "Không có chữ");
		console.info("Kho đã đặt:", `${targetName} (${targetColorName})`);
		console.info(
			"Kho expected:",
			expectedType
				? `${
						DOCUMENT_TYPES[expectedType as keyof typeof DOCUMENT_TYPES].name
				  } (${
						DOCUMENT_TYPES[expectedType as keyof typeof DOCUMENT_TYPES]
							.colorName
				  })`
				: "Không xác định"
		);
		console.info("Kết quả:", isCorrect ? "Đúng" : "Sai");
		console.info("=====================");

		if (isCorrect) {
			new Audio(correctSound).play();
			setScore((prev) => prev + 1);
			setCorrectMoves((prev) => prev + 1);
			setDropSpeed((prev) => {
				const newSpeed = prev / SPEED_INCREASE_FACTOR;
				return Math.max(BASE_DROP_SPEED / MAX_SPEED_MULTIPLIER, newSpeed);
			});
		} else {
			new Audio(wrongSound).play();
		}

		setShowCurrent(false);

		setTimeout(() => {
			setCurrentDoc(generateDocument());
			setFallingY(0);
			setCurrentX(2);
			setIsDropping(false);
			setShowCurrent(true);
			lastUpdateTimeRef.current = 0;
		}, 500);
	};

	const calculateGameStats = (): GameStats => {
		const accuracy = (correctMoves / totalMoves) * 100 || 0;
		const artifactUnlocked =
			score >= ARTIFACT.requirements.score &&
			accuracy >= ARTIFACT.requirements.accuracy;

		return {
			score,
			totalMoves,
			correctMoves,
			accuracy,
			artifact: artifactUnlocked ? ARTIFACT.name : "",
			artifactUnlocked,
		};
	};

	const handleGameOver = () => {
		const stats = calculateGameStats();
		setGameStats(stats);
		setGameOver(true);
	};

	useEffect(() => {
		if (timer <= 0) {
			handleGameOver();
		}
	}, [timer]);

	return (
		<div className="h-full bg-[url('/image/pirate-bg.jpg')] bg-cover bg-center flex items-center justify-center px-4">
			<div className="bg-[#0f172a]/80 backdrop-blur-md border-4 border-orange-600 rounded-2xl shadow-2xl p-10 max-w-4xl w-full text-center space-y-8 text-orange-100 font-pirate">
				{!started ? (
					<button
						onClick={startGame}
						className="bg-orange-600 text-white px-8 py-4 rounded-xl text-2xl hover:bg-orange-700 transition shadow-md"
					>
						🎮 Bắt đầu chơi
					</button>
				) : gameOver && gameStats ? (
					<GameConclusion
						gameStats={gameStats}
						artifact={ARTIFACT}
						onRestart={startGame}
					/>
				) : (
					<div className="grid grid-cols-2 gap-8">
						<div className="space-y-4">
							<div className="w-32 h-32 mx-auto">
								<CircularProgressbarWithChildren
									value={timer}
									maxValue={60}
									styles={{
										path: { stroke: "#f97316" },
										text: { fill: "#f97316", fontSize: "24px" },
									}}
								>
									<div className="text-2xl font-bold">{timer}s</div>
								</CircularProgressbarWithChildren>
							</div>
							<div className="text-2xl">Điểm: {score}</div>
							{gameStats?.artifactUnlocked && (
								<div className="text-sm text-orange-300">
									🏆 Đã mở khóa {ARTIFACT.name}!
								</div>
							)}
						</div>

						<div className="space-y-4">
							<div className="relative h-[500px] border-2 border-orange-600 rounded-lg bg-slate-900/50">
								<div className="absolute bottom-0 w-full grid grid-cols-5 gap-2 p-2">
									{Object.entries(DOCUMENT_TYPES).map(([type, info], index) => (
										<div
											key={type}
											className={`h-20 border-2 rounded-lg flex items-center justify-center ${
												currentX === index
													? "border-orange-400"
													: "border-orange-600"
											}`}
											style={{ backgroundColor: info.color }}
										>
											<div
												className="text-sm font-bold px-2 py-1 rounded"
												style={{
													color: getTextColor(info.color),
													textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
													backgroundColor: "rgba(0, 0, 0, 0.2)",
												}}
											>
												{info.name}
											</div>
										</div>
									))}
								</div>

								{showCurrent && currentDoc && (
									<div
										className="absolute h-20 w-[calc(20%-8px)] border-2 border-orange-400 rounded-lg flex items-center justify-center"
										style={{
											backgroundColor: currentDoc.color,
											left: `${currentX * 20}%`,
											top: `${fallingY}px`,
											transform: `translateY(0)`,
											transition: "transform 16ms linear",
										}}
									>
										<div
											className="text-sm font-bold px-2 py-1 rounded"
											style={{
												color: getTextColor(currentDoc.color),
												textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
												backgroundColor: "rgba(0, 0, 0, 0.2)",
											}}
										>
											{currentDoc.text || "Chỉ có màu"}
										</div>
									</div>
								)}
							</div>

							<div className="flex justify-center gap-4">
								<button
									onClick={handleMoveLeft}
									className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
								>
									←
								</button>
								<button
									onClick={handleMoveRight}
									className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
								>
									→
								</button>
								<button
									onClick={handleDrop}
									className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
								>
									↓
								</button>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Artifact Unlock Popup */}
			{showArtifactPopup && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
					<div className="bg-[#0f172a] border-4 border-orange-600 rounded-2xl p-8 max-w-md w-full text-center space-y-4 animate-scale-up artifact-popup">
						<h3 className="text-2xl font-bold text-orange-400">
							🎉 Chúc mừng! 🎉
						</h3>
						<p className="text-lg text-orange-100">Bạn đã mở khóa</p>
						<div className="artifact-container">
							<img
								src="/image/artifact-placeholder.png"
								alt="Artifact"
								className="w-48 h-48 object-contain mx-auto"
							/>
						</div>
						<p className="text-xl font-bold artifact-name">{ARTIFACT.name}</p>
						<p className="text-sm text-orange-200">{ARTIFACT.description}</p>
						<button
							onClick={() => {
								setShowArtifactPopup(false);
								new Audio(correctSound).play();
							}}
							className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition"
						>
							Đóng
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
