import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Zap, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { auth } from "../services/api";
import { useAuth } from "../context/AuthContext";

const FEATURES = [
  "Automated resume parsing with Gemini AI",
  "Intelligent candidate ranking & scoring",
  "AI-generated interview questions",
];

function LeftPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between bg-slate-900 text-white p-10 w-[45%] shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Zap size={16} className="text-white" strokeWidth={2.5} />
        </div>
        <span className="font-head font-bold text-xl tracking-tight">HireAI</span>
      </div>

      {/* Headline */}
      <div>
        <h2 className="font-head font-semibold text-4xl leading-tight mb-4">
          Hire smarter,<br />not harder.
        </h2>
        <p className="text-slate-300 text-base leading-relaxed mb-8">
          AI-powered resume screening that saves 70% of recruiter time.
        </p>
        <ul className="flex flex-col gap-3">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-3 text-slate-200 text-sm">
              <CheckCircle2 size={17} className="text-blue-400 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer quote */}
      <p className="text-slate-500 text-xs">
        © 2026 HireAI · Built for modern recruiters
      </p>
    </div>
  );
}

export default function Login() {
  const navigate  = useNavigate();
  const { login } = useAuth();
  const [form, setForm]       = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await auth.login(form.email.trim(), form.password);
      login(res.data.token);
      toast.success("Welcome back!");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || "Invalid credentials. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <LeftPanel />

      {/* Right â€” Form */}
      <div className="flex-1 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap size={13} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-head font-bold text-lg text-slate-900">HireAI</span>
          </div>

          <h2 className="font-head font-semibold text-3xl text-slate-900 mb-1">Welcome back</h2>
          <p className="text-slate-500 text-sm mb-8">Sign in to your account</p>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="you@company.com"
                autoComplete="email"
                required
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full px-3.5 py-2.5 pr-10 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  aria-label="Toggle password visibility"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-medium">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
