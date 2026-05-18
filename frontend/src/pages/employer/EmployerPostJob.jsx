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
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="bg-[#18191C]/95 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3"></div>

        <div className="mb-8 border-b border-white/10 pb-6 relative z-10">
          <h1 className="text-3xl font-head font-bold text-white mb-2">Create New Posting</h1>
          <p className="text-[#9199A3]">Fill out the details below to publish your opening to the board.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 relative z-10">
          <div className="md:col-span-2 space-y-1.5">
             <label className="text-sm font-medium text-white/80">Job Title</label>
             <input value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} placeholder="e.g. Senior Frontend Developer" className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-white/30" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-white/80">Category</label>
            <select value={form.category} onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))} className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none">
              <optgroup className="bg-slate-800 text-white">
                <option>Engineering</option><option>Design</option><option>Marketing</option>
              </optgroup>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-white/80">Job Type</label>
            <select value={form.type} onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))} className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none">
              <optgroup className="bg-slate-800 text-white">
                <option>Full Time</option><option>Part Time</option><option>Remote</option><option>Contract</option><option>Internship</option>
              </optgroup>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-white/80">Seniority Level</label>
            <select value={form.level} onChange={(event) => setForm((prev) => ({ ...prev, level: event.target.value }))} className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none">
              <optgroup className="bg-slate-800 text-white">
                <option>Entry</option><option>Mid</option><option>Senior</option><option>Executive</option>
              </optgroup>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-white/80">Experience Required</label>
            <input value={form.experience} onChange={(event) => setForm((prev) => ({ ...prev, experience: event.target.value }))} placeholder="e.g. 3+ years" className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-white/30" />
          </div>

          <div className="space-y-1.5">
             <label className="text-sm font-medium text-white/80">Minimum Salary (USD)</label>
             <input value={form.salaryMin} onChange={(event) => setForm((prev) => ({ ...prev, salaryMin: event.target.value }))} placeholder="e.g. 80000" className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-white/30" />
          </div>

          <div className="space-y-1.5">
             <label className="text-sm font-medium text-white/80">Maximum Salary (USD)</label>
             <input value={form.salaryMax} onChange={(event) => setForm((prev) => ({ ...prev, salaryMax: event.target.value }))} placeholder="e.g. 120000" className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-white/30" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-white/80">Application Deadline</label>
            <input type="date" value={form.deadline} onChange={(event) => setForm((prev) => ({ ...prev, deadline: event.target.value }))} className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all [color-scheme:dark]" />
          </div>

          <div className="space-y-1.5">
             <label className="text-sm font-medium text-white/80">Location</label>
             <input value={form.location} onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))} placeholder="e.g. San Francisco, CA or Remote" className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-white/30" />
          </div>

          <div className="md:col-span-2 space-y-1.5">
             <label className="text-sm font-medium text-white/80">Required Skills</label>
             <input value={form.skills} onChange={(event) => setForm((prev) => ({ ...prev, skills: event.target.value }))} placeholder="React, Node.js, TypeScript (comma separated)" className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-white/30" />
          </div>

          <div className="md:col-span-2 space-y-1.5">
             <label className="text-sm font-medium text-white/80">Job Description</label>
             <textarea value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} placeholder="Provide a detailed overview of the role..." className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-white/30" rows={5} />
          </div>

          <div className="md:col-span-2 space-y-1.5">
             <label className="text-sm font-medium text-white/80">Key Responsibilities</label>
             <textarea value={form.responsibilities} onChange={(event) => setForm((prev) => ({ ...prev, responsibilities: event.target.value }))} placeholder="What will the day-to-day look like?" className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-white/30" rows={4} />
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-4 justify-end relative z-10">
          <button type="button" onClick={saveDraft} className="px-6 py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors">
            Save as Draft
          </button>
          <button type="button" onClick={postJob} disabled={submitting} className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl font-medium transition-all shadow-glow disabled:opacity-60 disabled:cursor-not-allowed">
            {submitting ? "Publishing Job..." : "Publish Job Posting"}
          </button>
        </div>
      </div>
    </div>
  );
}
