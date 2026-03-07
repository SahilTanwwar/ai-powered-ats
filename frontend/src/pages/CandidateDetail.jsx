import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft, Download, BrainCircuit, Loader2,
  TrendingUp, TrendingDown, Minus, FileText,
} from "lucide-react";
import toast from "react-hot-toast";
import Layout from "../components/layout/Layout";
import Badge from "../components/ui/Badge";
import Skeleton from "../components/ui/Skeleton";
import ScoreRing from "../components/ui/ScoreRing";
import SkillTag from "../components/ui/SkillTag";
import ActivityTimeline from "../components/ui/ActivityTimeline";
import TeamNotes from "../components/ui/TeamNotes";
import ScheduledInterviews from "../components/ui/ScheduledInterviews";
import CandidateTags from "../components/ui/CandidateTags";
import { jobs, candidates, auditLogs } from "../services/api";

//  Score row bar 
function ScoreBar({ label, value, color = "bg-blue-500" }) {
  const pct = value ?? 0;
  return (
    <div>
      <div className="flex justify-between mb-1.5 text-xs">
        <span className="text-slate-600 font-medium">{label}</span>
        <span className="font-mono font-bold text-slate-800">{pct}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function CandidateDetail() {
  // Handles both /jobs/:jobId/candidates/:candidateId AND /candidates/:id
  const params = useParams();
  const jobId = params.jobId;
  const candidateId = params.candidateId || params.id;
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [cand, setCand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState([]);
  const [qLoading, setQLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        if (jobId) {
          // Standard route: /jobs/:jobId/candidates/:candidateId
          const [j, c] = await Promise.all([jobs.getById(jobId), candidates.getByJob(jobId)]);
          setJob(j.data);
          const list = c.data?.data || c.data || [];
          const found = list.find((x) => String(x.id) === String(candidateId));
          if (!found) { setError("Candidate not found."); return; }
          setCand(found);
          setStatus(found.status);
        } else {
          // Direct route from Global Search: /candidates/:id
          // We use search to find the candidate's basic info
          const res = await candidates.search(candidateId);
          const results = res.data?.data || [];
          // Try to find by exact ID match
          const found = results.find((c) => c.id === candidateId);
          if (!found) {
            // If search doesn't find it (it searches by name/email text), just use placeholder
            // The candidate detail page will show limited info
            setCand({ id: candidateId, name: "Candidate", email: "", status: "APPLIED", tags: [] });
            setStatus("APPLIED");
          } else {
            setCand({ id: found.id, name: found.name, email: found.email, status: found.status, tags: found.tags || [], atsScore: found.atsScore, breakdown: {}, scoreBreakdown: {} });
            setStatus(found.status);
            // Look up job info if we have jobId from the candidate
            if (found.jobId) {
              try {
                const jobRes = await jobs.getById(found.jobId);
                setJob(jobRes.data);
              } catch (e) { /* ignore */ }
            }
          }
        }
      } catch (e) {
        setError(e?.response?.data?.message || "Failed to load candidate.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [jobId, candidateId]);

  // Fetch activity history
  useEffect(() => {
    if (!candidateId) return;
    setActivitiesLoading(true);
    auditLogs.getByCandidate(candidateId)
      .then((res) => {
        setActivities(res.data?.data || []);
      })
      .catch((e) => {
        console.error("Failed to fetch activities:", e);
        setActivities([]);
      })
      .finally(() => setActivitiesLoading(false));
  }, [candidateId]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    try {
      await candidates.updateStatus(candidateId, newStatus);
      setCand((prev) => ({ ...prev, status: newStatus }));
      toast.success("Status updated.");
      // Refresh activities to show status change
      setTimeout(() => {
        auditLogs.getByCandidate(candidateId)
          .then((res) => setActivities(res.data?.data || []))
          .catch((e) => console.error("Failed to refresh activities:", e));
      }, 500);
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const generateQuestions = async () => {
    if (questions.length > 0) return;
    setQLoading(true);
    try {
      const res = await candidates.getInterviewQuestions(candidateId);
      const raw = res.data?.questions || res.data || [];
      setQuestions(Array.isArray(raw) ? raw : []);
      toast.success("Interview questions ready!");
    } catch {
      toast.error("Failed to generate questions. Try again.");
    } finally {
      setQLoading(false);
    }
  };

  if (loading) return (
    <Layout title="Candidate Detail">
      <div className="grid grid-cols-3 gap-5">
        <Skeleton.Card rows={6} />
        <div className="col-span-2 flex flex-col gap-4">
          <Skeleton.Card rows={4} />
          <Skeleton.Card rows={4} />
        </div>
      </div>
    </Layout>
  );

  if (error || !cand) return (
    <Layout title="Candidate Detail">
      <button onClick={() => navigate(`/jobs/${jobId}`)} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm font-medium mb-5">
        <ChevronLeft size={16} /> Back
      </button>
      <div className="text-center py-12 text-slate-500">{error || "Candidate not found."}</div>
    </Layout>
  );

  const bd = cand.breakdown || cand.scoreBreakdown || {};
  const hybrid = cand.atsScore ?? cand.hybridScore ?? 0;
  const matched = bd.matchedSkills || [];
  const missing = bd.missingSkills || [];
  const reqSkills = job?.requiredSkills || [];
  const neutral = reqSkills.filter((s) => !matched.includes(s) && !missing.includes(s));

  const colorClass = hybrid >= 80 ? "bg-emerald-500" : hybrid >= 60 ? "bg-amber-400" : "bg-red-400";

  return (
    <Layout title={cand.name || "Candidate"}>
      <button onClick={() => navigate(`/jobs/${jobId}`)} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm font-medium mb-5 transition-all">
        <ChevronLeft size={16} /> Back to {job?.title || "Job"}
      </button>

      <div className="grid grid-cols-3 gap-5">
        {/*  Left sidebar  */}
        <div className="flex flex-col gap-4">
          {/* Identity card */}
          <div className="card p-6 flex flex-col items-center text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
              {(cand.name || "?").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="font-head font-semibold text-lg text-slate-900">{cand.name}</h2>
              <p className="text-slate-400 text-xs mt-1">{cand.email}</p>
              {cand.phone && <p className="text-slate-400 text-xs">{cand.phone}</p>}
            </div>
            <div className="my-1"><ScoreRing score={hybrid} size={84} /></div>
            <div className="w-full">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Status</label>
              <select value={status} onChange={handleStatusChange}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                <option value="APPLIED">Applied</option>
                <option value="SHORTLISTED">Shortlisted</option>
                <option value="HIRED">Hired</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            {cand.resumeUrl && (
              <a href={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}${cand.resumeUrl}`} target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 font-medium hover:bg-slate-50 transition-all">
                <Download size={13} /> Download Resume
              </a>
            )}
          </div>

          {/* Skills card */}
          {(matched.length > 0 || missing.length > 0) && (
            <div className="card p-5">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {matched.map((s) => <SkillTag key={s} label={s} type="matched" />)}
                {missing.map((s) => <SkillTag key={s} label={s} type="missing" />)}
                {neutral.map((s) => <SkillTag key={s} label={s} type="neutral" />)}
              </div>
            </div>
          )}

          {/* Custom Tags */}
          <CandidateTags candidateId={candidateId} initialTags={cand.tags || []} />

          {/* Experience / Education */}
          {(cand.experience || cand.education) && (
            <div className="card p-5 flex flex-col gap-4">
              {cand.experience && (
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Experience</h4>
                  <p className="text-sm text-slate-700">{cand.experience}</p>
                </div>
              )}
              {cand.education && (
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Education</h4>
                  <p className="text-sm text-slate-700">{cand.education}</p>
                </div>
              )}
            </div>
          )}

          {/* --- NEW: Team Collaboration Notes --- */}
          <TeamNotes candidateId={candidateId} />
        </div>

        {/*  Main panel  */}
        <div className="col-span-2 flex flex-col gap-5">
          {/* AI Analysis card */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                <BrainCircuit size={14} className="text-blue-600" />
              </div>
              <h3 className="font-head font-semibold text-slate-900">AI Analysis</h3>
            </div>
            {cand.aiSummary ? (
              <p className="text-sm text-slate-600 leading-relaxed mb-5 italic border-l-4 border-blue-200 pl-4">{cand.aiSummary}</p>
            ) : (
              <p className="text-sm text-slate-400 italic mb-5">No AI summary available.</p>
            )}
            {(cand.strengths?.length > 0 || cand.weaknesses?.length > 0) && (
              <div className="grid grid-cols-2 gap-4">
                {cand.strengths?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <TrendingUp size={13} className="text-emerald-500" />
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Strengths</span>
                    </div>
                    <ul className="space-y-1.5">
                      {cand.strengths.map((s, i) => (
                        <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                          <span className="text-emerald-500 mt-0.5 shrink-0"></span>{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {cand.weaknesses?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <TrendingDown size={13} className="text-red-400" />
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Weaknesses</span>
                    </div>
                    <ul className="space-y-1.5">
                      {cand.weaknesses.map((s, i) => (
                        <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                          <span className="text-red-400 mt-0.5 shrink-0"></span>{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* --- NEW: Interview Scheduling --- */}
          <ScheduledInterviews candidateId={candidateId} jobId={jobId} />

          {/* Activity Timeline card */}
          <div className="card p-6">
            <h3 className="font-head font-semibold text-slate-900 mb-4">Activity History</h3>
            <ActivityTimeline activities={activities} loading={activitiesLoading} />
          </div>

          {/* Score breakdown card */}
          <div className="card p-6">
            <h3 className="font-head font-semibold text-slate-900 mb-4">Score Breakdown</h3>
            <div className="flex flex-col gap-4">
              <ScoreBar label="Skills Match" value={bd.skills ?? 0} color="bg-blue-500" />
              <ScoreBar label="Semantic Fit" value={bd.semantic ?? 0} color="bg-indigo-400" />
              <ScoreBar label="Experience" value={bd.experience ?? 0} color="bg-emerald-500" />
            </div>
          </div>

          {/* Interview questions card */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center">
                  <FileText size={14} className="text-amber-600" />
                </div>
                <h3 className="font-head font-semibold text-slate-900">Interview Questions</h3>
              </div>
              <button onClick={generateQuestions} disabled={qLoading || questions.length > 0}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-all">
                {qLoading ? <Loader2 size={12} className="animate-spin" /> : <BrainCircuit size={12} />}
                {questions.length > 0 ? "Generated" : qLoading ? "Generating..." : "Generate with AI"}
              </button>
            </div>
            {questions.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">
                Click "Generate with AI" to create tailored interview questions for {cand.name}.
              </p>
            ) : (
              <ol className="space-y-3">
                {questions.map((q, i) => (
                  <li key={i} className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                    <span className="w-5 h-5 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-sm text-slate-700">{q}</p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
