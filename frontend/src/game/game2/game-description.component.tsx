import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GameDescription from "../game-description/game-description";

export default function Description2() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const gameDescription = {
    title: "Truy tìm kho báu",
    description: "Trong trò chơi này, bạn sẽ lần theo các dấu vết để tìm kho báu được giấu kín.",
    gamePlay: [
      "Bấm vào các điểm trên bản đồ để khám phá thông tin.",
      "Nhấn bắt đầu để chơi.",
      "Tìm đúng địa điểm sau khi bản đồ thay đổi.",
      "Hoàn thành tất cả câu hỏi để chiến thắng!",
    ],
  };

  return <GameDescription gameId="2" gameDescription={gameDescription} />;
}
