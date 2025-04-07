export interface GameStats {
	score: number;
	totalMoves: number;
	correctMoves: number;
	accuracy: number;
	artifact: string;
	artifactUnlocked: boolean;
	hideGameOverText?: boolean;
}

export interface ArtifactRequirements {
	score: number;
	accuracy: number;
}

export interface Artifact {
	name: string;
	description: string;
	requirements: ArtifactRequirements;
	image: string;
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
