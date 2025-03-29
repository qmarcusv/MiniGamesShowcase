import { useState } from "react";
import preview from "../../assets/images/document-game.png"; // Adjust if needed
import Game from "./game.component";
import GameSetting from "./game-setting.component";
import Navigator from "../../shared/navigator/navigator.component";
import ButtonSound from "../../feature/button-sound/button-sound.component";

export default function Description5() {
	const [view, setView] = useState<"description" | "game" | "setting">(
		"description"
	);

	if (view === "game") return <Game />;
	if (view === "setting") return <GameSetting />;

	return (
		<div className="p-6 max-w-7xl mx-auto text-center h-screen flex flex-col items-center justify-center space-y-6">
			<h1 className="text-4xl font-bold text-purple-700">
				Trò chơi 5: Tài liệu bay
			</h1>
			<img
				src={preview}
				alt="Game preview"
				className="w-full max-w-2xl rounded-xl shadow-lg border border-gray-300"
			/>

			<p className="text-lg text-gray-700 max-w-3xl">
				Trong trò chơi này, bạn sẽ nhìn thấy các tài liệu bay qua màn hình. Hãy
				chọn đúng tài liệu phù hợp với câu hỏi (tác giả, loại văn bản, lĩnh
				vực...). Chọn sai sẽ khiến tốc độ bay tăng lên và màn hình rung nhẹ!
			</p>

			<div className="flex justify-center gap-6">
				<ButtonSound
					soundUrl="/sounds/press.mp3"
					onClick={() => setView("setting")}
					className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
				>
					Cài đặt
				</ButtonSound>

				<ButtonSound
					soundUrl="/sounds/press.mp3"
					onClick={() => setView("game")}
					className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
				>
					Bắt đầu chơi
				</ButtonSound>
			</div>

			<Navigator previewLink="../game4" nextLink="../game6" />
		</div>
	);
}
