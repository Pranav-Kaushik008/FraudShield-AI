import { FaHistory, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

function RecentTransactions({ transactions }) {
  const defaultData = [
    {
      id: 1,
      amount: 149.62,
      probability: 0.01,
      status: "Legitimate",
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      amount: 2399.00,
      probability: 0.95,
      status: "Fraud",
      created_at: new Date().toISOString()
    }
  ];

  const list = transactions || defaultData;

  const getStatusLabel = (item) => {
    if (item.status !== undefined) return item.status;
    return item.prediction === 1 ? "Fraud" : "Legitimate";
  };

  const getProbability = (item) => {
    const prob = item.probability !== undefined ? item.probability : item.fraud_probability;
    return (prob * 100).toFixed(1) + "%";
  };

  const getFormattedDate = (item) => {
    if (!item.created_at) return "N/A";
    return new Date(item.created_at).toLocaleString();
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 transition duration-300">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
        <FaHistory className="text-blue-500" /> Recent Predictions
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-700 text-slate-400 text-sm font-semibold uppercase tracking-wider">
              <th className="py-3 px-4">Transaction ID</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Risk Probability</th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-slate-700 dark:text-slate-200">
            {list.map((item) => {
              const status = getStatusLabel(item);
              const isFraud = status === "Fraud" || status === "Fraudulent";
              return (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition duration-150">
                  <td className="py-4 px-4 font-mono text-sm text-slate-500 dark:text-slate-400">#{item.id}</td>
                  <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">${Number(item.amount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  <td className="py-4 px-4 font-semibold">{getProbability(item)}</td>
                  <td className="py-4 px-4 text-sm text-slate-500 dark:text-slate-400">{getFormattedDate(item)}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      isFraud 
                        ? "bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400" 
                        : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
                    }`}>
                      {isFraud ? <FaExclamationTriangle /> : <FaCheckCircle />}
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentTransactions;