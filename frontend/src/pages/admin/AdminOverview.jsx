import { useNavigate } from "react-router-dom";

export default function AdminOverview() {
  const navigate = useNavigate();

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-head font-semibold text-dark">Admin Overview</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="border border-border rounded-xl p-4">
          <p className="text-sm text-secondary">Recruiters</p>
          <p className="text-2xl font-head font-semibold text-dark mt-2">24</p>
          <button type="button" onClick={() => navigate("/dashboard/admin/recruiters")} className="text-primary text-sm hover:underline mt-2">Manage</button>
        </div>
        <div className="border border-border rounded-xl p-4">
          <p className="text-sm text-secondary">Total Jobs</p>
          <p className="text-2xl font-head font-semibold text-dark mt-2">57</p>
          <button type="button" onClick={() => navigate("/dashboard/admin/jobs")} className="text-primary text-sm hover:underline mt-2">Review</button>
        </div>
        <div className="border border-border rounded-xl p-4">
          <p className="text-sm text-secondary">Candidates</p>
          <p className="text-2xl font-head font-semibold text-dark mt-2">413</p>
          <button type="button" onClick={() => navigate("/dashboard/admin/candidates")} className="text-primary text-sm hover:underline mt-2">Inspect</button>
        </div>
      </div>
    </div>
  );
}
