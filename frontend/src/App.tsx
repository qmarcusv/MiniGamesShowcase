import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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
