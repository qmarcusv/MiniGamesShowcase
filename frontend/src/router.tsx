import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import GameWrapper from "./pages/GameWrapper";
import Leaderboard from "./pages/Leaderboard";
import Description1 from "./games/game1/description";
import Description2 from "./games/game2/description";
import Description3 from "./games/game3/description";
import Description4 from "./games/game4/description";
import Description5 from "./games/game5/description";
import Description6 from "./games/game6/description";
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
			{ path: "play", element: <GameWrapper /> },
			{ path: "leaderboard", element: <Leaderboard /> },
		],
	},
]);
