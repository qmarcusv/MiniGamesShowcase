export interface GameStats {
	score: number;
	accuracy: number;
	totalMoves: number;
	correctMoves: number;
	wrongMoves: number;
	artifact: string;
	artifactUnlocked: boolean;
	hideGameOverText?: boolean;
	stats: Array<{
		label: string;
		value: string;
		icon: string;
	}>;
}

export interface ArtifactRequirements {
	score: number;
	accuracy: number;
}

export interface Artifact {
	name: string;
	description: string;
	image: string;
	requirements: {
		score: number;
		accuracy: number;
	};
}

export interface GameConclusionProps {
	gameStats: GameStats;
	artifact: Artifact;
	onRestart: () => void;
	messages?: {
		success: string;
		partial: string;
		fail: string;
	};
}
