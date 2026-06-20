function LoadingSpinner({ message = "Processing..." }) {
  return (
    <div className="flex flex-col justify-center items-center p-8 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl transition-all duration-300">
      <div className="relative flex items-center justify-center h-16 w-16">
        {/* Outer glowing pulsing ring */}
        <div className="absolute animate-ping h-8 w-8 rounded-full bg-blue-500/30 opacity-75"></div>
        {/* Inner rotating gradient spinner */}
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-r-2 border-transparent border-t-blue-600 border-r-indigo-500"></div>
      </div>
      <p className="mt-4 text-slate-600 dark:text-slate-300 font-bold text-sm tracking-wide animate-pulse">
        {message}
      </p>
    </div>
  );
}

export default LoadingSpinner;
