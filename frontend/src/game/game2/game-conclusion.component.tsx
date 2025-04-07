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
	FaLeaf,
	FaSeedling,
	FaTree,
	FaScroll,
	FaFeather,
} from "react-icons/fa";

const ARTIFACT: Artifact = {
	name: "Sách cổ về thiên nhiên",
	description:
		"Cuốn sách cổ chứa đựng bí ẩn của tự nhiên và sự sống, được lưu truyền qua hàng thế kỷ",
	image: "/game/game2/assets/ancient-book.jpg",
	requirements: {
		score: 12,
		accuracy: 60,
	},
};

interface Conclusion2Props {
	timeUsed: number;
	matchedCards: number;
	totalCards: number;
	win: boolean;
}

export default function Conclusion2({
	timeUsed,
	matchedCards,
	totalCards,
	win,
}: Conclusion2Props) {
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
				backgroundImage: "url('/game/game2/captain.png')",
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
			<div className="relative max-w-4xl w-full p-3">
				{/* Background texture */}
				<div className="absolute inset-0 rounded-[2rem] bg-[#f0f5e9]/70 opacity-90 shadow-xl"></div>

				{/* Border giả cổ */}
				<div className="absolute inset-0 rounded-[2rem] border-8 border-[#5d8c54]/20 box-border shadow-inner"></div>

				{/* Nội dung */}
				<div className="relative p-8 flex flex-col space-y-8 text-center">
					<h1 className="text-5xl font-bold text-[#1c4c3b] mb-8 drop-shadow-lg flex items-center justify-center font-sans">
						<FaScroll className="text-[#5d8c54] mr-4" /> Thử thách kiến thức
						hoàn thành!
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
							onRestart={() => navigate("/game2/game")}
						/>
					</div>

					<div className="mt-8 flex flex-wrap justify-center gap-4">
						<button
							onClick={() => navigate("/")}
							className="px-6 py-3 bg-[#5d8c54]/75 hover:bg-[#4a7344]/80 text-white rounded-lg border-2 border-[#94c77f]/40 shadow-lg transition-all duration-300 hover:scale-105 flex items-center font-sans"
						>
							<FaHome className="mr-2" /> Về trang chính
						</button>

						<button
							onClick={() => navigate("/game2/game")}
							className="px-6 py-3 bg-[#5d8c54]/75 hover:bg-[#4a7344]/80 text-white rounded-lg border-2 border-[#94c77f]/40 shadow-lg transition-all duration-300 hover:scale-105 flex items-center font-sans"
						>
							<FaRedo className="mr-2" /> Chơi lại
						</button>

						<button
							onClick={() => navigate("/game2")}
							className="px-6 py-3 bg-[#5d8c54]/75 hover:bg-[#4a7344]/80 text-white rounded-lg border-2 border-[#94c77f]/40 shadow-lg transition-all duration-300 hover:scale-105 flex items-center font-sans"
						>
							<FaInfoCircle className="mr-2" /> Thông tin trò chơi
						</button>
					</div>
				</div>
			</div>

			{/* Trang trí lá cây */}
			<div className="absolute top-10 left-10 w-32 h-32 z-10 pointer-events-none opacity-60">
				<FaLeaf className="text-[#5d8c54]/50 text-7xl transform -rotate-12" />
			</div>
			<div className="absolute top-40 right-20 w-20 h-20 z-10 pointer-events-none opacity-60">
				<FaSeedling className="text-[#5d8c54]/50 text-7xl transform rotate-12" />
			</div>
			<div className="absolute bottom-20 left-24 w-24 h-24 z-10 pointer-events-none opacity-60">
				<FaFeather className="text-[#5d8c54]/50 text-7xl transform rotate-180" />
			</div>
		</div>
	);
}
