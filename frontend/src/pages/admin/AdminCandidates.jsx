import { useNavigate } from "react-router-dom";

export default function AdminCandidates() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-head font-semibold text-dark">Candidate Oversight</h1>
      <p className="text-secondary">Inspect candidate pipeline and detailed profiles.</p>
      <button type="button" onClick={() => navigate("/candidates")} className="btn btn-primary px-4 py-2.5">Open Candidate Module</button>
    </div>
  );
}
