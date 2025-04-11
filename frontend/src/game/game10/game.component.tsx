import { useState, useEffect, useCallback, useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrag, useDrop } from "react-dnd";
import "./game.scss";
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

interface PuzzlePiece {
	id: number;
	originalPos: { x: number; y: number };
	currentPos: { x: number; y: number };
}

const GRID_SIZE = 6;
const PIECE_SIZE = 80; // px
const TIME_LIMIT = 300; // 5 minutes

const ARTIFACT: Artifact = {
	name: "Mảnh ghép bí ẩn",
	description: "Một mảnh ghép từ bức tranh cổ xưa",
	requirements: {
		score: 1000,
		accuracy: 80,
	},
	image: "/image/artifact-placeholder.png",
};

export default function Game10() {
	const [selectedImage, setSelectedImage] = useState<string>("");
	const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
	const [isComplete, setIsComplete] = useState(false);
	const [moves, setMoves] = useState(0);
	const [score, setScore] = useState(0);
	const [correctPlacements, setCorrectPlacements] = useState(0);
	const [gameOver, setGameOver] = useState(false);
	const [gameStats, setGameStats] = useState<GameStats | null>(null);
	const [showArtifactPopup, setShowArtifactPopup] = useState(false);
	const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
	const [gameStarted, setGameStarted] = useState(false);

	useEffect(() => {
		if (!selectedImage || gameOver) return;

		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 0) {
					clearInterval(timer);
					handleGameOver();
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [selectedImage, gameOver]);

	useEffect(() => {
		if (isComplete) {
			const timer = setTimeout(() => {
				handleGameOver();
			}, 2000);
			return () => clearTimeout(timer);
		}
	}, [isComplete]);

	// Tối ưu hàm khởi tạo puzzle bằng useCallback
	const initializePuzzle = useCallback((imageUrl: string) => {
		// Tối ưu kích thước ảnh trước khi sử dụng
		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");

			// Giảm kích thước ảnh xuống vừa đủ (GRID_SIZE * PIECE_SIZE)
			const size = GRID_SIZE * PIECE_SIZE;
			canvas.width = size;
			canvas.height = size;

			if (ctx) {
				ctx.drawImage(img, 0, 0, size, size);
				const optimizedImageUrl = canvas.toDataURL("image/jpeg", 0.8);

				const newPieces: PuzzlePiece[] = [];
				for (let y = 0; y < GRID_SIZE; y++) {
					for (let x = 0; x < GRID_SIZE; x++) {
						newPieces.push({
							id: y * GRID_SIZE + x,
							originalPos: { x, y },
							currentPos: { x, y },
						});
					}
				}

				setPieces(shufflePieces(newPieces));
				setSelectedImage(optimizedImageUrl);
				setMoves(0);
				setIsComplete(false);
			}
		};
		img.src = imageUrl;
	}, []);

	// Tối ưu hàm tráo mảnh bằng useMemo
	const shufflePieces = useCallback(
		(piecesToShuffle: PuzzlePiece[]): PuzzlePiece[] => {
			const shuffled = [...piecesToShuffle];
			for (let i = shuffled.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				const temp = { ...shuffled[i].currentPos };
				shuffled[i].currentPos = { ...shuffled[j].currentPos };
				shuffled[j].currentPos = temp;
			}
			return shuffled;
		},
		[]
	);

	// Tối ưu kiểm tra hoàn thành bằng useMemo
	const checkCompletion = useCallback(() => {
		const isCompleted = pieces.every(
			(piece) =>
				piece.originalPos.x === piece.currentPos.x &&
				piece.originalPos.y === piece.currentPos.y
		);
		if (isCompleted && !isComplete) {
			setIsComplete(true);
		}
	}, [pieces, isComplete]);

	// Thêm debounce cho việc di chuyển mảnh
	const handlePieceDrop = useCallback(
		(draggedPiece: PuzzlePiece, dropPos: { x: number; y: number }) => {
			setPieces((prevPieces) => {
				const newPieces = prevPieces.map((piece) => {
					if (piece.id === draggedPiece.id) {
						return { ...piece, currentPos: dropPos };
					}
					if (
						piece.currentPos.x === dropPos.x &&
						piece.currentPos.y === dropPos.y
					) {
						return { ...piece, currentPos: draggedPiece.currentPos };
					}
					return piece;
				});
				return newPieces;
			});
			setMoves((prev) => prev + 1);
		},
		[]
	);

	useEffect(() => {
		const timeoutId = setTimeout(checkCompletion, 300);
		return () => clearTimeout(timeoutId);
	}, [pieces, checkCompletion]);

	// Tối ưu render mảnh ghép bằng React.memo
	const PuzzlePiece = useMemo(() => {
		return ({ piece }: { piece: PuzzlePiece }) => {
			const [{ isDragging }, drag] = useDrag(() => ({
				type: "puzzle-piece",
				item: piece,
				collect: (monitor) => ({
					isDragging: !!monitor.isDragging(),
				}),
			}));

			const style = {
				backgroundImage: `url(${selectedImage})`,
				backgroundSize: `${GRID_SIZE * 100}%`,
				backgroundPosition: `${
					(piece.originalPos.x * 100) / (GRID_SIZE - 1)
				}% ${(piece.originalPos.y * 100) / (GRID_SIZE - 1)}%`,
			};

			return (
				<div
					ref={drag as any}
					className={`puzzle-piece ${isDragging ? "dragging" : ""}`}
					style={style}
				/>
			);
		};
	}, [selectedImage]);

	// Tối ưu render ô đích bằng React.memo
	const DropCell = useMemo(() => {
		return ({ x, y }: { x: number; y: number }) => {
			const [{ isOver }, drop] = useDrop(() => ({
				accept: "puzzle-piece",
				drop: (item: PuzzlePiece) => handlePieceDrop(item, { x, y }),
				collect: (monitor) => ({
					isOver: !!monitor.isOver(),
				}),
			}));

			const piece = pieces.find(
				(p) => p.currentPos.x === x && p.currentPos.y === y
			);

			return (
				<div
					ref={drop as any}
					className={`grid-cell ${isOver ? "can-drop" : ""}`}
				>
					{piece && <PuzzlePiece piece={piece} />}
				</div>
			);
		};
	}, [pieces, handlePieceDrop, PuzzlePiece]);

	const startGame = useCallback(
		(imageUrl: string) => {
			setGameStarted(true);
			setTimeLeft(TIME_LIMIT);
			setMoves(0);
			setScore(0);
			setCorrectPlacements(0);
			setIsComplete(false);
			setGameOver(false);
			initializePuzzle(imageUrl);
		},
		[initializePuzzle]
	);

	const ImageSelector = () => {
		const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (file) {
				const reader = new FileReader();
				reader.onloadend = () => {
					setSelectedImage(reader.result as string);
					setGameStarted(false);
				};
				reader.readAsDataURL(file);
			}
		};

		return (
			<div className="image-selector">
				<h2>Chọn ảnh để bắt đầu chơi</h2>
				<input
					type="file"
					accept="image/*"
					onChange={handleImageUpload}
					className="file-input"
				/>
				{selectedImage && !gameStarted && (
					<div className="preview-container">
						<h3>Xem trước ảnh:</h3>
						<img src={selectedImage} alt="Preview" className="preview-image" />
						<button
							className="start-game-button"
							onClick={() => startGame(selectedImage)}
						>
							Bắt đầu chơi
						</button>
					</div>
				)}
			</div>
		);
	};

	const calculateGameStats = (): GameStats => {
		const accuracy = (correctPlacements / moves) * 100 || 0;
		const timeBonus = Math.max(0, TIME_LIMIT - moves) * 2;
		const finalScore = score + timeBonus;

		const artifactUnlocked =
			finalScore >= ARTIFACT.requirements.score &&
			accuracy >= ARTIFACT.requirements.accuracy;

		return {
			score: finalScore,
			totalMoves: moves,
			correctMoves: correctPlacements,
			wrongMoves: moves - correctPlacements,
			accuracy,
			artifact: artifactUnlocked ? ARTIFACT.name : "",
			artifactUnlocked,
			stats: [
				{
					label: "Số bước di chuyển",
					value: moves.toString(),
					icon: "🎮",
				},
				{
					label: "Số bước đúng",
					value: correctPlacements.toString(),
					icon: "✅",
				},
				{
					label: "Điểm thưởng thời gian",
					value: timeBonus.toString(),
					icon: "⏱️",
				},
			],
		};
	};

	const handleGameOver = () => {
		const stats = calculateGameStats();
		setGameStats(stats);
		setGameOver(true);
		if (stats.artifactUnlocked) {
			setShowArtifactPopup(true);
		}
	};

	const restartGame = () => {
		window.location.reload();
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const handleNewGame = () => {
		setSelectedImage("");
		setGameStarted(false);
		setTimeLeft(TIME_LIMIT);
	};

	return (
		<DndProvider backend={HTML5Backend}>
			<div className="game10-container">
				{!gameStarted ? (
					<ImageSelector />
				) : gameOver ? (
					<GameConclusion
						gameStats={gameStats!}
						artifact={ARTIFACT}
						onRestart={restartGame}
					/>
				) : (
					<div className="game-area">
						<div className="game-info">
							<h2>Xếp hình 6x6</h2>
							<div className="timer-container">
								<CircularProgressbarWithChildren
									value={(timeLeft / TIME_LIMIT) * 100}
									strokeWidth={6}
									styles={{
										path: {
											stroke: timeLeft < 60 ? "#ff4444" : "#4CAF50",
											transition: "stroke-dashoffset 0.5s ease 0s",
										},
										trail: {
											stroke: "#1a1a1a",
										},
									}}
								>
									<div className="timer-text">
										<span>{formatTime(timeLeft)}</span>
									</div>
								</CircularProgressbarWithChildren>
							</div>
							<p>Số bước di chuyển: {moves}</p>
							{isComplete && (
								<div className="victory-message">
									🎉 Chúc mừng! Bạn đã hoàn thành trong {moves} bước!
								</div>
							)}
							<button
								className="shuffle-button"
								onClick={() => setPieces(shufflePieces(pieces))}
							>
								Tráo lại
							</button>
							<button className="new-game-button" onClick={handleNewGame}>
								Chọn ảnh mới
							</button>
						</div>

						<div className="puzzle-board">
							<div
								className="target-grid"
								style={{
									gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
									width: GRID_SIZE * PIECE_SIZE + "px",
									height: GRID_SIZE * PIECE_SIZE + "px",
								}}
							>
								{Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
									<DropCell
										key={i}
										x={i % GRID_SIZE}
										y={Math.floor(i / GRID_SIZE)}
									/>
								))}
							</div>
						</div>

						<div className="original-image">
							<h3>Ảnh gốc:</h3>
							<img
								src={selectedImage}
								alt="Original"
								style={{
									maxWidth: GRID_SIZE * PIECE_SIZE + "px",
									maxHeight: GRID_SIZE * PIECE_SIZE + "px",
								}}
							/>
						</div>
					</div>
				)}
			</div>

			{/* Artifact Unlock Popup */}
			{showArtifactPopup && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
					<div className="bg-[#0f172a] border-4 border-purple-600 rounded-2xl p-8 max-w-md w-full text-center space-y-4">
						<h3 className="text-2xl font-bold text-purple-400">
							🎉 Chúc mừng! 🎉
						</h3>
						<p className="text-lg text-purple-100">Bạn đã mở khóa</p>
						<div className="artifact-container">
							<img
								src={ARTIFACT.image}
								alt="Artifact"
								className="w-48 h-48 object-contain mx-auto"
							/>
						</div>
						<p className="text-xl font-bold text-purple-300">{ARTIFACT.name}</p>
						<p className="text-sm text-purple-200">{ARTIFACT.description}</p>
						<button
							onClick={() => {
								setShowArtifactPopup(false);
								new Audio(correctSound).play();
							}}
							className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
						>
							Đóng
						</button>
					</div>
				</div>
			)}
		</DndProvider>
	);
}
