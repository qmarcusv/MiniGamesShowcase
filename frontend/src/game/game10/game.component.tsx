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

interface PuzzlePiece {
	id: number;
	image: string;
	correctPosition: { x: number; y: number };
	currentPosition: { x: number; y: number };
	rotation: number;
}

const PUZZLE_SIZE = 3; // 3x3 puzzle
const TIME_LIMIT = 300; // 5 minutes
const ROTATION_STEP = 90; // 90 degrees rotation

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
	const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
	const [selectedPiece, setSelectedPiece] = useState<PuzzlePiece | null>(null);
	const [timer, setTimer] = useState(TIME_LIMIT);
	const [score, setScore] = useState(0);
	const [moves, setMoves] = useState(0);
	const [correctPlacements, setCorrectPlacements] = useState(0);
	const [gameOver, setGameOver] = useState(false);
	const [gameStats, setGameStats] = useState<GameStats | null>(null);
	const [showArtifactPopup, setShowArtifactPopup] = useState(false);

	// Initialize puzzle pieces
	useEffect(() => {
		const initialPieces: PuzzlePiece[] = [];
		for (let i = 0; i < PUZZLE_SIZE * PUZZLE_SIZE; i++) {
			const row = Math.floor(i / PUZZLE_SIZE);
			const col = i % PUZZLE_SIZE;
			initialPieces.push({
				id: i,
				image: `/images/puzzle/piece${i + 1}.jpg`,
				correctPosition: { x: col, y: row },
				currentPosition: {
					x: Math.floor(Math.random() * PUZZLE_SIZE),
					y: Math.floor(Math.random() * PUZZLE_SIZE),
				},
				rotation: Math.floor(Math.random() / ROTATION_STEP) * ROTATION_STEP,
			});
		}
		setPieces(initialPieces);
	}, []);

	// Timer countdown
	useEffect(() => {
		if (!gameOver && timer > 0) {
			const interval = setInterval(() => {
				setTimer((prev) => {
					if (prev <= 1) {
						handleGameOver();
						return 0;
					}
					if (prev <= 10) new Audio(hurrySound).play();
					else new Audio(tickSound).play();
					return prev - 1;
				});
			}, 1000);
			return () => clearInterval(interval);
		}
	}, [gameOver, timer]);

	const handlePieceClick = (piece: PuzzlePiece) => {
		if (selectedPiece?.id === piece.id) {
			// Rotate piece
			setPieces(
				pieces.map((p) =>
					p.id === piece.id
						? { ...p, rotation: (p.rotation + ROTATION_STEP) % 360 }
						: p
				)
			);
		} else {
			setSelectedPiece(piece);
		}
	};

	const handleDrop = (targetX: number, targetY: number) => {
		if (!selectedPiece) return;

		setMoves((prev) => prev + 1);

		const isCorrectPosition =
			selectedPiece.correctPosition.x === targetX &&
			selectedPiece.correctPosition.y === targetY &&
			selectedPiece.rotation === 0;

		if (isCorrectPosition) {
			new Audio(correctSound).play();
			setCorrectPlacements((prev) => prev + 1);
			setScore((prev) => prev + 100);
		} else {
			new Audio(wrongSound).play();
		}

		// Update piece position
		setPieces(
			pieces.map((p) =>
				p.id === selectedPiece.id
					? { ...p, currentPosition: { x: targetX, y: targetY } }
					: p
			)
		);

		setSelectedPiece(null);

		// Check if puzzle is complete
		if (
			correctPlacements + (isCorrectPosition ? 1 : 0) ===
			PUZZLE_SIZE * PUZZLE_SIZE
		) {
			handleGameOver();
		}
	};

	const calculateGameStats = (): GameStats => {
		const accuracy = (correctPlacements / moves) * 100 || 0;
		const timeBonus = Math.max(0, TIME_LIMIT - timer) * 2;
		const finalScore = score + timeBonus;

		const artifactUnlocked =
			finalScore >= ARTIFACT.requirements.score &&
			accuracy >= ARTIFACT.requirements.accuracy;

		return {
			score: finalScore,
			totalMoves: moves,
			correctMoves: correctPlacements,
			accuracy,
			artifact: artifactUnlocked ? ARTIFACT.name : "",
			artifactUnlocked,
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

	return (
		<div className="h-full bg-[url('/game/image/description/game.png')] bg-cover bg-center flex items-center justify-center px-4">
			<div className="bg-[#0f172a]/80 backdrop-blur-md border-4 border-purple-600 rounded-2xl shadow-2xl p-10 max-w-4xl w-full text-center space-y-8 text-purple-100">
				{gameOver && gameStats ? (
					<GameConclusion
						gameStats={gameStats}
						artifact={ARTIFACT}
						onRestart={restartGame}
					/>
				) : (
					<div className="grid grid-cols-2 gap-8">
						<div className="space-y-4">
							<div className="w-32 h-32 mx-auto">
								<CircularProgressbarWithChildren
									value={timer}
									maxValue={TIME_LIMIT}
									styles={{
										path: { stroke: "#9333ea" },
										text: { fill: "#9333ea", fontSize: "24px" },
									}}
								>
									<div className="text-2xl font-bold">{timer}s</div>
								</CircularProgressbarWithChildren>
							</div>
							<div className="text-2xl">Điểm: {score}</div>
							<div className="text-lg">Số bước: {moves}</div>
							<div className="text-lg">Đúng: {correctPlacements}</div>
						</div>

						<div className="grid grid-cols-3 gap-2 bg-slate-800/50 p-4 rounded-xl">
							{Array.from({ length: PUZZLE_SIZE * PUZZLE_SIZE }).map((_, i) => {
								const x = i % PUZZLE_SIZE;
								const y = Math.floor(i / PUZZLE_SIZE);
								const piece = pieces.find(
									(p) => p.currentPosition.x === x && p.currentPosition.y === y
								);

								return (
									<div
										key={i}
										className={`aspect-square border-2 ${
											piece ? "border-purple-500" : "border-purple-800"
										} rounded-lg overflow-hidden cursor-pointer`}
										onClick={() => piece && handlePieceClick(piece)}
										onDragOver={(e) => e.preventDefault()}
										onDrop={() => handleDrop(x, y)}
									>
										{piece && (
											<img
												src={piece.image}
												alt={`Piece ${piece.id}`}
												className="w-full h-full object-cover"
												style={{ transform: `rotate(${piece.rotation}deg)` }}
												draggable
												onDragStart={() => setSelectedPiece(piece)}
											/>
										)}
									</div>
								);
							})}
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
		</div>
	);
}
