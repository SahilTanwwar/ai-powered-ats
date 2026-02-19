import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/api";
import { useToast } from "../context/ToastContext";
import useDebouncedValue from "../hooks/useDebouncedValue";
import useIsMobile from "../hooks/useIsMobile";
import AppLayout from "../layout/AppLayout";
import { Card, Btn, Input, Modal, Skeleton, Badge, Icon, PageWrap, ScoreRing, EmptyState } from "../components/UI";
import { T } from "../theme";

const STATUSES = ["APPLIED", "SHORTLISTED", "HIRED", "REJECTED"];
const PAGE_SIZE = 8;
const FILTER_KEY = "ats_candidates_filters_v1";

function getSavedFilters() {
  try {
    const raw = localStorage.getItem(FILTER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function Candidates() {
  const saved = getSavedFilters();
  const [jobs, setJobs] = useState([]);
  const [jobId, setJobId] = useState(saved?.jobId || "");
  const [rows, setRows] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingRows, setLoadingRows] = useState(false);
  const [err, setErr] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [upload, setUpload] = useState({ name: "", email: "", phone: "", file: null });
  const [query, setQuery] = useState(saved?.query || "");
  const [statusFilter, setStatusFilter] = useState(saved?.statusFilter || "ALL");
  const [sortBy, setSortBy] = useState(saved?.sortBy || "score_desc");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { success, error } = useToast();

  const debouncedQuery = useDebouncedValue(query, 280);

  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);
      const res = await api.get("/jobs");
      const list = res.data || [];
      setJobs(list);
      if (list.length && !jobId) setJobId(String(list[0].id));
    } catch (e) {
      const msg = e?.response?.data?.message || "Failed to load jobs.";
      setErr(msg);
      error(msg);
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchCandidates = async (jid) => {
    if (!jid) return;
    try {
      setLoadingRows(true);
      const res = await api.get(`/candidates/job/${jid}`);
      setRows(res.data?.data || res.data || []);
      setErr("");
    } catch (e) {
      const msg = e?.response?.data?.message || "Failed to load candidates.";
      setErr(msg);
      error(msg);
    } finally {
      setLoadingRows(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    fetchCandidates(jobId);
  }, [jobId]);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    let list = rows.filter((row) => {
      const hit = !q || `${row.name || ""} ${row.email || ""}`.toLowerCase().includes(q);
      const statusHit = statusFilter === "ALL" || row.status === statusFilter;
      return hit && statusHit;
    });

    const score = (c) => c.atsScore ?? c.hybridScore ?? 0;

    if (sortBy === "score_desc") list = [...list].sort((a, b) => score(b) - score(a));
    if (sortBy === "score_asc") list = [...list].sort((a, b) => score(a) - score(b));
    if (sortBy === "name") list = [...list].sort((a, b) => (a.name || "").localeCompare(b.name || ""));

    return list;
  }, [debouncedQuery, rows, statusFilter, sortBy]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, statusFilter, sortBy, jobId]);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  useEffect(() => {
    localStorage.setItem(FILTER_KEY, JSON.stringify({ jobId, query, statusFilter, sortBy }));
  }, [jobId, query, statusFilter, sortBy]);

  const onUpload = async (e) => {
    e.preventDefault();
    if (!jobId || !upload.file) {
      const msg = "Please select a job and resume file.";
      setErr(msg);
      error(msg);
      return;
    }
    setErr("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("name", upload.name);
      fd.append("email", upload.email);
      fd.append("phone", upload.phone);
      fd.append("jobId", jobId);
      fd.append("resume", upload.file);
      await api.post("/candidates/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setUploadOpen(false);
      setUpload({ name: "", email: "", phone: "", file: null });
      await fetchCandidates(jobId);
      success("Candidate uploaded and scored.");
    } catch (e) {
      const msg = e?.response?.data?.message || "Upload failed.";
      setErr(msg);
      error(msg);
    } finally {
      setUploading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/candidates/${id}/status`, { status });
      success("Status updated.");
      fetchCandidates(jobId);
    } catch (e) {
      const msg = e?.response?.data?.message || "Failed to update status.";
      setErr(msg);
      error(msg);
    }
  };

  const exportCsv = () => {
    const rowsCsv = filtered.map((row) => ({
      Name: row.name || "",
      Email: row.email || "",
      Phone: row.phone || "",
      Score: row.atsScore ?? row.hybridScore ?? 0,
      Status: row.status || "",
      JobId: row.jobId || "",
      CreatedAt: row.createdAt || "",
    }));

    const header = Object.keys(rowsCsv[0] || { Name: "", Email: "", Phone: "", Score: "", Status: "", JobId: "", CreatedAt: "" });
    const lines = [
      header.join(","),
      ...rowsCsv.map((row) =>
        header.map((key) => `"${String(row[key] ?? "").replace(/"/g, "\"\"")}"`).join(",")
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "candidates-export.csv";
    a.click();
    URL.revokeObjectURL(url);
    success("Candidates CSV exported.");
  };

  const set = (key) => (e) => setUpload((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <AppLayout title="Candidates">
      <PageWrap>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: T.text, letterSpacing: -0.4, marginBottom: 3 }}>Candidates</h2>
            <p style={{ fontSize: 13, color: T.textLight }}>AI-ranked by ATS score</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="secondary" onClick={exportCsv} disabled={filtered.length === 0}>Export CSV</Btn>
            <Btn variant="primary" icon={<Icon.Upload />} onClick={() => setUploadOpen(true)} disabled={!jobId}>Upload Resume</Btn>
          </div>
        </div>

        {err && <div style={{ padding: "10px 14px", background: T.dangerSoft, border: `1px solid ${T.danger}30`, borderRadius: T.r10, fontSize: 13, color: T.danger, marginBottom: 16 }}>{err}</div>}

        <Card style={{ padding: "14px", marginBottom: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: T.textMid, whiteSpace: "nowrap" }}>Job</span>
              {loadingJobs ? (
                <Skeleton style={{ height: 36, width: 220 }} />
              ) : (
                <select value={jobId} onChange={(e) => setJobId(e.target.value)} style={{ border: `1px solid ${T.border}`, borderRadius: T.r10, padding: "8px 12px", fontSize: 13.5, color: T.text, background: T.white, minWidth: 220 }}>
                  {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
                </select>
              )}
            </div>
            <Input aria-label="Search candidates" placeholder="Search by name or email" icon={<Icon.Search />} value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10 }}>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ border: `1px solid ${T.border}`, borderRadius: T.r10, padding: "9px 11px", background: T.white }}>
              <option value="ALL">All statuses</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ border: `1px solid ${T.border}`, borderRadius: T.r10, padding: "9px 11px", background: T.white }}>
              <option value="score_desc">Highest score</option>
              <option value="score_asc">Lowest score</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </Card>

        {loadingRows ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{[1, 2, 3, 4].map((i) => <Skeleton key={i} style={{ height: 72 }} />)}</div>
        ) : filtered.length === 0 ? (
          <Card>
            <EmptyState
              icon=""
              title="No candidates found"
              sub="Try changing filters or upload more resumes."
              action={<Btn variant="primary" icon={<Icon.Upload />} onClick={() => setUploadOpen(true)}>Upload Resume</Btn>}
            />
          </Card>
        ) : isMobile ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {paginated.map((c) => (
              <Card key={c.id} hover onClick={() => navigate(`/candidates/${c.id}`)} style={{ padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: T.text }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: T.textLight }}>{c.email}</div>
                  </div>
                  <ScoreRing score={c.atsScore ?? c.hybridScore ?? 0} size={48} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Badge status={c.status} />
                  <select value={c.status} onChange={(e) => updateStatus(c.id, e.target.value)} style={{ border: `1px solid ${T.border}`, borderRadius: T.r8, padding: "6px 9px", fontSize: 12.5, background: T.white }}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card style={{ overflowX: "auto" }}>
            <div style={{ minWidth: 780 }}>
              <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr 80px 130px 160px", padding: "10px 20px", background: T.bg, borderBottom: `1px solid ${T.border}` }}>
                {["#", "Candidate", "Email", "Score", "Status", "Action"].map((h) => <div key={h} style={{ fontSize: 11, fontWeight: 700, color: T.textLight, textTransform: "uppercase" }}>{h}</div>)}
              </div>
              {paginated.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  style={{ display: "grid", gridTemplateColumns: "40px 1fr 1fr 80px 130px 160px", padding: "14px 20px", borderBottom: `1px solid ${T.border}`, alignItems: "center", cursor: "pointer" }}
                  onClick={(e) => {
                    if (e.target.tagName !== "SELECT") navigate(`/candidates/${c.id}`);
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 700, color: T.textLight }}>#{(page - 1) * PAGE_SIZE + i + 1}</span>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: T.text }}>{c.name}</span>
                  <span style={{ fontSize: 13, color: T.textLight }}>{c.email}</span>
                  <ScoreRing score={c.atsScore ?? c.hybridScore ?? 0} size={44} />
                  <Badge status={c.status} />
                  <div onClick={(e) => e.stopPropagation()}>
                    <select value={c.status} onChange={(e) => updateStatus(c.id, e.target.value)} style={{ border: `1px solid ${T.border}`, borderRadius: T.r8, padding: "6px 10px", fontSize: 12.5, background: T.white }}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        )}

        {filtered.length > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
            <span style={{ fontSize: 12.5, color: T.textLight }}>Page {page} of {pageCount}</span>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn size="sm" variant="secondary" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Btn>
              <Btn size="sm" variant="secondary" disabled={page === pageCount} onClick={() => setPage((p) => Math.min(pageCount, p + 1))}>Next</Btn>
            </div>
          </div>
        )}

        <Modal open={uploadOpen} title="Upload Candidate Resume" onClose={() => { setUploadOpen(false); setErr(""); }}>
          <form onSubmit={onUpload} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
              <Input label="Full Name *" placeholder="John Doe" value={upload.name} onChange={set("name")} required />
              <Input label="Email *" type="email" placeholder="john@email.com" value={upload.email} onChange={set("email")} required />
            </div>
            <Input label="Phone" placeholder="+1 555 000 0000" value={upload.phone} onChange={set("phone")} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: T.textMid }}>Resume File *</label>
              <div style={{ border: `2px dashed ${upload.file ? T.lime : T.border}`, borderRadius: T.r10, padding: 20, textAlign: "center", cursor: "pointer", background: upload.file ? T.limeSoft : T.bg }} onClick={() => document.getElementById("resume-file-input")?.click()}>
                <input id="resume-file-input" type="file" accept=".pdf,.docx" style={{ display: "none" }} onChange={(e) => setUpload((u) => ({ ...u, file: e.target.files?.[0] || null }))} required />
                <div style={{ fontSize: 13, fontWeight: 600, color: upload.file ? "#3a4a0a" : T.textMid }}>
                  {upload.file ? upload.file.name : "Click to upload PDF or DOCX"}
                </div>
              </div>
            </div>
            {err && <div style={{ fontSize: 13, color: T.danger, fontWeight: 500 }}>{err}</div>}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 4 }}>
              <Btn type="button" variant="secondary" onClick={() => { setUploadOpen(false); setErr(""); }}>Cancel</Btn>
              <Btn type="submit" variant="primary" loading={uploading}>{uploading ? "Processing..." : "Upload & Score"}</Btn>
            </div>
          </form>
        </Modal>
      </PageWrap>
    </AppLayout>
  );
}
