import "./navbar.component.scss";

import { Link } from "react-router-dom";
import LanguageSwitcher from "../language/language-switcher.component";

const Navbar = () => {
  return (
    <nav className="navbar w-full bg-gradient-to-r from-purple-500 to-blue-500 shadow-md px-6 py-3 text-white flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold tracking-wide flex items-center gap-2">
        🎮 <span>Mini Games</span>
      </Link>
      <LanguageSwitcher />
    </nav>
  );
};

export default Navbar;
