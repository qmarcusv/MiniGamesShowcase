import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import ButtonSound from "../../feature/button-sound/button-sound.component";
import "./game.component.scss";
import { FaHome, FaCog, FaPlay, FaMapMarkedAlt, FaCompass, FaHistory, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { vietnamLocations } from "./vietnam-locations";
import { Stepper } from "../../shared/component/stepper/stepper.component";

export default function Game4Description() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedLocation, setSelectedLocation] = useState(vietnamLocations[0]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSelectLocation = (location: (typeof vietnamLocations)[0]) => {
    setSelectedLocation(location);
    setShowDropdown(false);
  };

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
              <h1 className="text-3xl sm:text-3xl md:text-4xl font-pirate mb-4 md:mb-6 text-amber-800 text-shadow-medium tracking-wider uppercase text-center flex items-center justify-center gap-2">
                <FaHistory className="text-amber-700" />
                Trở về tương lai
                <FaCompass className="text-amber-700" />
              </h1>

              {/* Description */}
              <div className="mb-4 md:mb-6">
                <h2 className="text-xl sm:text-xl md:text-2xl font-pirate mb-2 md:mb-3 text-amber-900 text-shadow-light">
                  {t("description4.description")}
                </h2>
                <p className="text-base sm:text-base md:text-lg text-amber-950 leading-relaxed font-medium">
                  Trở về tương lai đưa bạn trở về quá khứ để khám phá những thay đổi đáng kinh ngạc tại các di tích và danh lam thắng cảnh Việt Nam.
                  So sánh bản đồ cổ và hiện đại để tìm ra những điểm khác biệt đã thay đổi theo dòng lịch sử.
                </p>
              </div>

              {/* Location Selection */}
              <div className="mb-4 md:mb-6 bg-amber-50/30 p-3 rounded-lg border border-amber-700/30">
                <h2 className="text-xl sm:text-xl md:text-2xl font-pirate mb-2 md:mb-3 text-amber-900 text-shadow-light flex items-center">
                  <FaMapMarkedAlt className="mr-2 text-amber-800" /> Chọn địa điểm
                </h2>

                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="w-full p-3 text-left bg-amber-100/70 hover:bg-amber-200/80 text-amber-900 rounded border border-amber-700/40 flex justify-between items-center transition-colors">
                    <span className="font-medium">{selectedLocation.name}</span>
                    {showDropdown ? <FaChevronUp /> : <FaChevronDown />}
                  </button>

                  {showDropdown && (
                    <div className="absolute z-20 w-full bg-amber-50 border border-amber-700/40 rounded-b shadow-lg max-h-48 overflow-y-auto">
                      {vietnamLocations.map((location) => (
                        <button
                          key={location.id}
                          onClick={() => handleSelectLocation(location)}
                          className={`w-full p-2 text-left hover:bg-amber-200/60 text-amber-900 transition-colors ${
                            selectedLocation.id === location.id ? "bg-amber-200/80 font-bold" : ""
                          }`}>
                          {location.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-3 p-2 bg-amber-100/50 rounded border border-amber-700/20">
                  <p className="italic text-amber-900">Khám phá những thay đổi tại {selectedLocation.name} qua nhiều thế kỷ</p>
                </div>
              </div>

              {/* Instructions */}
              <div className="mb-4 md:mb-6">
                <h2 className="text-xl sm:text-xl md:text-2xl font-pirate mb-2 md:mb-3 text-amber-900 text-shadow-light">
                  {t("description4.instructions")}
                </h2>
                <ol className="text-base sm:text-base md:text-lg space-y-1 md:space-y-2 text-amber-950 leading-relaxed list-decimal list-inside font-medium">
                  <li>So sánh hai bản đồ để tìm điểm khác biệt</li>
                  <li>Nhấp vào điểm khác biệt để đánh dấu</li>
                  <li>Tìm càng nhanh càng tốt trước khi hết thời gian</li>
                  <li>Khám phá tất cả điểm khác biệt để giành chiến thắng</li>
                </ol>
              </div>
            </div>

            {/* Khoảng cách giữa nội dung và nút - responsive */}
            <div className="flex-grow max-h-[20vh]"></div>

            {/* Khung xanh - phần buttons - responsive */}
            <Stepper gameId="4" />
          </div>
        </div>
      </div>
    </div>
  );
}
