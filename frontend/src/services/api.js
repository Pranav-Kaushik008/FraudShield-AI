import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

export const predictFraud = async (data) => {
  const response = await API.post("/predict", data);
  return response.data;
};

export const getDashboard = async () => {
  const response = await API.get("/dashboard");
  return response.data;
};

export const getHistory = async (params = {}) => {
  const response = await API.get("/history", { params });
  return response.data;
};

export const getFraudDistribution = async () => {
  const response = await API.get("/fraud-distribution");
  return response.data;
};

export const getRecentTransactions = async (limit = 10) => {
  const response = await API.get(`/recent-transactions?limit=${limit}`);
  return response.data;
};

export const getDailyTrend = async () => {
  const response = await API.get("/daily-trend");
  return response.data;
};

export const getAnalytics = async () => {
  const response = await API.get("/analytics");
  return response.data;
};

export const explainPrediction = async (data) => {
  const response = await API.post("/explain", data);
  return response.data;
};

export const uploadCSV = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await API.post("/upload-csv", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export default API;