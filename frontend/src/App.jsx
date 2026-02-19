import { Suspense, lazy, useEffect, useRef } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { useToast } from "./context/ToastContext";

const ProtectedRoute = lazy(() => import("./auth/ProtectedRoute"));
const Login = lazy(() => import("./pages/Auth").then((m) => ({ default: m.Login })));
const Register = lazy(() => import("./pages/Auth").then((m) => ({ default: m.Register })));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Jobs = lazy(() => import("./pages/Jobs"));
const JobDetails = lazy(() => import("./pages/JobDetails"));
const Candidates = lazy(() => import("./pages/Candidates"));
const CandidateDetails = lazy(() => import("./pages/CandidateDetails"));
const Settings = lazy(() => import("./pages/Misc").then((m) => ({ default: m.Settings })));
const NotFound = lazy(() => import("./pages/Misc").then((m) => ({ default: m.NotFound })));

function RouteFallback() {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--bg)" }}>
      <div className="spinner" aria-label="Loading" />
    </div>
  );
}

function SessionWatcher() {
  const { isAuthed } = useAuth();
  const { info } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const prevAuthed = useRef(isAuthed);

  useEffect(() => {
    const dropped = prevAuthed.current && !isAuthed;
    if (dropped && location.pathname !== "/login") {
      info("Session expired. Please sign in again.");
      navigate("/login", { replace: true });
    }
    prevAuthed.current = isAuthed;
  }, [info, isAuthed, location.pathname, navigate]);

  return null;
}

function AppRoutes() {
  return (
    <>
      <SessionWatcher />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/candidates/:id" element={<CandidateDetails />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
