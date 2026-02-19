import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/api";
import { useToast } from "../context/ToastContext";
import useDebouncedValue from "../hooks/useDebouncedValue";
import AppLayout from "../layout/AppLayout";
import { Card, Btn, Input, Textarea, Modal, Skeleton, Icon, PageWrap, EmptyState } from "../components/UI";
import { T } from "../theme";

const PAGE_SIZE = 6;
const FILTER_KEY = "ats_jobs_filters_v1";

function getSavedFilters() {
  try {
    const raw = localStorage.getItem(FILTER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function JobCard({ job, index, onClick }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05, duration: 0.3 }}>
      <Card hover onClick={onClick} style={{ padding: "20px 22px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14.5, fontWeight: 800, color: T.text, marginBottom: 4 }}>{job.title}</div>
            <div style={{ fontSize: 12.5, color: T.textLight, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {job.description}
            </div>
          </div>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: T.indigoSoft, display: "flex", alignItems: "center", justifyContent: "center", color: T.indigo, flexShrink: 0, marginLeft: 12 }}>
            <Icon.Briefcase />
          </div>
        </div>

        {!!job.requiredSkills?.length && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
            {job.requiredSkills.slice(0, 4).map((skill) => (
              <span key={skill} style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 99, background: T.bg, color: T.textMid, border: `1px solid ${T.border}` }}>
                {skill}
              </span>
            ))}
            {job.requiredSkills.length > 4 && <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 99, background: T.bg, color: T.textLight }}>+{job.requiredSkills.length - 4}</span>}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
          <span style={{ fontSize: 12, color: T.textLight }}>{job.experienceRequired || "Experience not specified"}</span>
          <span style={{ fontSize: 11.5, color: T.textLight }}>{new Date(job.createdAt).toLocaleDateString()}</span>
        </div>
      </Card>
    </motion.div>
  );
}

export default function Jobs() {
  const saved = getSavedFilters();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [query, setQuery] = useState(saved?.query || "");
  const [sortBy, setSortBy] = useState(saved?.sortBy || "newest");
  const [recentOnly, setRecentOnly] = useState(Boolean(saved?.recentOnly));
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({ title: "", description: "", requiredSkills: "", experienceRequired: "" });
  const navigate = useNavigate();
  const { success, error } = useToast();

  const debouncedQuery = useDebouncedValue(query, 280);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/jobs");
      setJobs(res.data || []);
      setErr("");
    } catch (e) {
      const msg = e?.response?.data?.message || "Failed to load jobs.";
      setErr(msg);
      error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    const cutoff = Date.now() - 1000 * 60 * 60 * 24 * 30;

    let list = jobs.filter((job) => {
      const hit = !q || [job.title, job.description, ...(job.requiredSkills || [])].join(" ").toLowerCase().includes(q);
      const recentHit = !recentOnly || new Date(job.createdAt).getTime() >= cutoff;
      return hit && recentHit;
    });

    if (sortBy === "oldest") list = [...list].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sortBy === "title") list = [...list].sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    if (sortBy === "newest") list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return list;
  }, [debouncedQuery, jobs, recentOnly, sortBy]);

  const pageCount = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE));
  const paginatedJobs = filteredJobs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, sortBy, recentOnly]);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  useEffect(() => {
    localStorage.setItem(FILTER_KEY, JSON.stringify({ query, sortBy, recentOnly }));
  }, [query, sortBy, recentOnly]);

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const createJob = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      const msg = "Title and description are required.";
      setErr(msg);
      error(msg);
      return;
    }

    setErr("");
    setSubmitting(true);
    try {
      await api.post("/jobs", {
        ...form,
        requiredSkills: form.requiredSkills ? form.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean) : [],
      });
      success("Job created successfully.");
      setOpen(false);
      setForm({ title: "", description: "", requiredSkills: "", experienceRequired: "" });
      fetchJobs();
    } catch (e) {
      const msg = e?.response?.data?.message || "Failed to create job.";
      setErr(msg);
      error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const exportCsv = () => {
    const rows = filteredJobs.map((job) => ({
      Title: job.title || "",
      Description: (job.description || "").replace(/\n/g, " "),
      Skills: (job.requiredSkills || []).join(", "),
      Experience: job.experienceRequired || "",
      CreatedAt: job.createdAt || "",
    }));

    const header = Object.keys(rows[0] || { Title: "", Description: "", Skills: "", Experience: "", CreatedAt: "" });
    const lines = [
      header.join(","),
      ...rows.map((row) =>
        header.map((key) => `"${String(row[key] ?? "").replace(/"/g, "\"\"")}"`).join(",")
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "jobs-export.csv";
    a.click();
    URL.revokeObjectURL(url);
    success("Jobs CSV exported.");
  };

  return (
    <AppLayout title="Jobs">
      <PageWrap>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, gap: 8, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: T.text, letterSpacing: -0.4, marginBottom: 3 }}>All Jobs</h2>
            <p style={{ fontSize: 13, color: T.textLight }}>{filteredJobs.length} matching position{filteredJobs.length !== 1 ? "s" : ""}</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="secondary" onClick={exportCsv} disabled={filteredJobs.length === 0}>Export CSV</Btn>
            <Btn variant="primary" icon={<Icon.Plus />} onClick={() => setOpen(true)}>Create Job</Btn>
          </div>
        </div>

        <Card style={{ padding: 14, marginBottom: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 10 }}>
            <Input aria-label="Search jobs" placeholder="Search jobs by title, description, skill" icon={<Icon.Search />} value={query} onChange={(e) => setQuery(e.target.value)} />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ border: `1px solid ${T.border}`, borderRadius: T.r10, padding: "9px 11px", background: T.white }}>
              <option value="newest">Latest first</option>
              <option value="oldest">Oldest first</option>
              <option value="title">Title A-Z</option>
            </select>
            <label style={{ display: "flex", alignItems: "center", gap: 8, border: `1px solid ${T.border}`, borderRadius: T.r10, padding: "0 12px", fontSize: 13, color: T.textMid }}>
              <input type="checkbox" checked={recentOnly} onChange={(e) => setRecentOnly(e.target.checked)} /> Last 30 days
            </label>
          </div>
        </Card>

        {err && <div style={{ padding: "10px 14px", background: T.dangerSoft, border: `1px solid ${T.danger}30`, borderRadius: T.r10, fontSize: 13, color: T.danger, marginBottom: 16 }}>{err}</div>}

        {loading ? (
          <div className="responsive-grid-3">{[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} style={{ height: 180 }} />)}</div>
        ) : filteredJobs.length === 0 ? (
          <Card>
            <EmptyState
              icon=""
              title="No jobs found"
              sub="Try changing filters or create a new role."
              action={<Btn variant="primary" icon={<Icon.Plus />} onClick={() => setOpen(true)}>Create Job</Btn>}
            />
          </Card>
        ) : (
          <>
            <div className="responsive-grid-3">
              {paginatedJobs.map((job, i) => (
                <JobCard key={job.id} job={job} index={i} onClick={() => navigate(`/jobs/${job.id}`)} />
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
              <span style={{ fontSize: 12.5, color: T.textLight }}>Page {page} of {pageCount}</span>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn size="sm" variant="secondary" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Btn>
                <Btn size="sm" variant="secondary" disabled={page === pageCount} onClick={() => setPage((p) => Math.min(pageCount, p + 1))}>Next</Btn>
              </div>
            </div>
          </>
        )}

        <Modal open={open} title="Create New Job" onClose={() => { setOpen(false); setErr(""); }}>
          <form onSubmit={createJob} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input label="Job Title *" placeholder="e.g. Senior React Developer" value={form.title} onChange={set("title")} required />
            <Textarea label="Job Description *" placeholder="Describe the role and responsibilities" value={form.description} onChange={set("description")} required />
            <Input label="Required Skills" placeholder="React, Node.js, PostgreSQL" value={form.requiredSkills} onChange={set("requiredSkills")} />
            <Input label="Experience Required" placeholder="e.g. 2-4 years" value={form.experienceRequired} onChange={set("experienceRequired")} />
            {err && <div style={{ fontSize: 13, color: T.danger, fontWeight: 500 }}>{err}</div>}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 4 }}>
              <Btn type="button" variant="secondary" onClick={() => { setOpen(false); setErr(""); }}>Cancel</Btn>
              <Btn type="submit" variant="primary" loading={submitting}>Create Job</Btn>
            </div>
          </form>
        </Modal>
      </PageWrap>
    </AppLayout>
  );
}
