import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Zap, ShieldCheck, Users, CornerDownRight } from "lucide-react";
import toast from "react-hot-toast";
import { auth } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [roleMode, setRoleMode] = useState("RECRUITER"); // "RECRUITER" | "ADMIN"
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      // Backend handles actual role verification from token
      const res = await auth.login(form.email.trim(), form.password);
      login(res.data.token);
      toast.success(`Welcome back!`);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || "Invalid credentials. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const isRecruiter = roleMode === "RECRUITER";

  return (
    <div className="min-h-screen w-full flex bg-slate-50">

      {/* Left Column: Branding / Illustration (Hidden on mobile) */}
      <div className={`hidden lg:flex w-1/2 flex-col justify-between p-12 text-white transition-colors duration-700
        ${isRecruiter ? 'bg-gradient-to-br from-blue-600 to-indigo-800' : 'bg-gradient-to-br from-purple-700 to-indigo-900'}
      `}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/30">
            <Zap size={20} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-head font-bold text-3xl tracking-tight text-white">HireAI</span>
        </div>

        <div className="max-w-md">
          <h1 className="font-head font-bold text-5xl leading-tight mb-6">
            {isRecruiter
              ? "Discover the best talent faster."
              : "Manage your hiring platform."}
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed mb-10">
            {isRecruiter
              ? "Upload resumes, get AI-powered shortlists, and build your dream team in minutes."
              : "Control user access, enforce security policies, and oversee the entire ATS system."}
          </p>

          <div className="flex items-center gap-4 text-sm font-medium text-white/80">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full bg-indigo-400 border-2 border-indigo-600 flex items-center justify-center font-bold">JD</div>
              <div className="w-10 h-10 rounded-full bg-blue-400 border-2 border-indigo-600 flex items-center justify-center font-bold">AS</div>
              <div className="w-10 h-10 rounded-full bg-purple-400 border-2 border-indigo-600 flex items-center justify-center font-bold">MK</div>
            </div>
            <p>Trusted by 10,000+ professionals</p>
          </div>
        </div>

        <div className="text-indigo-200/60 text-sm">
          &copy; {new Date().getFullYear()} HireAI Inc. All rights reserved.
        </div>

        {/* Floating decor shapes */}
        <div className="absolute top-[-10%] right-[40%] w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Right Column: Form */}
      <div className="flex-1 flex flex-col items-center justify-center relative p-6 sm:p-12 overflow-hidden">

        {/* Mobile Header */}
        <div className="lg:hidden flex items-center gap-2 mb-10 absolute top-8 left-8">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-lg
            ${isRecruiter ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/30' : 'bg-gradient-to-br from-purple-500 to-indigo-600 shadow-purple-500/30'}
          `}>
            <Zap size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-head font-bold text-xl text-slate-900 tracking-tight">HireAI</span>
        </div>

        {/* Decorative Orbs (Mobile & Desktop Light bg) */}
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md z-10">

          <div className="mb-10">
            <h2 className="font-head font-bold text-3xl text-slate-900 mb-3">Welcome back</h2>
            <p className="text-slate-500 text-base">Please enter your details to sign in.</p>
          </div>

          {/* Role Toggle */}
          <div className="flex p-1.5 bg-slate-100 rounded-xl mb-8 border border-slate-200/60">
            <button
              type="button"
              onClick={() => setRoleMode("RECRUITER")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300
                ${isRecruiter
                  ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200/50'
                  : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Users size={16} /> Recruiter
            </button>
            <button
              type="button"
              onClick={() => setRoleMode("ADMIN")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300
                ${!isRecruiter
                  ? 'bg-white text-purple-700 shadow-sm ring-1 ring-slate-200/50'
                  : 'text-slate-500 hover:text-slate-700'}`}
            >
              <ShieldCheck size={16} /> Admin
            </button>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder={isRecruiter ? "recruiter@company.com" : "admin@hireai.com"}
                autoComplete="email"
                required
                className="w-full px-4 py-3.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900 placeholder-slate-400 shadow-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3.5 pr-12 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900 placeholder-slate-400 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full h-12 mt-4 text-white text-base font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all flex items-center justify-center gap-2
                ${isRecruiter
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800'}
              `}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>Sign in to {isRecruiter ? 'Recruiter' : 'Admin'} Portal <CornerDownRight size={18} /></>
              )}
            </button>
          </form>

          {/* Conditional Sign Up link */}
          {isRecruiter ? (
            <p className="text-center text-sm text-slate-500 mt-10">
              Don&apos;t have a recruiter account?{" "}
              <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors hover:underline">
                Sign up instead
              </Link>
            </p>
          ) : (
            <p className="text-center text-sm text-slate-400 mt-10 flex items-center justify-center gap-1.5">
              <ShieldCheck size={14} /> Admins are provisioned internally.
            </p>
          )}

        </div>
      </div>
    </div>
  );
}
