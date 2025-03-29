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
	{ id: "game1", image: mapGame, path: "../../game1" },
	{ id: "game2", image: millionGame, path: "../../game2" },
	{ id: "game3", image: treasureGame, path: "../../game3" },
	{ id: "game4", image: differenceGame, path: "../../game4" },
	{ id: "game5", image: documentGame, path: "../../game5" },
	{ id: "game6", image: question, path: "../../game6" },
];

const Home = () => {
	const { t } = useTranslation();

	return (
		<div className="min-h-screen px-4 py-10 text-center bg-gradient-to-b from-blue-300 to-blue-500 ">
			<h1 className="text-5xl font-extrabold text-blue-800 mb-3 drop-shadow-sm">
				{t("app.title")}
			</h1>
			<p className=" text-lg text-gray-600 mb-12">{t("app.select_game")}</p>

			<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-40 max-w-9xl mx-auto px-6">
				{games.map((game) => (
					<Link
						key={game.id}
						to={game.path}
						className="rounded-2xl overflow-hidden shadow-lg hover:scale-[1.04] hover:shadow-2xl transition-transform duration-300 bg-white "
					>
						<div className="relative">
							<img
								src={game.image}
								alt={t(`games.${game.id}`)}
								className="w-full h-[280px] object-cover"
							/>
							<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white text-xl font-semibold px-4 py-3">
								{t(`games.${game.id}`)}
							</div>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};

export default Home;
