import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Game from "./game.component";
import GameSetting from "./game-setting.component";
import Navigator from "../../shared/navigator/navigator.component";
import ButtonSound from "../../feature/button-sound/button-sound.component";

export default function Description5() {
	const [view, setView] = useState<"description" | "game" | "setting">(
		"description"
	);
	const { t } = useTranslation();

	// Optional: apply hide-navbar-footer when in game view
	useEffect(() => {
		if (view === "game") {
			document.body.classList.add("hide-navbar-footer");
		} else {
			document.body.classList.remove("hide-navbar-footer");
		}
	}, [view]);

	if (view === "game")
		return (
			<div className="hide-navbar-footer">
				<Game />
			</div>
		);
	if (view === "setting") return <GameSetting />;

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-800 to-violet-700 flex items-center justify-center px-4">
			<div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-10 max-w-3xl w-full text-center space-y-8">
				<h1 className="text-4xl font-extrabold text-purple-300 drop-shadow">
					{t("games.game5")} ✈️
				</h1>

				<p className="text-lg text-violet-100 leading-relaxed">
					{t("description5.instructions")}
				</p>

				<div className="flex justify-center gap-6 flex-wrap">
					<ButtonSound
						soundUrl="/sounds/press.mp3"
						onClick={() => setView("setting")}
						className="bg-white/20 text-white px-6 py-2 rounded-xl hover:bg-white/30 transition shadow-md"
					>
						{t("description5.setting")}
					</ButtonSound>

					<ButtonSound
						soundUrl="/sounds/press.mp3"
						onClick={() => setView("game")}
						className="bg-purple-500 text-white px-6 py-2 rounded-xl hover:bg-purple-600 transition shadow-md"
					>
						🎮 {t("description5.start")}
					</ButtonSound>
				</div>

				<Navigator previewLink="../game4" nextLink="../game6" />
			</div>
		</div>
	);
}
