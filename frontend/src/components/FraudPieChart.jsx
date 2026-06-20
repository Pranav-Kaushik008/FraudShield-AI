import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

function FraudPieChart({ data }) {
  const defaultData = [
    {
      name: "Legitimate",
      value: 284315
    },
    {
      name: "Fraud",
      value: 492
    }
  ];

  const chartData = data || defaultData;

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg h-[400px] transition-all duration-300">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
        Fraud Distribution
      </h2>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            outerRadius={100}
            label
          >
            <Cell fill="#10b981"/>
            <Cell fill="#ef4444"/>
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: "#1e293b", color: "#fff", borderRadius: "8px" }} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default FraudPieChart;