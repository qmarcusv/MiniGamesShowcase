import { useState } from "react";
import des from "../../assets/temp/game2.png";
import Navigator from "../../shared/navigator/navigator.component";
import Game from "./game.component";
import GameSetting from "./game-setting.component";
// import ButtonSound from "../../feature/button-sound/button-sound.component";
// import pressSound from "/sound/pressed.mp3";

export default function Description2() {
	const [view, setView] = useState<"description" | "game" | "setting">(
		"description"
	);

	if (view === "game") return <Game />;
	if (view === "setting") return <GameSetting />;

	return (
		<div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-800 text-white">
			<div className="w-full max-w-4xl text-center">
				<h1 className="text-5xl font-bold text-blue-400 mb-6 drop-shadow">
					Trò chơi 2: Câu hỏi
				</h1>

				<img
					src={des}
					alt="Game preview"
					className="rounded-2xl w-full h-auto max-h-[400px] object-cover mb-6 shadow-lg"
				/>

				<p className="text-lg text-gray-300 mb-6">
					Trong trò chơi này, bạn sẽ trả lời các câu hỏi trắc nghiệm với thời
					gian giới hạn.
				</p>

				<div className="flex justify-center gap-6 mb-8 flex-wrap">
					<button
						className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition text-lg font-medium"
						onClick={() => setView("setting")}
					>
						Cài đặt
					</button>

					<button
						className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition text-lg font-medium"
						onClick={() => setView("game")}
					>
						Bắt đầu chơi
					</button>
				</div>

				<Navigator previewLink="../game1" nextLink="../game3" />
			</div>

			{/* <ButtonSound soundUrl={pressSound} onClick={() => console.log("Clicked!")}>
        🔊 Play Sound
      </ButtonSound> */}
		</div>
	);
}
