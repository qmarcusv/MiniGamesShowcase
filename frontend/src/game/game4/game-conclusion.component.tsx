import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
	FaHome,
	FaRedo,
	FaArrowLeft,
	FaMap,
	FaCompass,
	FaSkull,
	FaScroll,
} from "react-icons/fa";
import GameConclusion from "../../shared/component/game-conclusion/game-conclusion.component";
import {
	GameStats,
	Artifact,
} from "../../shared/component/game-conclusion/game-conclusion.types";

const ARTIFACT: Artifact = {
	name: "La bàn thời gian",
	description:
		"Một la bàn huyền bí có khả năng dẫn đường xuyên thời gian, giúp phát hiện những thay đổi giữa quá khứ và hiện tại",
	image: "/game/game4/time-compass.jpg",
	requirements: {
		score: 15,
		accuracy: 70,
	},
};

interface ConclusionProps {
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
}: ConclusionProps) {
	const navigate = useNavigate();
	const accuracy = Math.round((matchedCards / totalCards) * 100);
	const score = Math.floor((matchedCards / totalCards) * 20); // Scale to max score of 20

	const gameStats: GameStats = {
		score,
		accuracy,
		totalMoves: totalCards,
		correctMoves: matchedCards,
		wrongMoves: totalCards - matchedCards,
		artifact: ARTIFACT.name,
		artifactUnlocked:
			accuracy >= ARTIFACT.requirements.accuracy &&
			score >= ARTIFACT.requirements.score,
		hideGameOverText: true,
		stats: [
			{
				label: "Thời gian",
				value: `${timeUsed}s`,
				icon: "clock",
			},
			{
				label: "Độ chính xác",
				value: `${accuracy}%`,
				icon: "target",
			},
			{
				label: "Điểm tìm được",
				value: `${matchedCards}/${totalCards}`,
				icon: "search",
			},
		],
	};

	return (
		<div
			className="h-full bg-cover bg-center flex items-center justify-center px-4 relative overflow-hidden"
			style={{
				backgroundImage: "url('/game/game4/conclusion.png')",
				backgroundSize: "cover",
			}}
		>
			{/* Lớp overlay tối */}
			<div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>

			<div className="absolute inset-0 flex items-center justify-center">
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.7 }}
					className="relative bg-[#2b1d0e]/90 backdrop-blur-sm border-4 border-amber-700/80 rounded-2xl shadow-2xl p-8 max-w-4xl w-full text-center space-y-8 text-amber-100"
				>
					<div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
						<div className="bg-amber-900/90 rounded-full p-4 border-4 border-amber-700/80 shadow-xl">
							<FaCompass className="text-amber-300 text-4xl" />
						</div>
					</div>

					<h1 className="text-4xl font-pirate text-amber-300 mb-6 mt-4 flex items-center justify-center gap-3">
						<FaMap className="text-amber-400" />
						{win ? "Kho báu tri thức" : "Hành trình chưa hoàn thành"}
					</h1>

					<div className="relative z-10">
						<div className="absolute inset-0 bg-amber-500/5 blur-xl rounded-full"></div>
						<GameConclusion
							gameStats={gameStats}
							artifact={ARTIFACT}
							onRestart={() => navigate("/game4/game")}
						/>
					</div>

					<div className="mt-8 flex flex-wrap justify-center gap-4">
						<button
							onClick={() => navigate("/")}
							className="px-6 py-3 bg-amber-900/70 hover:bg-amber-800/90 text-amber-200 rounded-lg border-2 border-amber-700/70 shadow-lg transition-all duration-300 flex items-center"
						>
							<FaHome className="mr-2" /> Về trang chính
						</button>

						<button
							onClick={() => navigate("/game4/game")}
							className="px-6 py-3 bg-amber-900/70 hover:bg-amber-800/90 text-amber-200 rounded-lg border-2 border-amber-700/70 shadow-lg transition-all duration-300 flex items-center"
						>
							<FaRedo className="mr-2" /> Chơi lại
						</button>

						<button
							onClick={() => navigate("/game4")}
							className="px-6 py-3 bg-amber-900/70 hover:bg-amber-800/90 text-amber-200 rounded-lg border-2 border-amber-700/70 shadow-lg transition-all duration-300 flex items-center"
						>
							<FaArrowLeft className="mr-2" /> Quay lại
						</button>
					</div>
				</motion.div>
			</div>

			{/* Trang trí */}
			<div className="absolute top-8 left-10 transform -rotate-12 opacity-30">
				<FaScroll className="text-amber-500 text-7xl" />
			</div>
			<div className="absolute bottom-12 right-16 transform rotate-12 opacity-30">
				<FaSkull className="text-amber-500 text-7xl" />
			</div>

			{/* Hiệu ứng ánh sáng */}
			<div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/10 blur-3xl rounded-full animate-pulse"></div>
			<div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-500/10 blur-3xl rounded-full animate-pulse delay-1000"></div>
		</div>
	);
}
