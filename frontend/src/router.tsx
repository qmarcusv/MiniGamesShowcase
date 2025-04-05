import { createBrowserRouter } from "react-router-dom";
import App from "./app/app.component.tsx";
import Home from "./feature/home/home.component";
// import GameWrapper from "./feature/game-wrapper/game-wrapper.component.tsx";
import Leaderboard from "./feature/leaderboard/leaderboard.component.tsx";
import Description1 from "./game/game1/description";
import Description2 from "./game/game2/description";
import Description3 from "./game/game3/description";
import Description4 from "./game/game4/description";
import Description5 from "./game/game5/description";
import Description6 from "./game/game6/description";
import Description7 from "./game/game7/description";
import Description8 from "./game/game8/description";
import Description9 from "./game/game9/description";
import Description10 from "./game/game10/description";
import Treasure from "./game/treasure/treasure.component.tsx";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{ index: true, element: <Home /> },
			{ path: "game1", element: <Description1 /> },
			{ path: "game2", element: <Description2 /> },
			{ path: "game3", element: <Description3 /> },
			{ path: "game4", element: <Description4 /> },
			{ path: "game5", element: <Description5 /> },
			{ path: "game6", element: <Description6 /> },
			{ path: "game7", element: <Description7 /> },
			{ path: "game8", element: <Description8 /> },
			{ path: "game9", element: <Description9 /> },
			{ path: "game10", element: <Description10 /> },
			{ path: "treasure", element: <Treasure /> },
			// { path: "play", element: <GameWrapper /> },
			{ path: "leaderboard", element: <Leaderboard /> },
		],
	},
]);
