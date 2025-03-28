import "./home.component.scss";

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import mapGame from "../../assets/images/map-game.jpg";
import millionGame from "../../assets/images/million-game.jpg";
import treasureGame from "../../assets/images/treasure-game.jpg";
import differenceGame from "../../assets/images/difference-game.jpg";
import documentGame from "../../assets/images/document-game.png";
import question from "../../assets/images/question.png";

const games = [
  {
    id: "game1",
    image: mapGame,
    path: "../../game1",
  },
  {
    id: "game2",
    image: millionGame,
    path: "../../game2",
  },
  {
    id: "game3",
    image: treasureGame,
    path: "../../game3",
  },
  {
    id: "game4",
    image: differenceGame,
    path: "../../game4",
  },
  {
    id: "game5",
    image: documentGame,
    path: "../../game5",
  },
  {
    id: "game6",
    image: question,
    path: "../../game6",
  },
  // Add more games here later
];

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6 text-center">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-2">{t("app.title")}</h1>
      <p className="text-lg text-gray-300 mb-8">{t("app.select_game")}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {games.map((game) => (
          <Link key={game.id} to={game.path} className="bg-white rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform">
            <img src={game.image} alt={t(`games.${game.id}`)} className="w-full h-48 object-cover" />
            <div className="p-4 font-bold text-lg text-gray-800">{t(`games.${game.id}`)}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
