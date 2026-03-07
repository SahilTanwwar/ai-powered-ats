import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import {
  ChevronLeft, Upload, Trash2, X, CloudUpload,
  CheckCircle2, Loader2, User, AlertCircle, Layout as LayoutIcon, Columns, Check, CheckSquare, Square,
} from "lucide-react";
import toast from "react-hot-toast";
import Layout from "../components/layout/Layout";
import Badge from "../components/ui/Badge";
import Skeleton from "../components/ui/Skeleton";
import KanbanBoard from "../components/ui/KanbanBoard";
import { jobs, candidates } from "../services/api";
import { useAuth } from "../context/AuthContext";

const TABS = ["All", "APPLIED", "SHORTLISTED", "HIRED", "REJECTED"];

//  Score badge 
function ScoreBadge({ score }) {
  if (score == null) return <span className="font-mono text-xs text-slate-400">—</span>;
  const cls =
    score >= 80 ? "bg-emerald-50 text-emerald-700" :
      score >= 60 ? "bg-amber-50 text-amber-700" :
        "bg-red-50 text-red-500";
  return (
    <span className={`font-mono text-sm font-bold px-2.5 py-1 rounded-lg ${cls}`}>{score}</span>
  );
}

//  Upload Modal 
function UploadModal({ job, onClose, onUploaded }) {
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [step, setStep] = useState(0); // 0=idle 1=uploading 2=done 3=error
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    onDrop: (accepted, rejected) => {
      if (rejected.length > 0) { toast.error("Only PDF or DOCX up to 5 MB."); return; }
      if (accepted.length > 0) setFile(accepted[0]);
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setError("Please select a resume file."); return; }
    if (!form.name.trim()) { setError("Candidate name is required."); return; }
    if (!form.email.trim()) { setError("Candidate email is required."); return; }
    setError(""); setStep(1);

    const fd = new FormData();
    fd.append("resume", file);
    fd.append("name", form.name.trim());
    fd.append("email", form.email.trim());
    fd.append("phone", form.phone.trim());
    fd.append("jobId", String(job.id));

    try {
      const res = await candidates.uploadResume(fd);
      setResult(res.data?.data || res.data);
      setStep(2);
      toast.success("Resume uploaded and analyzed!");
    } catch (err) {
      setError(err?.response?.data?.message || "Upload failed."); setStep(3);
    }
  };

  const handleDone = () => { if (result) onUploaded(result); onClose(); };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
          <div>
            <h3 className="font-head font-semibold text-lg text-slate-900">Upload Resume</h3>
            <p className="text-slate-400 text-xs mt-0.5">For job: {job?.title}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100"><X size={18} /></button>
        </div>

        {step === 2 ? (
          <div className="p-8 flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle2 size={28} className="text-emerald-600" />
            </div>
            <div>
              <h4 className="font-head font-semibold text-lg text-slate-900 mb-1">Analysis Complete!</h4>
              <p className="text-slate-500 text-sm">{result?.name} scored <strong className="text-slate-900 font-mono">{result?.atsScore ?? "—"}</strong> / 100</p>
              {result?.status && (
                <p className="text-xs text-slate-400 mt-1">Status auto-set to: <Badge label={result.status} variant={result.status} /></p>
              )}
            </div>
            <div className="w-full bg-slate-50 rounded-xl p-4 text-left text-xs text-slate-600">
              {result?.aiMatchReason && <p className="italic">"{result.aiMatchReason}"</p>}
            </div>
            <button onClick={handleDone} className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold">
              View Candidates
            </button>
          </div>
        ) : step === 1 ? (
          <div className="p-10 flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
            <div className="text-center">
              <p className="font-medium text-slate-700 mb-1">Analyzing resume with AI...</p>
              <p className="text-slate-400 text-xs">This usually takes 20–50 seconds</p>
            </div>
            <div className="w-full flex flex-col gap-2 text-xs text-slate-500">
              {["Extracting text from file...", "Parsing resume structure...", "Scoring against job requirements...", "Computing hybrid ATS score..."].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <Loader2 size={12} className="animate-spin text-blue-400" />{s}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="p-6 flex flex-col gap-4">
            {/* Drop zone */}
            <div {...getRootProps()} className={`upload-zone p-8 text-center cursor-pointer ${isDragActive ? "drag-active" : ""}`}>
              <input {...getInputProps()} />
              <CloudUpload size={36} className="text-blue-400 mx-auto mb-3" />
              {file ? (
                <div>
                  <p className="font-medium text-slate-700 text-sm">{file.name}</p>
                  <p className="text-slate-400 text-xs mt-1">{(file.size / 1024).toFixed(0)} KB  Click to change</p>
                </div>
              ) : (
                <div>
                  <p className="text-slate-600 text-sm font-medium mb-1">Drop resume here or click to upload</p>
                  <p className="text-slate-400 text-xs">PDF or DOCX  max 5 MB</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name *</label>
                <input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Jane Doe" required
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email *</label>
                <input type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} placeholder="jane@example.com" required
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Phone</label>
              <input value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 234 567 8900"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            {error && (
              <div className="flex items-start gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />{error}
              </div>
            )}

            <div className="flex gap-3 pt-2 border-t border-slate-100">
              <button type="button" onClick={onClose} className="flex-1 h-10 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
              <button type="submit" className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2">
                <Upload size={14} /> Process Resume
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

//  Main page 
export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [candList, setCandList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [viewMode, setViewMode] = useState("table"); // "table" or "kanban"
  const [showUpload, setShowUpload] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [selected, setSelected] = useState(new Set()); // Bulk selection
  const [bulkAction, setBulkAction] = useState(null); // "STATUS" or "DELETE"

  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    Promise.all([jobs.getById(id), candidates.getByJob(id)])
      .then(([j, c]) => {
        setJob(j.data);
        setCandList(c.data?.data || c.data || []);
      })
      .catch((e) => setError(e?.response?.data?.message || "Failed to load."))
      .finally(() => setLoading(false));
  }, [id]);

  const filtered = activeTab === "All"
    ? candList
    : candList.filter((c) => c.status === activeTab);

  const tabCount = (tab) =>
    tab === "All" ? candList.length : candList.filter((c) => c.status === tab).length;

  const updateStatus = async (candidateId, status) => {
    setUpdatingId(candidateId);
    try {
      await candidates.updateStatus(candidateId, status);
      setCandList((prev) => prev.map((c) => c.id === candidateId ? { ...c, status } : c));
      toast.success("Status updated.");
    } catch {
      toast.error("Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (candidate) => {
    if (!window.confirm(`Delete ${candidate.name}? This cannot be undone.`)) return;
    try {
      await candidates.deleteCandidate(candidate.id);
      setCandList((prev) => prev.filter((c) => c.id !== candidate.id));
      toast.success("Candidate deleted.");
    } catch {
      toast.error("Failed to delete candidate.");
    }
  };

  // Bulk actions
  const toggleSelect = (candId) => {
    const newSelected = new Set(selected);
    if (newSelected.has(candId)) {
      newSelected.delete(candId);
    } else {
      newSelected.add(candId);
    }
    setSelected(newSelected);
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length && filtered.length > 0) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((c) => c.id)));
    }
  };

  const bulkUpdateStatus = async (status) => {
    if (!window.confirm(`Update ${selected.size} candidate(s) to ${status}?`)) return;
    setUpdatingId("bulk");
    try {
      await Promise.all(
        Array.from(selected).map((candId) =>
          candidates.updateStatus(candId, status)
        )
      );
      setCandList((prev) =>
        prev.map((c) => (selected.has(c.id) ? { ...c, status } : c))
      );
      setSelected(new Set());
      toast.success(`${selected.size} candidate(s) updated.`);
    } catch {
      toast.error("Failed to update some candidates.");
    } finally {
      setUpdatingId(null);
      setBulkAction(null);
    }
  };

  const bulkDelete = async () => {
    if (!window.confirm(`Delete ${selected.size} candidate(s)? This cannot be undone.`)) return;
    setUpdatingId("bulk");
    try {
      await Promise.all(
        Array.from(selected).map((candId) =>
          candidates.deleteCandidate(candId)
        )
      );
      setCandList((prev) => prev.filter((c) => !selected.has(c.id)));
      setSelected(new Set());
      toast.success(`${selected.size} candidate(s) deleted.`);
    } catch {
      toast.error("Failed to delete some candidates.");
    } finally {
      setUpdatingId(null);
      setBulkAction(null);
    }
  };

  if (loading) return (
    <Layout title="Job Detail">
      <div className="flex flex-col gap-4">
        <Skeleton.Card rows={2} />
        <Skeleton.Card rows={5} />
      </div>
    </Layout>
  );

  return (
    <Layout title={job?.title || "Job Detail"}>
      {/* Back */}
      <button onClick={() => navigate("/jobs")} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm font-medium mb-5 transition-all">
        <ChevronLeft size={16} /> Back to Jobs
      </button>

      {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}

      {/* Job header card */}
      {job && (
        <div className="card p-6 mb-5">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex-1">
              <h2 className="font-head font-bold text-xl text-slate-900 mb-2">{job.title}</h2>
              <p className="text-slate-500 text-sm leading-relaxed">{job.description}</p>
            </div>
            <button onClick={() => setShowUpload(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all shrink-0">
              <Upload size={14} /> Upload Resume
            </button>
          </div>
          <div className="flex flex-wrap gap-5 pt-5 border-t border-slate-100">
            {job.experienceRequired && (
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Experience</div>
                <div className="text-sm font-semibold text-slate-700">{job.experienceRequired}</div>
              </div>
            )}
            {job.requiredSkills?.length > 0 && (
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Required Skills</div>
                <div className="flex flex-wrap gap-1.5">
                  {job.requiredSkills.map((s) => (
                    <span key={s} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">{s}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="ml-auto">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Total Candidates</div>
              <div className="text-sm font-semibold text-slate-700 font-mono">{candList.length}</div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs and View Toggle */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5
                ${activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              {tab}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === tab ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-500"}`}>
                {tabCount(tab)}
              </span>
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode("table")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5
              ${viewMode === "table" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            title="Table view">
            <LayoutIcon size={14} />
          </button>
          <button
            onClick={() => setViewMode("kanban")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5
              ${viewMode === "kanban" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            title="Kanban board">
            <Columns size={14} />
          </button>
        </div>
      </div>

      {/* Bulk Action Toolbar */}
      {selected.size > 0 && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-blue-900">{selected.size} selected</span>
          </div>
          <div className="flex items-center gap-2">
            <select
              onChange={(e) => {
                if (e.target.value) bulkUpdateStatus(e.target.value);
                e.target.value = "";
              }}
              className="text-xs border border-blue-300 bg-white text-blue-900 rounded-lg px-2.5 py-1.5 font-medium hover:bg-blue-100 focus:outline-none"
            >
              <option value="">Change Status...</option>
              <option value="APPLIED">Applied</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="HIRED">Hired</option>
              <option value="REJECTED">Rejected</option>
            </select>
            {isAdmin && (
              <button
                onClick={bulkDelete}
                disabled={updatingId === "bulk"}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-all"
              >
                {updatingId === "bulk" ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                Delete
              </button>
            )}
            <button
              onClick={() => setSelected(new Set())}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-blue-900 rounded-lg text-xs font-semibold"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Candidate view - Table or Kanban */}
      {viewMode === "kanban" ? (
        // Kanban board
        <div className="card p-4 overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="py-14 text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <User size={22} className="text-slate-300" />
              </div>
              <p className="text-slate-500 text-sm font-medium">No candidates in this category</p>
            </div>
          ) : (
            <KanbanBoard
              candidates={filtered}
              onStatusChange={updateStatus}
              onCandidateClick={(cand) => navigate(`/jobs/${id}/candidates/${cand.id}`)}
            />
          )}
        </div>
      ) : (
        // Table view
        <div className="card overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-14 text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <User size={22} className="text-slate-300" />
              </div>
              <p className="text-slate-500 text-sm font-medium">No candidates in this category</p>
              <button onClick={() => setShowUpload(true)} className="mt-3 text-xs text-blue-600 font-semibold hover:underline">
                Upload the first resume
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th className="text-left w-8">
                      <button
                        onClick={toggleSelectAll}
                        className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"
                        title={selected.size === filtered.length && filtered.length > 0 ? "Deselect all" : "Select all"}
                      >
                        {selected.size === filtered.length && filtered.length > 0 ? (
                          <CheckSquare size={16} className="text-blue-600" />
                        ) : (
                          <Square size={16} />
                        )}
                      </button>
                    </th>
                    <th className="text-left w-8">Rank</th>
                    <th className="text-left">Candidate</th>
                    <th className="text-left">ATS Score</th>
                    <th className="text-left">Skills Match</th>
                    <th className="text-left">Status</th>
                    <th className="text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((cand, i) => {
                    const skillsPct = cand.breakdown?.skills ?? cand.scoreBreakdown?.skills ?? 0;
                    const medal = i === 0 ? "" : i === 1 ? "" : i === 2 ? "" : null;
                    const initials = (cand.name || "?").slice(0, 2).toUpperCase();
                    return (
                      <tr key={cand.id} className={selected.has(cand.id) ? "bg-blue-50" : ""}>
                        <td>
                          <button
                            onClick={() => toggleSelect(cand.id)}
                            className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600"
                          >
                            {selected.has(cand.id) ? (
                              <CheckSquare size={16} className="text-blue-600" />
                            ) : (
                              <Square size={16} />
                            )}
                          </button>
                        </td>
                        <td>
                          <span className="font-mono text-xs text-slate-500 font-bold">
                            {medal || `#${i + 1}`}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                              {initials}
                            </div>
                            <div>
                              <button onClick={() => navigate(`/jobs/${id}/candidates/${cand.id}`)}
                                className="font-semibold text-slate-900 hover:text-blue-600 transition-colors text-sm">
                                {cand.name}
                              </button>
                              <div className="text-xs text-slate-400">{cand.email}</div>
                            </div>
                          </div>
                        </td>
                        <td><ScoreBadge score={cand.atsScore ?? cand.hybridScore} /></td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-20 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${skillsPct >= 80 ? "bg-emerald-500" : skillsPct >= 60 ? "bg-amber-400" : "bg-red-400"}`}
                                style={{ width: `${skillsPct}%` }} />
                            </div>
                            <span className="text-xs text-slate-500 font-medium">{skillsPct}%</span>
                          </div>
                        </td>
                        <td>
                          <select value={cand.status} disabled={updatingId === cand.id}
                            onChange={(e) => updateStatus(cand.id, e.target.value)}
                            className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                            <option value="APPLIED">Applied</option>
                            <option value="SHORTLISTED">Shortlisted</option>
                            <option value="HIRED">Hired</option>
                            <option value="REJECTED">Rejected</option>
                          </select>
                        </td>
                        <td>
                          <div className="flex items-center gap-1">
                            <button onClick={() => navigate(`/jobs/${id}/candidates/${cand.id}`)}
                              className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-all">
                              View
                            </button>
                            {isAdmin && (
                              <button onClick={() => handleDelete(cand)}
                                className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {showUpload && job && (
        <UploadModal
          job={job}
          onClose={() => setShowUpload(false)}
          onUploaded={(newCand) => {
            setCandList((prev) => [newCand, ...prev]);
          }}
        />
      )}
    </Layout>
  );
}
