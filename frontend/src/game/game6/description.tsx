import { useEffect, useState } from "react";
import Game6 from "./game.component.tsx";
// import Game6Setting from "./game-setting.component.tsx";
import ButtonSound from "../../feature/button-sound/button-sound.component";
import Navigator from "../../shared/navigator/navigator.component";
import { useTranslation } from "react-i18next";

export default function Description6() {
	const [view, setView] = useState<"description" | "game" | "setting">(
		"description"
	);
	const [gridSize, setGridSize] = useState<"4x4" | "6x6">("6x6");
	const [timers, setTimers] = useState({
		"4x4": 45,
		"6x6": 120,
	});
	const { t } = useTranslation();

	useEffect(() => {
		if (view === "game") {
			document.body.classList.add("hide-navbar-footer");
		} else {
			document.body.classList.remove("hide-navbar-footer");
		}
	}, [view]);

	if (view === "game") {
		return <Game6 gridSize={gridSize} timer={timers[gridSize]} />;
	}

	// if (view === "setting") {
	// 	return (
	// 		<Game6Setting
	// 			gridSize={gridSize}
	// 			setGridSize={setGridSize}
	// 			timers={timers}
	// 			setTimers={setTimers}
	// 		/>
	// 	);
	// }

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center px-4">
			<div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-10 max-w-3xl w-full text-center space-y-8">
				<h1 className="text-4xl font-extrabold text-emerald-400 drop-shadow">
					{t("games.game6")}
				</h1>

				<p className="text-lg text-slate-100 leading-relaxed">
					{t("description6.instructions")}
				</p>

				<div className="flex justify-center gap-4 flex-wrap items-center">
					<select
						value={gridSize}
						onChange={(e) => setGridSize(e.target.value as "4x4" | "6x6")}
						className="bg-white/20 text-white px-4 py-2 rounded-xl hover:bg-white/30 transition shadow-md"
					>
						<option value="4x4">4 x 4</option>
						<option value="6x6">6 x 6</option>
					</select>

					{/* <ButtonSound
						soundUrl="/sounds/press.mp3"
						onClick={() => setView("setting")}
						className="bg-white/20 text-white px-6 py-2 rounded-xl hover:bg-white/30 transition shadow-md"
					>
						{t("description6.setting")}
					</ButtonSound> */}

					<ButtonSound
						soundUrl="/sounds/press.mp3"
						onClick={() => setView("game")}
						className="bg-emerald-500 text-white px-6 py-2 rounded-xl hover:bg-emerald-600 transition shadow-md"
					>
						{t("description6.start")}
					</ButtonSound>
				</div>

				<Navigator previewLink="../game5" nextLink="../game1" />
			</div>
		</div>
	);
}
