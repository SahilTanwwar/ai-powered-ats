import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Briefcase, Bell, Menu, X, LogOut, LayoutDashboard, User } from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
  { to: "/find-jobs", label: "Find Jobs" },
  { to: "/companies", label: "Browse Companies" },
  { to: "/candidates-public", label: "Candidates" },
  { to: "/blog", label: "Blog" },
];

export default function PublicNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white">
            <Briefcase size={18} />
          </div>
          <span className="font-head text-[22px] font-bold text-text-primary tracking-tight">Jobpilot</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `font-medium text-[15px] transition-colors ${isActive ? "text-primary underline underline-offset-8" : "text-text-secondary hover:text-primary"}`}>
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-5">
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)} 
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-light">
                    <img src={`https://ui-avatars.com/api/?name=${user.email}&background=E7F0FA&color=0A65CC`} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-border rounded-[8px] shadow-lg py-2 flex flex-col z-50">
                    <Link to="/dashboard" className="px-4 py-2 text-[14px] text-text-secondary hover:bg-primary-light hover:text-primary flex items-center gap-2">
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <Link to="/profile" className="px-4 py-2 text-[14px] text-text-secondary hover:bg-primary-light hover:text-primary flex items-center gap-2">
                      <User size={16} /> My Profile
                    </Link>
                    <hr className="my-2 border-border" />
                    <button onClick={() => { logout(); navigate("/"); }} className="px-4 py-2 text-[14px] text-red-500 hover:bg-red-50 flex items-center gap-2 text-left w-full">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="px-5 py-2.5 text-primary font-medium text-[15px] border border-primary-light rounded-[4px] hover:bg-primary-light transition-colors">
                Sign In
              </Link>
              <Link to="/login" className="px-5 py-2.5 bg-primary text-white font-medium text-[15px] rounded-[4px] hover:bg-primary-hover transition-colors">
                Post A Job
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-text-primary p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-white absolute w-full left-0 p-4 flex flex-col gap-4 shadow-lg pb-6">
          {NAV_LINKS.map((item) => (
            <Link key={item.to} to={item.to} onClick={() => setMobileMenuOpen(false)} className="text-text-secondary hover:text-primary font-medium text-[15px] transition-colors">
              {item.label}
            </Link>
          ))}
          <hr className="border-border my-2" />
          {user ? (
            <div className="flex flex-col gap-4">
              <button className="text-left font-medium text-text-secondary flex items-center gap-2" onClick={() => navigate("/dashboard")}>
                 <LayoutDashboard size={18} /> Dashboard
              </button>
              <button className="text-left font-medium text-red-500 flex items-center gap-2" onClick={() => { logout(); navigate("/"); setMobileMenuOpen(false); }}>
                 <LogOut size={18} /> Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 mt-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-center px-5 py-2.5 text-primary font-medium border border-border rounded-[4px]">Sign In</Link>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-center px-5 py-2.5 bg-primary text-white font-medium rounded-[4px]">Post A Job</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
