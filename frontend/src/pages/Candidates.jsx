import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Briefcase, TrendingUp, ChevronRight, Loader2 } from "lucide-react";
import Layout from "../components/layout/Layout";
import Badge from "../components/ui/Badge";
import { jobs, candidates } from "../services/api";

export default function Candidates() {
  const navigate = useNavigate();
  const [jobList, setJobList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [candCounts, setCandCounts] = useState({});

  useEffect(() => {
    jobs.getAll()
      .then(async (res) => {
        const list = res.data?.data || res.data || [];
        setJobList(list);
        // fetch candidate counts per job in parallel
        const counts = {};
        await Promise.all(
          list.map((j) =>
            candidates.getByJob(j.id)
              .then((r) => {
                const arr = r.data?.data || r.data || [];
                counts[j.id] = {
                  total: arr.length,
                  shortlisted: arr.filter((c) => c.status === "SHORTLISTED").length,
                  hired: arr.filter((c) => c.status === "HIRED").length,
                  avgScore: arr.length
                    ? Math.round(arr.reduce((s, c) => s + (c.atsScore ?? c.hybridScore ?? 0), 0) / arr.length)
                    : null,
                };
              })
              .catch(() => { counts[j.id] = { total: 0, shortlisted: 0, hired: 0, avgScore: null }; })
          )
        );
        setCandCounts(counts);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout title="Candidates">
      <div className="mb-6">
        <h2 className="font-head font-bold text-2xl text-slate-900 mb-1">All Candidates</h2>
        <p className="text-slate-400 text-sm">Candidates are organized by job. Click a job to view and manage its candidates.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
          <Loader2 size={22} className="animate-spin" />
          <span className="text-sm font-medium">Loading candidates...</span>
        </div>
      ) : jobList.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Users size={24} className="text-slate-300" />
          </div>
          <p className="text-slate-500 font-medium mb-1">No jobs found</p>
          <p className="text-slate-400 text-sm">Create a job first, then upload resumes to it.</p>
          <button onClick={() => navigate("/jobs")} className="mt-4 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold">
            Go to Jobs
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {jobList.map((job) => {
            const c = candCounts[job.id];
            return (
              <button key={job.id} onClick={() => navigate(`/jobs/${job.id}`)}
                className="card p-5 text-left hover:shadow-md hover:border-blue-200 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                    <Briefcase size={18} className="text-blue-500" />
                  </div>
                  <Badge variant={job.status} label={job.status} />
                </div>
                <h3 className="font-head font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                <p className="text-slate-400 text-xs mb-4 line-clamp-2">{job.description}</p>
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100">
                  <div className="text-center">
                    <div className="font-mono font-bold text-lg text-slate-900">{c?.total ?? "—"}</div>
                    <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="font-mono font-bold text-lg text-amber-600">{c?.shortlisted ?? "—"}</div>
                    <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Shortlisted</div>
                  </div>
                  <div className="text-center">
                    <div className={`font-mono font-bold text-lg ${c?.avgScore != null ? (c.avgScore >= 80 ? "text-emerald-600" : c.avgScore >= 60 ? "text-amber-500" : "text-red-500") : "text-slate-300"}`}>
                      {c?.avgScore != null ? c.avgScore : "—"}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Avg Score</div>
                  </div>
                </div>
                <div className="flex items-center justify-end mt-3 text-xs text-blue-500 font-semibold gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  View candidates <ChevronRight size={13} />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
