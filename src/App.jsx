import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./components/Analytics/dashboard";
import Predictions from "./components/Dashboard/prediction";
import Home from "./components/Home/Home";
import Landing from "./components/Dashboard/Landing";
import Treasures from "./components/Dashboard/treasure";
import Savings from "./components/Dashboard/saving";
import Market from "./components/Markets/Market";
import AdminDashboard from './components/Admin/AdminDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import { Provider } from 'react-redux';
import { store } from './state/store';

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
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
            <Route path="/treasures" element={<Treasures />} />
            <Route path="/savings" element={<Savings />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
      </BrowserRouter>
    </Provider>
  );
};

export default App;