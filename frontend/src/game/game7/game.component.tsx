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
import Conclusion7 from "./game-conclusion.component";
import { useNavigate } from "react-router-dom";

interface Document {
	id: string;
	type: "text" | "audio" | "history" | "nom" | "han";
	color: string;
	colorName: string;
	text?: string;
	image: string;
}

const DOCUMENT_TYPES = {
	text: {
		name: "Kho đỏ",
		color: "#FF6B6B",
		colorName: "red",
		image: "/game/game7/text.png",
	},
	audio: {
		name: "Kho xanh",
		color: "#4ECDC4",
		colorName: "teal",
		image: "/game/game7/audio.png",
	},
	history: {
		name: "Kho đen",
		color: "#292524",
		colorName: "black",
		image: "/game/game7/history.png",
	},
	nom: {
		name: "Kho xanh lá",
		color: "#96CEB4",
		colorName: "green",
		image: "/game/game7/nom.png",
	},
	han: {
		name: "Kho vàng",
		color: "#FFEEAD",
		colorName: "yellow",
		image: "/game/game7/han.png",
	},
};

const SAMPLE_DOCUMENTS: Document[] = [
	{
		id: "1",
		type: "text",
		color: DOCUMENT_TYPES.text.color,
		colorName: DOCUMENT_TYPES.text.colorName,
		text: DOCUMENT_TYPES.text.name,
		image: DOCUMENT_TYPES.text.image,
	},
	{
		id: "2",
		type: "audio",
		color: DOCUMENT_TYPES.audio.color,
		colorName: DOCUMENT_TYPES.audio.colorName,
		text: DOCUMENT_TYPES.audio.name,
		image: DOCUMENT_TYPES.audio.image,
	},
	{
		id: "3",
		type: "history",
		color: DOCUMENT_TYPES.history.color,
		colorName: DOCUMENT_TYPES.history.colorName,
		text: DOCUMENT_TYPES.history.name,
		image: DOCUMENT_TYPES.history.image,
	},
	{
		id: "4",
		type: "nom",
		color: DOCUMENT_TYPES.nom.color,
		colorName: DOCUMENT_TYPES.nom.colorName,
		text: DOCUMENT_TYPES.nom.name,
		image: DOCUMENT_TYPES.nom.image,
	},
	{
		id: "5",
		type: "han",
		color: DOCUMENT_TYPES.han.color,
		colorName: DOCUMENT_TYPES.han.colorName,
		text: DOCUMENT_TYPES.han.name,
		image: DOCUMENT_TYPES.han.image,
	},
	// Thêm các biến thể không có text để tăng độ khó
	{
		id: "6",
		type: "text",
		color: DOCUMENT_TYPES.text.color,
		colorName: DOCUMENT_TYPES.text.colorName,
		image: DOCUMENT_TYPES.text.image,
	},
	{
		id: "7",
		type: "audio",
		color: DOCUMENT_TYPES.audio.color,
		colorName: DOCUMENT_TYPES.audio.colorName,
		image: DOCUMENT_TYPES.audio.image,
	},
	{
		id: "8",
		type: "history",
		color: DOCUMENT_TYPES.history.color,
		colorName: DOCUMENT_TYPES.history.colorName,
		image: DOCUMENT_TYPES.history.image,
	},
	{
		id: "9",
		type: "nom",
		color: DOCUMENT_TYPES.nom.color,
		colorName: DOCUMENT_TYPES.nom.colorName,
		image: DOCUMENT_TYPES.nom.image,
	},
	{
		id: "10",
		type: "han",
		color: DOCUMENT_TYPES.han.color,
		colorName: DOCUMENT_TYPES.han.colorName,
		image: DOCUMENT_TYPES.han.image,
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
	const navigate = useNavigate();
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
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

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
		const targetInfo = DOCUMENT_TYPES[targetType];

		console.info("=== Debug handleLanding ===");
		console.info("currentX khi handleLanding:", currentX);
		console.info("Loại kho đã chọn:", targetType);

		// Kiểm tra theo logic mới: so sánh trực tiếp type của object với kho được chọn
		const isCorrect = currentDoc.type === targetType;

		// In thông tin ra terminal
		console.info("=== Thông tin object ===");
		console.info("Type object:", currentDoc.type);
		console.info("Màu sắc object:", currentDoc.colorName);
		console.info("Nội dung:", currentDoc.text || "Không có chữ");
		console.info("Kho đã đặt:", targetType);
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
			wrongMoves: totalMoves - correctMoves,
			accuracy,
			artifact: artifactUnlocked ? ARTIFACT.name : "",
			artifactUnlocked,
			stats: [
				{
					label: "Thời gian",
					value: `${60 - timer}s`,
					icon: "⏱️",
				},
				{
					label: "Độ chính xác",
					value: `${Math.round(accuracy)}%`,
					icon: "🎯",
				},
				{
					label: "Số vật phẩm đúng",
					value: `${correctMoves}/${totalMoves}`,
					icon: "📦",
				},
			],
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
		<div
			className="h-full bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 relative overflow-hidden"
			style={{
				backgroundImage: "url('/game/game7/gameplay.png')",
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			<div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>

			{/* Menu Button và Dropdown */}
			<div className="fixed top-4 right-4 z-30">
				<div className="relative">
					<button
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className="w-12 h-12 bg-[#292524]/60 hover:bg-[#1c1917]/80 text-slate-200 rounded-full text-xl transition shadow-md border-2 border-[#44403c]/30 hover:border-[#292524] flex items-center justify-center"
					>
						⚙️
					</button>
					{isMenuOpen && (
						<div
							ref={menuRef}
							className="absolute right-0 mt-2 w-48 bg-[#1c1917]/90 backdrop-blur-md border-2 border-[#292524] rounded-xl shadow-2xl overflow-hidden"
						>
							<button
								onClick={() => {
									setIsMenuOpen(false);
									navigate("/");
								}}
								className="w-full px-4 py-2 text-left text-slate-200 hover:bg-[#292524]/60 transition flex items-center gap-2"
							>
								🏠 Trang chính
							</button>
							<button
								onClick={() => {
									setIsMenuOpen(false);
									navigate("/game/7");
								}}
								className="w-full px-4 py-2 text-left text-slate-200 hover:bg-[#292524]/60 transition flex items-center gap-2"
							>
								↩️ Quay lại
							</button>
						</div>
					)}
				</div>
			</div>

			<div className="relative z-10 bg-[#1c1917]/40 backdrop-blur-sm border-4 border-[#292524] rounded-2xl shadow-2xl p-10 w-[90vw] max-w-7xl text-center space-y-8 text-slate-200 mb-32">
				{!started ? (
					<button
						onClick={startGame}
						className="bg-[#292524] hover:bg-[#1c1917] text-slate-200 px-8 py-4 rounded-xl text-2xl transition shadow-md border-2 border-[#44403c] hover:border-[#292524]"
					>
						🎮 Bắt đầu chơi
					</button>
				) : gameOver && gameStats ? (
					<div className="bg-[#1c1917]/80 backdrop-blur-md rounded-xl p-8 max-w-2xl mx-auto">
						<h2 className="text-3xl font-bold mb-8 text-orange-400">
							Trò chơi kết thúc!
						</h2>
						<div className="grid grid-cols-2 gap-6 mb-8">
							<div className="bg-[#292524]/60 rounded-lg p-4">
								<div className="text-4xl mb-2">🎯</div>
								<div className="text-sm text-slate-400">Điểm số</div>
								<div className="text-2xl font-bold">{score}</div>
							</div>
							<div className="bg-[#292524]/60 rounded-lg p-4">
								<div className="text-4xl mb-2">📊</div>
								<div className="text-sm text-slate-400">Độ chính xác</div>
								<div className="text-2xl font-bold">
									{((correctMoves / totalMoves) * 100).toFixed(1)}%
								</div>
							</div>
							<div className="bg-[#292524]/60 rounded-lg p-4">
								<div className="text-4xl mb-2">✅</div>
								<div className="text-sm text-slate-400">Số lần đúng</div>
								<div className="text-2xl font-bold">{correctMoves}</div>
							</div>
							<div className="bg-[#292524]/60 rounded-lg p-4">
								<div className="text-4xl mb-2">📝</div>
								<div className="text-sm text-slate-400">Tổng số lần</div>
								<div className="text-2xl font-bold">{totalMoves}</div>
							</div>
						</div>

						<div className="text-sm text-slate-400 mb-8">
							<div className="font-bold text-orange-400 mb-2">
								Yêu cầu nhận thưởng:
							</div>
							<div className="flex justify-center gap-8">
								<div>
									<span className="text-slate-400">Điểm số: </span>
									<span
										className={score >= 12 ? "text-green-400" : "text-red-400"}
									>
										12+
									</span>
								</div>
								<div>
									<span className="text-slate-400">Độ chính xác: </span>
									<span
										className={
											(correctMoves / totalMoves) * 100 >= 60
												? "text-green-400"
												: "text-red-400"
										}
									>
										60%+
									</span>
								</div>
							</div>
						</div>

						<div className="flex justify-center gap-4">
							<button
								onClick={() => navigate("/game/7")}
								className="bg-[#292524]/60 hover:bg-[#1c1917]/80 text-slate-200 px-6 py-3 rounded-lg transition shadow-md border border-[#44403c]/30 hover:border-[#292524] flex items-center gap-2"
							>
								↩️ Quay lại
							</button>
							<button
								onClick={startGame}
								className="bg-[#292524]/60 hover:bg-[#1c1917]/80 text-slate-200 px-6 py-3 rounded-lg transition shadow-md border border-[#44403c]/30 hover:border-[#292524] flex items-center gap-2"
							>
								🔄 Chơi lại
							</button>
						</div>
					</div>
				) : (
					<div className="grid grid-cols-2 gap-8">
						<div className="space-y-4">
							<div className="w-32 h-32 mx-auto">
								<CircularProgressbarWithChildren
									value={timer}
									maxValue={60}
									styles={{
										path: { stroke: "#d6d3d1" },
										text: { fill: "#d6d3d1", fontSize: "24px" },
									}}
								>
									<div className="text-2xl font-bold">{timer}s</div>
								</CircularProgressbarWithChildren>
							</div>
							<div className="text-2xl">Điểm: {score}</div>
							{gameStats?.artifactUnlocked && (
								<div className="text-sm text-slate-300">
									🏆 Đã mở khóa {ARTIFACT.name}!
								</div>
							)}
						</div>

						<div className="relative h-[70vh] border-2 border-[#44403c] rounded-lg bg-[#292524]/20">
							<div className="absolute bottom-0 w-full grid grid-cols-5 gap-2 p-2">
								{Object.entries(DOCUMENT_TYPES).map(([type, info], index) => (
									<div
										key={type}
										className={`h-24 border-2 rounded-lg flex items-center justify-center relative overflow-hidden ${
											currentX === index
												? "border-[#d6d3d1]"
												: "border-[#44403c]/30"
										}`}
									>
										<img
											src={info.image}
											alt={info.name}
											className="absolute inset-0 w-full h-full object-cover"
										/>
										<div className="relative z-10 text-sm font-bold px-2 py-1 rounded bg-black/30 text-white">
											{info.name}
										</div>
									</div>
								))}
							</div>

							{showCurrent && currentDoc && (
								<div
									className="absolute h-24 w-[calc(20%-8px)] border-2 border-[#d6d3d1] rounded-lg flex items-center justify-center"
									style={{
										backgroundColor: currentDoc.color,
										left: `${currentX * 20}%`,
										top: `${fallingY}px`,
										transform: `translateY(0)`,
										transition: "transform 16ms linear",
									}}
								>
									{currentDoc.text && (
										<div className="text-sm font-bold px-2 py-1 rounded bg-black/30 text-white">
											{currentDoc.text}
										</div>
									)}
								</div>
							)}
						</div>
					</div>
				)}
			</div>

			{/* Nút điều khiển */}
			{started && !gameOver && (
				<div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-8 z-20">
					<button
						onClick={handleMoveLeft}
						className="w-20 h-20 bg-[#292524]/40 hover:bg-[#1c1917]/60 text-slate-200 rounded-full text-3xl transition shadow-md border-2 border-[#44403c]/30 hover:border-[#292524] flex items-center justify-center"
					>
						⬅️
					</button>
					<button
						onClick={handleDrop}
						className="w-20 h-20 bg-[#292524]/40 hover:bg-[#1c1917]/60 text-slate-200 rounded-full text-3xl transition shadow-md border-2 border-[#44403c]/30 hover:border-[#292524] flex items-center justify-center"
					>
						⬇️
					</button>
					<button
						onClick={handleMoveRight}
						className="w-20 h-20 bg-[#292524]/40 hover:bg-[#1c1917]/60 text-slate-200 rounded-full text-3xl transition shadow-md border-2 border-[#44403c]/30 hover:border-[#292524] flex items-center justify-center"
					>
						➡️
					</button>
				</div>
			)}

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
