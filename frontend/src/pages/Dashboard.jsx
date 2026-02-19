import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import api from "../api/api";
import { useAuth } from "../auth/AuthContext";
import AppLayout from "../layout/AppLayout";
import { Card, Skeleton, Btn, Icon, PageWrap } from "../components/UI";
import { T } from "../theme";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

function StatCard({ label, value, icon, color, sub, loading }) {
  return (
    <motion.div variants={fadeUp}>
      <Card style={{ padding: "22px 24px" }} hover>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: T.textMid }}>{label}</span>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", color }}>
            {icon}
          </div>
        </div>
        {loading
          ? <Skeleton style={{ height: 36, width: 80, marginBottom: 8 }} />
          : <div style={{ fontSize: 32, fontWeight: 800, color: T.text, letterSpacing: -1, lineHeight: 1, marginBottom: 6 }}>{(value ?? 0).toLocaleString()}</div>
        }
        {sub && <div style={{ fontSize: 12, color: T.textLight, fontWeight: 500 }}>{sub}</div>}
      </Card>
    </motion.div>
  );
}

function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
      <div style={{ fontSize: 11, color: T.textLight, marginBottom: 6, fontWeight: 600 }}>{label}</div>
      {payload.map(p => <div key={p.dataKey} style={{ fontSize: 13, fontWeight: 700, color: p.fill, marginBottom: 2 }}>{p.name}: {p.value}</div>)}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/dashboard").then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const hiringPct = stats ? Math.round((stats.hiredCount / (stats.totalCandidates || 1)) * 100) : 0;
  const barData = stats?.weeklyApplications || [];

  return (
    <AppLayout title="Dashboard">
      <PageWrap>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: T.text, letterSpacing: -0.6, marginBottom: 4 }}>
            Good morning, {user?.email?.split("@")[0]}
          </h2>
          <p style={{ fontSize: 13.5, color: T.textLight }}>Here's your recruitment pipeline at a glance.</p>
        </div>

        <motion.div variants={stagger} initial="hidden" animate="show"
          className="responsive-grid-4" style={{ marginBottom: 24 }}>
          <StatCard label="Total Jobs" value={stats?.totalJobs} icon={<Icon.Briefcase />} color={T.indigo} sub="Active positions" loading={loading} />
          <StatCard label="Candidates" value={stats?.totalCandidates} icon={<Icon.Users />} color="#f59e0b" sub="Across all jobs" loading={loading} />
          <StatCard label="Hired" value={stats?.hiredCount} icon={<Icon.Check />} color={T.success} sub={`${hiringPct}% conversion`} loading={loading} />
          <StatCard label="Shortlisted" value={stats?.shortlistedCount} icon={<Icon.Star />} color="#8b5cf6" sub="Awaiting review" loading={loading} />
        </motion.div>

        <div className="responsive-split" style={{ marginBottom: 24 }}>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card style={{ padding: "22px 22px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: T.text, marginBottom: 4 }}>Weekly Applications</div>
                  <div style={{ display: "flex", gap: 14 }}>
                    {[{ c: "#c7d2fe", l: "Applied" }, { c: T.lime, l: "Shortlisted" }].map(x => (
                      <span key={x.l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: T.textLight, fontWeight: 600 }}>
                        <span style={{ width: 9, height: 9, borderRadius: 2, background: x.c, display: "inline-block" }} />{x.l}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={barData} barGap={4} barCategoryGap="35%">
                  <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: T.textLight }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: T.textLight }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: T.bg }} />
                  <Bar dataKey="Applied" name="Applied" fill="#c7d2fe" radius={[5,5,0,0]} />
                  <Bar dataKey="Shortlisted" name="Shortlisted" fill={T.lime} radius={[5,5,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <Card style={{ padding: "22px", height: "100%" }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: T.text, marginBottom: 4 }}>Hiring Funnel</div>
              <div style={{ fontSize: 12, color: T.textLight, marginBottom: 20 }}>Pipeline overview</div>
              {[
                { label: "Applied",     val: stats?.totalCandidates || 0,                              color: T.indigo  },
                { label: "Shortlisted", val: stats?.shortlistedCount || 0,                             color: "#8b5cf6" },
                { label: "Hired",       val: stats?.hiredCount || 0,                                   color: T.success },
                { label: "Rejected",    val: stats?.rejectedCount || 0,                                color: T.danger  },
              ].map(({ label, val, color }) => {
                const pct = stats?.totalCandidates ? Math.round((val / stats.totalCandidates) * 100) : 0;
                return (
                  <div key={label} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: T.textMid }}>{label}</span>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color }}>{val}</span>
                    </div>
                    <div style={{ height: 6, background: T.bg, borderRadius: 99, overflow: "hidden" }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.5 }}
                        style={{ height: "100%", background: color, borderRadius: 99 }} />
                    </div>
                  </div>
                );
              })}
            </Card>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <Card style={{ padding: "20px 24px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 14 }}>Quick Actions</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Btn variant="primary" icon={<Icon.Plus />} onClick={() => navigate("/jobs")}>Post New Job</Btn>
              <Btn variant="secondary" icon={<Icon.Upload />} onClick={() => navigate("/candidates")}>Upload Resume</Btn>
              <Btn variant="secondary" icon={<Icon.Users />} onClick={() => navigate("/candidates")}>View Candidates</Btn>
            </div>
          </Card>
        </motion.div>
      </PageWrap>
    </AppLayout>
  );
}
