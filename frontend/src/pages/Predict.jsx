import { useState } from "react";

import { predictFraud } from "../services/api";

import CSVUploader from "../components/CSVUploader";

import PredictionCard from "../components/PredictionCard";

function Predict() {

  const [amount, setAmount] = useState("");

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {

    try {

      setLoading(true);

      const payload = {

        Time: 0,

        V1: -1.359807,

        V2: -0.072781,

        V3: 2.536346,

        V4: 1.378155,

        V5: -0.338321,

        V6: 0.462388,

        V7: 0.239599,

        V8: 0.098698,

        V9: 0.363787,

        V10: 0.090794,

        V11: -0.5516,

        V12: -0.617801,

        V13: -0.99139,

        V14: -0.311169,

        V15: 1.468177,

        V16: -0.470401,

        V17: 0.207971,

        V18: 0.025791,

        V19: 0.403993,

        V20: 0.251412,

        V21: -0.018307,

        V22: 0.277838,

        V23: -0.110474,

        V24: 0.066928,

        V25: 0.128539,

        V26: -0.189115,

        V27: 0.133558,

        V28: -0.021053,

        Amount: Number(amount)

      };

      const response = await predictFraud(payload);

      setResult(response);

    }

    catch(error){

      console.log(error);

      alert("Prediction failed");

    }

    finally{

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen p-8 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white transition-all duration-300">
      <h1 className="text-4xl font-bold mb-8 text-slate-900 dark:text-white">
        Predict Fraud
      </h1>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 transition duration-300">
        <label className="block mb-2 text-lg font-semibold text-slate-700 dark:text-slate-200">
          Transaction Amount ($)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter transaction amount (e.g. 149.62)"
          className="border border-slate-200 dark:border-slate-700 p-3 w-full rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          onClick={handlePredict}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
          disabled={loading || !amount}
        >
          {loading ? "Predicting..." : "Run Analysis"}
        </button>
      </div>

      <div className="mt-8">
        <CSVUploader />
      </div>


      <PredictionCard result={result} />
    </div>
  );
}

export default Predict;