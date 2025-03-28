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
      // { path: "play", element: <GameWrapper /> },
      { path: "leaderboard", element: <Leaderboard /> },
    ],
  },
]);
