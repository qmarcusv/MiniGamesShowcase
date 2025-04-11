import "./stepper.component.scss";
import { FaHome, FaCog, FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ButtonSound from "../../../feature/button-sound/button-sound.component";
import { useGameContext } from "../../context/game.hook";
import { Button } from "../../ui/button/button";

export const Stepper: React.FC<{ gameId: string }> = ({ gameId }) => {
  const navigate = useNavigate();
  const { games } = useGameContext();

  const currentGameId = parseInt(gameId, 10);

  if (isNaN(currentGameId)) return null;
  const navButtonClass =
    "w-16 h-16 sm:w-20 sm:h-20 bg-amber-700 hover:bg-amber-800 text-amber-50 rounded-xl transition-all duration-300 shadow-xl border-2 border-amber-600 hover:scale-110 flex items-center justify-center";

  return (
    <div className="stepper fixed bottom-8 p-4 w-full flex justify-between items-center rounded">
      {currentGameId > 1 ? (
        <button onClick={() => navigate(`/game${currentGameId - 1}`)} className={navButtonClass}>
          ←
        </button>
      ) : (
        <div className={navButtonClass}></div>
      )}

      <div className="flex gap-2">
        <ButtonSound onClick={() => navigate("/")} className={navButtonClass}>
          <FaHome size={24} />
        </ButtonSound>

        <ButtonSound onClick={() => navigate(`/game${currentGameId}/settings`)} className={navButtonClass}>
          <FaCog size={24} />
        </ButtonSound>

        <ButtonSound onClick={() => navigate(`/game${currentGameId}/game`)} className={navButtonClass}>
          <FaPlay size={24} />
        </ButtonSound>
      </div>

      {currentGameId < games.length - 1 ? (
        <button onClick={() => navigate(`/game${currentGameId + 1}`)} className={navButtonClass}>
          →
        </button>
      ) : (
        <div className={navButtonClass}></div>
      )}
    </div>
  );
};
