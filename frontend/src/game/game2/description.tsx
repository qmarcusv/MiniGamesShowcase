import { useEffect, useState } from "react";
import Game from "./game.component";
import GameSetting from "./game-setting.component";

export default function Description2() {
  const [view, setView] = useState<"description" | "game" | "setting">("description");

  // Optional: add class to body to hide nav/footer when in game view
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
    <div className="h-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-10 max-w-3xl w-full text-center space-y-8">
        <h1 className="text-4xl font-extrabold text-blue-400 drop-shadow">Trò chơi 2: Câu hỏi</h1>

        <p className="text-lg text-slate-100 leading-relaxed">Trong trò chơi này, bạn sẽ trả lời các câu hỏi trắc nghiệm với thời gian giới hạn.</p>

        <div className="flex justify-center gap-6 flex-wrap">
          <button className="bg-white/20 text-white px-6 py-2 rounded-xl hover:bg-white/30 transition shadow-md" onClick={() => setView("setting")}>
            Cài đặt
          </button>
          <button className="bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600 transition shadow-md" onClick={() => setView("game")}>
            Bắt đầu chơi
          </button>
        </div>
      </div>
    </div>
  );
}
