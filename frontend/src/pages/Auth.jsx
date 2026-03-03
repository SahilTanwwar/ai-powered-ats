import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/api";
import { useAuth } from "../auth/AuthContext";
import { Btn, Input, Spinner, Icon } from "../components/UI";
import { useToast } from "../context/ToastContext";
import { T } from "../theme";

function AuthShell({ children, title, sub }) {
  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: 24 }}>
          <div style={{ width: 36, height: 36, background: T.lime, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon.Zap />
          </div>
          <span style={{ fontSize: 20, fontWeight: 800, color: T.text, letterSpacing: -0.5 }}>HireAI</span>
        </div>
        <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 18, padding: 28, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: T.text, letterSpacing: -0.5, marginBottom: 4 }}>{title}</h2>
            <p style={{ fontSize: 13.5, color: T.textLight }}>{sub}</p>
          </div>
          {children}
        </div>
      </motion.div>
    </div>
  );
}

export function Login() {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const { success, error } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      setToken(res.data.token);
      success("Signed in successfully.");
      navigate("/dashboard", { replace: true });
    } catch (e) {
      const msg = e?.response?.data?.message || "Invalid credentials.";
      setErr(msg);
      error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome back" sub="Sign in to your HireAI workspace">
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Input label="Email address" type="email" placeholder="you@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <div style={{ position: "relative" }}>
          <Input label="Password" type={showPwd ? "text" : "password"} placeholder="Enter password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <button type="button" onClick={() => setShowPwd((v) => !v)} style={{ position: "absolute", right: 12, bottom: 10, background: "none", border: "none", color: T.textLight, display: "flex" }} aria-label="Toggle password visibility">
            <Icon.Eye />
          </button>
        </div>
        {err && <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} style={{ padding: "10px 14px", background: T.dangerSoft, border: `1px solid ${T.danger}30`, borderRadius: T.r10, fontSize: 13, color: T.danger, fontWeight: 500 }}>{err}</motion.div>}
        <Btn type="submit" variant="primary" size="lg" loading={loading} style={{ width: "100%", marginTop: 4 }}>{loading ? "Signing in..." : "Sign in"}</Btn>
        <p style={{ textAlign: "center", fontSize: 13, color: T.textLight }}>
          Do not have an account? <Link to="/register" style={{ color: T.indigo, fontWeight: 700 }}>Register</Link>
        </p>
      </form>
    </AuthShell>
  );
}

export function Register() {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      const msg = "Passwords do not match.";
      setErr(msg);
      error(msg);
      return;
    }
    if (form.password.length < 6) {
      const msg = "Password must be at least 6 characters.";
      setErr(msg);
      error(msg);
      return;
    }

    setErr("");
    setLoading(true);
    try {
      await api.post("/auth/register", { email: form.email, password: form.password });
      setDone(true);
      success("Account created.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (e) {
      const msg = e?.response?.data?.message || "Registration failed.";
      setErr(msg);
      error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <AuthShell title="Account created" sub="Redirecting to sign in">
        <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
          <Spinner size={32} />
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Create account" sub="Join HireAI and start hiring smarter">
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Input label="Email address" type="email" placeholder="you@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <Input label="Password" type="password" placeholder="Min. 6 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <Input label="Confirm password" type="password" placeholder="Repeat password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} required />
        {err && <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} style={{ padding: "10px 14px", background: T.dangerSoft, border: `1px solid ${T.danger}30`, borderRadius: T.r10, fontSize: 13, color: T.danger, fontWeight: 500 }}>{err}</motion.div>}
        <Btn type="submit" variant="primary" size="lg" loading={loading} style={{ width: "100%", marginTop: 4 }}>{loading ? "Creating account..." : "Create account"}</Btn>
        <p style={{ textAlign: "center", fontSize: 13, color: T.textLight }}>
          Already have an account? <Link to="/login" style={{ color: T.indigo, fontWeight: 700 }}>Sign in</Link>
        </p>
      </form>
    </AuthShell>
  );
}
