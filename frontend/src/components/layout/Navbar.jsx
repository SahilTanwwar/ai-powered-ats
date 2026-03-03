import { useEffect, useRef, useState } from "react";
import { Bell, Search, X, CheckCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const SAMPLE_NOTIFS = [
  { id: 1, text: "New candidate uploaded to React Developer", time: "Just now",  unread: true },
  { id: 2, text: "Candidate John Doe was shortlisted",        time: "2 min ago", unread: true },
  { id: 3, text: "AI analysis completed for 3 resumes",       time: "1 hr ago",  unread: false },
];

export default function Navbar({ title }) {
  const { user } = useAuth();
  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "U";
  const [showNotif, setShowNotif] = useState(false);
  const [notifs, setNotifs]       = useState(SAMPLE_NOTIFS);
  const ref = useRef(null);

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setShowNotif(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unreadCount = notifs.filter((n) => n.unread).length;
  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));
  const dismiss     = (id) => setNotifs((prev) => prev.filter((n) => n.id !== id));

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20">
      <h1 className="font-head font-semibold text-lg text-slate-900 tracking-tight">
        {title || "Dashboard"}
      </h1>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <Search size={15} className="absolute left-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidates..."
            className="pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg w-56 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all"
          />
        </div>

        {/* Notification bell */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setShowNotif((v) => !v)}
            className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-all"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-blue-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 top-12 w-80 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <span className="font-head font-semibold text-sm text-slate-900">Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline">
                    <CheckCheck size={12} /> Mark all read
                  </button>
                )}
              </div>
              {notifs.length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-sm">No notifications</div>
              ) : (
                <ul>
                  {notifs.map((n) => (
                    <li key={n.id} className={`flex items-start gap-3 px-4 py-3 border-b border-slate-50 last:border-0 ${n.unread ? "bg-blue-50/50" : ""}`}>
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.unread ? "bg-blue-500" : "bg-slate-200"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-700 leading-relaxed">{n.text}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                      </div>
                      <button onClick={() => dismiss(n.id)} className="text-slate-300 hover:text-slate-500 shrink-0 mt-0.5">
                        <X size={13} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer select-none">
          {initials}
        </div>
      </div>
    </header>
  );
}
