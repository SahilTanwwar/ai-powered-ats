import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { candidates, jobs } from "../../services/api";

export default function EmployerMyJobs() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("All");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const computeStatus = (createdAt) => {
    const created = new Date(createdAt).getTime();
    const ageDays = Math.floor((Date.now() - created) / (1000 * 60 * 60 * 24));
    return ageDays > 30 ? "Expired" : "Active";
  };

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await jobs.getAll();
      const rows = response.data || [];
      const withCounts = await Promise.all(
        rows.map(async (job) => {
          try {
            const candidatesResponse = await candidates.getByJob(job.id);
            const count = candidatesResponse?.data?.data?.length || 0;
            return { ...job, applications: count, status: computeStatus(job.createdAt) };
          } catch {
            return { ...job, applications: 0, status: computeStatus(job.createdAt) };
          }
        })
      );
      setItems(withCounts);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const filtered = useMemo(() => {
    if (tab === "All") return items;
    return items.filter((job) => job.status === tab);
  }, [items, tab]);

  const duplicateJob = async (job) => {
    try {
      await jobs.create({
        title: `${job.title} (Copy)`,
        description: job.description,
        requiredSkills: job.requiredSkills || [],
        experienceRequired: job.experienceRequired || "",
      });
      toast.success("Job duplicated.");
      fetchJobs();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to duplicate job.");
    }
  };

  const deleteJob = async (job) => {
    if (!window.confirm(`Delete ${job.title}?`)) return;
    try {
      await jobs.deleteJob(job.id);
      toast.success("Job deleted.");
      setItems((prev) => prev.filter((item) => item.id !== job.id));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete job.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {["All", "Active", "Expired", "Draft"].map((status) => (
          <button key={status} type="button" onClick={() => setTab(status)} className={`px-3 py-1.5 rounded-md text-sm ${tab === status ? "bg-primary text-white" : "bg-primary-light text-primary"}`}>
            {status}
          </button>
        ))}
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th>Job Title</th><th>Applications</th><th>Posted</th><th>Deadline</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="p-4 text-sm text-secondary">Loading jobs...</td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-sm text-secondary">No jobs found for this filter.</td>
              </tr>
            )}
            {filtered.map((job) => (
              <tr key={job.id}>
                <td>{job.title}</td>
                <td>{job.applications}</td>
                <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                <td>—</td>
                <td>{job.status}</td>
                <td>
                  <div className="flex gap-2 text-xs">
                    <button type="button" onClick={() => navigate(`/jobs/${job.id}`)} className="text-primary hover:underline">Edit</button>
                    <button type="button" onClick={() => duplicateJob(job)} className="text-secondary hover:underline">Duplicate</button>
                    <button type="button" onClick={() => deleteJob(job)} className="text-warning hover:underline">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
