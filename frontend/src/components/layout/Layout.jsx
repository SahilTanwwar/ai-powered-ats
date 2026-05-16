import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import useIsMobile from "../../hooks/useIsMobile";

export default function Layout({ children, title }) {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const sidebarWidth = collapsed ? 64 : 240;

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Decorative Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />

      {/* Main area */}
      <div
        className="flex-1 flex flex-col transition-all duration-200 min-w-0"
        style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
      >
        <Navbar title={title} />
        <main className="flex-1 p-6 lg:p-8 text-slate-700 dark:text-slate-200 transition-colors duration-200">
          <div className="page-enter max-w-screen-xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
