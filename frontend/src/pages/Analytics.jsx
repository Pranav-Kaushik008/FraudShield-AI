import { useState, useEffect } from "react";
import { getAnalytics, getFraudDistribution, getRecentTransactions } from "../services/api";
import FraudPieChart from "../components/FraudPieChart";
import RiskBarChart from "../components/RiskBarChart";
import ExportPDF from "../components/ExportPDF";

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [distribution, setDistribution] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [amountFilter, setAmountFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [analyticsData, distData, txData] = await Promise.all([
        getAnalytics(),
        getFraudDistribution(),
        getRecentTransactions(50)
      ]);
      setAnalytics(analyticsData);
      setDistribution(distData);
      setTransactions(txData);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-900 transition-all duration-300">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-900 text-red-500 dark:text-red-400 text-xl font-bold">
        Error loading analytics data.
      </div>
    );
  }

  // Filter transactions in memory based on selected filter
  const filteredTransactions = transactions.filter((tx) => {
    if (amountFilter === "high") return tx.amount > 1000;
    if (amountFilter === "medium") return tx.amount >= 100 && tx.amount <= 1000;
    if (amountFilter === "low") return tx.amount < 100;
    return true;
  });

  // Calculate dynamic stats based on filtered transactions
  const totalFiltered = filteredTransactions.length;
  const fraudFiltered = filteredTransactions.filter(tx => tx.prediction === 1).length;
  const legitFiltered = totalFiltered - fraudFiltered;
  const fraudRateFiltered = totalFiltered > 0 ? ((fraudFiltered / totalFiltered) * 100).toFixed(2) : 0;

  // Format data for RiskBarChart: group by amount ranges
  const riskRanges = [
    { feature: "< $100", impact: transactions.filter(t => t.amount < 100 && t.prediction === 1).length },
    { feature: "$100-$500", impact: transactions.filter(t => t.amount >= 100 && t.amount <= 500 && t.prediction === 1).length },
    { feature: "$500-$1000", impact: transactions.filter(t => t.amount > 500 && t.amount <= 1000 && t.prediction === 1).length },
    { feature: "> $1000", impact: transactions.filter(t => t.amount > 1000 && t.prediction === 1).length }
  ];

  return (
    <div className="min-h-screen p-8 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white transition-all duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Security & Analytics
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Real-time KPIs, fraud distribution analysis, and export tools.
          </p>
        </div>
        
        {/* PDF Export Utility */}
        <div className="flex gap-4 items-center">
          <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 shadow-sm">
            <span className="text-sm font-medium mr-2 text-slate-600 dark:text-slate-300">Filter Amount:</span>
            <select
              value={amountFilter}
              onChange={(e) => setAmountFilter(e.target.value)}
              className="bg-transparent text-sm focus:outline-none border-none text-slate-800 dark:text-white cursor-pointer font-semibold"
            >
              <option value="all">All Amounts</option>
              <option value="high">High (&gt; $1,000)</option>
              <option value="medium">Medium ($100 - $1,000)</option>
              <option value="low">Low (&lt; $100)</option>

            </select>
          </div>
          <ExportPDF stats={analytics} />
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 transition duration-300 hover:shadow-xl">
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">
            Total Analyzed
          </h3>
          <h1 className="text-4xl font-extrabold mt-3 text-slate-900 dark:text-white">
            {amountFilter === "all" ? analytics.total : totalFiltered}
          </h1>
          <p className="text-xs text-slate-400 mt-2">
            Predictions logged in database
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 transition duration-300 hover:shadow-xl">
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider text-rose-500 dark:text-rose-400">
            Fraud Incidents
          </h3>
          <h1 className="text-4xl font-extrabold mt-3 text-rose-600 dark:text-rose-500">
            {amountFilter === "all" ? analytics.fraud : fraudFiltered}
          </h1>
          <p className="text-xs text-rose-400 dark:text-rose-400 mt-2">
            Flagged suspicious activities
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 transition duration-300 hover:shadow-xl">
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider text-emerald-500 dark:text-emerald-400">
            Legitimate Transactions
          </h3>
          <h1 className="text-4xl font-extrabold mt-3 text-emerald-600 dark:text-emerald-500">
            {amountFilter === "all" ? analytics.legitimate : legitFiltered}
          </h1>
          <p className="text-xs text-emerald-400 dark:text-emerald-400 mt-2">
            Verified safe transfers
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 transition duration-300 hover:shadow-xl">
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider text-amber-500 dark:text-amber-400">
            Fraud Rate
          </h3>
          <h1 className="text-4xl font-extrabold mt-3 text-amber-600 dark:text-amber-500">
            {amountFilter === "all" ? analytics.fraud_rate : fraudRateFiltered}%
          </h1>
          <p className="text-xs text-amber-400 dark:text-amber-400 mt-2">
            Percentage of total cases
          </p>
        </div>
      </div>

      {/* Visual Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <FraudPieChart data={amountFilter === "all" ? distribution : [
          { name: "Legitimate", value: legitFiltered },
          { name: "Fraud", value: fraudFiltered }
        ]} />
        
        <RiskBarChart data={riskRanges} />
      </div>
    </div>
  );
}

export default Analytics;