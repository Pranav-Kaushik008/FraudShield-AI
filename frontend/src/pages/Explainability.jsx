import { useState } from "react";
import { explainPrediction } from "../services/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { FaBrain, FaRegLightbulb, FaInfoCircle } from "react-icons/fa";

const sampleTransactions = [
  {
    name: "Standard Legitimate Transaction ($14.95)",
    Time: 0,
    V1: -1.359807, V2: -0.072781, V3: 2.536346, V4: 1.378155, V5: -0.338321, V6: 0.462388,
    V7: 0.239599, V8: 0.098698, V9: 0.363787, V10: 0.090794, V11: -0.5516, V12: -0.617801,
    V13: -0.99139, V14: -0.311169, V15: 1.468177, V16: -0.470401, V17: 0.207971, V18: 0.025791,
    V19: 0.403993, V20: 0.251412, V21: -0.018307, V22: 0.277838, V23: -0.110474, V24: 0.066928,
    V25: 0.128539, V26: -0.189115, V27: 0.133558, V28: -0.021053, Amount: 14.95
  },
  {
    name: "High-Risk Suspicious Wire ($3,450.00)",
    Time: 8500,
    V1: -2.311269, V2: 1.956782, V3: -4.512634, V4: 3.821456, V5: -1.823901, V6: -0.956234,
    V7: -3.856902, V8: 1.256890, V9: -2.124567, V10: -4.856234, V11: 3.256123, V12: -5.124567,
    V13: 0.856234, V14: -6.856234, V15: -0.256123, V16: -4.512367, V17: -7.856123, V18: -2.856123,
    V19: 1.256890, V20: 0.856234, V21: 1.256890, V22: -0.451236, V23: -0.356123, V24: -0.156123,
    V25: 0.356123, V26: 0.451236, V27: 0.856234, V28: 0.256123, Amount: 3450.00
  },
  {
    name: "Mid-Value Safe Transfer ($125.00)",
    Time: 12000,
    V1: 0.951236, V2: -0.256123, V3: 0.856234, V4: 0.451236, V5: -0.356123, V6: 0.156123,
    V7: -0.156123, V8: 0.056123, V9: 0.256123, V10: -0.156123, V11: -0.856234, V12: 0.256123,
    V13: 0.656123, V14: -0.056123, V15: 0.856234, V16: 0.356123, V17: -0.256123, V18: -0.156123,
    V19: -0.056123, V20: 0.056123, V21: -0.056123, V22: -0.156123, V23: 0.056123, V24: 0.156123,
    V25: 0.256123, V26: -0.356123, V27: 0.056123, V28: 0.025612, Amount: 125.00
  }
];

function Explainability() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [amount, setAmount] = useState(sampleTransactions[0].Amount.toString());
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState(null);

  const handleSelectSample = (idx) => {
    setSelectedIdx(idx);
    setAmount(sampleTransactions[idx].Amount.toString());
    setExplanation(null);
  };

  const handleGenerateExplanation = async () => {
    try {
      setLoading(true);
      const basePayload = sampleTransactions[selectedIdx];
      const payload = {
        ...basePayload,
        Amount: parseFloat(amount) || 0
      };
      
      // Delete the non-feature name field used for list label
      delete payload.name;

      const data = await explainPrediction(payload);
      setExplanation(data);
    } catch (error) {
      console.error("SHAP explain API call failed:", error);
      alert("Failed to compute explainability values");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white transition-all duration-300">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
          <FaBrain className="text-indigo-600 dark:text-indigo-400" /> Explainable AI (SHAP)
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Understand why the machine learning model classifies a transaction as fraud or legitimate using SHAP value attribution.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 flex flex-col gap-6 transition duration-300">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FaRegLightbulb className="text-indigo-500" /> Choose Input
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Select Template</label>
            <select
              value={selectedIdx}
              onChange={(e) => handleSelectSample(parseInt(e.target.value))}
              className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-sm"
            >
              {sampleTransactions.map((sample, idx) => (
                <option key={idx} value={idx}>{sample.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Transaction Amount ($)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-sm font-semibold"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400 flex gap-2">
            <FaInfoCircle size={18} className="text-indigo-500 shrink-0 mt-0.5" />
            <p>
              This explanation runs TreeSHAP on the XGBoost classifier. The 28 PCA-reduced features (V1-V28) will be loaded from the selected template, with your custom Amount.
            </p>
          </div>

          <button
            onClick={handleGenerateExplanation}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg text-sm transition shadow-md disabled:opacity-50"
          >
            {loading ? "Calculating SHAP..." : "Generate AI Explanation"}
          </button>
        </div>

        {/* Output Visualization */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 transition duration-300">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-full min-h-[350px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-slate-500 dark:text-slate-400 text-sm">Calculating feature importance coefficients...</p>
            </div>
          ) : !explanation ? (
            <div className="flex flex-col justify-center items-center h-full min-h-[350px] text-slate-400 dark:text-slate-500 text-center">
              <FaBrain size={64} className="mb-4 text-slate-300 dark:text-slate-700" />
              <p className="text-lg font-semibold">Ready to Analyze</p>
              <p className="text-sm mt-1">Select a template on the left and trigger the explainability engine.</p>
            </div>
          ) : (
            <div className="flex flex-col h-full justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">SHAP Values Attribution</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  Below are the top 5 features driving the classifier's output. Larger impact scores mean that specific feature heavily influenced the final decision.
                </p>
                
                {/* Recharts Horizontal Bar Chart */}
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={explanation}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis type="number" stroke="#64748b" />
                      <YAxis dataKey="feature" type="category" stroke="#64748b" width={80} />
                      <Tooltip contentStyle={{ backgroundColor: "#1e293b", color: "#fff", borderRadius: "8px" }} />
                      <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
                        {explanation.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.feature === "Amount" || entry.feature === "V14" ? "#ef4444" : "#6366f1"} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Explainer analysis text block */}
              <div className="mt-6 p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">AI Interpretation</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Feature <span className="font-semibold text-indigo-600 dark:text-indigo-400">{explanation[0]?.feature}</span> exerted the strongest leverage on this prediction with an impact coefficient of <span className="font-bold">{explanation[0]?.impact}</span>. In card transaction fraud networks, anomalies in this component indicate high deviation from standard client behavior.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Explainability;
