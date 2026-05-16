import { useNavigate } from "react-router-dom";

export default function AdminRecruiters() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-head font-semibold text-dark">Recruiter Management</h1>
      <p className="text-secondary">Open the full recruiter management interface to approve/block recruiters.</p>
      <button type="button" onClick={() => navigate("/manage-recruiters")} className="btn btn-primary px-4 py-2.5">Open Recruiter Manager</button>
    </div>
  );
}
