import { useState } from "react";
import { User, Lock, Shield, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Settings() {
  const { user } = useAuth();
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, next: false });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwDone, setPwDone] = useState(false);

  const onChange = (e) => setPwForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleChangePw = async (e) => {
    e.preventDefault();
    setPwError("");
    if (pwForm.next.length < 6) { setPwError("New password must be at least 6 characters."); return; }
    if (pwForm.next !== pwForm.confirm) { setPwError("Passwords do not match."); return; }
    setPwLoading(true);
    try {
      await api.patch("/auth/change-password", { currentPassword: pwForm.current, newPassword: pwForm.next });
      setPwDone(true);
      setPwForm({ current: "", next: "", confirm: "" });
      toast.success("Password changed successfully.");
    } catch (err) {
      setPwError(err?.response?.data?.message || "Failed to change password.");
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <Layout title="Settings">
      <div className="max-w-2xl flex flex-col gap-6">

        {/* Profile card */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
              <User size={14} className="text-blue-600" />
            </div>
            <h3 className="font-head font-semibold text-slate-900">Profile</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
              {(user?.email || "U").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-slate-900 text-base">{user?.email?.split("@")[0]}</div>
              <div className="text-slate-400 text-sm">{user?.email}</div>
              <div className="mt-1.5">
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wide">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Change password card */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center">
              <Lock size={14} className="text-amber-600" />
            </div>
            <h3 className="font-head font-semibold text-slate-900">Change Password</h3>
          </div>
          {pwDone ? (
            <div className="flex items-center gap-3 px-4 py-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
              <div>
                <p className="text-emerald-700 font-semibold text-sm">Password updated!</p>
                <p className="text-emerald-600 text-xs mt-0.5">Your new password is active immediately.</p>
              </div>
              <button onClick={() => setPwDone(false)} className="ml-auto text-xs text-emerald-600 hover:underline font-medium">Change again</button>
            </div>
          ) : (
            <form onSubmit={handleChangePw} className="flex flex-col gap-4">
              {[
                { name: "current", label: "Current Password", key: "current" },
                { name: "next",    label: "New Password",     key: "next" },
              ].map(({ name, label, key }) => (
                <div key={name}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
                  <div className="relative">
                    <input
                      type={showPw[key] ? "text" : "password"}
                      name={name}
                      value={pwForm[name]}
                      onChange={onChange}
                      required
                      placeholder=""
                      className="w-full px-3.5 py-2.5 pr-10 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                    <button type="button" onClick={() => setShowPw((s) => ({ ...s, [key]: !s[key] }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                      {showPw[key] ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  name="confirm"
                  value={pwForm.confirm}
                  onChange={onChange}
                  required
                  placeholder=""
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              {pwError && (
                <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-medium">{pwError}</div>
              )}
              <button type="submit" disabled={pwLoading}
                className="h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2">
                {pwLoading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Updating...</> : "Update Password"}
              </button>
            </form>
          )}
        </div>

        {/* App info card */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center">
              <Shield size={14} className="text-slate-500" />
            </div>
            <h3 className="font-head font-semibold text-slate-900">About</h3>
          </div>
          <div className="text-sm text-slate-500 flex flex-col gap-2">
            <div className="flex justify-between"><span className="font-medium text-slate-700">Application</span><span>HireAI ATS</span></div>
            <div className="flex justify-between"><span className="font-medium text-slate-700">Version</span><span className="font-mono">1.0.0</span></div>
            <div className="flex justify-between"><span className="font-medium text-slate-700">AI Model</span><span>Gemini 2.5 Flash</span></div>
          </div>
        </div>

      </div>
    </Layout>
  );
}