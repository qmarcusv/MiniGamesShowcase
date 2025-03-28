import { useState } from "react";
import des from "../../assets/temp/game2.png"; // use actual extension if it's .png, .webp, etc.
import Navigator from "../../shared/navigator/navigator.component";

import Game from "./game.component"; // this is the file you moved the game code into
import GameSetting from "./game-setting.component"; // this is the file you moved the game code into
// import ButtonSound from "../../feature/button-sound/button-sound.component";
// import pressSound from "/sound/pressed.mp3";

export default function Description2() {
  // const [startGame, setStartGame] = useState(false);
  const [view, setView] = useState<"description" | "game" | "setting">("description");

  if (view === "game") return <Game />;
  if (view === "setting") return <GameSetting />;

  return (
    <div className="p-6 max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Trò chơi 2: Câu hỏi</h1>

      <img src={des} alt="Game preview" className="rounded-xl w-full max-w-2xl mx-auto mb-6 shadow-lg" />

      <p className="text-lg text-gray-200 mb-4">Trong trò chơi này, bạn sẽ trả lời các câu hỏi trắc nghiệm với thời gian giới hạn.</p>

      <div className="flex justify-center gap-4">
        <button className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition" onClick={() => setView("setting")}>
          Cài đặt
        </button>

        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition" onClick={() => setView("game")}>
          Bắt đầu chơi
        </button>
      </div>

      <Navigator previewLink="../game1" nextLink="../game3" />

      {/* <ButtonSound soundUrl={pressSound} onClick={() => console.log("Clicked!")}>
        🔊 Play Sound
      </ButtonSound> */}
    </div>
  );
}
