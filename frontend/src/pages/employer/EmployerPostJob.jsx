import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { jobs } from "../../services/api";

export default function EmployerPostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    category: "Engineering",
    type: "Full Time",
    level: "Mid",
    salaryMin: "",
    salaryMax: "",
    experience: "1 year",
    deadline: "",
    location: "",
    description: "",
    responsibilities: "",
    skills: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("employer_job_draft");
    if (!raw) return;
    try {
      const draft = JSON.parse(raw);
      setForm((prev) => ({ ...prev, ...draft }));
    } catch {
      localStorage.removeItem("employer_job_draft");
    }
  }, []);

  const saveDraft = () => {
    localStorage.setItem("employer_job_draft", JSON.stringify(form));
    toast.success("Draft saved locally.");
  };

  const postJob = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Title and description are required.");
      return;
    }

    try {
      setSubmitting(true);
      const requiredSkills = form.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const response = await jobs.create({
        title: form.title.trim(),
        description: form.description.trim(),
        requiredSkills,
        experienceRequired: form.experience?.trim() || "",
      });

      localStorage.removeItem("employer_job_draft");
      toast.success("Job posted successfully!");
      // Redirect to My Jobs instead of full page view
      navigate("/dashboard/employer/jobs");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to post job.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-head font-semibold text-dark">Post a Job</h1>
      <div className="grid md:grid-cols-2 gap-3">
        <input value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} placeholder="Job Title" className="border border-border rounded-lg px-3 py-2.5" />
        <select value={form.category} onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))} className="border border-border rounded-lg px-3 py-2.5">
          <option>Engineering</option><option>Design</option><option>Marketing</option>
        </select>
        <select value={form.type} onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))} className="border border-border rounded-lg px-3 py-2.5">
          <option>Full Time</option><option>Part Time</option><option>Remote</option><option>Contract</option><option>Internship</option>
        </select>
        <select value={form.level} onChange={(event) => setForm((prev) => ({ ...prev, level: event.target.value }))} className="border border-border rounded-lg px-3 py-2.5">
          <option>Entry</option><option>Mid</option><option>Senior</option><option>Executive</option>
        </select>
        <input value={form.salaryMin} onChange={(event) => setForm((prev) => ({ ...prev, salaryMin: event.target.value }))} placeholder="Salary Min" className="border border-border rounded-lg px-3 py-2.5" />
        <input value={form.salaryMax} onChange={(event) => setForm((prev) => ({ ...prev, salaryMax: event.target.value }))} placeholder="Salary Max" className="border border-border rounded-lg px-3 py-2.5" />
        <input value={form.experience} onChange={(event) => setForm((prev) => ({ ...prev, experience: event.target.value }))} placeholder="Experience" className="border border-border rounded-lg px-3 py-2.5" />
        <input type="date" value={form.deadline} onChange={(event) => setForm((prev) => ({ ...prev, deadline: event.target.value }))} className="border border-border rounded-lg px-3 py-2.5" />
        <input value={form.location} onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))} placeholder="Location" className="md:col-span-2 border border-border rounded-lg px-3 py-2.5" />
        <textarea value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} placeholder="Job Description" className="md:col-span-2 border border-border rounded-lg px-3 py-2.5" rows={4} />
        <textarea value={form.responsibilities} onChange={(event) => setForm((prev) => ({ ...prev, responsibilities: event.target.value }))} placeholder="Responsibilities" className="md:col-span-2 border border-border rounded-lg px-3 py-2.5" rows={3} />
        <input value={form.skills} onChange={(event) => setForm((prev) => ({ ...prev, skills: event.target.value }))} placeholder="Required skills (comma separated)" className="md:col-span-2 border border-border rounded-lg px-3 py-2.5" />
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={saveDraft} className="btn btn-secondary px-4 py-2.5">Save as Draft</button>
        <button type="button" onClick={postJob} disabled={submitting} className="btn btn-primary px-4 py-2.5 disabled:opacity-60">
          {submitting ? "Posting..." : "Post Job"}
        </button>
      </div>
    </div>
  );
}
