import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Briefcase,
  MessageSquare,
  Bell,
  Search,
  Menu,
  X,
  UserCircle
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export function LinkedInLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  
  const derivedName = user?.email ? user.email.split('@')[0] : "Me";
  const derivedAvatar = `https://ui-avatars.com/api/?name=${derivedName}&background=6366f1&color=fff`;

  const navItems = [
    { name: "Home", path: "/feed", icon: Home },
    { name: "My Network", path: "/network", icon: Users },
    { name: "Jobs", path: "/jobs", icon: Briefcase },
    { name: "Messaging", path: "/messaging", icon: MessageSquare }, // Mock path
    { name: "Notifications", path: "/notifications", icon: Bell }, // Mock path
  ];

  return (
    <div className="min-h-screen bg-bg font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-surface border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            
            {/* Logo and Search */}
            <div className="flex items-center gap-4">
              <Link to="/feed" className="flex-shrink-0">
                <div className="w-8 h-8 bg-accent rounded font-head font-bold text-white flex items-center justify-center text-lg shadow-glow">
                  in
                </div>
              </Link>
              
              <div className="hidden md:flex relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted group-focus-within:text-accent transition-colors">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  className="block w-64 pl-10 pr-3 py-1.5 border border-transparent rounded bg-[#EDF3F8] text-sm placeholder-secondary focus:outline-none focus:bg-surface focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  placeholder="Search"
                />
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center h-full">
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex flex-col items-center justify-center w-20 h-full relative text-xs hover:text-primary transition-colors ${
                      isActive ? "text-primary" : "text-secondary"
                    }`}
                  >
                    <Icon className={`h-6 w-6 mb-0.5 ${isActive ? "fill-primary" : ""}`} />
                    <span className="hidden lg:block">{item.name}</span>
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                  </Link>
                );
              })}
              
              <div className="w-px h-8 bg-border mx-2"></div>
              
              <Link to="/profile/me" className="flex flex-col items-center justify-center w-20 h-full text-xs text-secondary hover:text-primary transition-colors">
                <img src={derivedAvatar} alt="Me" className="w-6 h-6 rounded-full mb-0.5" />
                <span className="hidden lg:flex items-center gap-1">Me ▼</span>
              </Link>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
               <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-secondary hover:text-primary p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="md:hidden bg-surface border-b border-border shadow-lg overflow-hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <div className="p-2 mb-2">
                 <input
                  type="text"
                  className="block w-full pl-3 pr-3 py-2 border border-transparent rounded bg-[#EDF3F8] text-sm placeholder-secondary focus:outline-none focus:bg-surface focus:border-accent"
                  placeholder="Search"
                />
              </div>
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                      isActive
                        ? "bg-accent/10 text-accent"
                        : "text-secondary hover:bg-bg hover:text-primary"
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
              <Link
                to="/profile/me"
                 onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-secondary hover:bg-bg hover:text-primary"
              >
                <UserCircle className="h-5 w-5 mr-3" />
                View Profile
              </Link>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
