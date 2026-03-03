import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Users, CheckCircle, Target, TrendingUp, ArrowRight } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import Layout from "../components/layout/Layout";
import StatCard from "../components/ui/StatCard";
import Skeleton from "../components/ui/Skeleton";
import { dashboard, jobs } from "../services/api";
import { useAuth } from "../context/AuthContext";

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
        <StatCard label="Total Jobs"  value={stats?.totalJobs}        icon={Briefcase}   iconBg="bg-blue-100"    iconColor="text-blue-600"    trendLabel="Active positions"  loading={loading} />
        <StatCard label="Candidates"  value={stats?.totalCandidates}  icon={Users}       iconBg="bg-violet-100"  iconColor="text-violet-600"  trendLabel="Across all jobs"   loading={loading} />
        <StatCard label="Hired"       value={stats?.hiredCount}       icon={CheckCircle} iconBg="bg-emerald-100" iconColor="text-emerald-600" trendLabel={`${hiringPct}% conversion`} loading={loading} />
        <StatCard label="Shortlisted" value={stats?.shortlistedCount} icon={Target}      iconBg="bg-amber-100"   iconColor="text-amber-600"   trendLabel="Awaiting review"   loading={loading} />
      </div>

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
                <Bar dataKey="Applied"     fill="#3B82F6" radius={[4,4,0,0]} name="Applied" />
                <Bar dataKey="Shortlisted" fill="#8B5CF6" radius={[4,4,0,0]} name="Shortlisted" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card p-5">
          <h3 className="font-head font-semibold text-base text-slate-900 mb-5">Hiring Pipeline</h3>
          {loading ? (
            <div className="flex flex-col gap-3">{[...Array(4)].map((_,i) => <div key={i} className="skeleton h-10 rounded-lg" />)}</div>
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
            <table><tbody>{[...Array(4)].map((_,i) => <Skeleton.Row key={i} cols={4} />)}</tbody></table>
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
