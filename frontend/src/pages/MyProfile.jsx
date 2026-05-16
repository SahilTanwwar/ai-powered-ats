import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import EmployerCompanyProfile from "./employer/EmployerCompanyProfile";
import CandidateProfileEdit from "./candidate/CandidateProfileEdit";

export default function MyProfile() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-bg flex items-center justify-center"><div>Loading...</div></div>
  );

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user?.role === "RECRUITER") {
    // Render the company profile page as a standalone public-style page
    return <div className="max-w-5xl mx-auto px-4 py-8"><EmployerCompanyProfile /></div>;
  }

  if (user?.role === "CANDIDATE") {
    return <div className="max-w-5xl mx-auto px-4 py-8"><CandidateProfileEdit /></div>;
  }

  // Fallback for admins
  return <Navigate to="/dashboard/admin" replace />;
}
