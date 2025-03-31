import { useState } from "react";
import Game1 from "./game.component";
import Game1Setting from "./game-setting.component";
import ButtonSound from "../../feature/button-sound/button-sound.component";
import { useTranslation } from "react-i18next";

export default function Description1() {
	const [view, setView] = useState<"description" | "game" | "setting">(
		"description"
	);
	const { t } = useTranslation();

	if (view === "game") return <Game1 />;
	if (view === "setting") return <Game1Setting />;

	return (
		<div className="min-h-screen bg-[url('/image/pirate-bg.jpg')] bg-cover bg-center flex items-center justify-center px-4">
			<div className="bg-[#0f172a]/80 backdrop-blur-md border-4 border-yellow-600 rounded-2xl shadow-2xl p-10 max-w-3xl w-full text-center space-y-8 text-yellow-100 font-pirate">
				<h1 className="text-5xl font-bold text-yellow-400 drop-shadow-lg tracking-wider">
					🏴‍☠️ {t("games.game1")}
				</h1>

				<p className="text-lg leading-relaxed whitespace-pre-line">
					🗺️ In this trial, ye must reclaim the first shard of the shattered
					Magic Stone. The treasure map lies before ye, but beware! The marks
					will shuffle and test yer wits. Only true pirate blood can spot the
					right place in time... ⏱️ Find the hidden landmark in each round
					before the timer runs out. Claim victory, and earn what’s rightfully
					yers — the first piece o’ fortune!
				</p>

				<div className="flex justify-center gap-4 flex-wrap">
					<ButtonSound
						soundUrl="/sound/press.mp3"
						onClick={() => setView("setting")}
						className="bg-yellow-700 text-white px-6 py-2 rounded-xl hover:bg-yellow-800 transition shadow-md"
					>
						⚙️ {t("description1.setting")}
					</ButtonSound>

					<ButtonSound
						soundUrl="/sound/press.mp3"
						onClick={() => setView("game")}
						className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition shadow-md"
					>
						🏴‍☠️ {t("description1.start")}
					</ButtonSound>
				</div>
			</div>
		</div>
	);
}
