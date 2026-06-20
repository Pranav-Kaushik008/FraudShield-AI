import { useLocation } from "react-router-dom";
import { FaCircle } from "react-icons/fa";

function Navbar() {
  const location = useLocation();
  
  const getPageTitle = (pathname) => {
    switch (pathname) {
      case "/":
        return "Dashboard Hub";
      case "/predict":
        return "Transaction Scanner";
      case "/analytics":
        return "Security Analytics";
      case "/history":
        return "Log Audit Trail";
      case "/explainability":
        return "SHAP Explainability";
      default:
        return "FraudShield AI";
    }
  };

  return (
    <nav className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 h-16 px-8 flex justify-between items-center transition-all duration-300 shrink-0 select-none">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-extrabold text-slate-800 dark:text-white">
          {getPageTitle(location.pathname)}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* API connection indicator */}
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm">
          <FaCircle className="text-emerald-500 animate-pulse text-[9px]" />
          <span className="text-slate-600 dark:text-slate-400">Shields Active</span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;