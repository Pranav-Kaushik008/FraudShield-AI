import { NavLink } from "react-router-dom";
import { FaShieldAlt, FaChartPie, FaChartLine, FaHistory, FaBrain, FaSun, FaMoon } from "react-icons/fa";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

function Sidebar() {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  const menuItems = [
    { path: "/", label: "Dashboard", icon: <FaChartPie size={18} /> },
    { path: "/predict", label: "Predict Fraud", icon: <FaShieldAlt size={18} /> },
    { path: "/analytics", label: "Analytics", icon: <FaChartLine size={18} /> },
    { path: "/history", label: "Audit History", icon: <FaHistory size={18} /> },
    { path: "/explainability", label: "Explainability", icon: <FaBrain size={18} /> },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen flex flex-col justify-between border-r border-slate-800 shrink-0 select-none">
      <div>
        <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-800">
          <FaShieldAlt className="text-blue-500 animate-pulse" size={24} />
          <span className="font-black text-base tracking-wider bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            FRAUDSHIELD AI
          </span>
        </div>
        <nav className="p-4 flex flex-col gap-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl font-semibold transition-all duration-200 text-sm ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800/85">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition duration-200 text-slate-300 font-semibold text-sm cursor-pointer"
        >
          <span className="flex items-center gap-3">
            {darkMode ? <FaSun className="text-amber-400" /> : <FaMoon className="text-indigo-400" />}
            <span>{darkMode ? "Light Theme" : "Dark Theme"}</span>
          </span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
