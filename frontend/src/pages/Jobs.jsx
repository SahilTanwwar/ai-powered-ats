import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Briefcase, Users, Calendar, X, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Layout from "../components/layout/Layout";
import Skeleton from "../components/ui/Skeleton";
import { jobs } from "../services/api";
import { useAuth } from "../context/AuthContext";

//  Create Job Modal 
function CreateJobModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    title: "", description: "", requiredSkills: "", experienceRequired: "",
  });
  const [skillInput, setSkillInput] = useState("");
  const [skillList, setSkillList] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skillList.includes(s)) setSkillList((prev) => [...prev, s]);
    setSkillInput("");
  };

  const removeSkill = (s) => setSkillList((prev) => prev.filter((x) => x !== s));

  const onKeyDown = (e) => {
    if (e.key === "Enter") { e.preventDefault(); addSkill(); }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      setError("Title and description are required."); return;
    }
    setError(""); setSubmitting(true);
    try {
      const res = await jobs.create({
        title: form.title.trim(),
        description: form.description.trim(),
        requiredSkills: skillList,
        experienceRequired: form.experienceRequired.trim(),
      });
      toast.success("Job created successfully!");
      onCreated(res.data);
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to create job.";
      setError(msg); toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="flex-1 bg-slate-900/20 backdrop-blur-sm" onClick={onClose} />
      {/* Drawer */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-2xl border-l border-white/50 h-full overflow-y-auto shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
          <div>
            <h3 className="font-head font-semibold text-lg text-slate-900">Create New Job</h3>
            <p className="text-slate-400 text-xs mt-0.5">Fill in the job details below</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex-1 flex flex-col gap-5 px-6 py-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Job Title *</label>
            <input
              value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Senior Frontend Developer" required
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Job Description *</label>
            <textarea
              value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Describe the role, responsibilities, and requirements..." required rows={5}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Required Skills</label>
            <div className="flex gap-2 mb-2">
              <input
                value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={onKeyDown}
                placeholder="Type a skill and press Enter"
                className="flex-1 px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button type="button" onClick={addSkill}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200">
                Add
              </button>
            </div>
            {skillList.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skillList.map((s) => (
                  <span key={s} className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                    {s}
                    <button type="button" onClick={() => removeSkill(s)}>
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Experience Required */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Experience Required</label>
            <input
              value={form.experienceRequired} onChange={(e) => setForm((f) => ({ ...f, experienceRequired: e.target.value }))}
              placeholder="e.g. 2-4 years"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-medium">{error}</div>
          )}

          <div className="flex gap-3 mt-auto pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose}
              className="flex-1 h-10 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2">
              {submitting ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</>
              ) : "Create Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

//  Job Card 
function JobCard({ job, index, onClick, onDelete, isAdmin }) {
  return (
    <div
      onClick={onClick}
      className="glass-card p-5 cursor-pointer flex flex-col hover:shadow-glow group"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-head font-semibold text-base text-slate-900 mb-1.5 truncate group-hover:text-indigo-600 transition-colors">{job.title}</h3>
          <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{job.description}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100/50 shadow-sm flex items-center justify-center text-indigo-500 shrink-0">
          <Briefcase size={17} />
        </div>
      </div>

      {/* Skills */}
      {job.requiredSkills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {job.requiredSkills.slice(0, 4).map((s) => (
            <span key={s} className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
              {s}
            </span>
          ))}
          {job.requiredSkills.length > 4 && (
            <span className="text-xs text-slate-400 font-medium">+{job.requiredSkills.length - 4}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <span className="text-xs text-slate-400">
          {job.experienceRequired || "Experience not specified"}
        </span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Calendar size={11} />
            {new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
          {isAdmin && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(job); }}
              className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
              title="Delete job"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

//  Main Page 
export default function Jobs() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await jobs.getAll();
      setAllJobs(res.data || []);
      setError("");
    } catch (e) {
      const msg = e?.response?.data?.message || "Failed to load jobs.";
      setError(msg); toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return allJobs;
    const q = query.toLowerCase();
    return allJobs.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        (j.requiredSkills || []).some((s) => s.toLowerCase().includes(q))
    );
  }, [allJobs, query]);

  const handleDelete = async (job) => {
    if (!window.confirm(`Delete "${job.title}" and all linked candidates? This cannot be undone.`)) return;
    setDeleting(job.id);
    try {
      await jobs.deleteJob(job.id);
      setAllJobs((prev) => prev.filter((j) => j.id !== job.id));
      toast.success("Job deleted.");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to delete job.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <Layout title="Jobs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-head font-bold text-2xl text-slate-900 tracking-tight">Job Postings</h2>
          <p className="text-slate-500 text-sm mt-0.5">
            {loading ? "Loading..." : `${allJobs.length} job${allJobs.length !== 1 ? "s" : ""} posted`}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          <Plus size={16} /> Create Job
        </button>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search jobs by title, description, or skills..."
          className="w-full max-w-sm pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton.Card key={i} rows={3} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <Briefcase size={28} className="text-slate-300" />
          </div>
          <h3 className="font-head font-semibold text-lg text-slate-700 mb-1">
            {query ? "No jobs match your search" : "No jobs posted yet"}
          </h3>
          <p className="text-slate-400 text-sm mb-6 max-w-xs">
            {query
              ? "Try a different search term or clear the filter."
              : "Create your first job posting to start screening candidates with AI."}
          </p>
          {!query && (
            <button onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700">
              <Plus size={15} /> Create your first job
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((job, i) => (
            <JobCard
              key={job.id}
              job={job}
              index={i}
              isAdmin={isAdmin}
              onClick={() => navigate(`/jobs/${job.id}`)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showModal && (
        <CreateJobModal
          onClose={() => setShowModal(false)}
          onCreated={(newJob) => setAllJobs((prev) => [newJob, ...prev])}
        />
      )}
    </Layout>
  );
}
