import { useEffect, useState } from "react";
import {
	CircularProgressbarWithChildren,
	buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
	GameState,
	NavalQuestion,
	GAME_CONSTANTS,
	GameStats,
	GridCell,
	LevelNumber,
} from "./game.types";
import { Artifact } from "../../shared/component/game-conclusion/game-conclusion.types";
import GameConclusion from "../../shared/component/game-conclusion/game-conclusion.component";
import VirtualKeyboard from "./virtual-keyboard.component";
import Conclusion8 from "./game-conclusion.component";

// Sound imports
import tickSound from "/sound/tick.mp3";
import correctSound from "/sound/correct.mp3";
import wrongSound from "/sound/wrong.mp3";
import hurrySound from "/sound/hurry.mp3";
import endSound from "/sound/end.mp3";

// Hàm mã hóa Caesar cipher
const encodeCaesar = (text: string, shift: number): string => {
	return text
		.split("")
		.map((char) => {
			if (char.match(/[A-Z]/)) {
				const code = char.charCodeAt(0);
				return String.fromCharCode(((code - 65 + shift) % 26) + 65);
			}
			return char;
		})
		.join("");
};

// Định nghĩa từ gốc và từ đã mã hóa
const TARGET_WORD = "YEU-VIET-NAM";
const ENCODED_WORD = encodeCaesar(TARGET_WORD, GAME_CONSTANTS.CAESAR_SHIFT);

const QUESTIONS: NavalQuestion[] = [
	{
		id: 1,
		level: 1 as LevelNumber,
		pattern: [
			{ direction: "➡️", steps: 2 },
			{ direction: "⬇️", steps: 2 },
		],
		startPoint: "A1",
		solution: ["A1", "C1", "C3"],
		hiddenLetters: ENCODED_WORD.split("-")[0].split(""),
		hints: [
			{
				text: "Di chuyển sang phải 2 ô từ điểm bắt đầu",
				cells: ["A1", "B1", "C1"],
			},
			{
				text: "Sau đó di chuyển xuống 2 ô",
				cells: ["C1", "C2", "C3"],
			},
		],
	},
	{
		id: 2,
		level: 2 as LevelNumber,
		pattern: [
			{ direction: "↗️", steps: 2 },
			{ direction: "➡️", steps: 1 },
			{ direction: "↘️", steps: 2 },
		],
		startPoint: "B3",
		solution: ["B3", "D1", "E1", "G3"],
		hiddenLetters: ENCODED_WORD.split("-")[1].split(""),
		hints: [
			{
				text: "Di chuyển chéo lên phải 2 ô",
				cells: ["B3", "C2", "D1"],
			},
			{
				text: "Tiếp tục sang phải 1 ô",
				cells: ["D1", "E1"],
			},
			{
				text: "Kết thúc bằng di chuyển chéo xuống phải 2 ô",
				cells: ["E1", "F2", "G3"],
			},
		],
	},
	{
		id: 3,
		level: 3 as LevelNumber,
		pattern: [
			{ direction: "↗️", steps: 2 },
			{ direction: "↘️", steps: 2 },
		],
		startPoint: "A4",
		solution: ["A4", "C2", "E4"],
		hiddenLetters: ENCODED_WORD.split("-")[2].split(""),
		hints: [
			{
				text: "Di chuyển chéo lên phải 2 ô",
				cells: ["A4", "B3", "C2"],
			},
			{
				text: "Kết thúc bằng di chuyển chéo xuống phải 2 ô",
				cells: ["C2", "D3", "E4"],
			},
		],
	},
];

// Hàm giải mã Caesar cipher
const decodeCaesar = (text: string, shift: number): string => {
	return encodeCaesar(text, 26 - shift);
};

const ARTIFACT: Artifact = {
	name: "Mật mã Hải quân",
	description: "Một mảnh giấy cũ chứa mật mã bí ẩn từ thời chiến tranh.",
	image: "/images/artifacts/naval-cipher.png",
	requirements: {
		score: 15,
		accuracy: 60,
	},
};

const LEVEL_LETTERS = {
	// Level 1: VOG
	A1: "V",
	C1: "O",
	C3: "G",
	// Level 2: KLMN
	B3: "K",
	D1: "L",
	E1: "M",
	G3: "N",
	// Level 3: PQR
	A4: "P",
	C2: "Q",
	E4: "R",
} as const;

const generateNewGrid = (currentLevel: number): GridCell[] => {
	// Tạo mảng các chữ cái cần thu thập cho level hiện tại
	const currentQuestion = QUESTIONS[currentLevel - 1];
	const solutionCoordinates = new Set(currentQuestion.solution);

	// Tạo grid
	return Array.from(
		{ length: GAME_CONSTANTS.GRID_SIZE * GAME_CONSTANTS.GRID_SIZE },
		(_, index) => {
			const row = Math.floor(index / GAME_CONSTANTS.GRID_SIZE);
			const col = index % GAME_CONSTANTS.GRID_SIZE;
			const coordinate = `${String.fromCharCode(65 + col)}${row + 1}`;

			// Nếu là ô trong solution của level hiện tại, gán chữ cái đã định nghĩa
			let value = String.fromCharCode(65 + Math.floor(Math.random() * 26));
			if (solutionCoordinates.has(coordinate)) {
				value =
					LEVEL_LETTERS[coordinate as keyof typeof LEVEL_LETTERS] || value;
			}

			return {
				coordinate,
				value,
				isRevealed: false,
				isHighlighted: false,
				row,
				col,
			};
		}
	);
};

const formatCollectedLetters = (letters: string[]): string => {
	const lettersPerLevel = QUESTIONS.map((q) => q.solution.length);
	let result = "";
	let currentIndex = 0;

	for (let i = 0; i < lettersPerLevel.length; i++) {
		const levelLetters = letters.slice(
			currentIndex,
			currentIndex + lettersPerLevel[i]
		);
		if (levelLetters.length > 0) {
			if (result.length > 0) {
				result += "-";
			}
			result += levelLetters.join("");
		}
		currentIndex += lettersPerLevel[i];
	}

	return result;
};

// Thêm hàm mới để tính số ký tự thực tế (không tính dấu gạch ngang)
const getActualLetterCount = (word: string): number => {
	return word.replace(/-/g, "").length;
};

// Sửa lại hàm getRequiredLetterCount
const getRequiredLetterCount = (): number => {
	return TARGET_WORD.replace(/-/g, "").length;
};

// Tính tổng số chữ cái cần thu thập từ tất cả các level
const totalRequiredLetters = QUESTIONS.reduce(
	(total, q) => total + q.solution.length,
	0
);

export default function Game8() {
	const [gameState, setGameState] = useState<GameState>({
		timeLeft: GAME_CONSTANTS.TOTAL_TIME,
		currentQuestion: 1,
		score: 0,
		hintsRemaining: 2,
		selectedCells: [],
		collectedLetters: [],
		isComplete: false,
		wrongMoves: 0,
		hasSubmittedAnswer: false,
	});

	const [cells, setCells] = useState<GridCell[]>(() => generateNewGrid(1));
	const [showHint, setShowHint] = useState(false);
	const [gameStats, setGameStats] = useState<GameStats | null>(null);
	const [nextPoint, setNextPoint] = useState<string | null>(null);
	const [decodingAnswer, setDecodingAnswer] = useState("");
	const [showResult, setShowResult] = useState(false);
	const [isCorrect, setIsCorrect] = useState(false);
	const [showConclusion, setShowConclusion] = useState(false);

	// Timer effect
	useEffect(() => {
		if (gameState.isComplete) return;

		const timer = setInterval(() => {
			setGameState((prev) => {
				if (prev.timeLeft <= 0) {
					clearInterval(timer);
					handleGameOver();
					return prev;
				}

				if (prev.timeLeft <= 10) {
					new Audio(hurrySound).play();
				} else {
					new Audio(tickSound).play();
				}

				return { ...prev, timeLeft: prev.timeLeft - 1 };
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [gameState.isComplete]);

	// Next point effect
	useEffect(() => {
		const currentQ = QUESTIONS[gameState.currentQuestion - 1];
		if (currentQ && gameState.selectedCells.length < currentQ.solution.length) {
			setNextPoint(currentQ.solution[gameState.selectedCells.length]);
		} else {
			setNextPoint(null);
		}
	}, [gameState.selectedCells, gameState.currentQuestion]);

	const handleCellClick = (coordinate: string) => {
		const currentQ = QUESTIONS[gameState.currentQuestion - 1];
		if (!currentQ) return;

		const expectedNext = currentQ.solution[gameState.selectedCells.length];

		if (coordinate === expectedNext) {
			new Audio(correctSound).play();

			// Lấy chữ cái từ hiddenLetters
			const letter = currentQ.hiddenLetters[gameState.selectedCells.length];

			// Cập nhật cells
			setCells((prev) =>
				prev.map((cell) => {
					if (cell.coordinate === coordinate) {
						return {
							...cell,
							isRevealed: true,
							isHighlighted: true,
							value: letter,
						};
					}
					return cell;
				})
			);

			// Cập nhật game state
			setGameState((prev) => {
				const newSelectedCells = [...prev.selectedCells, coordinate];
				const newCollectedLetters = [...prev.collectedLetters, letter];

				// Kiểm tra hoàn thành level
				if (newSelectedCells.length === currentQ.solution.length) {
					// Nếu là level cuối
					if (prev.currentQuestion === QUESTIONS.length) {
						return {
							...prev,
							selectedCells: [],
							collectedLetters: newCollectedLetters,
							score:
								prev.score + GAME_CONSTANTS.POINTS_PER_LEVEL[currentQ.level],
						};
					}

					// Chuyển sang level mới
					const nextLevel = prev.currentQuestion + 1;
					setTimeout(() => {
						setCells(generateNewGrid(nextLevel));
					}, 500);

					return {
						...prev,
						currentQuestion: nextLevel,
						score: prev.score + GAME_CONSTANTS.POINTS_PER_LEVEL[currentQ.level],
						selectedCells: [],
						collectedLetters: newCollectedLetters,
						hintsRemaining: currentQ.level === 1 ? 1 : 0,
					};
				}

				return {
					...prev,
					selectedCells: newSelectedCells,
					collectedLetters: newCollectedLetters,
				};
			});
		} else {
			new Audio(wrongSound).play();
			setCells((prev) =>
				prev.map((cell) => {
					if (cell.coordinate === coordinate) {
						return {
							...cell,
							isRevealed: true,
							isHighlighted: false,
						};
					}
					return cell;
				})
			);
			setGameState((prev) => ({
				...prev,
				wrongMoves: prev.wrongMoves + 1,
				score: Math.max(0, prev.score - GAME_CONSTANTS.WRONG_MOVE_PENALTY),
			}));
		}
	};

	const handleDecodingSubmit = () => {
		const isAnswerCorrect = decodingAnswer.toUpperCase() === TARGET_WORD;

		setIsCorrect(isAnswerCorrect);
		setShowResult(true);

		if (isAnswerCorrect) {
			setGameState((prev) => ({
				...prev,
				score: prev.score + GAME_CONSTANTS.BONUS_POINTS,
				hasSubmittedAnswer: true,
			}));
		} else {
			setGameState((prev) => ({
				...prev,
				hasSubmittedAnswer: true,
			}));
		}

		setTimeout(() => {
			handleGameOver();
		}, 3000);
	};

	const handleGameOver = () => {
		const correctMoves = gameState.collectedLetters.length;
		const wrongMoves = gameState.wrongMoves;
		const totalMoves = correctMoves + wrongMoves;
		const accuracy =
			totalMoves > 0 ? Math.round((correctMoves / totalMoves) * 100) : 0;

		const stats: GameStats = {
			score: gameState.score,
			accuracy,
			totalMoves,
			correctMoves,
			wrongMoves,
			bonusPoints: gameState.hasSubmittedAnswer
				? GAME_CONSTANTS.BONUS_POINTS
				: 0,
			collectedWord: gameState.collectedLetters.join(""),
			decodedWord: gameState.hasSubmittedAnswer ? TARGET_WORD : "",
			artifact: ARTIFACT.name,
			artifactUnlocked:
				accuracy >= ARTIFACT.requirements.accuracy &&
				gameState.score >= ARTIFACT.requirements.score,
			details: [
				{
					icon: "🎯",
					label: "Độ chính xác",
					value: `${accuracy}%`,
				},
				{
					icon: "✅",
					label: "Số lần đúng",
					value: correctMoves.toString(),
				},
				{
					icon: "❌",
					label: "Số lần sai",
					value: wrongMoves.toString(),
				},
				{
					icon: "📝",
					label: "Mật thư thu được",
					value: gameState.collectedLetters.join(""),
				},
				{
					icon: "🔓",
					label: "Giải mã thành công",
					value: gameState.hasSubmittedAnswer ? "Có" : "Không",
				},
				{
					icon: "⭐",
					label: "Điểm thưởng",
					value: gameState.hasSubmittedAnswer
						? GAME_CONSTANTS.BONUS_POINTS.toString()
						: "0",
				},
			],
			requirements: {
				score: ARTIFACT.requirements.score,
				accuracy: ARTIFACT.requirements.accuracy,
			},
		};

		setGameStats(stats);
		setShowConclusion(true);
	};

	if (showConclusion && gameStats) {
		return (
			<Conclusion8
				timeUsed={GAME_CONSTANTS.TOTAL_TIME - gameState.timeLeft}
				matchedCards={gameState.collectedLetters.length}
				totalCards={totalRequiredLetters}
				win={gameState.hasSubmittedAnswer}
			/>
		);
	}

	const currentQuestion = QUESTIONS[gameState.currentQuestion - 1];

	// Hiển thị bàn phím khi đã thu thập đủ số chữ cái
	const showDecodingPhase =
		gameState.collectedLetters.length === totalRequiredLetters &&
		!gameState.hasSubmittedAnswer;

	return (
		<div className="game-zone flex w-full h-full gap-8 p-8 bg-slate-900 font-pirate">
			{/* Left Panel */}
			<div className="w-[600px] bg-slate-800/50 rounded-2xl p-8 flex flex-col gap-8">
				{/* Timer */}
				<div className="w-32 h-32 mx-auto">
					<CircularProgressbarWithChildren
						value={(gameState.timeLeft / GAME_CONSTANTS.TOTAL_TIME) * 100}
						strokeWidth={8}
						styles={buildStyles({
							pathColor: gameState.timeLeft <= 10 ? "#ef4444" : "#22d3ee",
							trailColor: "#1e293b",
						})}
					>
						<div className="text-4xl font-bold text-cyan-400">
							{gameState.timeLeft}
						</div>
					</CircularProgressbarWithChildren>
				</div>

				{/* Mật thư */}
				<div className="bg-slate-700/50 rounded-xl p-6">
					<h2 className="text-2xl font-bold text-cyan-400 mb-4">
						{showDecodingPhase ? "Giải mã mật thư" : "Mật thư đang thu thập"}
					</h2>
					<div className="space-y-4">
						<div>
							<p className="text-lg text-cyan-300/80 mb-1">
								Mật thư đã thu thập:
							</p>
							<p className="text-xl text-cyan-300 font-mono">
								{formatCollectedLetters(gameState.collectedLetters)}
							</p>
						</div>
						{showDecodingPhase && (
							<div>
								<p className="text-lg text-cyan-300/80">
									Gợi ý: Lùi mỗi chữ cái về {GAME_CONSTANTS.CAESAR_SHIFT} bước
									để tìm ra từ gốc
								</p>
							</div>
						)}
					</div>
				</div>

				{showDecodingPhase ? (
					<div className="space-y-6">
						{/* Bảng Alphabet cơ bản */}
						<div className="bg-slate-700/50 rounded-xl p-4">
							<div className="grid grid-cols-13 gap-2 text-center">
								{"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((char) => (
									<div key={char} className="text-white text-lg">
										{char}
									</div>
								))}
							</div>
							{/* Nút hiển thị bảng dịch */}
							<button
								onClick={() => setShowHint(!showHint)}
								className="mt-2 px-4 py-2 bg-cyan-600/50 hover:bg-cyan-600 text-white rounded-lg transition-colors text-sm w-full"
							>
								{showHint ? "Ẩn gợi ý" : "Hiện gợi ý"}
							</button>
							{/* Bảng dịch chuyển */}
							{showHint && (
								<div className="mt-2 grid grid-cols-13 gap-2 text-center border-t border-cyan-500/30 pt-2">
									{"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((char) => (
										<div
											key={`hint-${char}`}
											className="text-emerald-400 text-lg"
										>
											{String.fromCharCode(
												((char.charCodeAt(0) -
													65 +
													GAME_CONSTANTS.CAESAR_SHIFT) %
													26) +
													65
											)}
										</div>
									))}
								</div>
							)}
						</div>

						{/* Phần nhập đáp án */}
						<div className="bg-slate-700/50 rounded-xl p-4">
							<div className="flex gap-1 justify-center items-center">
								{/* YEU */}
								{[0, 1, 2].map((index) => (
									<div
										key={`part1-${index}`}
										className="w-12 h-12 flex items-center justify-center border-b-4 border-cyan-500/50 mx-1"
									>
										<span
											className={`text-2xl font-bold font-mono ${
												showResult
													? isCorrect
														? "text-emerald-400"
														: "text-red-400"
													: "text-white"
											}`}
										>
											{showResult
												? formatCollectedLetters(gameState.collectedLetters)[
														index
												  ]
												: decodingAnswer[index] || "_"}
										</span>
									</div>
								))}

								<div className="mx-4">
									<span className="text-cyan-500 text-2xl">-</span>
								</div>

								{/* VIET */}
								{[0, 1, 2, 3].map((index) => (
									<div
										key={`part2-${index}`}
										className="w-12 h-12 flex items-center justify-center border-b-4 border-cyan-500/50 mx-1"
									>
										<span
											className={`text-2xl font-bold font-mono ${
												showResult
													? isCorrect
														? "text-emerald-400"
														: "text-red-400"
													: "text-white"
											}`}
										>
											{showResult
												? formatCollectedLetters(gameState.collectedLetters)[
														index + 4
												  ]
												: decodingAnswer[index + 3] || "_"}
										</span>
									</div>
								))}

								<div className="mx-4">
									<span className="text-cyan-500 text-2xl">-</span>
								</div>

								{/* NAM */}
								{[0, 1, 2].map((index) => (
									<div
										key={`part3-${index}`}
										className="w-12 h-12 flex items-center justify-center border-b-4 border-cyan-500/50 mx-1"
									>
										<span
											className={`text-2xl font-bold font-mono ${
												showResult
													? isCorrect
														? "text-emerald-400"
														: "text-red-400"
													: "text-white"
											}`}
										>
											{showResult
												? formatCollectedLetters(gameState.collectedLetters)[
														index + 9
												  ]
												: decodingAnswer[index + 7] || "_"}
										</span>
									</div>
								))}
							</div>
						</div>

						{/* Trạng thái đúng/sai */}
						{showResult && (
							<div
								className={`text-center p-4 rounded-xl ${
									isCorrect ? "bg-emerald-500/20" : "bg-red-500/20"
								}`}
							>
								<div className="flex items-center justify-center gap-2">
									<span
										className={`text-2xl ${
											isCorrect ? "text-emerald-400" : "text-red-400"
										}`}
									>
										{isCorrect ? "🎉" : "❌"}
									</span>
									<p
										className={isCorrect ? "text-emerald-400" : "text-red-400"}
									>
										{isCorrect
											? `Chính xác! +${GAME_CONSTANTS.BONUS_POINTS} điểm`
											: `Đáp án đúng là: ${TARGET_WORD}`}
									</p>
								</div>
							</div>
						)}

						<VirtualKeyboard
							onKeyPress={(key) => {
								if (!showResult && decodingAnswer.length < 10) {
									setDecodingAnswer((prev) => prev + key);
								}
							}}
							onBackspace={() =>
								!showResult && setDecodingAnswer((prev) => prev.slice(0, -1))
							}
							onEnter={() => {
								if (!showResult && decodingAnswer.length === 10) {
									handleDecodingSubmit();
								}
							}}
						/>
					</div>
				) : (
					<>
						<div className="text-center space-y-6">
							<h2 className="text-3xl font-bold text-cyan-400">
								Câu {gameState.currentQuestion}/3
							</h2>
							<div className="bg-slate-700/50 rounded-xl p-6">
								<p className="text-2xl text-cyan-300 mb-4">
									Bắt đầu từ điểm {currentQuestion.startPoint}
								</p>
								<div className="flex flex-col gap-4">
									{currentQuestion.pattern.map((p, index) => (
										<div
											key={index}
											className={`flex items-center justify-center gap-4 text-3xl ${
												index <= gameState.selectedCells.length
													? "text-cyan-400"
													: "text-cyan-400/30"
											}`}
										>
											<span>{p.direction}</span>
											<span className="text-xl">({p.steps} ô)</span>
										</div>
									))}
								</div>
							</div>
						</div>

						<div className="mt-auto text-center">
							<div className="text-6xl font-bold text-cyan-400">
								{gameState.score.toFixed(1)}
							</div>
							<div className="text-cyan-300 text-xl mt-2">Điểm</div>
						</div>
					</>
				)}
			</div>

			{/* Right Panel - Grid */}
			<div className="flex-1 bg-slate-800/50 rounded-2xl p-8 relative">
				<div className="grid grid-cols-8 grid-rows-8 gap-2 h-full">
					{cells.map((cell) => (
						<button
							key={cell.coordinate}
							onClick={() => handleCellClick(cell.coordinate)}
							disabled={cell.isRevealed && cell.isHighlighted}
							className={`relative aspect-square rounded-lg transition-all transform hover:scale-105 ${
								cell.isRevealed
									? cell.isHighlighted
										? "bg-emerald-500/80 ring-4 ring-emerald-500/20"
										: "bg-red-500/80 ring-4 ring-red-500/20"
									: "bg-cyan-500/80 hover:bg-cyan-400 hover:ring-4 hover:ring-cyan-400/20"
							} transition-opacity duration-300`}
						>
							<span className="absolute top-2 left-2 text-sm text-white/80">
								{cell.coordinate}
							</span>
							{cell.isRevealed && cell.isHighlighted && (
								<span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">
									{cell.value}
								</span>
							)}
						</button>
					))}
				</div>

				{/* Game Progress */}
				<div className="absolute top-4 right-4 bg-slate-800/50 px-4 py-2 rounded-lg backdrop-blur-sm">
					<p className="text-cyan-300">
						Chữ đã thu thập:{" "}
						{formatCollectedLetters(gameState.collectedLetters)}
					</p>
					<p className="text-red-300">Số lần sai: {gameState.wrongMoves}</p>
				</div>
			</div>
		</div>
	);
}
