import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Predict from "./pages/Predict";
import Analytics from "./pages/Analytics";
import History from "./pages/History";
import Explainability from "./pages/Explainability";

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-900 transition-all duration-300">
        {/* Sidebar Nav */}
        <Sidebar />

        {/* Content Panel */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Header Bar */}
          <Navbar />

          {/* Page Panel */}
          <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <Routes>
              <Route
                path="/"
                element={<Dashboard />}
              />
              <Route
                path="/predict"
                element={<Predict />}
              />
              <Route
                path="/analytics"
                element={<Analytics />}
              />
              <Route
                path="/history"
                element={<History />}
              />
              <Route
                path="/explainability"
                element={<Explainability />}
              />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;