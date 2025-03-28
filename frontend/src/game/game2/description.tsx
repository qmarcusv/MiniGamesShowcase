import { useState } from "react";
import des from "../../assets/temp/game2.png"; // use actual extension if it's .png, .webp, etc.
import Navigator from "../../shared/navigator/navigator.component";

import Game from "./game.component"; // this is the file you moved the game code into

export default function Description2() {
  const [startGame, setStartGame] = useState(false);

  if (startGame) return <Game />;

  return (
    <div className="p-6 max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Trò chơi 2: Câu hỏi</h1>

      <img src={des} alt="Game preview" className="rounded-xl w-full max-w-2xl mx-auto mb-6 shadow-lg" />

      <p className="text-lg text-gray-200 mb-4">Trong trò chơi này, bạn sẽ trả lời các câu hỏi trắc nghiệm với thời gian giới hạn.</p>

      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition" onClick={() => setStartGame(true)}>
        Bắt đầu chơi
      </button>

      <Navigator previewLink="../game1" nextLink="../game3" />
    </div>
  );
}
