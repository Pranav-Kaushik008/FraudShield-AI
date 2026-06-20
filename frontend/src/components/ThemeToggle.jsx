import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

function ThemeToggle() {

  const {
    darkMode,
    toggleTheme
  } = useContext(ThemeContext);

  return (

    <button

      onClick={toggleTheme}

      className="px-4 py-2 rounded-lg bg-slate-700 text-white"

    >

      {darkMode ? "☀️ Light" : "🌙 Dark"}

    </button>

  );

}

export default ThemeToggle;