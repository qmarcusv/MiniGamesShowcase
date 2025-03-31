import { useEffect, useState } from "react";
import Game from "./game.component";
import GameSetting from "./game-setting.component";
import ButtonSound from "../../feature/button-sound/button-sound.component";
import { useTranslation } from "react-i18next";

export default function Description2() {
	const [view, setView] = useState<"description" | "game" | "setting">(
		"description"
	);
	const { t } = useTranslation();

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
		<div className="min-h-screen bg-[url('/image/pirate-bg.jpg')] bg-cover bg-center flex items-center justify-center px-4">
			<div className="bg-[#0f172a]/80 backdrop-blur-md border-4 border-yellow-600 rounded-2xl shadow-2xl p-10 max-w-3xl w-full text-center space-y-8 text-yellow-100 font-pirate">
				<h1 className="text-5xl font-bold text-yellow-400 drop-shadow-lg tracking-wider">
					📜 {t("games.game2", "Trò chơi 2: Truy tìm kiến thức")}
				</h1>

				<p className="text-lg leading-relaxed whitespace-pre-line">
					🧠 Hãy thử sức với các câu hỏi trắc nghiệm và xem bạn hiểu biết đến
					đâu! Mỗi câu trả lời đúng sẽ giúp bạn tiến gần hơn đến kho báu tri
					thức! ⏱️ Bạn chỉ có vài giây để suy nghĩ — hãy khôn ngoan như một cướp
					biển lão luyện!
				</p>

				<div className="flex justify-center gap-4 flex-wrap">
					<ButtonSound
						soundUrl="/sound/press.mp3"
						onClick={() => setView("setting")}
						className="bg-yellow-700 text-white px-6 py-2 rounded-xl hover:bg-yellow-800 transition shadow-md"
					>
						⚙️ {t("description2.setting", "Cài đặt")}
					</ButtonSound>

					<ButtonSound
						soundUrl="/sound/press.mp3"
						onClick={() => setView("game")}
						className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition shadow-md"
					>
						🏴‍☠️ {t("description2.start", "Bắt đầu truy tìm")}
					</ButtonSound>
				</div>
			</div>
		</div>
	);
}
