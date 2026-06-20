import { useState, useEffect } from "react";
import StatsCard from "../components/StatsCard";
import FraudPieChart from "../components/FraudPieChart";
import RiskBarChart from "../components/RiskBarChart";
import RecentTransactions from "../components/RecentTransactions";
import { getDashboard, getFraudDistribution, getRecentTransactions, getDailyTrend } from "../services/api";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { FaShieldAlt, FaChartLine, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [distribution, setDistribution] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardStats, distData, recentTx, dailyTrend] = await Promise.all([
        getDashboard(),
        getFraudDistribution(),
        getRecentTransactions(5),
        getDailyTrend()
      ]);
      setStats(dashboardStats);
      setDistribution(distData);
      setTransactions(recentTx);
      setTrend(dailyTrend);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
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

  if (!stats) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-900 text-rose-500 font-bold text-xl">
        Error loading system dashboard. Please check API server.
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white transition-all duration-300">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <FaShieldAlt className="text-blue-600" /> FraudShield Hub
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Intrusion monitoring and real-time classification dashboard.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Transactions"
          value={stats.total_transactions.toLocaleString()}
        />
        <StatsCard
          title="Fraud Flagged"
          value={stats.fraud_transactions.toLocaleString()}
        />
        <StatsCard
          title="Fraud Incident Rate"
          value={`${stats.fraud_rate}%`}
        />
        <StatsCard
          title="Average Amount"
          value={`$${stats.average_amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <FraudPieChart data={distribution} />
        
        {/* Daily Prediction Trend Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 h-[400px] transition-all duration-300">
          <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
            <FaChartLine className="text-blue-500" /> Daily Prediction Trend
          </h2>
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:hidden" />
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" className="hidden dark:block" />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", color: "#fff", borderRadius: "8px" }} />
              <Area type="monotone" dataKey="total" name="Total Predictions" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTotal)" />
              <Area type="monotone" dataKey="fraud" name="Fraud Cases" stroke="#ef4444" fillOpacity={1} fill="url(#colorFraud)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8">
        <RecentTransactions transactions={transactions} />
      </div>
    </div>
  );
}

export default Dashboard;