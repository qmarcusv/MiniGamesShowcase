import "./app.component.scss";

import { Outlet } from "react-router-dom";
import Navbar from "../shared/component/navbar/navbar.component";
import Footer from "../shared/component/footer/footer.component";
// import Navigator from "../shared/navigator/navigator.component";

function App() {
  return (
    <div className="app min-h-screen flex flex-col bg-gray-600">
      <Navbar />
      <main className="flex-grow">
        {/* <Navigator /> */}
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default App;
