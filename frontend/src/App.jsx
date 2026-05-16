import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const EmailVerification = lazy(() => import("./pages/EmailVerification"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ManageRecruiters = lazy(() => import("./pages/ManageRecruiters"));
const MyProfile = lazy(() => import("./pages/MyProfile"));
const Home = lazy(() => import("./pages/Home"));
const FindJobs = lazy(() => import("./pages/FindJobs"));
const PublicJobDetail = lazy(() => import("./pages/PublicJobDetail"));
const Companies = lazy(() => import("./pages/Companies"));
const PublicCandidates = lazy(() => import("./pages/PublicCandidates"));
const Blog = lazy(() => import("./pages/Blog"));
const CompanyDetail = lazy(() => import("./pages/CompanyDetail"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const PublicCandidateDetail = lazy(() => import("./pages/PublicCandidateDetail"));
const PublicLayout = lazy(() => import("./components/layout/PublicLayout"));
const CandidateDashboardShell = lazy(() => import("./layout/CandidateDashboardShell"));
const CandidateOverview = lazy(() => import("./pages/candidate/CandidateOverview"));
const CandidateAppliedJobs = lazy(() => import("./pages/candidate/CandidateAppliedJobs"));
const CandidateFavourites = lazy(() => import("./pages/candidate/CandidateFavourites"));
const CandidateAlerts = lazy(() => import("./pages/candidate/CandidateAlerts"));
const CandidateProfileEdit = lazy(() => import("./pages/candidate/CandidateProfileEdit"));
const CandidateResume = lazy(() => import("./pages/candidate/CandidateResume"));
const CandidateSettings = lazy(() => import("./pages/candidate/CandidateSettings"));

const EmployerDashboardShell = lazy(() => import("./layout/EmployerDashboardShell"));
const EmployerOverview = lazy(() => import("./pages/employer/EmployerOverview"));
const EmployerPostJob = lazy(() => import("./pages/employer/EmployerPostJob"));
const EmployerMyJobs = lazy(() => import("./pages/employer/EmployerMyJobs"));
const EmployerApplicants = lazy(() => import("./pages/employer/EmployerApplicants"));
const EmployerSavedCandidates = lazy(() => import("./pages/employer/EmployerSavedCandidates"));
const EmployerCompanyProfile = lazy(() => import("./pages/employer/EmployerCompanyProfile"));
const EmployerSubscriptions = lazy(() => import("./pages/employer/EmployerSubscriptions"));
const EmployerSettings = lazy(() => import("./pages/employer/EmployerSettings"));
const AdminDashboardShell = lazy(() => import("./layout/AdminDashboardShell"));
const AdminOverview = lazy(() => import("./pages/admin/AdminOverview"));
const AdminRecruiters = lazy(() => import("./pages/admin/AdminRecruiters"));
const AdminJobs = lazy(() => import("./pages/admin/AdminJobs"));
const AdminCandidates = lazy(() => import("./pages/admin/AdminCandidates"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const Messages = lazy(() => import("./pages/Messages"));
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        <span className="text-sm text-white font-medium">Loading...</span>
      </div>
    </div>
  );
}

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

function AdminRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== "ADMIN") return <Navigate to="/dashboard" replace />;
  return children;
}

function RoleRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user?.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

function ProfileGateway() {
  const { user, loading } = useAuth();
  
  if (loading || !user) {
    return <LoadingScreen />;
  }
  
  if (user.role === "RECRUITER") {
    return <Navigate to="/dashboard/employer/company-profile" replace />;
  }
  if (user.role === "CANDIDATE") {
    return <Navigate to="/dashboard/candidate/profile" replace />;
  }
  // ADMIN
  return <Navigate to="/dashboard/admin" replace />;
}

function DashboardGateway() {
  const { user, loading } = useAuth();
  
  // Wait for user data to load
  if (loading || !user) {
    return <LoadingScreen />;
  }
  
  console.log("DashboardGateway - User role:", user.role);
  
  if (user.role === "ADMIN") {
    console.log("Routing to /dashboard/admin");
    return <Navigate to="/dashboard/admin" replace />;
  }
  if (user.role === "RECRUITER") {
    console.log("Routing to /dashboard/employer");
    return <Navigate to="/dashboard/employer" replace />;
  }
  // CANDIDATE goes to home page instead of dashboard
  console.log("Candidate - Routing to home page");
  return <Navigate to="/" replace />;
}

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/find-jobs" element={<FindJobs />} />
          <Route path="/job/:id" element={<PublicJobDetail />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:id" element={<CompanyDetail />} />
          <Route path="/candidates-public" element={<PublicCandidates />} />
          <Route path="/candidates-public/:id" element={<PublicCandidateDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
        </Route>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/verify-email" element={<PublicRoute><EmailVerification /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardGateway /></PrivateRoute>} />

        <Route
          path="/dashboard/candidate"
          element={
            <RoleRoute allowedRoles={["CANDIDATE"]}>
              <CandidateDashboardShell />
            </RoleRoute>
          }
        >
          <Route index element={<CandidateOverview />} />
          <Route path="applied" element={<CandidateAppliedJobs />} />
          <Route path="favourites" element={<CandidateFavourites />} />
          <Route path="alerts" element={<CandidateAlerts />} />
          <Route path="profile" element={<CandidateProfileEdit />} />
          <Route path="resume" element={<CandidateResume />} />
          <Route path="settings" element={<CandidateSettings />} />
        </Route>

        <Route
          path="/dashboard/employer"
          element={
            <RoleRoute allowedRoles={["RECRUITER"]}>
              <EmployerDashboardShell />
            </RoleRoute>
          }
        >
          <Route index element={<EmployerOverview />} />
          <Route path="post-job" element={<EmployerPostJob />} />
          <Route path="jobs" element={<EmployerMyJobs />} />
          <Route path="applicants" element={<EmployerApplicants />} />
          <Route path="saved-candidates" element={<EmployerSavedCandidates />} />
          <Route path="company-profile" element={<EmployerCompanyProfile />} />
          <Route path="subscriptions" element={<EmployerSubscriptions />} />
          <Route path="settings" element={<EmployerSettings />} />
        </Route>

        <Route path="/dashboard/admin" element={<AdminRoute><AdminDashboardShell /></AdminRoute>}>
          <Route index element={<AdminOverview />} />
          <Route path="recruiters" element={<AdminRecruiters />} />
          <Route path="jobs" element={<AdminJobs />} />
          <Route path="candidates" element={<AdminCandidates />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route
          path="/dashboard/messages"
          element={
            <RoleRoute allowedRoles={["CANDIDATE", "RECRUITER", "ADMIN"]}>
              <Messages />
            </RoleRoute>
          }
        />
        <Route path="/manage-recruiters" element={<AdminRoute><ManageRecruiters /></AdminRoute>} />
        <Route path="/profile" element={<PrivateRoute><MyProfile /></PrivateRoute>} />

        <Route path="/profile" element={<PrivateRoute><ProfileGateway /></PrivateRoute>} />

        <Route path="*" element={
          <div className="min-h-screen bg-bg flex items-center justify-center">
            <div className="text-center">
              <h1 className="font-head text-6xl font-bold text-accent mb-2">404</h1>
              <p className="text-secondary text-lg mb-6">Page not found</p>
              <Link to="/dashboard" className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
                Go to Dashboard
              </Link>
            </div>
          </div>
        } />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
