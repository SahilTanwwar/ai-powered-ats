import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { candidates, jobs } from "../../services/api";

const STATUS_MAP = {
  APPLIED: "All",
  SHORTLISTED: "Shortlisted",
  REJECTED: "Rejected",
  HIRED: "Hired",
};

const TO_API_STATUS = {
  All: "APPLIED",
  Shortlisted: "SHORTLISTED",
  Rejected: "REJECTED",
  Hired: "HIRED",
};

export default function EmployerApplicants() {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [jobsList, setJobsList] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("All");

  const loadJobs = useCallback(async () => {
    try {
      const response = await jobs.getAll();
      const rows = response.data || [];
      setJobsList(rows);
      if (!selectedJobId && rows[0]?.id) {
        setSelectedJobId(String(rows[0].id));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load jobs.");
    }
  }, [selectedJobId]);

  const loadApplicants = useCallback(async (jobId) => {
    if (!jobId) return;
    try {
      setLoading(true);
      const response = await candidates.getByJob(jobId);
      const rows = response?.data?.data || [];
      setApplicants(
        rows.map((item) => ({
          ...item,
          date: item.createdAt,
          status: STATUS_MAP[item.status] || "All",
        }))
      );
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load applicants.");
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  useEffect(() => {
    if (selectedJobId) {
      loadApplicants(selectedJobId);
    }
  }, [selectedJobId, loadApplicants]);

  const filtered = useMemo(() => {
    if (tab === "All") return applicants;
    return applicants.filter((item) => item.status === tab);
  }, [tab, applicants]);

  const updateStatus = async (id, status) => {
    const apiStatus = TO_API_STATUS[status];
    if (!apiStatus) return;

    try {
      await candidates.updateStatus(id, apiStatus);
      setApplicants((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
      toast.success("Candidate status updated.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update status.");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <select
          value={selectedJobId}
          onChange={(event) => setSelectedJobId(event.target.value)}
          className="border border-border rounded-lg px-3 py-2 text-sm"
        >
          {jobsList.map((job) => (
            <option key={job.id} value={String(job.id)}>{job.title}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        {["All", "Shortlisted", "Rejected", "Hired"].map((item) => (
          <button key={item} type="button" onClick={() => setTab(item)} className={`px-3 py-1.5 rounded-md text-sm ${tab === item ? "bg-primary text-white" : "bg-primary-light text-primary"}`}>
            {item}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {loading && <div className="text-sm text-secondary">Loading applicants...</div>}
        {!loading && filtered.length === 0 && <div className="text-sm text-secondary">No applicants found.</div>}
        {filtered.map((applicant) => (
          <div key={applicant.id} className="border border-border rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium text-dark">{applicant.name}</p>
              <p className="text-sm text-secondary">{applicant.email}</p>
              <p className="text-xs text-text-muted">Applied: {new Date(applicant.date).toLocaleDateString()}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => navigate(`/candidates/${applicant.id}`)} className="btn btn-secondary px-3 py-2">View Profile</button>
              <a href={`mailto:${applicant.email}?subject=Please%20share%20your%20latest%20resume`} className="btn btn-secondary px-3 py-2">Request CV</a>
              <button type="button" onClick={() => navigate(`/dashboard/messages?candidateId=${applicant.id}`)} className="btn btn-primary px-3 py-2">Message</button>
              <select value={applicant.status} onChange={(event) => updateStatus(applicant.id, event.target.value)} className="border border-border rounded-lg px-2 py-2 text-sm">
                <option>All</option>
                <option>Shortlisted</option>
                <option>Rejected</option>
                <option>Hired</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
