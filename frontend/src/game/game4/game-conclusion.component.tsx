import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ButtonSound from "../../feature/button-sound/button-sound.component";
import GameConclusion from "../../shared/component/game-conclusion/game-conclusion.component";
import {
	GameStats,
	Artifact,
} from "../../shared/component/game-conclusion/game-conclusion.types";
import "./game.component.scss";

const ARTIFACT: Artifact = {
	name: "Kẻ du hành",
	description: "Một mảnh ghép bí ẩn từ cuộc hành trình của người du hành",
	image: "/game/image/description/artifact-traveler.png",
	requirements: {
		score: 12,
		accuracy: 60,
	},
};

interface Conclusion4Props {
	timeUsed: number;
	matchedCards: number;
	totalCards: number;
	win: boolean;
}

export default function Conclusion4({
	timeUsed,
	matchedCards,
	totalCards,
	win,
}: Conclusion4Props) {
	const navigate = useNavigate();
	const { t } = useTranslation();

	const accuracy = Math.round((matchedCards / totalCards) * 100);
	const score = Math.floor((matchedCards / totalCards) * 20); // Scale to max score of 20

	const gameStats: GameStats = {
		score,
		accuracy,
		totalMoves: totalCards,
		correctMoves: matchedCards,
		artifact: ARTIFACT.name,
		artifactUnlocked:
			accuracy >= ARTIFACT.requirements.accuracy &&
			score >= ARTIFACT.requirements.score,
	};

	return (
		<div
			className="h-full bg-cover bg-center flex items-center justify-center px-4"
			style={{
				backgroundImage: "url('/game/image/description/conclusion-bg.jpg')",
			}}
		>
			<div className="bg-[#0f172a]/70 backdrop-blur-sm border-4 border-orange-600 rounded-2xl shadow-2xl p-10 max-w-4xl w-full text-center space-y-8 text-orange-100 font-pirate">
				<GameConclusion
					gameStats={gameStats}
					artifact={ARTIFACT}
					onRestart={() => navigate("/game4/game")}
				/>
			</div>
		</div>
	);
}
