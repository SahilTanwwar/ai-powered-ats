import { useEffect, useRef, useState } from "react";
import { Bell, X, CheckCheck, Moon, Sun } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import GlobalSearch from "../ui/GlobalSearch";
import { auditLogs } from "../../services/api";
import { formatDistanceToNow } from "date-fns";

const ACTION_TEXT = {
  CANDIDATE_CREATED: (d) => `New candidate "${d?.candidateName}" added to ${d?.jobTitle || "a job"}`,
  CANDIDATE_STATUS_UPDATED: (d) => `${d?.candidateName} moved to ${d?.newStatus}`,
  JOB_CREATED: (d) => `New job posted: "${d?.jobTitle}"`,
  JOB_DELETED: (d) => `Job "${d?.jobTitle}" was deleted`,
  CANDIDATE_DELETED: (d) => `Candidate "${d?.candidateName}" was removed`,
  INTERVIEW_SCHEDULED: (d) => `Interview scheduled for ${d?.candidateName}`,
};

const ONE_HOUR = 60 * 60 * 1000;

export default function Navbar({ title }) {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "U";
  const [showNotif, setShowNotif] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [readIds, setReadIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("ats_read_notifs") || "[]")); }
    catch { return new Set(); }
  });
  const ref = useRef(null);

  // Fetch real audit log events and map them to notifications
  useEffect(() => {
    auditLogs.getAll({ limit: 8 })
      .then((res) => {
        const logs = res.data?.data || res.data || [];
        const mapped = logs
          .filter((log) => ACTION_TEXT[log.action])
          .map((log) => ({
            id: log.id,
            text: ACTION_TEXT[log.action]?.(log.details) || log.action,
            time: formatDistanceToNow(new Date(log.createdAt), { addSuffix: true }),
            createdAt: log.createdAt,
          }));
        setNotifs(mapped);
      })
      .catch(() => setNotifs([]));
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setShowNotif(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unreadCount = notifs.filter(
    (n) => !readIds.has(n.id) && (new Date() - new Date(n.createdAt)) < ONE_HOUR
  ).length;

  const markAllRead = () => {
    const newSet = new Set([...readIds, ...notifs.map((n) => n.id)]);
    setReadIds(newSet);
    localStorage.setItem("ats_read_notifs", JSON.stringify([...newSet]));
  };

  const dismiss = (id) => setNotifs((prev) => prev.filter((n) => n.id !== id));

  return (
    <header className="h-16 bg-white/60 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/40 dark:border-slate-800 shadow-sm flex items-center justify-between px-6 sticky top-0 z-20 transition-colors duration-200">
      <h1 className="font-head font-semibold text-lg text-slate-900 dark:text-white tracking-tight">
        {title || "Dashboard"}
      </h1>

      <div className="flex items-center gap-3">
        {/* Global Search */}
        <GlobalSearch />

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          title={isDark ? "Light mode" : "Dark mode"}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 flex items-center justify-center text-white text-xs font-bold cursor-pointer select-none">
          {initials}
        </div>
      </div>
    </header>
  );
}
