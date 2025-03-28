import "./app.component.scss";

import { Outlet } from "react-router-dom";
import Navbar from "../shared/navbar/navbar.component";
import Footer from "../shared/footer/footer.component";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-600">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
