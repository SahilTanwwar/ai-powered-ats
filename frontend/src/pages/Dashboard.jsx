import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, Users, CheckCircle, Target, TrendingUp, ArrowRight, Zap, AlertTriangle, Clock, UserPlus, Trash2, Edit } from "lucide-react";
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import Layout from "../components/layout/Layout";
import StatCard from "../components/ui/StatCard";
import Skeleton from "../components/ui/Skeleton";
import { dashboard, jobs } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { formatDistanceToNow } from "date-fns";

function greet(email) {
  const h = new Date().getHours();
  const name = email?.split("@")[0] || "there";
  const time = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  return `${time}, ${name}`;
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-4 py-3 text-xs">
      <p className="font-semibold text-slate-700 mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.fill }} className="font-medium">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

// Helper to format audit actions
function getActivityIcon(action) {
  if (action.includes("CREATE") || action.includes("UPLOAD")) return <UserPlus size={14} className="text-emerald-500" />;
  if (action.includes("DELETE")) return <Trash2 size={14} className="text-red-500" />;
  if (action.includes("STATUS") || action.includes("UPDATE")) return <Edit size={14} className="text-blue-500" />;
  return <Clock size={14} className="text-slate-500" />;
}

function getActionText(action, resourceType) {
  const map = {
    CANDIDATE_CREATED: "New candidate uploaded",
    CANDIDATE_STATUS_UPDATED: "Candidate status updated",
    CANDIDATE_DELETED: "Candidate deleted",
    JOB_CREATED: "New job posting created",
    JOB_DELETED: "Job posting deleted",
    USER_STATUS_UPDATED: "Recruiter account updated",
    USER_CREATED: "New recruiter registered",
  };
  return map[action] || `${resourceType} ${action.split('_').pop().toLowerCase()}`;
}

const PIPELINE_COLORS = {
  Applied: "bg-blue-500",
  Shortlisted: "bg-violet-500",
  Hired: "bg-emerald-500",
  Rejected: "bg-red-400",
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([dashboard.getStats(), jobs.getAll()])
      .then(([statsRes, jobsRes]) => {
        setStats(statsRes.data);
        setRecentJobs((jobsRes.data || []).slice(0, 5));
      })
      .catch(() => setError("Failed to load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  const hiringPct = stats
    ? Math.round((stats.hiredCount / (stats.totalCandidates || 1)) * 100)
    : 0;

  const pipelineData = stats
    ? [
      { label: "Applied", count: Math.max(0, stats.totalCandidates - stats.hiredCount - stats.shortlistedCount - stats.rejectedCount), max: stats.totalCandidates },
      { label: "Shortlisted", count: stats.shortlistedCount, max: stats.totalCandidates },
      { label: "Hired", count: stats.hiredCount, max: stats.totalCandidates },
      { label: "Rejected", count: stats.rejectedCount, max: stats.totalCandidates },
    ]
    : [];

  const statusDistribution = stats
    ? [
      { name: "Applied", value: Math.max(0, stats.totalCandidates - stats.hiredCount - stats.shortlistedCount - stats.rejectedCount), fill: "#3B82F6" },
      { name: "Shortlisted", value: stats.shortlistedCount, fill: "#8B5CF6" },
      { name: "Hired", value: stats.hiredCount, fill: "#10B981" },
      { name: "Rejected", value: stats.rejectedCount, fill: "#EF4444" },
    ].filter(d => d.value > 0)
    : [];

  return (
    <Layout title="Dashboard">
      <div className="mb-6">
        <h2 className="font-head font-bold text-2xl text-slate-900 tracking-tight mb-1">
          {greet(user?.email)}
        </h2>
        <p className="text-slate-500 text-sm">Here's your recruitment pipeline at a glance.</p>
      </div>

      {error && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
      )}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Jobs" value={stats?.totalJobs} icon={Briefcase} iconBg="bg-blue-100" iconColor="text-blue-600" trendLabel="Active positions" loading={loading} />
        <StatCard label="Candidates" value={stats?.totalCandidates} icon={Users} iconBg="bg-violet-100" iconColor="text-violet-600" trendLabel="Across all jobs" loading={loading} />
        <StatCard label="Hired" value={stats?.hiredCount} icon={CheckCircle} iconBg="bg-emerald-100" iconColor="text-emerald-600" trendLabel={`${hiringPct}% conversion`} loading={loading} />
        <StatCard label="Shortlisted" value={stats?.shortlistedCount} icon={Target} iconBg="bg-amber-100" iconColor="text-amber-600" trendLabel="Awaiting review" loading={loading} />
      </div>

      {/* --- NEW ACTIVITY DASHBOARD ROW --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">

        {/* ACTION REQUIRED WIDGET */}
        <div className="card p-0 overflow-hidden flex flex-col border-amber-200 shadow-[0_4px_20px_-4px_rgba(251,191,36,0.1)]">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4 border-b border-amber-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle size={16} className="text-amber-600" />
              </div>
              <div>
                <h3 className="font-head font-bold text-slate-900 text-sm">Action Required</h3>
                <p className="text-[11px] text-amber-700/80 font-medium">Candidates idle for {">"} 5 days</p>
              </div>
            </div>
            <span className="bg-amber-200 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {stats?.actionRequired?.length || 0}
            </span>
          </div>

          <div className="p-2 flex-1 overflow-y-auto max-h-[300px]">
            {loading ? (
              <div className="p-3"><div className="skeleton h-12 w-full rounded-lg"></div></div>
            ) : !stats?.actionRequired?.length ? (
              <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                <CheckCircle size={28} className="text-emerald-400 mb-2 opacity-50" />
                <p className="text-sm font-medium">All caught up!</p>
                <p className="text-xs">No stalled candidates.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5 p-1">
                {stats.actionRequired.map(candidate => (
                  <Link to={`/candidates/${candidate.id}`} key={candidate.id}
                    className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl border border-transparent hover:border-slate-100 transition-colors group">
                    <div>
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{candidate.name}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> {candidate.status} in <span className="font-medium">{candidate.Job?.title || 'Job'}</span>
                      </p>
                    </div>
                    <div className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                      {formatDistanceToNow(new Date(candidate.updatedAt))} ago
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RECENT ACTIVITY LOG */}
        <div className="card p-0 overflow-hidden xl:col-span-2 flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white/50 backdrop-blur-sm">
            <div>
              <h3 className="font-head font-semibold text-base text-slate-900">Recent Activity</h3>
              <p className="text-slate-400 text-xs mt-0.5">Real-time system events</p>
            </div>
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[300px] p-2 bg-slate-50/30">
            {loading ? (
              <div className="p-4 space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <div className="w-8 h-8 rounded-full skeleton shrink-0" />
                    <div className="flex-1 max-w-sm"><div className="h-4 skeleton rounded" /><div className="h-2 w-24 skeleton rounded mt-2" /></div>
                  </div>
                ))}
              </div>
            ) : !stats?.recentActivity?.length ? (
              <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
                No recent activity to display.
              </div>
            ) : (
              <div className="relative pl-4 pr-2 py-2">
                <div className="absolute top-4 bottom-4 left-[27px] w-px bg-slate-200"></div>
                <div className="flex flex-col gap-4">
                  {stats.recentActivity.map((log) => (
                    <div key={log.id} className="relative flex gap-4 text-sm group">
                      <div className="w-7 h-7 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center z-10 shrink-0 group-hover:scale-110 group-hover:border-indigo-300 transition-all">
                        {getActivityIcon(log.action)}
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <p className="text-slate-800">
                          <span className="font-semibold text-slate-900">{log.userEmail.split('@')[0]}</span>{" "}
                          <span className="text-slate-600">{getActionText(log.action, log.resourceType)}</span>
                        </p>
                        {log.details && Object.keys(log.details).length > 0 && (
                          <div className="mt-1.5 text-xs text-slate-500 bg-white border border-slate-100 rounded-md p-2 shadow-sm inline-block">
                            {log.details.newStatus && <span>Moved to <span className="font-medium text-slate-700">{log.details.newStatus}</span></span>}
                            {log.details.jobTitle && <span>Job: <span className="font-medium text-slate-700">{log.details.jobTitle}</span></span>}
                            {log.details.candidateName && <span>Name: <span className="font-medium text-slate-700">{log.details.candidateName}</span></span>}
                          </div>
                        )}
                        <p className="text-[10px] text-slate-400 mt-1.5 uppercase tracking-wide font-medium">
                          {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- OLD CHARTS ROW --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">
        <div className="card p-5 xl:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-head font-semibold text-base text-slate-900">Weekly Applications</h3>
              <p className="text-slate-400 text-xs mt-0.5">Last 7 days</p>
            </div>
            <TrendingUp size={18} className="text-slate-300" />
          </div>
          {loading ? (
            <div className="skeleton h-44 rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={stats?.weeklyApplications || []} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F8FAFC" }} />
                <Bar dataKey="Applied" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Applied" />
                <Bar dataKey="Shortlisted" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Shortlisted" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card p-5">
          <h3 className="font-head font-semibold text-base text-slate-900 mb-5">Candidate Status</h3>
          {loading ? (
            <div className="flex items-center justify-center h-44">
              <div className="skeleton w-40 h-40 rounded-full" />
            </div>
          ) : statusDistribution.length === 0 ? (
            <div className="flex items-center justify-center h-44 text-slate-400 text-sm">
              No candidates yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} candidates`} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <div className="card p-5">
          <h3 className="font-head font-semibold text-base text-slate-900 mb-5">Hiring Pipeline</h3>
          {loading ? (
            <div className="flex flex-col gap-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-10 rounded-lg" />)}</div>
          ) : (
            <div className="flex flex-col gap-3">
              {pipelineData.map(({ label, count, max }) => (
                <div key={label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-slate-600">{label}</span>
                    <span className="font-mono text-xs font-bold text-slate-700">{count}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${PIPELINE_COLORS[label] || "bg-slate-400"}`}
                      style={{ width: max > 0 ? `${Math.round((count / max) * 100)}%` : "0%" }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-head font-semibold text-base text-slate-900">Quick Stats</h3>
              <p className="text-slate-400 text-xs mt-0.5">Campaign metrics</p>
            </div>
            <Zap size={18} className="text-yellow-400" />
          </div>
          {loading ? (
            <div className="flex flex-col gap-4">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-12 rounded-lg" />)}</div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-slate-600">Avg. Jobs per Recruiter</span>
                <span className="font-mono text-lg font-bold text-blue-600">
                  {stats?.totalJobs ? (stats.totalJobs / Math.max(1, stats.recruiterCount || 1)).toFixed(1) : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-violet-50 rounded-lg">
                <span className="text-sm text-slate-600">Conversion Rate</span>
                <span className="font-mono text-lg font-bold text-violet-600">
                  {stats?.totalCandidates ? `${hiringPct}%` : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                <span className="text-sm text-slate-600">Shortlist Rate</span>
                <span className="font-mono text-lg font-bold text-emerald-600">
                  {stats?.totalCandidates ? `${Math.round((stats.shortlistedCount / stats.totalCandidates) * 100)}%` : "—"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-head font-semibold text-base text-slate-900">Recent Jobs</h3>
          <button onClick={() => navigate("/jobs")}
            className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold hover:text-blue-700">
            View all <ArrowRight size={13} />
          </button>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <table><tbody>{[...Array(4)].map((_, i) => <Skeleton.Row key={i} cols={4} />)}</tbody></table>
          ) : recentJobs.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No jobs posted yet.{" "}
              <button onClick={() => navigate("/jobs")} className="text-blue-600 font-medium hover:underline">
                Create your first job
              </button>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th className="text-left">Job Title</th>
                  <th className="text-left">Experience</th>
                  <th className="text-left">Skills</th>
                  <th className="text-left">Posted</th>
                </tr>
              </thead>
              <tbody>
                {recentJobs.map((job) => (
                  <tr key={job.id} onClick={() => navigate(`/jobs/${job.id}`)} className="cursor-pointer">
                    <td>
                      <div className="font-semibold text-slate-900">{job.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">{job.description}</div>
                    </td>
                    <td><span className="text-slate-600">{job.experienceRequired || "—"}</span></td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {(job.requiredSkills || []).slice(0, 3).map((s) => (
                          <span key={s} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">{s}</span>
                        ))}
                        {(job.requiredSkills || []).length > 3 && (
                          <span className="text-xs text-slate-400">+{job.requiredSkills.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="text-slate-500 text-xs">
                      {new Date(job.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
}
