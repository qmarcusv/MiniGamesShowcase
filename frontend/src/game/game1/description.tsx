import { useState } from "react";
import Game1 from "./game.component";
import Game1Setting from "./game-setting.component";
import ButtonSound from "../../feature/button-sound/button-sound.component";
import { useTranslation } from "react-i18next";

export default function Description1() {
  const [view, setView] = useState<"description" | "game" | "setting">("description");
  const { t } = useTranslation();

  if (view === "game") return <Game1 />;
  if (view === "setting") return <Game1Setting />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-10 max-w-3xl w-full text-center space-y-8">
        <h1 className="text-4xl font-extrabold text-emerald-400 drop-shadow">{t("games.game1")}</h1>

        <p className="text-lg text-slate-100 leading-relaxed whitespace-pre-line">{t("description1.instructions")}</p>

        <div className="flex justify-center gap-4 flex-wrap">
          <ButtonSound
            soundUrl="/sounds/press.mp3"
            onClick={() => setView("setting")}
            className="bg-white/20 text-white px-6 py-2 rounded-xl hover:bg-white/30 transition shadow-md">
            {t("description1.setting")}
          </ButtonSound>

          <ButtonSound
            soundUrl="/sounds/press.mp3"
            onClick={() => setView("game")}
            className="bg-emerald-500 text-white px-6 py-2 rounded-xl hover:bg-emerald-600 transition shadow-md">
            {t("description1.start")}
          </ButtonSound>
        </div>
      </div>
    </div>
  );
}
