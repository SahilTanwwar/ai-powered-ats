import { useNavigate } from "react-router-dom";

export default function AdminJobs() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-head font-semibold text-dark">Admin Job Control</h1>
      <p className="text-secondary">Review and manage all jobs across recruiters.</p>
      <div className="flex gap-3">
        <button type="button" onClick={() => navigate("/jobs")} className="btn btn-primary px-4 py-2.5">Open Jobs Module</button>
        <button type="button" onClick={() => navigate("/dashboard/legacy")} className="btn btn-secondary px-4 py-2.5">Open Legacy Analytics</button>
      </div>
    </div>
  );
}
