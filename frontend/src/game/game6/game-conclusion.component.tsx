import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameConclusion from "../../shared/component/game-conclusion/game-conclusion.component";
import {
	GameStats,
	Artifact,
} from "../../shared/component/game-conclusion/game-conclusion.types";
import "./game.component.scss";
import { FaScroll } from "react-icons/fa";

const ARTIFACT: Artifact = {
	name: "Mảnh ghép di sản",
	description: "Một mảnh ghép quý giá từ bộ sưu tập di sản văn hóa Việt Nam",
	image: "/game/image/description/artifact-heritage.png",
	requirements: {
		score: 12,
		accuracy: 60,
	},
};

interface Conclusion6Props {
	score: number;
	timeUsed: number;
	totalPairs: number;
	matchedPairs: number;
	wrongAttempts: number;
	win?: boolean;
}

export default function Conclusion6({
	score,
	timeUsed,
	totalPairs,
	matchedPairs,
	wrongAttempts,
	win = false,
}: Conclusion6Props) {
	const navigate = useNavigate();
	const { t } = useTranslation();

	const accuracy =
		Math.round((matchedPairs / (matchedPairs + wrongAttempts)) * 100) || 0;

	const gameStats: GameStats = {
		score: matchedPairs,
		accuracy,
		totalMoves: matchedPairs + wrongAttempts,
		correctMoves: matchedPairs,
		wrongMoves: wrongAttempts,
		artifact: ARTIFACT.name,
		artifactUnlocked:
			matchedPairs >= ARTIFACT.requirements.score &&
			accuracy >= ARTIFACT.requirements.accuracy,
		hideGameOverText: true,
		stats: [
			{
				label: "Thời gian",
				value: `${timeUsed}s`,
				icon: "⏱️",
			},
			{
				label: "Độ chính xác",
				value: `${accuracy}%`,
				icon: "🎯",
			},
			{
				label: "Số cặp đã ghép",
				value: `${matchedPairs}/${totalPairs}`,
				icon: "🔍",
			},
		],
	};

	return (
		<div
			className="h-full bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 relative overflow-hidden"
			style={{
				backgroundImage: "url('/game/game6/conclusion.png')",
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			<div className="absolute inset-0 bg-[#0a261a]/5"></div>

			<div
				className="absolute bottom-0 left-0 right-0 h-32 bg-bottom bg-repeat-x"
				style={{
					backgroundImage:
						"linear-gradient(0deg, rgba(10,38,26,0.3) 0%, rgba(10,38,26,0) 100%)",
				}}
			></div>

			{/* Main container - cổ kính như khung parchment */}
			<div className="relative max-w-4xl w-full bg-[#f0f5e9] rounded-[2rem] p-12 m-8">
				{/* Background texture */}
				<div className="absolute inset-0 rounded-[2rem] bg-[#f0f5e9]/70 opacity-90 shadow-xl"></div>

				{/* Border giả cổ */}
				<div className="absolute inset-0 rounded-[2rem] border-8 border-[#5d8c54]/20 box-border shadow-inner"></div>

				{/* Nội dung */}
				<div className="relative p-8 flex flex-col space-y-8 text-center">
					<h1 className="text-5xl font-bold text-[#1c4c3b] mb-8 drop-shadow-lg flex items-center justify-center font-sans">
						<FaScroll className="text-[#5d8c54] mr-4" /> Thử thách hoàn thành!
					</h1>

					{/* Trang trí góc */}
					<div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#5d8c54]/20 rounded-tl-2xl"></div>
					<div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#5d8c54]/20 rounded-tr-2xl"></div>
					<div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[#5d8c54]/20 rounded-bl-2xl"></div>
					<div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#5d8c54]/20 rounded-br-2xl"></div>

					<div className="relative z-10">
						<div className="absolute inset-0 bg-[#5d8c54]/5 blur-xl rounded-full"></div>
						<GameConclusion
							gameStats={gameStats}
							artifact={ARTIFACT}
							onRestart={() => navigate("/game6/game")}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
