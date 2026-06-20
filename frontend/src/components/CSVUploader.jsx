import { useState } from "react";
import { uploadCSV } from "../services/api";
import { FaCloudUploadAlt, FaFileCsv, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

function CSVUploader() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Choose a CSV file first");
      return;
    }

    try {
      setLoading(true);
      const response = await uploadCSV(file);
      setResult(response);
    } catch (error) {
      console.error("CSV Upload failed:", error);
      alert("Failed to analyze CSV. Ensure columns match standard transaction features.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 transition-all duration-300">
      <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
        <FaFileCsv className="text-blue-500" /> Batch CSV Analysis
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Upload a transaction log to run batch predictions and log results to the database.
      </p>

      {/* Styled upload zone */}
      <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center bg-slate-50 dark:bg-slate-900 hover:border-blue-500 dark:hover:border-blue-400 transition duration-200">
        <input
          type="file"
          accept=".csv"
          id="file-upload"
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-3">
          <FaCloudUploadAlt size={48} className="text-slate-400 dark:text-slate-500" />
          <span className="text-slate-700 dark:text-slate-300 font-semibold">
            {file ? file.name : "Click to select CSV File"}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Accepts transaction tables with Time, V1-V28, and Amount
          </span>
        </label>
      </div>

      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Analyzing Upload..." : "Upload & Analyze Table"}
      </button>

      {result && (
        <div className="mt-6 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 transition-all">
          <h4 className="text-md font-bold mb-3 text-slate-900 dark:text-white flex items-center gap-2">
            <FaCheckCircle className="text-emerald-500" /> Batch Result Summary
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
              <span className="text-xs text-slate-400 uppercase font-bold">Total Rows</span>
              <p className="text-xl font-bold mt-1 text-slate-800 dark:text-white">{result.total_rows}</p>
            </div>
            <div className={`p-3 rounded-lg shadow-sm border ${
              result.fraud_count > 0 
                ? "bg-rose-50/50 dark:bg-rose-950/10 border-rose-100 dark:border-rose-900/50" 
                : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700"
            }`}>
              <span className={`text-xs uppercase font-bold ${result.fraud_count > 0 ? "text-rose-500" : "text-slate-400"}`}>
                Fraud Detected
              </span>
              <p className={`text-xl font-bold mt-1 ${result.fraud_count > 0 ? "text-rose-600 dark:text-rose-400" : "text-slate-800 dark:text-white"}`}>
                {result.fraud_count}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CSVUploader;