import { useEffect, useState } from "react";
import API from "../api/axios";
import StatusBadge from "../components/StatusBadge";

const STATUS_OPTIONS = [
  { value: "APPLIED", label: "Applied" },
  { value: "SHORTLISTED", label: "Shortlisted" },
  { value: "HIRED", label: "Hired" },
  { value: "REJECTED", label: "Rejected" },
];

const Candidates = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    try {
      const response = await API.get("/jobs");
      const jobsData = Array.isArray(response.data) ? response.data : [];
      console.log("Jobs API response:", response.data);
      setJobs(jobsData);

      if (!selectedJobId && jobsData.length > 0) {
        setSelectedJobId(String(jobsData[0].id));
      }
    } catch (err) {
      console.error("Jobs fetch failed:", err);
      setError("Failed to load jobs.");
    }
  };

  const fetchCandidates = async (jobId = selectedJobId) => {
    if (!jobId) {
      setCandidates([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await API.get(`/candidates/job/${jobId}`);
      console.log("Candidates API response:", response.data);
      setCandidates(response.data?.data || []);
    } catch (err) {
      console.error("Candidates fetch failed:", err);
      setError("Failed to load candidates.");
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await API.patch(`/candidates/${id}/status`, {
        status: newStatus,
      });
      fetchCandidates();
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      fetchCandidates(selectedJobId);
    }
  }, [selectedJobId]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">
          Candidates
        </h1>

        <select
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm"
        >
          {jobs.length === 0 && (
            <option value="">No jobs found</option>
          )}
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="text-sm text-red-600 mb-4">{error}</p>
      )}

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Name
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Email
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                ATS Score
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  className="px-4 py-4 text-gray-500"
                  colSpan="4"
                >
                  Loading candidates...
                </td>
              </tr>
            )}

            {!loading && candidates.length === 0 && (
              <tr>
                <td
                  className="px-4 py-4 text-gray-500"
                  colSpan="4"
                >
                  No candidates found.
                </td>
              </tr>
            )}

            {!loading &&
              candidates.map((candidate) => {
                console.log("Candidate status:", candidate.status);

                return (
                  <tr
                    key={candidate.id}
                    className="border-t border-gray-100"
                  >
                    <td className="px-4 py-3 text-gray-800">
                      {candidate.name}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {candidate.email}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {typeof candidate.atsScore === "number"
                        ? candidate.atsScore.toFixed(1)
                        : "-"}
                    </td>

                    {/* 🔥 Updated Status Column */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <StatusBadge
                          status={candidate.status}
                        />

                        <select
                          value={candidate.status}
                          onChange={(e) =>
                            handleStatusChange(
                              candidate.id,
                              e.target.value
                            )
                          }
                          className="border rounded px-2 py-1 text-xs"
                        >
                          {STATUS_OPTIONS.map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Candidates;
