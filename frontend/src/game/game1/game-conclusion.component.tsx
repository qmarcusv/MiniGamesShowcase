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
	name: "Con tàu cướp biển",
	description:
		"Bạn đã hoàn thành con tàu cướp biển và khám phá được bí mật của kho báu!",
	image: "/places/halong.jpg",
	requirements: {
		score: 12,
		accuracy: 60,
	},
};

interface Conclusion1Props {
	timeUsed: number;
	matchedCards: number;
	totalCards: number;
	win: boolean;
}

export default function Conclusion1({
	timeUsed,
	matchedCards,
	totalCards,
	win,
}: Conclusion1Props) {
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
		hideGameOverText: true,
	};

	return (
		<div
			className="h-full bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 relative overflow-hidden"
			style={{
				backgroundImage: "url('/game/game1/shipwreck.png')",
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			<div className="absolute inset-0 bg-[#0c1e35]/30"></div>

			<div
				className="absolute bottom-0 left-0 right-0 h-32 bg-bottom bg-repeat-x"
				style={{
					backgroundImage:
						"linear-gradient(0deg, rgba(12,30,53,0.5) 0%, rgba(12,30,53,0) 100%)",
				}}
			></div>

			<div className="relative bg-[#0f172a]/50 backdrop-blur-sm border-4 border-amber-600/80 rounded-2xl shadow-2xl p-10 max-w-4xl w-full text-center space-y-8 text-amber-100 font-pirate">
				<h1 className="text-5xl font-bold text-amber-300 mb-8 drop-shadow-lg">
					🏆 Cuộc săn kho báu hoàn thành!
				</h1>

				<div className="relative z-10">
					<div className="absolute inset-0 bg-amber-500/10 blur-xl rounded-full"></div>
					<GameConclusion
						gameStats={gameStats}
						artifact={ARTIFACT}
						onRestart={() => navigate("/game1/game")}
					/>
				</div>

				<div className="mt-8 flex flex-wrap justify-center gap-4">
					<button
						onClick={() => navigate("/")}
						className="px-6 py-3 bg-[#1a3d65]/70 hover:bg-[#2a4d75]/90 text-amber-200 rounded-lg border-2 border-amber-500/80 shadow-lg transition-all duration-300 backdrop-blur-sm hover:scale-105"
					>
						🏠 Về trang chính
					</button>

					<button
						onClick={() => navigate("/game1")}
						className="px-6 py-3 bg-[#1a3d65]/70 hover:bg-[#2a4d75]/90 text-amber-200 rounded-lg border-2 border-amber-500/80 shadow-lg transition-all duration-300 backdrop-blur-sm hover:scale-105"
					>
						ℹ️ Thông tin trò chơi
					</button>
				</div>
			</div>
		</div>
	);
}
