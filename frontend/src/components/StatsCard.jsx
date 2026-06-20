function StatsCard({ title, value }) {
  return (
    <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-2xl shadow-lg p-6 border border-slate-100 dark:border-slate-700 transition duration-300 hover:shadow-xl">
      <h3 className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">
        {title}
      </h3>
      <h1 className="text-4xl font-extrabold mt-3 text-slate-900 dark:text-white">
        {value}
      </h1>
    </div>
  );
}

export default StatsCard;