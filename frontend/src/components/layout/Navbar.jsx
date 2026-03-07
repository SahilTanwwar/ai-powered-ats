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
    <header className="h-16 bg-white/60 backdrop-blur-xl border-b border-white/40 shadow-sm flex items-center justify-between px-6 sticky top-0 z-20">
      <h1 className="font-head font-semibold text-lg text-slate-900 dark:text-white tracking-tight">
        {title || "Dashboard"}
      </h1>

      <div className="flex items-center gap-3">
        {/* Global Search */}
        <GlobalSearch />

        {/* Notification bell */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setShowNotif((v) => !v)}
            className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-blue-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                <span className="font-head font-semibold text-sm text-slate-900 dark:text-white">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                  >
                    <CheckCheck size={12} /> Mark all read
                  </button>
                )}
              </div>

              {notifs.length === 0 ? (
                <div className="py-10 text-center text-slate-400 dark:text-slate-500 text-sm">
                  No recent activity
                </div>
              ) : (
                <ul>
                  {notifs.map((n) => {
                    const isUnread = !readIds.has(n.id) && (new Date() - new Date(n.createdAt)) < ONE_HOUR;
                    return (
                      <li
                        key={n.id}
                        className={`flex items-start gap-3 px-4 py-3 border-b border-slate-50 dark:border-slate-700 last:border-0 ${isUnread ? "bg-blue-50/50 dark:bg-blue-900/20" : ""
                          }`}
                      >
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${isUnread ? "bg-blue-500" : "bg-slate-200 dark:bg-slate-700"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{n.text}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{n.time}</p>
                        </div>
                        <button
                          onClick={() => dismiss(n.id)}
                          className="text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 shrink-0 mt-0.5"
                        >
                          <X size={13} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>

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
