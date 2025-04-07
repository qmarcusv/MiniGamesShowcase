import { useTranslation } from "react-i18next";
import ButtonSound from "../button-sound/button-sound.component";

interface GameConclusionProps {
	score: number;
	accuracy: number;
	artifact: {
		name: string;
		requirements: {
			score: number;
			accuracy: number;
		};
	};
	onReplay: () => void;
	onBack: () => void;
}

export default function GameConclusion({
	score,
	accuracy,
	artifact,
	onReplay,
	onBack,
}: GameConclusionProps) {
	const { t } = useTranslation();
	const isArtifactUnlocked =
		score >= artifact.requirements.score &&
		accuracy >= artifact.requirements.accuracy;

	return (
		<div className="relative w-full max-w-2xl mx-4">
			<div className="relative">
				<img
					src="/game/image/description/scroll.png"
					alt="Scroll background"
					className="w-full"
				/>
				<div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-amber-950">
					{/* Title */}
					<h1 className="text-4xl font-pirate mb-6 drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">
						{t("conclusion.title")}
					</h1>

					{/* Stats */}
					<div className="mb-8 w-full">
						<div className="grid grid-cols-2 gap-4">
							<div className="bg-amber-100 p-4 rounded-lg border-2 border-amber-700">
								<h2 className="text-2xl font-pirate mb-2">
									{t("conclusion.score")}
								</h2>
								<p className="text-3xl font-bold">{score}</p>
							</div>
							<div className="bg-amber-100 p-4 rounded-lg border-2 border-amber-700">
								<h2 className="text-2xl font-pirate mb-2">
									{t("conclusion.accuracy")}
								</h2>
								<p className="text-3xl font-bold">{accuracy}%</p>
							</div>
						</div>
					</div>

					{/* Artifact */}
					<div className="mb-8 w-full">
						<div className="bg-amber-100 p-4 rounded-lg border-2 border-amber-700">
							<h2 className="text-2xl font-pirate mb-2">
								{t("conclusion.artifact")}
							</h2>
							<p className="text-lg mb-2">{artifact.name}</p>
							{isArtifactUnlocked ? (
								<p className="text-green-600 font-bold">
									{t("conclusion.artifact_unlocked")}
								</p>
							) : (
								<p className="text-red-600 font-bold">
									{t("conclusion.artifact_locked")}
								</p>
							)}
						</div>
					</div>

					{/* Buttons */}
					<div className="flex gap-4">
						<ButtonSound
							onClick={onBack}
							className="px-6 py-3 bg-amber-800 hover:bg-amber-900 text-white rounded-lg transition-all duration-300 shadow-lg border-2 border-amber-700"
						>
							{t("conclusion.back")}
						</ButtonSound>
						<ButtonSound
							onClick={onReplay}
							className="px-6 py-3 bg-amber-800 hover:bg-amber-900 text-white rounded-lg transition-all duration-300 shadow-lg border-2 border-amber-700"
						>
							{t("conclusion.replay")}
						</ButtonSound>
					</div>
				</div>
			</div>
		</div>
	);
}
