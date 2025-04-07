import { useState } from "react";
import correctSound from "/sound/correct.mp3";
import { GameStats, Artifact } from "./game-conclusion.types";
import "./game-conclusion.component.scss";

interface GameConclusionProps {
	gameStats: GameStats;
	artifact: Artifact;
	onRestart: () => void;
}

export default function GameConclusion({
	gameStats,
	artifact,
	onRestart,
}: GameConclusionProps) {
	const [showArtifactPopup, setShowArtifactPopup] = useState(false);

	// Kiểm tra nếu không có gameStats
	if (!gameStats) {
		return (
			<div className="game-conclusion space-y-4">
				<button
					onClick={onRestart}
					className="bg-orange-600 text-white px-8 py-4 rounded-xl text-2xl hover:bg-orange-700 transition shadow-md font-sans"
				>
					🎮 Chơi lại
				</button>
			</div>
		);
	}

	return (
		<div className="game-conclusion space-y-4 font-sans">
			{!gameStats.hideGameOverText && (
				<div className="text-4xl font-bold">Trò chơi kết thúc!</div>
			)}

			<div className="grid grid-cols-2 gap-4 p-4 bg-slate-800/50 rounded-xl">
				<div className="space-y-2 text-left">
					<p className="text-xl">🎯 Điểm số: {gameStats.score}</p>
					<p className="text-xl">
						📊 Độ chính xác: {gameStats.accuracy.toFixed(1)}%
					</p>
					<p className="text-lg">✅ Số lần đúng: {gameStats.correctMoves}</p>
					<p className="text-lg">📝 Tổng số lần: {gameStats.totalMoves}</p>
				</div>
				<div className="flex flex-col items-center justify-center gap-4">
					{gameStats.artifactUnlocked ? (
						<>
							{showArtifactPopup ? (
								<div className="relative animate-pulse">
									<img
										src={artifact.image}
										alt="Artifact"
										className="w-32 h-32 object-contain"
									/>
									<div className="absolute inset-0 bg-yellow-500/20 animate-ping rounded-full"></div>
								</div>
							) : (
								<button
									onClick={() => setShowArtifactPopup(true)}
									className="treasure-chest-btn font-sans"
								>
									<span className="text-2xl">🎁</span>
									<span className="text-sm">Mở báu vật</span>
								</button>
							)}
						</>
					) : (
						<div className="text-center opacity-50">
							<p className="text-sm mb-2">Chưa đủ điều kiện nhận thưởng</p>
							<p className="text-xs">Yêu cầu:</p>
							<p className="text-xs">
								- Điểm số: {artifact.requirements.score}+
							</p>
							<p className="text-xs">
								- Độ chính xác: {artifact.requirements.accuracy}%+
							</p>
						</div>
					)}
				</div>
			</div>
			<button
				onClick={onRestart}
				className="bg-orange-600 text-white px-8 py-4 rounded-xl text-2xl hover:bg-orange-700 transition shadow-md font-sans"
			>
				🎮 Chơi lại
			</button>

			{/* Artifact Unlock Popup */}
			{showArtifactPopup && (
				<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
					<div className="bg-[#0f172a] border-4 border-orange-600 rounded-2xl p-8 max-w-md w-full text-center space-y-4 animate-scale-up artifact-popup font-sans">
						<h3 className="text-2xl font-bold text-orange-400">
							🎉 Chúc mừng! 🎉
						</h3>
						<p className="text-lg text-orange-100">Bạn đã mở khóa</p>
						<div className="artifact-container">
							<img
								src={artifact.image}
								alt="Artifact"
								className="w-48 h-48 object-contain mx-auto"
							/>
						</div>
						<p className="text-xl font-bold artifact-name">{artifact.name}</p>
						<p className="text-sm text-orange-200">{artifact.description}</p>
						<button
							onClick={() => {
								setShowArtifactPopup(false);
								new Audio(correctSound).play();
							}}
							className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition font-sans"
						>
							Đóng
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
