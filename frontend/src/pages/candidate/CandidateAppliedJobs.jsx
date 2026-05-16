import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const DATA = [
  { id: 1, title: "Frontend Engineer", company: "Figma", appliedDate: "2026-03-24", status: "Pending" },
  { id: 2, title: "UI Designer", company: "Linear", appliedDate: "2026-03-20", status: "Viewed" },
  { id: 3, title: "Backend Engineer", company: "Stripe", appliedDate: "2026-03-18", status: "Accepted" },
  { id: 4, title: "Fullstack Developer", company: "Vercel", appliedDate: "2026-03-16", status: "Rejected" },
];

export default function CandidateAppliedJobs() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = useMemo(() => {
    if (statusFilter === "All") return DATA;
    return DATA.filter((job) => job.status === statusFilter);
  }, [statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {["All", "Pending", "Viewed", "Accepted", "Rejected"].map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-md text-sm ${statusFilter === status ? "bg-primary text-white" : "bg-primary-light text-primary"}`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Applied Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.company}</td>
                <td>{item.appliedDate}</td>
                <td>{item.status}</td>
                <td>
                  <button type="button" onClick={() => navigate(`/find-jobs?q=${encodeURIComponent(item.title)}`)} className="text-primary hover:underline">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
