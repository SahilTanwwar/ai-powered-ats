import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/api";
import AppLayout from "../layout/AppLayout";
import { Card, Btn, Badge, Icon, PageWrap, Skeleton, ScoreRing } from "../components/UI";
import { T } from "../theme";

const STATUSES = ["APPLIED", "SHORTLISTED", "HIRED", "REJECTED"];

function SkillTag({ skill, type }) {
  const matched = type === "matched";
  return (
    <span style={{
      fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 99,
      background: matched ? T.successSoft : T.dangerSoft,
      color: matched ? T.success : T.danger,
      border: `1px solid ${matched ? T.success : T.danger}30`,
      display: "inline-flex", alignItems: "center", gap: 4,
    }}>
      {matched ? "✓" : "✗"} {skill}
    </span>
  );
}

function Section({ title, children }) {
  return (
    <Card style={{ padding: "22px", marginBottom: 16 }}>
      <div style={{ fontSize: 13.5, fontWeight: 800, color: T.text, marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${T.border}` }}>{title}</div>
      {children}
    </Card>
  );
}

export default function CandidateDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [job, setJob] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loadingQ, setLoadingQ] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    // We need to find the candidate — fetch from job listing
    // Since there's no GET /candidates/:id endpoint, we use the jobId from state or re-fetch
    // For now, pull from all jobs and find the candidate
    const load = async () => {
      try {
        // Try to find candidate by fetching jobs then candidates
        const jobsRes = await api.get("/jobs");
        for (const j of (jobsRes.data || [])) {
          const candRes = await api.get(`/candidates/job/${j.id}`);
          const list = candRes.data?.data || candRes.data || [];
          const found = list.find(c => String(c.id) === String(id));
          if (found) { setCandidate(found); setJob(j); break; }
        }
      } catch (e) { setErr(e?.response?.data?.message || "Failed to load."); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  const updateStatus = async (status) => {
    setUpdatingStatus(true);
    try {
      await api.patch(`/candidates/${id}/status`, { status });
      setCandidate(c => ({ ...c, status }));
    } catch (e) { setErr("Failed to update status."); }
    finally { setUpdatingStatus(false); }
  };

  const generateQuestions = async () => {
    setLoadingQ(true);
    try {
      const res = await api.get(`/candidates/${id}/interview-questions`);
      setQuestions(res.data?.questions || []);
    } catch (e) { setErr("Failed to generate questions."); }
    finally { setLoadingQ(false); }
  };

  if (loading) return (
    <AppLayout title="Candidate">
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Skeleton style={{ height: 140 }} />
        <Skeleton style={{ height: 200 }} />
        <Skeleton style={{ height: 200 }} />
      </div>
    </AppLayout>
  );

  if (!candidate) return (
    <AppLayout title="Candidate">
      <Card style={{ padding: "40px", textAlign: "center" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 8 }}>Candidate not found</div>
        <Btn variant="secondary" onClick={() => navigate("/candidates")}>Back to Candidates</Btn>
      </Card>
    </AppLayout>
  );

  const bd = candidate.scoreBreakdown || {};
  const score = candidate.atsScore ?? candidate.hybridScore ?? 0;

  return (
    <AppLayout title={candidate.name}>
      <PageWrap>
        <Btn variant="ghost" icon={<Icon.ArrowLeft />} onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>Back</Btn>

        {err && <div style={{ padding: "10px 14px", background: T.dangerSoft, color: T.danger, borderRadius: T.r10, marginBottom: 16, fontSize: 13 }}>{err}</div>}

        {/* Hero card */}
        <Card style={{ padding: "24px", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
            {/* Avatar */}
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#C8F135,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 24, color: "#fff", flexShrink: 0 }}>
              {candidate.name?.[0]?.toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6, flexWrap: "wrap" }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: T.text, letterSpacing: -0.5 }}>{candidate.name}</h2>
                <Badge status={candidate.status} />
              </div>
              <div style={{ fontSize: 13.5, color: T.textLight, marginBottom: 4 }}>{candidate.email}</div>
              {candidate.phone && <div style={{ fontSize: 13.5, color: T.textLight }}>{candidate.phone}</div>}
              {job && <div style={{ marginTop: 8, fontSize: 12.5, color: T.textMid, fontWeight: 600 }}>Applied for: <span style={{ color: T.indigo }}>{job.title}</span></div>}
            </div>
            {/* Score */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <ScoreRing score={score} size={72} />
              <span style={{ fontSize: 11, color: T.textLight, fontWeight: 600 }}>ATS Score</span>
            </div>
          </div>
          {/* Status change */}
          <div style={{ display: "flex", gap: 8, marginTop: 20, paddingTop: 18, borderTop: `1px solid ${T.border}`, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: T.textMid, alignSelf: "center" }}>Move to:</span>
            {STATUSES.filter(s => s !== candidate.status).map(s => (
              <Btn key={s} size="sm" variant="secondary" loading={updatingStatus} onClick={() => updateStatus(s)}>{s}</Btn>
            ))}
          </div>
        </Card>

        {/* Score Breakdown */}
        <Section title="📊 AI Score Breakdown">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 16 }}>
            {[
              { label: "Skills Match", val: bd.skills ?? 0, color: T.indigo },
              { label: "Semantic Match", val: bd.semantic ?? 0, color: "#8b5cf6" },
              { label: "Experience", val: bd.experience ?? 0, color: T.success },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ textAlign: "center", padding: "16px", background: T.bg, borderRadius: T.r12 }}>
                <ScoreRing score={Math.round(val)} size={56} />
                <div style={{ fontSize: 12, fontWeight: 600, color: T.textMid, marginTop: 8 }}>{label}</div>
              </div>
            ))}
          </div>
          {candidate.aiMatchReason && (
            <div style={{ padding: "14px 16px", background: T.indigoSoft, borderRadius: T.r10, fontSize: 13, color: T.indigo, lineHeight: 1.6 }}>
              <strong>AI Insight:</strong> {candidate.aiMatchReason}
            </div>
          )}
        </Section>

        {/* Skills */}
        {((bd.matchedSkills?.length > 0) || (bd.missingSkills?.length > 0)) && (
          <Section title="🎯 Skills Analysis">
            {bd.matchedSkills?.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.textMid, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 }}>Matched Skills</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {bd.matchedSkills.map(s => <SkillTag key={s} skill={s} type="matched" />)}
                </div>
              </div>
            )}
            {bd.missingSkills?.length > 0 && (
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.textMid, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 }}>Missing Skills</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {bd.missingSkills.map(s => <SkillTag key={s} skill={s} type="missing" />)}
                </div>
              </div>
            )}
          </Section>
        )}

        {/* AI Summary */}
        {candidate.aiParsedJson?.summary && (
          <Section title="📝 Candidate Summary">
            <p style={{ fontSize: 13.5, color: T.textMid, lineHeight: 1.7 }}>{candidate.aiParsedJson.summary}</p>
          </Section>
        )}

        {/* Interview Questions */}
        <Section title="🎤 Interview Questions">
          {questions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "10px 0 6px" }}>
              <p style={{ fontSize: 13.5, color: T.textLight, marginBottom: 16 }}>Generate AI-powered interview questions tailored to this candidate.</p>
              <Btn variant="primary" icon={<Icon.MessageSquare />} loading={loadingQ} onClick={generateQuestions}>
                {loadingQ ? "Generating..." : "Generate Interview Questions"}
              </Btn>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {questions.map((q, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  style={{ display: "flex", gap: 14, padding: "14px 16px", background: T.bg, borderRadius: T.r10, alignItems: "flex-start" }}>
                  <div style={{ width: 26, height: 26, borderRadius: 8, background: T.indigo, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <p style={{ fontSize: 13.5, color: T.text, lineHeight: 1.6 }}>{q}</p>
                </motion.div>
              ))}
              <Btn variant="ghost" size="sm" onClick={() => setQuestions([])} style={{ alignSelf: "flex-start", color: T.textLight, marginTop: 4 }}>Regenerate</Btn>
            </div>
          )}
        </Section>
      </PageWrap>
    </AppLayout>
  );
}
