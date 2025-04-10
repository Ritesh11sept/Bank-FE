import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useMemo } from "react";
import Dashboard from "./components/scenes/Analytics/dashboard";
import Predictions from "./components/Dashboard/prediction";
import Home from "./components/Home/Home";
import Landing from "./components/Dashboard/Landing";
import Insights from "./components/Dashboard/insights";
import Treasures from "./components/Dashboard/treasure";
import Savings from "./components/Dashboard/saving";
import ReduxProvider from "./components/ReduxProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import Market from "./components/Markets/Market";

const AppContent = () => {
  return (
    <main className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/markets" element={<Market />} />
        <Route path="/dashboard" element={
          <ErrorBoundary>
            <Dashboard />
          </ErrorBoundary>
        } />
        <Route path="/predictions" element={<Predictions />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/treasures" element={<Treasures />} />
        <Route path="/savings" element={<Savings />} />
      </Routes>
    </main>
  );
};

function App() {
  return (
    <ReduxProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ReduxProvider>
  );
}

export default App;
