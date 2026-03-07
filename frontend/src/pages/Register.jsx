import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Zap, CheckCircle2, CornerDownRight, Briefcase } from "lucide-react";
import toast from "react-hot-toast";
import { auth } from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await auth.register({ email: form.email.trim(), password: form.password });
      setDone(true);
      toast.success("Account created successfully!");
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden p-4">
        {/* Decorative Background Orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="flex flex-col items-center gap-6 p-12 bg-white rounded-3xl shadow-xl max-w-md w-full text-center z-10 border border-slate-100">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30 rotate-3">
            <CheckCircle2 size={40} className="text-white" />
          </div>
          <div>
            <h2 className="font-head font-bold text-3xl text-slate-900 mb-3 tracking-tight">Account Created!</h2>
            <div className="p-4 bg-amber-50 border border-amber-200/50 rounded-xl mb-4 text-left">
              <p className="text-slate-700 text-sm leading-relaxed">
                Your recruiter account is currently <span className="font-semibold text-amber-600 border-b border-amber-300">pending admin approval</span>.
                <br /><br />
                The admin team will review and activate your account shortly. You cannot log in until it is approved.
              </p>
            </div>

          </div>
          <Link to="/login" className="btn-primary w-full h-11 justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-slate-50">

      {/* Left Column: Branding / Illustration (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 text-white bg-gradient-to-br from-blue-600 to-indigo-800 transition-colors duration-700 relative overflow-hidden">
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/30">
            <Zap size={20} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-head font-bold text-3xl tracking-tight text-white">HireAI</span>
        </div>

        <div className="max-w-md relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-semibold tracking-wide uppercase mb-6 shadow-sm">
            <Briefcase size={14} className="text-blue-200" />
            Recruiter Sign Up
          </div>
          <h1 className="font-head font-bold text-5xl leading-tight mb-6 mt-2">
            Start hiring smarter today.
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed mb-10">
            Join the smartest ATS. Automate your screening with AI, organize candidates seamlessly, and find the perfect match faster than ever.
          </p>

          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-sm font-medium text-white/90">
              <div className="w-6 h-6 rounded-full bg-indigo-500/40 flex items-center justify-center shrink-0 border border-indigo-400/50">
                <CheckCircle2 size={12} className="text-blue-200" />
              </div>
              Automated Resume Parsing
            </li>
            <li className="flex items-center gap-3 text-sm font-medium text-white/90">
              <div className="w-6 h-6 rounded-full bg-indigo-500/40 flex items-center justify-center shrink-0 border border-indigo-400/50">
                <CheckCircle2 size={12} className="text-blue-200" />
              </div>
              Intelligent ATS Scoring & Ranking
            </li>
            <li className="flex items-center gap-3 text-sm font-medium text-white/90">
              <div className="w-6 h-6 rounded-full bg-indigo-500/40 flex items-center justify-center shrink-0 border border-indigo-400/50">
                <CheckCircle2 size={12} className="text-blue-200" />
              </div>
              AI-Generated Interview Questions
            </li>
          </ul>
        </div>

        <div className="text-indigo-200/60 text-sm relative z-10">
          &copy; {new Date().getFullYear()} HireAI Inc.
        </div>

        {/* Floating decor shapes */}
        <div className="absolute top-[-10%] right-[40%] w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Right Column: Form */}
      <div className="flex-1 flex flex-col items-center justify-center relative p-6 sm:p-12 overflow-hidden">

        {/* Mobile Header */}
        <div className="lg:hidden flex items-center gap-2 mb-10 absolute top-8 left-8">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/30 flex items-center justify-center shadow-lg">
            <Zap size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-head font-bold text-xl text-slate-900 tracking-tight">HireAI</span>
        </div>

        {/* Decorative Orbs (Mobile & Desktop Light bg) */}
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md z-10">

          <div className="mb-8">
            <h2 className="font-head font-bold text-3xl text-slate-900 mb-2">Create Recruiter Account</h2>
            <p className="text-slate-500 text-sm mb-4">You'll be able to log in after an admin approves your request.</p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4 relative">

            {/* Password input structure trick for Tailwind forms module if needed, but we'll stick to our custom classes */}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
              <input
                type="email" name="email" value={form.email} onChange={onChange}
                placeholder="you@company.com" autoComplete="email" required
                className="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 placeholder-slate-400 shadow-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"} name="password" value={form.password} onChange={onChange}
                  placeholder="Min. 6 characters" autoComplete="new-password" required
                  className="w-full px-4 py-3 pr-12 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 placeholder-slate-400 shadow-sm"
                />
                <button type="button" onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors" aria-label="Toggle">
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"} name="confirm" value={form.confirm} onChange={onChange}
                  placeholder="Repeat your password" autoComplete="new-password" required
                  className="w-full px-4 py-3 pr-12 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 placeholder-slate-400 shadow-sm"
                />
                <button type="button" onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors" aria-label="Toggle">
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2 mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-4 text-white text-base font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>Complete Sign Up <CornerDownRight size={18} /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-10">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors hover:underline">
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
