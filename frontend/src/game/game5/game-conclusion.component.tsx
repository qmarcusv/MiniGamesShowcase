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
	FaBook,
	FaGraduationCap,
	FaCrown,
} from "react-icons/fa";

const ARTIFACT: Artifact = {
	name: "Chứng chỉ Văn thư",
	description:
		"Chứng nhận khả năng phân loại và xử lý văn bản hành chính nhà nước",
	image: "/game/game5/certificate.png",
	requirements: {
		score: 15,
		accuracy: 70,
	},
};

interface Conclusion5Props {
	timeUsed: number;
	correctClicks: number;
	wrongClicks: number;
	totalQuestions: number;
}

export default function Conclusion5({
	timeUsed,
	correctClicks,
	wrongClicks,
	totalQuestions,
}: Conclusion5Props) {
	const navigate = useNavigate();
	const { t } = useTranslation();

	const maxScore = totalQuestions * 2 * 2;
	const correctPoints = correctClicks * 2;
	const wrongPoints = wrongClicks * 4;
	const score = Math.max(0, correctPoints - wrongPoints);

	const totalClicks = correctClicks + wrongClicks;
	const accuracy =
		totalClicks > 0 ? Math.round((correctClicks / totalClicks) * 100) : 0;

	const gameStats: GameStats = {
		score: Math.max(0, correctClicks * 2 - wrongClicks * 4),
		accuracy,
		totalMoves: totalClicks,
		correctMoves: correctClicks,
		wrongMoves: wrongClicks,
		artifact: ARTIFACT.name,
		artifactUnlocked:
			accuracy >= ARTIFACT.requirements.accuracy &&
			score >= ARTIFACT.requirements.score,
		hideGameOverText: true,
		stats: [
			{
				label: "Điểm số",
				value: Math.max(0, correctClicks * 2 - wrongClicks * 4).toString(),
				icon: "🎯",
			},
			{
				label: "Độ chính xác",
				value: accuracy + "%",
				icon: "📊",
			},
			{
				label: "Số lần đúng",
				value: correctClicks.toString(),
				icon: "✅",
			},
			{
				label: "Số lần click sai",
				value: wrongClicks.toString(),
				icon: "❌",
			},
		],
	};

	return (
		<div
			className="h-full bg-cover bg-center flex items-center justify-center px-4 relative overflow-hidden"
			style={{
				backgroundImage: "url('/game/game5/victory.png')",
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

			<div className="relative z-10 w-full max-w-4xl">
				<h1 className="text-5xl font-bold text-amber-300 mb-8 drop-shadow-lg flex items-center justify-center">
					<FaCrown className="text-amber-400 mr-4" /> Hoàn thành xuất sắc!
				</h1>

				<div className="relative z-10">
					<div className="absolute inset-0 bg-amber-500/10 blur-xl rounded-full"></div>
					<GameConclusion
						gameStats={gameStats}
						artifact={ARTIFACT}
						onRestart={() => navigate("/game5/game")}
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
						onClick={() => navigate("/game5/game")}
						className="px-6 py-3 bg-[#1a3d65]/70 hover:bg-[#2a4d75]/90 text-amber-200 rounded-lg border-2 border-amber-500/80 shadow-lg transition-all duration-300 backdrop-blur-sm hover:scale-105 flex items-center"
					>
						<FaRedo className="mr-2" /> Chơi lại
					</button>

					<button
						onClick={() => navigate("/game5")}
						className="px-6 py-3 bg-[#1a3d65]/70 hover:bg-[#2a4d75]/90 text-amber-200 rounded-lg border-2 border-amber-500/80 shadow-lg transition-all duration-300 backdrop-blur-sm hover:scale-105 flex items-center"
					>
						<FaInfoCircle className="mr-2" /> Thông tin trò chơi
					</button>
				</div>
			</div>

			{/* Trang trí */}
			<div className="absolute top-10 left-10 w-32 h-32 z-10 pointer-events-none opacity-70">
				<FaBook className="text-amber-500/60 text-7xl transform -rotate-12" />
			</div>
			<div className="absolute top-10 right-10 w-32 h-32 z-10 pointer-events-none opacity-70">
				<FaGraduationCap className="text-amber-500/60 text-7xl transform rotate-12" />
			</div>
		</div>
	);
}
