import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children, title }) {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? 64 : 240;

  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />

      {/* Main area */}
      <div
        className="flex-1 flex flex-col transition-all duration-200 min-w-0"
        style={{ marginLeft: sidebarWidth }}
      >
        <Navbar title={title} />
        <main className="flex-1 p-6 lg:p-8">
          <div className="page-enter max-w-screen-xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
