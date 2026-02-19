import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../auth/AuthContext";
import { Icon } from "../components/UI";
import useIsMobile from "../hooks/useIsMobile";
import { T } from "../theme";

const NAV = [
  { to: "/dashboard", label: "Dashboard", Ic: Icon.Grid },
  { to: "/jobs", label: "Jobs", Ic: Icon.Briefcase },
  { to: "/candidates", label: "Candidates", Ic: Icon.Users },
  { to: "/settings", label: "Settings", Ic: Icon.Settings },
];

function SidebarContent({ onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "4px 10px 26px" }}>
        <div style={{ width: 30, height: 30, background: T.lime, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon.Zap /></div>
        <span style={{ fontSize: 16, fontWeight: 800, color: T.text, letterSpacing: -0.4 }}>HireAI</span>
      </div>
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: T.textLight, letterSpacing: 0.8, padding: "0 10px", marginBottom: 6, textTransform: "uppercase" }}>Main Menu</div>
        {NAV.map(({ to, label, Ic }) => (
          <NavLink key={to} to={to} onClick={onClose}>
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: 2 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 10px",
                  borderRadius: T.r10,
                  background: isActive ? T.indigoSoft : "transparent",
                  color: isActive ? T.indigo : T.textMid,
                  fontSize: 13.5,
                  fontWeight: isActive ? 700 : 600,
                }}
              >
                <Ic /> {label}
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>
      <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 10px", borderRadius: T.r10, background: T.bg }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg,#C8F135,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: "#fff" }}>
            {user?.email?.[0]?.toUpperCase() || "U"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email?.split("@")[0]}</div>
            <div style={{ fontSize: 10.5, color: T.textLight }}>{user?.role}</div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              logout();
              navigate("/login");
            }}
            style={{ background: "none", border: "none", color: T.textLight, display: "flex", padding: 3, borderRadius: 6 }}
            title="Logout"
            aria-label="Logout"
          >
            <Icon.Logout />
          </motion.button>
        </div>
      </div>
    </>
  );
}

function Topbar({ title, onOpenMenu, isMobile }) {
  const { user } = useAuth();

  return (
    <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "12px 14px" : "14px 28px", background: T.white, borderBottom: `1px solid ${T.border}`, position: "sticky", top: 0, zIndex: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {isMobile && (
          <button
            onClick={onOpenMenu}
            aria-label="Open navigation"
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              border: `1px solid ${T.border}`,
              background: T.bg,
              display: "grid",
              placeItems: "center",
              color: T.text,
            }}
          >
            <Icon.Menu />
          </button>
        )}
        <h1 style={{ fontSize: isMobile ? 16 : 18, fontWeight: 800, color: T.text, letterSpacing: -0.4 }}>{title}</h1>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: isMobile ? "5px 8px" : "5px 10px 5px 5px", background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.r12 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#C8F135,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 11, color: "#fff" }}>
            {user?.email?.[0]?.toUpperCase() || "U"}
          </div>
          {!isMobile && <span style={{ fontSize: 12.5, fontWeight: 700, color: T.text }}>{user?.email?.split("@")[0]}</span>}
        </div>
      </div>
    </header>
  );
}

export default function AppLayout({ title, children }) {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: T.bg }}>
      {!isMobile && (
        <motion.aside
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          style={{ width: 230, minHeight: "100vh", background: T.white, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", padding: "22px 12px", position: "sticky", top: 0, flexShrink: 0 }}
        >
          <SidebarContent />
        </motion.aside>
      )}

      <AnimatePresence>
        {isMobile && menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 40 }}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              style={{ position: "fixed", top: 0, left: 0, width: 240, height: "100vh", background: T.white, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", padding: "22px 12px", zIndex: 50 }}
            >
              <SidebarContent onClose={() => setMenuOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Topbar title={title} onOpenMenu={() => setMenuOpen(true)} isMobile={isMobile} />
        <main style={{ flex: 1, overflowY: "auto", padding: isMobile ? "16px" : "26px 30px" }}>{children}</main>
      </div>
    </div>
  );
}
