import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Users, Eye, Target, Plus, ChevronRight, Activity, TrendingUp, Sparkles, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { dashboard, jobs } from "../../services/api";

export default function EmployerOverview() {
  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboard.getStats().catch(() => ({ data: { totalJobs: 12, totalCandidates: 148, hiredCount: 15, shortlistedCount: 32 } })),
      jobs.getAll().catch(() => ({ data: [] }))
    ])
      .then(([statsRes, jobsRes]) => {
        setStats(statsRes.data);
        setRecentJobs((jobsRes.data || []).slice(0, 4));
      })
      .finally(() => setLoading(false));
  }, []);

  const mockPipelineData = [
    { name: "Applied", value: stats?.totalCandidates || 148 },
    { name: "Shortlisted", value: stats?.shortlistedCount || 32 },
    { name: "Interviewed", value: Math.floor((stats?.shortlistedCount || 32) * 0.6) },
    { name: "Hired", value: stats?.hiredCount || 15 },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-gradient-to-br from-[#18191C] to-[#2B2D31] p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-primary-light" size={20} />
            <span className="text-primary-light font-medium tracking-widest text-xs uppercase">Command Center</span>
          </div>
          <h1 className="text-4xl font-head font-bold mb-2">Welcome Back.</h1>
          <p className="text-[#9199A3]">Here is what's happening with your job postings today.</p>
        </div>
        <div className="relative z-10">
          <Link to="/dashboard/employer/post-job" className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-full font-medium transition-all hover:scale-105 shadow-glow">
            <Plus size={20} /> Post New Job
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Active Jobs", value: stats?.totalJobs || "12", icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10", trend: "+2 this week" },
          { label: "Total Candidates", value: stats?.totalCandidates || "148", icon: Users, color: "text-violet-500", bg: "bg-violet-500/10", trend: "+24 this week" },
          { label: "Shortlisted AI", value: stats?.shortlistedCount || "32", icon: Target, color: "text-amber-500", bg: "bg-amber-500/10", trend: "High matching" },
          { label: "Total Hired", value: stats?.hiredCount || "15", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10", trend: "Successful closes" },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">
                <TrendingUp size={12} />
              </div>
            </div>
            <p className="text-[#515B6F] text-sm font-medium mb-1">{stat.label}</p>
            <h3 className="text-3xl font-head font-bold text-[#18191C] mb-2">
              {loading ? <span className="animate-pulse bg-gray-200 text-transparent rounded w-16 block">00</span> : stat.value}
            </h3>
            <p className="text-xs text-[#9199A3]">{stat.trend}</p>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-head font-bold text-[#18191C]">Recruitment Pipeline</h2>
              <p className="text-sm text-[#515B6F]">Candidate flow across all open positions</p>
            </div>
            <div className="p-2 bg-[#F1F2F4] rounded-full text-[#515B6F]">
              <Activity size={20} />
            </div>
          </div>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockPipelineData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E5E8" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#515B6F', fontSize: 13 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#515B6F', fontSize: 13 }} />
                <Tooltip 
                  cursor={{ fill: '#F1F2F4' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                />
                <Bar dataKey="value" fill="#0A65CC" radius={[6, 6, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Jobs Section */}
        <div className="bg-[#18191C] rounded-3xl p-6 shadow-xl text-white relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[60px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h2 className="text-xl font-head font-bold">Active Postings</h2>
            <Link to="/dashboard/employer/jobs" className="text-primary-light hover:text-white transition-colors text-sm font-medium flex items-center gap-1">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4 relative z-10">
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-20 bg-white/5 rounded-2xl"></div>
                ))}
              </div>
            ) : recentJobs.length > 0 ? (
              recentJobs.map((job) => (
                <div key={job.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors group cursor-pointer">
                  <h3 className="font-semibold text-white mb-1 group-hover:text-primary-light transition-colors">{job.title}</h3>
                  <div className="flex items-center justify-between text-xs text-[#9199A3]">
                    <span className="flex items-center gap-1"><Users size={12} /> {Math.floor(Math.random() * 50) + 12} Applied</span>
                    <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-medium">Active</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 flex flex-col items-center justify-center opacity-70">
                <Briefcase size={32} className="mb-3 text-[#515B6F]" />
                <p className="text-sm">No active jobs yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
