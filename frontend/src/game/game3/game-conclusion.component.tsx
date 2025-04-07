import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ButtonSound from "../../feature/button-sound/button-sound.component";
import GameConclusion from "../../shared/component/game-conclusion/game-conclusion.component";
import {
	GameStats,
	Artifact,
} from "../../shared/component/game-conclusion/game-conclusion.types";
import "./game.component.scss";
import {
	FaHome,
	FaRedo,
	FaInfoCircle,
	FaShip,
	FaSkull,
	FaCrown,
} from "react-icons/fa";

const ARTIFACT: Artifact = {
	name: "Thanh gươm truyền thuyết",
	description:
		"Thanh gươm huyền thoại có sức mạnh đánh bại mọi kẻ thù trên biển cả",
	image: "/game/game3/legendary-sword.jpg",
	requirements: {
		score: 12,
		accuracy: 75,
	},
};

interface Conclusion3Props {
	timeUsed: number;
	matchedCards: number;
	totalCards: number;
	win: boolean;
}

export default function Conclusion3({
	timeUsed,
	matchedCards,
	totalCards,
	win,
}: Conclusion3Props) {
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
			className="h-full bg-cover bg-center flex items-center justify-center px-4 relative overflow-hidden"
			style={{
				backgroundImage: "url('/game/game3/victory.png')",
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			<div className="absolute inset-0 bg-[#0c1e35]/50"></div>

			<div
				className="absolute bottom-0 left-0 right-0 h-32 bg-bottom bg-repeat-x"
				style={{
					backgroundImage:
						"linear-gradient(0deg, rgba(12,30,53,0.5) 0%, rgba(12,30,53,0) 100%)",
				}}
			></div>

			<div className="relative bg-[#0c1e35]/60 backdrop-blur-sm border-4 border-amber-600/80 rounded-2xl shadow-2xl p-10 max-w-4xl w-full text-center space-y-8 text-amber-100">
				<h1 className="text-5xl font-bold text-amber-300 mb-8 drop-shadow-lg flex items-center justify-center">
					<FaCrown className="text-amber-400 mr-4" /> Chiến thắng hải tặc!
				</h1>

				<div className="relative z-10">
					<div className="absolute inset-0 bg-amber-500/10 blur-xl rounded-full"></div>
					<GameConclusion
						gameStats={gameStats}
						artifact={ARTIFACT}
						onRestart={() => navigate("/game3/game")}
					/>
				</div>

				<div className="mt-8 flex flex-wrap justify-center gap-4">
					<button
						onClick={() => navigate("/")}
						className="px-6 py-3 bg-[#1a3d65]/70 hover:bg-[#2a4d75]/90 text-amber-200 rounded-lg border-2 border-amber-500/80 shadow-lg transition-all duration-300 backdrop-blur-sm hover:scale-105 flex items-center"
					>
						<FaHome className="mr-2" /> Về trang chính
					</button>

					<button
						onClick={() => navigate("/game3/game")}
						className="px-6 py-3 bg-[#1a3d65]/70 hover:bg-[#2a4d75]/90 text-amber-200 rounded-lg border-2 border-amber-500/80 shadow-lg transition-all duration-300 backdrop-blur-sm hover:scale-105 flex items-center"
					>
						<FaRedo className="mr-2" /> Chơi lại
					</button>

					<button
						onClick={() => navigate("/game3")}
						className="px-6 py-3 bg-[#1a3d65]/70 hover:bg-[#2a4d75]/90 text-amber-200 rounded-lg border-2 border-amber-500/80 shadow-lg transition-all duration-300 backdrop-blur-sm hover:scale-105 flex items-center"
					>
						<FaInfoCircle className="mr-2" /> Thông tin trò chơi
					</button>
				</div>
			</div>

			{/* Trang trí hải tặc */}
			<div className="absolute top-10 left-10 w-32 h-32 z-10 pointer-events-none opacity-70">
				<FaShip className="text-amber-500/60 text-7xl transform -rotate-12" />
			</div>
			<div className="absolute bottom-20 right-20 w-20 h-20 z-10 pointer-events-none opacity-70">
				<FaSkull className="text-amber-500/60 text-7xl transform rotate-12" />
			</div>
		</div>
	);
}
