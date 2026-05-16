import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import JobCard from "../../components/ui/JobCard";

const INITIAL = [
  { id: 1, title: "Frontend Engineer", company: "Figma", location: "Remote", salary: "$120k - $150k", type: "Full-Time" },
  { id: 2, title: "Product Designer", company: "Notion", location: "New York", salary: "$110k - $140k", type: "Remote" },
];

export default function CandidateFavourites() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(INITIAL);
  const hasItems = useMemo(() => saved.length > 0, [saved]);

  const removeSaved = (id) => setSaved((prev) => prev.filter((item) => item.id !== id));

  if (!hasItems) {
    return (
      <div className="border border-border rounded-xl p-8 text-center">
        <h2 className="font-head text-xl font-semibold text-dark mb-2">No saved jobs yet</h2>
        <p className="text-secondary mb-4">Save jobs to review them later.</p>
        <button type="button" onClick={() => navigate("/find-jobs")} className="btn btn-primary px-5 py-2.5">Browse Jobs</button>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {saved.map((job) => (
        <JobCard
          key={job.id}
          title={job.title}
          company={job.company}
          location={job.location}
          salary={job.salary}
          type={job.type}
          onSave={() => removeSaved(job.id)}
        />
      ))}
    </div>
  );
}
