import { GameStats as BaseGameStats } from "../../shared/component/game-conclusion/game-conclusion.types";

export interface GridCell {
	coordinate: string; // Vd: "A1", "B2"
	value: string; // Chữ cái ẩn
	isRevealed: boolean;
	isHighlighted: boolean;
	row: number;
	col: number;
}

export interface MovementPattern {
	direction: string;
	steps: number;
}

export interface Hint {
	text: string;
	cells: string[];
}

export interface NavalQuestion {
	id: number;
	level: LevelNumber;
	pattern: MovementPattern[];
	startPoint: string;
	solution: string[];
	hints: Hint[];
	hiddenLetters: string[]; // Thêm mảng chữ cái cần thu thập cho mỗi ô trong solution
}

export interface GameState {
	timeLeft: number;
	currentQuestion: number;
	score: number;
	hintsRemaining: number;
	selectedCells: string[];
	collectedLetters: string[]; // Các chữ cái đã thu thập
	isComplete: boolean;
	wrongMoves: number; // Số lần di chuyển sai
	hasSubmittedAnswer: boolean; // Đã submit đáp án giải mã chưa
}

export interface GameStats extends BaseGameStats {
	wrongMoves: number;
	bonusPoints: number;
	collectedWord: string;
	decodedWord: string;
	details: Array<{
		icon: string;
		label: string;
		value: string;
	}>;
	requirements: {
		score: number;
		accuracy: number;
	};
}

export const GAME_CONSTANTS = {
	GRID_SIZE: 8,
	TOTAL_TIME: 300,
	MAX_SCORE: 20, // Tổng điểm tối đa
	POINTS_PER_LEVEL: {
		1: 5,
		2: 7,
		3: 8,
	} as const,
	WRONG_MOVE_PENALTY: 1,
	BONUS_POINTS: 10,
	CAESAR_SHIFT: 3, // Độ dịch cho Caesar cipher
} as const;

export type LevelNumber = keyof typeof GAME_CONSTANTS.POINTS_PER_LEVEL;
