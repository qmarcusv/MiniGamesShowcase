import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ButtonSound from "../../feature/button-sound/button-sound.component";
import "./game.component.scss";
import { FaHome, FaCog, FaPlay } from "react-icons/fa";
import { Stepper } from "../../shared/component/stepper/stepper.component";

export default function Description3() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-[url('/game/image/description/game.png')] bg-cover bg-center">
      <div className="relative z-10 w-full max-w-[85rem] mx-4">
        {/* Khung đen - toàn bộ scroll */}
        <div className="relative">
          <img
            src="/game/image/description/scroll.png"
            alt="Scroll background"
            className="w-full object-cover min-h-[65vh] sm:min-h-[75vh] md:min-h-[85vh] lg:min-h-[92vh] max-h-[92vh]"
          />
          <div className="absolute inset-0 flex flex-col items-center">
            {/* Phần trống phía trên - responsive */}
            <div className="h-[15%] sm:h-[18%] md:h-[20%] lg:h-[25%]"></div>

            {/* Khung đỏ - phần nội dung - responsive */}
            <div className="w-[85%] sm:w-[80%] md:w-[75%] lg:w-[70%] max-h-[60%] sm:max-h-[58%] md:max-h-[55%] overflow-auto p-4 sm:p-5 md:p-6 rounded">
              {/* Title */}
              <h1 className="text-3xl sm:text-3xl md:text-4xl font-pirate mb-4 md:mb-6 text-amber-800 text-shadow-medium tracking-wider uppercase text-center">
                {t("description3.title")}
              </h1>

              {/* Description */}
              <div className="mb-4 md:mb-6">
                <h2 className="text-xl sm:text-xl md:text-2xl font-pirate mb-2 md:mb-3 text-amber-900 text-shadow-light">
                  {t("description3.description")}
                </h2>
                <p className="text-base sm:text-base md:text-lg text-amber-950 leading-relaxed font-medium">
                  {t("description3.description_content")}
                </p>
              </div>

              {/* Instructions */}
              <div className="mb-4 md:mb-6">
                <h2 className="text-xl sm:text-xl md:text-2xl font-pirate mb-2 md:mb-3 text-amber-900 text-shadow-light">
                  {t("description3.instructions")}
                </h2>
                <ol className="text-base sm:text-base md:text-lg space-y-1 md:space-y-2 text-amber-950 leading-relaxed list-decimal list-inside font-medium">
                  <li>{t("description3.instruction1")}</li>
                  <li>{t("description3.instruction2")}</li>
                  <li>{t("description3.instruction3")}</li>
                  <li>{t("description3.instruction4")}</li>
                </ol>
              </div>
            </div>

            {/* Khoảng cách giữa nội dung và nút - responsive */}
            <div className="flex-grow max-h-[20vh]"></div>

            {/* Khung xanh - phần buttons - responsive */}
            <Stepper gameId="3" />
          </div>
        </div>
      </div>
    </div>
  );
}
