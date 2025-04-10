import { createBrowserRouter } from "react-router-dom";
import App from "./app/app.component.tsx";
import Home from "./feature/home/home.component";
// import GameWrapper from "./feature/game-wrapper/game-wrapper.component.tsx";
import Leaderboard from "./feature/leaderboard/leaderboard.component.tsx";
import Description1 from "./game/game1/game-description.component";
import Description2 from "./game/game2/game-description.component";
import Description3 from "./game/game3/game-description.component";
import Description4 from "./game/game4/game-description.component";
import Description5 from "./game/game5/game-description.component";
import Description6 from "./game/game6/game-description.component";
import Description7 from "./game/game7/game-description.component";
import Description8 from "./game/game8/game-description.component";
import Description9 from "./game/game9/game-description.component";
import Description10 from "./game/game10/game-description.component";
import Game1 from "./game/game1/game.component";
import Game2 from "./game/game2/game.component";
import Game3 from "./game/game3/game.component";
import Game4 from "./game/game4/game.component";
import Game5 from "./game/game5/game.component";
import Game6 from "./game/game6/game.component";
import Game7 from "./game/game7/game.component";
import Game8 from "./game/game8/game.component";
import Game9 from "./game/game9/game.component";
import Game10 from "./game/game10/game.component";
import Treasure from "./game/treasure/treasure.component.tsx";
import Setting1 from "./game/game1/game-setting.component";
import Setting2 from "./game/game2/game-setting.component";
import Setting3 from "./game/game3/game-setting.component";
import Setting4 from "./game/game4/game-setting.component";
import Setting5 from "./game/game5/game-setting.component";
import Setting6 from "./game/game6/game-setting.component";
import Setting7 from "./game/game7/game-setting.component";
import Setting8 from "./game/game8/game-setting.component";
import Setting9 from "./game/game9/game-setting.component";
import Setting10 from "./game/game10/game-setting.component";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{ index: true, element: <Home /> },
			{ path: "game1", element: <Description1 /> },
			{
				path: "game1/game",
				element: (
					<div className="hide-navbar hide-footer">
						<Game1 />
					</div>
				),
			},
			{
				path: "game1/settings",
				element: (
					<div className="hide-navbar hide-footer">
						<Setting1 />
					</div>
				),
			},
			{ path: "game2", element: <Description2 /> },
			{
				path: "game2/game",
				element: (
					<div className="hide-navbar hide-footer">
						<Game2 />
					</div>
				),
			},
			{
				path: "game2/settings",
				element: (
					<div className="hide-navbar hide-footer">
						<Setting2 />
					</div>
				),
			},
			{ path: "game3", element: <Description3 /> },
			{
				path: "game3/game",
				element: (
					<div className="hide-navbar hide-footer">
						<Game3 />
					</div>
				),
			},
			{
				path: "game3/settings",
				element: (
					<div className="hide-navbar hide-footer">
						<Setting3 />
					</div>
				),
			},
			{ path: "game4", element: <Description4 /> },
			{
				path: "game4/game",
				element: (
					<div className="hide-navbar hide-footer">
						<Game4 />
					</div>
				),
			},
			{
				path: "game4/settings",
				element: (
					<div className="hide-navbar hide-footer">
						<Setting4 />
					</div>
				),
			},
			{ path: "game5", element: <Description5 /> },
			{
				path: "game5/game",
				element: (
					<div className="hide-navbar hide-footer">
						<Game5 />
					</div>
				),
			},
			{
				path: "game5/settings",
				element: (
					<div className="hide-navbar hide-footer">
						<Setting5 />
					</div>
				),
			},
			{ path: "game6", element: <Description6 /> },
			{
				path: "game6/game",
				element: (
					<div className="hide-navbar hide-footer">
						<Game6 gridSize="4x4" timer={60} />
					</div>
				),
			},
			{
				path: "game6/settings",
				element: (
					<div className="hide-navbar hide-footer">
						<Setting6
							gridSize="4x4"
							setGridSize={() => {}}
							timers={{ "4x4": 60, "6x6": 120 }}
							setTimers={() => {}}
						/>
					</div>
				),
			},
			{ path: "game7", element: <Description7 /> },
			{
				path: "game7/game",
				element: (
					<div className="hide-navbar hide-footer">
						<Game7 />
					</div>
				),
			},
			{
				path: "game7/settings",
				element: (
					<div className="hide-navbar hide-footer">
						<Setting7 />
					</div>
				),
			},
			{ path: "game8", element: <Description8 /> },
			{
				path: "game8/game",
				element: (
					<div className="hide-navbar hide-footer">
						<Game8 />
					</div>
				),
			},
			{
				path: "game8/settings",
				element: (
					<div className="hide-navbar hide-footer">
						<Setting8 />
					</div>
				),
			},
			{ path: "game9", element: <Description9 /> },
			{
				path: "game9/game",
				element: (
					<div className="hide-navbar hide-footer">
						<Game9 />
					</div>
				),
			},
			{
				path: "game9/settings",
				element: (
					<div className="hide-navbar hide-footer">
						<Setting9 />
					</div>
				),
			},
			{ path: "game10", element: <Description10 /> },
			{
				path: "game10/game",
				element: (
					<div className="hide-navbar hide-footer">
						<Game10 />
					</div>
				),
			},
			{
				path: "game10/settings",
				element: (
					<div className="hide-navbar hide-footer">
						<Setting10 />
					</div>
				),
			},
			{
				path: "treasure",
				element: (
					<div className="hide-navbar hide-footer">
						<Treasure />
					</div>
				),
			},
			// { path: "play", element: <GameWrapper /> },
			{ path: "leaderboard", element: <Leaderboard /> },
		],
	},
]);
