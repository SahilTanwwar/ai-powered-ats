import { useEffect, useState } from "react";
import {
    ShieldCheck, Clock, CheckCircle2, XCircle, Trash2,
    UserPlus, X, Loader2, Users,
} from "lucide-react";
import toast from "react-hot-toast";
import Layout from "../components/layout/Layout";
import { users } from "../services/api";

// ── Status Badge ────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
    const map = {
        ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
        PENDING: "bg-amber-50 text-amber-700 border-amber-200",
        BLOCKED: "bg-red-50 text-red-600 border-red-200",
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${map[status] || ""}`}>
            {status}
        </span>
    );
}

// ── Add Recruiter Modal ──────────────────────────────────────────────────────
function AddRecruiterModal({ onClose, onAdded }) {
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
        setLoading(true);
        try {
            await users.create(form);
            toast.success("Recruiter account created!");
            onAdded();
            onClose();
        } catch (err) {
            const msg = err?.response?.data?.message || "Failed to create recruiter.";
            setError(msg); toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="font-head font-semibold text-lg text-slate-900">Add Recruiter</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Account will be active immediately</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100"><X size={18} /></button>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
                        <input
                            type="email" required value={form.email}
                            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                            placeholder="recruiter@company.com"
                            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
                        <input
                            type="password" required value={form.password}
                            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                            placeholder="Min. 6 characters"
                            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                    {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
                    <div className="flex gap-3 mt-2">
                        <button type="button" onClick={onClose}
                            className="flex-1 h-10 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading}
                            className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2">
                            {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</> : "Create Account"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── Recruiter Row ────────────────────────────────────────────────────────────
function RecruiterRow({ user, onApprove, onBlock, onDelete }) {
    return (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {user.email.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">{user.email}</div>
                    <div className="text-[11px] text-slate-400">
                        Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <StatusBadge status={user.status} />
                {user.status === "PENDING" && (
                    <>
                        <button onClick={() => onApprove(user)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold transition-all">
                            <CheckCircle2 size={13} /> Approve
                        </button>
                        <button onClick={() => onDelete(user)}
                            className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all" title="Reject & delete">
                            <XCircle size={16} />
                        </button>
                    </>
                )}
                {user.status === "ACTIVE" && (
                    <button onClick={() => onBlock(user)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold transition-all">
                        Block
                    </button>
                )}
                {user.status === "BLOCKED" && (
                    <>
                        <button onClick={() => onApprove(user)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold transition-all">
                            Unblock
                        </button>
                        <button onClick={() => onDelete(user)}
                            className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all" title="Delete">
                            <Trash2 size={15} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function ManageRecruiters() {
    const [all, setAll] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState("PENDING"); // "PENDING" | "ACTIVE" | "BLOCKED"
    const [showAdd, setShowAdd] = useState(false);

    const fetchAll = async () => {
        try {
            setLoading(true);
            const res = await users.getAll();
            setAll(res.data?.data || []);
        } catch {
            toast.error("Failed to load recruiters.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, []);

    const filtered = all.filter((u) => u.status === tab);
    const pendingCount = all.filter((u) => u.status === "PENDING").length;

    const handleApprove = async (user) => {
        try {
            await users.updateStatus(user.id, "ACTIVE");
            toast.success(`${user.email} approved!`);
            fetchAll();
        } catch { toast.error("Failed to approve."); }
    };

    const handleBlock = async (user) => {
        if (!window.confirm(`Block ${user.email}?`)) return;
        try {
            await users.updateStatus(user.id, "BLOCKED");
            toast.success(`${user.email} blocked.`);
            fetchAll();
        } catch { toast.error("Failed to block."); }
    };

    const handleDelete = async (user) => {
        if (!window.confirm(`Delete ${user.email}? This cannot be undone.`)) return;
        try {
            await users.delete(user.id);
            toast.success("Recruiter deleted.");
            fetchAll();
        } catch { toast.error("Failed to delete."); }
    };

    const TABS = [
        { key: "PENDING", label: "Pending Requests", icon: Clock },
        { key: "ACTIVE", label: "Active Recruiters", icon: CheckCircle2 },
        { key: "BLOCKED", label: "Blocked", icon: XCircle },
    ];

    return (
        <Layout title="Manage Recruiters">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="font-head font-bold text-2xl text-slate-900 tracking-tight">Manage Recruiters</h2>
                    <p className="text-slate-500 text-sm mt-0.5">
                        {loading ? "Loading..." : `${all.length} recruiter${all.length !== 1 ? "s" : ""} total`}
                        {pendingCount > 0 && (
                            <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                                {pendingCount} pending
                            </span>
                        )}
                    </p>
                </div>
                <button
                    onClick={() => setShowAdd(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <UserPlus size={16} /> Add Recruiter
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-6 w-fit">
                {TABS.map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => setTab(key)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all
              ${tab === key
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        <Icon size={14} />
                        {label}
                        {key === "PENDING" && pendingCount > 0 && (
                            <span className="ml-1 w-5 h-5 bg-amber-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                                {pendingCount}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="card p-2">
                {loading ? (
                    <div className="flex items-center justify-center py-16 gap-3 text-slate-400">
                        <Loader2 size={20} className="animate-spin" />
                        <span className="text-sm">Loading recruiters...</span>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
                            <Users size={22} className="text-slate-300" />
                        </div>
                        <p className="text-slate-500 font-medium">No {tab.toLowerCase()} recruiters</p>
                        <p className="text-slate-400 text-sm mt-1">
                            {tab === "PENDING"
                                ? "No pending approval requests."
                                : tab === "ACTIVE"
                                    ? "No active recruiters yet. Add one above."
                                    : "No blocked accounts."}
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col divide-y divide-slate-100">
                        {filtered.map((u) => (
                            <RecruiterRow
                                key={u.id}
                                user={u}
                                onApprove={handleApprove}
                                onBlock={handleBlock}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>

            {showAdd && (
                <AddRecruiterModal onClose={() => setShowAdd(false)} onAdded={fetchAll} />
            )}
        </Layout>
    );
}
