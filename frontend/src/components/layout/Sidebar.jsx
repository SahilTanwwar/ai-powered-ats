import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Briefcase, Users, Settings,
  LogOut, ChevronLeft, Menu, Zap,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const NAV = [
  { to: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/jobs",      label: "Jobs",      Icon: Briefcase },
  { to: "/candidates", label: "Candidates", Icon: Users },
  { to: "/settings",  label: "Settings",  Icon: Settings },
];

function NavItem({ to, label, Icon, collapsed, onClick }) {
  return (
    <NavLink to={to} onClick={onClick} className="block">
      {({ isActive }) => (
        <div
          className={`flex items-center px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 group
            ${isActive
              ? "bg-blue-50 text-blue-600 font-semibold"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          title={collapsed ? label : undefined}
        >
          <Icon
            size={18}
            className={`shrink-0 ${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-700"}`}
          />
          {!collapsed && (
            <span className="ml-3 text-sm">{label}</span>
          )}
        </div>
      )}
    </NavLink>
  );
}

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleLogoutClick = () => setConfirmLogout(true);

  const handleLogoutConfirm = () => {
    logout();
    toast.success("Signed out successfully.");
    navigate("/login");
  };

  const handleLogoutCancel = () => setConfirmLogout(false);

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : "U";

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white border-r border-slate-200 flex flex-col z-30 transition-all duration-200
        ${collapsed ? "w-16" : "w-60"}`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-slate-100">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap size={14} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-head font-bold text-base text-slate-900 tracking-tight">HireAI</span>
          </div>
        )}
        {collapsed && (
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
            <Zap size={14} className="text-white" strokeWidth={2.5} />
          </div>
        )}
        {!collapsed && (
          <button
            onClick={onToggle}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-2 py-4 flex flex-col gap-1">
        {!collapsed && (
          <span className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Main Menu
          </span>
        )}
        {NAV.map((item) => (
          <NavItem key={item.to} {...item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Logout confirmation overlay */}
      {confirmLogout && (
        <div className="absolute bottom-20 left-2 right-2 bg-white border border-red-200 rounded-xl shadow-lg p-4 z-40">
          <p className="text-sm font-semibold text-slate-800 mb-1">Sign out?</p>
          <p className="text-xs text-slate-400 mb-3">You will be returned to the login page.</p>
          <div className="flex gap-2">
            <button onClick={handleLogoutCancel}
              className="flex-1 h-8 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50">
              Cancel
            </button>
            <button onClick={handleLogoutConfirm}
              className="flex-1 h-8 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold">
              Sign out
            </button>
          </div>
        </div>
      )}

      {/* User / Logout */}
      <div className="px-2 pb-4 border-t border-slate-100 pt-3">
        {collapsed ? (
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-center p-2.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
            title="Logout"
          >
            <LogOut size={17} />
          </button>
        ) : (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-900 truncate">
                {user?.email?.split("@")[0]}
              </div>
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                {user?.role}
              </div>
            </div>
            <button
              onClick={handleLogoutClick}
              className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <button
          onClick={onToggle}
          className="mx-auto mb-3 p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          aria-label="Expand sidebar"
        >
          <Menu size={16} />
        </button>
      )}
    </aside>
  );
}
