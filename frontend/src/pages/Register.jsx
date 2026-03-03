import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Zap, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { auth } from "../services/api";

const FEATURES = [
  "Up and running in minutes",
  "AI-powered screening pipeline",
  "Team collaboration built-in",
];

function LeftPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between bg-slate-900 text-white p-10 w-[45%] shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Zap size={16} className="text-white" strokeWidth={2.5} />
        </div>
        <span className="font-head font-bold text-xl tracking-tight">HireAI</span>
      </div>

      <div>
        <h2 className="font-head font-semibold text-4xl leading-tight mb-4">
          Start hiring<br />the smart way.
        </h2>
        <p className="text-slate-300 text-base leading-relaxed mb-8">
          Create your free account and let AI handle the heavy lifting.
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

      <p className="text-slate-500 text-xs">
        © 2026 HireAI · Built for modern recruiters
      </p>
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [showPwd,     setShowPwd]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error,   setError]           = useState("");
  const [done,    setDone]            = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      const msg = "Password must be at least 6 characters.";
      setError(msg); return;
    }
    if (form.password !== form.confirm) {
      const msg = "Passwords do not match.";
      setError(msg); return;
    }

    setLoading(true);
    try {
      await auth.register({ email: form.email.trim(), password: form.password });
      setDone(true);
      toast.success("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      const msg = err?.response?.data?.message || "Registration failed. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-4 p-8 card max-w-sm w-full text-center">
          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
            <CheckCircle2 size={28} className="text-emerald-600" />
          </div>
          <div>
            <h2 className="font-head font-semibold text-xl text-slate-900 mb-1">Account created!</h2>
            <p className="text-slate-500 text-sm">Redirecting you to sign in...</p>
          </div>
          <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <LeftPanel />

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap size={13} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-head font-bold text-lg text-slate-900">HireAI</span>
          </div>

          <h2 className="font-head font-semibold text-3xl text-slate-900 mb-1">Create account</h2>
          <p className="text-slate-500 text-sm mb-8">Join HireAI and start hiring smarter</p>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email address</label>
              <input
                type="email" name="email" value={form.email} onChange={onChange}
                placeholder="you@company.com" autoComplete="email" required
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"} name="password" value={form.password} onChange={onChange}
                  placeholder="Min. 6 characters" autoComplete="new-password" required
                  className="w-full px-3.5 py-2.5 pr-10 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all placeholder:text-slate-400"
                />
                <button type="button" onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700" aria-label="Toggle">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Confirm password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"} name="confirm" value={form.confirm} onChange={onChange}
                  placeholder="Repeat your password" autoComplete="new-password" required
                  className="w-full px-3.5 py-2.5 pr-10 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all placeholder:text-slate-400"
                />
                <button type="button" onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700" aria-label="Toggle">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
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
                  Creating account...
                </>
              ) : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
