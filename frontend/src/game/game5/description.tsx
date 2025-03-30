import { useState } from "react";
import { useTranslation } from "react-i18next";
import preview from "../../assets/images/document-game.png";
import Game from "./game.component";
import GameSetting from "./game-setting.component";
import Navigator from "../../shared/navigator/navigator.component";
import ButtonSound from "../../feature/button-sound/button-sound.component";

export default function Description5() {
	const [view, setView] = useState<"description" | "game" | "setting">(
		"description"
	);
	const { t } = useTranslation();

	if (view === "game") return <Game />;
	if (view === "setting") return <GameSetting />;

	return (
		<div className="p-6 max-w-7xl mx-auto text-center min-h-screen flex flex-col items-center justify-center space-y-8 bg-gradient-to-b from-violet-50 to-purple-100">
			<h1 className="text-5xl font-extrabold text-purple-700 drop-shadow-md">
				{t("games.game5")} ✈️
			</h1>

			<img
				src={preview}
				alt="Game preview"
				className="w-full max-w-2xl rounded-xl shadow-xl border border-purple-200"
			/>

			<p className="text-lg text-gray-700 max-w-3xl leading-relaxed">
				{t("description5.instructions")}
			</p>

			<div className="flex justify-center gap-6">
				<ButtonSound
					soundUrl="/sounds/press.mp3"
					onClick={() => setView("setting")}
					className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 shadow"
				>
					{t("description5.setting")}
				</ButtonSound>

				<ButtonSound
					soundUrl="/sounds/press.mp3"
					onClick={() => setView("game")}
					className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 shadow"
				>
					🎮 {t("description5.start")}
				</ButtonSound>
			</div>

			<Navigator previewLink="../game4" nextLink="../game6" />
		</div>
	);
}
