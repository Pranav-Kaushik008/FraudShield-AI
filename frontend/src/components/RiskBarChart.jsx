import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

function RiskBarChart({ data }) {
  const defaultData = [
    {
      feature: "V14",
      impact: 4.2
    },
    {
      feature: "V10",
      impact: 3.8
    },
    {
      feature: "V12",
      impact: 3.1
    },
    {
      feature: "V17",
      impact: 2.7
    },
    {
      feature: "Amount",
      impact: 1.2
    }
  ];

  const chartData = data || defaultData;

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg h-[400px] transition-all duration-300">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
        Top Risk Features
      </h2>
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:hidden" />
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" className="hidden dark:block" />
          <XAxis dataKey="feature" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip contentStyle={{ backgroundColor: "#1e293b", color: "#fff", borderRadius: "8px" }} />
          <Bar
            dataKey="impact"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RiskBarChart;