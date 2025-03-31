import { useState } from "react";
import Game4 from "./game.component";
import Game4Setting from "./game-setting.component";
import ButtonSound from "../../feature/button-sound/button-sound.component";
import { useTranslation } from "react-i18next";
import { useGameContext } from "../../shared/context/game.hook";

export default function Description4() {
  const { games, completeGame } = useGameContext();
  const [view, setView] = useState<"description" | "game" | "setting">("description");
  const { t } = useTranslation();

  if (view === "game") return <Game4 />;
  if (view === "setting") return <Game4Setting />;

  return (
    <div className="h-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-10 max-w-3xl w-full text-center space-y-8">
        <h1 className="text-4xl font-extrabold text-blue-400 drop-shadow">Trò chơi 4: So sánh quá khứ và hiện tại</h1>

        <p className="text-lg text-slate-100 leading-relaxed">
          Cháu chưa có nghĩ ra display như nào nhưng đại khái trò này sẽ có các ảnh về các địa điểm như Nhà thờ Đức Bà hoặc bản đồ của một khu vực nào
          đó trước đây và bây giờ. Người chơi sẽ phải so sánh và chọn ra các điểm khác biệt (các điểm này sẽ được mình đặt trước). Rồi các kiểu các
          kiểu nữa 😄
        </p>

        <div className="flex justify-center gap-4 flex-wrap items-center">
          <ButtonSound
            soundUrl="/sounds/press.mp3"
            onClick={() => setView("setting")}
            className="bg-white/20 text-white px-6 py-2 rounded-xl hover:bg-white/30 transition shadow-md">
            {t("description4.setting") || "Cài đặt bản đồ"}
          </ButtonSound>

          <ButtonSound
            soundUrl="/sounds/press.mp3"
            onClick={() => setView("game")}
            className="bg-emerald-500 text-white px-6 py-2 rounded-xl hover:bg-emerald-600 transition shadow-md">
            {t("description4.start") || "Bắt đầu chơi"}
          </ButtonSound>

          <button onClick={() => completeGame(3)} className="bg-emerald-500 text-white px-4 py-2 rounded-xl">
            Complete
          </button>
        </div>
      </div>
    </div>
  );
}
