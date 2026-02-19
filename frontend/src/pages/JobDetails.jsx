import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/api";
import AppLayout from "../layout/AppLayout";
import { Card, Btn, Badge, Icon, PageWrap, Skeleton, ScoreRing, EmptyState } from "../components/UI";
import { T } from "../theme";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    Promise.all([api.get(`/jobs/${id}`), api.get(`/candidates/job/${id}`)])
      .then(([j, c]) => { setJob(j.data); setCandidates(c.data?.data || c.data || []); })
      .catch(e => setErr(e?.response?.data?.message || "Failed to load."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <AppLayout title="Job Details"><div style={{ display: "flex", flexDirection: "column", gap: 14 }}><Skeleton style={{ height: 140 }} /><Skeleton style={{ height: 300 }} /></div></AppLayout>;

  return (
    <AppLayout title={job?.title || "Job Details"}>
      <PageWrap>
        <Btn variant="ghost" icon={<Icon.ArrowLeft />} onClick={() => navigate("/jobs")} style={{ marginBottom: 20 }}>Back to Jobs</Btn>

        {err && <div style={{ padding: "10px 14px", background: T.dangerSoft, color: T.danger, borderRadius: T.r10, marginBottom: 16, fontSize: 13 }}>{err}</div>}

        {job && (
          <Card style={{ padding: "24px", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 18 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: T.indigoSoft, display: "flex", alignItems: "center", justifyContent: "center", color: T.indigo, flexShrink: 0 }}>
                <Icon.Briefcase />
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: T.text, marginBottom: 6 }}>{job.title}</h2>
                <p style={{ fontSize: 13.5, color: T.textLight, lineHeight: 1.6 }}>{job.description}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 28, flexWrap: "wrap", paddingTop: 18, borderTop: `1px solid ${T.border}` }}>
              {job.experienceRequired && (
                <div>
                  <div style={{ fontSize: 11, color: T.textLight, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 5 }}>Experience</div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: T.text }}>{job.experienceRequired}</div>
                </div>
              )}
              {Array.isArray(job.requiredSkills) && job.requiredSkills.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, color: T.textLight, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Required Skills</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {job.requiredSkills.map(s => (
                      <span key={s} style={{ fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 99, background: T.limeSoft, color: "#3a4a0a", border: `1px solid ${T.lime}50` }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: T.text }}>Candidates ({candidates.length})</h3>
          <Btn variant="secondary" icon={<Icon.Plus />} onClick={() => navigate("/candidates")}>Upload Candidate</Btn>
        </div>

        {candidates.length === 0 ? (
          <Card><EmptyState icon="👤" title="No candidates yet" sub="Upload resumes for this job to start AI screening." action={<Btn variant="primary" onClick={() => navigate("/candidates")}>Upload Resume</Btn>} /></Card>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {candidates.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card hover onClick={() => navigate(`/candidates/${c.id}`)} style={{ padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#C8F135,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, color: "#fff", flexShrink: 0 }}>
                      {c.name?.[0]?.toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 2 }}>{c.name}</div>
                      <div style={{ fontSize: 12.5, color: T.textLight }}>{c.email}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {c.rank && <span style={{ fontSize: 11, fontWeight: 700, color: T.textLight }}>#{c.rank}</span>}
                      <ScoreRing score={c.atsScore ?? c.hybridScore ?? 0} size={46} />
                      <Badge status={c.status} />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </PageWrap>
    </AppLayout>
  );
}
