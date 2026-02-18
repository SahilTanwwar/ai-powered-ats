import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";

import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import Candidates from "./pages/Candidates";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/candidates" element={<Candidates />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;
