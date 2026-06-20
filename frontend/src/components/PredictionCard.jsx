import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

function PredictionCard({ result }) {
  if (!result) return null;

  const isFraud = result.prediction === 1;
  const probabilityPct = (result.fraud_probability * 100).toFixed(2);

  return (
    <div
      className={`mt-8 p-8 rounded-2xl shadow-lg border backdrop-blur-sm transition-all duration-500 ${
        isFraud
          ? "bg-rose-50/70 dark:bg-rose-950/10 border-rose-200 dark:border-rose-900/50 text-rose-950 dark:text-rose-200"
          : "bg-emerald-50/70 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/50 text-emerald-950 dark:text-emerald-200"
      }`}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            AI Classification Analysis
          </h2>
          <div className="flex items-center gap-3 text-lg font-semibold mt-1">
            <span>Result Status:</span>
            {isFraud ? (
              <span className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-extrabold animate-pulse">
                <FaExclamationTriangle /> High Risk (Fraud Flagged)
              </span>
            ) : (
              <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold">
                <FaCheckCircle /> Verified Legitimate
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end shrink-0">
          <span className="text-xs uppercase font-bold text-slate-400">
            Confidence Score
          </span>
          <span className="text-3xl font-black flex items-center gap-1 mt-1">
            {probabilityPct}
            <span className="text-lg font-normal text-slate-400">%</span>
          </span>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
          <span>SAFE ZONE</span>
          <span>SUSPICIOUS ZONE</span>
        </div>
        {/* Visual Probability Bar with smooth glow and gradient */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden shadow-inner relative">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out shadow-lg ${
              isFraud
                ? "bg-gradient-to-r from-orange-500 to-rose-600 shadow-rose-500/20"
                : "bg-gradient-to-r from-teal-400 to-emerald-500 shadow-emerald-500/20"
            }`}
            style={{ width: `${probabilityPct}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default PredictionCard;
