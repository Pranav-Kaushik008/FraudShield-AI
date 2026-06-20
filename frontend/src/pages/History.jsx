import { useState, useEffect } from "react";
import { getHistory } from "../services/api";
import { FaSearch, FaArrowUp, FaArrowDown, FaFileCsv, FaChevronLeft, FaChevronRight, FaFilter } from "react-icons/fa";

function History() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(1);
  
  // Filters
  const [predictionFilter, setPredictionFilter] = useState("all");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  
  // Sorting
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, [page, limit, predictionFilter, sortBy, sortOrder]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        sort_by: sortBy,
        sort_order: sortOrder
      };

      if (predictionFilter !== "all") {
        params.prediction = predictionFilter === "fraud" ? 1 : 0;
      }
      if (minAmount) params.min_amount = parseFloat(minAmount);
      if (maxAmount) params.max_amount = parseFloat(maxAmount);

      const response = await getHistory(params);
      setLogs(response.results || []);
      setTotal(response.total || 0);
      setPages(response.pages || 1);
    } catch (error) {
      console.error("Failed to fetch history logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    setPage(1);
    fetchLogs();
  };

  const handleClearFilters = () => {
    setPredictionFilter("all");
    setMinAmount("");
    setMaxAmount("");
    setPage(1);
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const exportToCSV = () => {
    if (logs.length === 0) return;
    const headers = ["ID", "Amount ($)", "Prediction", "Fraud Probability", "Created At"];
    const rows = logs.map(log => [
      log.id,
      log.amount,
      log.prediction === 1 ? "Fraud" : "Legitimate",
      `${(log.fraud_probability * 100).toFixed(2)}%`,
      new Date(log.created_at).toLocaleString()
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `FraudShield_Audit_History_Page_${page}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen p-8 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white transition-all duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Audit History
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Audit trail of all transaction classification queries.
          </p>
        </div>
        <button
          onClick={exportToCSV}
          disabled={logs.length === 0}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-lg transition duration-200 shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer text-sm disabled:opacity-50"
        >
          <FaFileCsv size={16} /> Export Page to CSV
        </button>
      </div>

      {/* Filter Sidebar / Form */}
      <form onSubmit={handleApplyFilters} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 mb-8 transition-all duration-300">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
          <FaFilter className="text-blue-500" /> Filter Logs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Status</label>
            <select
              value={predictionFilter}
              onChange={(e) => setPredictionFilter(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-sm"
            >
              <option value="all">All Predictions</option>
              <option value="fraud">Fraudulent</option>
              <option value="legit">Legitimate</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Min Amount ($)</label>
            <input
              type="number"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              placeholder="e.g. 50"
              className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Max Amount ($)</label>
            <input
              type="number"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              placeholder="e.g. 1000"
              className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-sm"
            />
          </div>
          <div className="flex items-end gap-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={handleClearFilters}
              className="flex-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold py-2.5 rounded-lg text-sm transition"
            >
              Clear
            </button>
          </div>
        </div>
      </form>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden transition-all duration-300">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-500">Querying transaction log audit trail...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            <p className="text-lg font-semibold">No transactions found</p>
            <p className="text-sm mt-1">Try adjusting your filters or upload some data.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 text-slate-400 text-sm font-semibold uppercase tracking-wider select-none">
                  <th className="py-4 px-6 cursor-pointer" onClick={() => toggleSort("id")}>
                    Log ID {sortBy === "id" && (sortOrder === "desc" ? <FaArrowDown className="inline ml-1" /> : <FaArrowUp className="inline ml-1" />)}
                  </th>
                  <th className="py-4 px-6 cursor-pointer" onClick={() => toggleSort("amount")}>
                    Amount {sortBy === "amount" && (sortOrder === "desc" ? <FaArrowDown className="inline ml-1" /> : <FaArrowUp className="inline ml-1" />)}
                  </th>
                  <th className="py-4 px-6 cursor-pointer" onClick={() => toggleSort("fraud_probability")}>
                    Probability {sortBy === "fraud_probability" && (sortOrder === "desc" ? <FaArrowDown className="inline ml-1" /> : <FaArrowUp className="inline ml-1" />)}
                  </th>
                  <th className="py-4 px-6 cursor-pointer" onClick={() => toggleSort("created_at")}>
                    Timestamp {sortBy === "created_at" && (sortOrder === "desc" ? <FaArrowDown className="inline ml-1" /> : <FaArrowUp className="inline ml-1" />)}
                  </th>
                  <th className="py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-slate-700 dark:text-slate-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition">
                    <td className="py-4 px-6 font-mono text-sm">#{log.id}</td>
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">${log.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                    <td className="py-4 px-6 font-semibold">{(log.fraud_probability * 100).toFixed(2)}%</td>
                    <td className="py-4 px-6 text-sm text-slate-500 dark:text-slate-400">{new Date(log.created_at).toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        log.prediction === 1
                          ? "bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400"
                          : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
                      }`}>
                        {log.prediction === 1 ? "Fraud" : "Legitimate"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination Panel */}
            <div className="flex justify-between items-center px-6 py-4 border-t border-slate-100 dark:border-slate-700 text-sm">
              <span className="text-slate-500 dark:text-slate-400">
                Showing page <span className="font-semibold text-slate-800 dark:text-white">{page}</span> of <span className="font-semibold text-slate-800 dark:text-white">{pages}</span> ({total} entries total)
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/50 disabled:opacity-40 transition cursor-pointer text-slate-700 dark:text-slate-200"
                >
                  <FaChevronLeft size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setPage(p => Math.min(p + 1, pages))}
                  disabled={page === pages}
                  className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/50 disabled:opacity-40 transition cursor-pointer text-slate-700 dark:text-slate-200"
                >
                  <FaChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
