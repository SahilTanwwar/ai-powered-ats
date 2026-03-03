import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { T, statusColor } from "../theme";

export const Icon = {
  Grid: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>,
  Briefcase: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>,
  Users: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  Settings: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
  Logout: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
  Search: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>,
  Bell: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
  Plus: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>,
  ChevronDown: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>,
  X: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  Check: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>,
  Eye: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
  ArrowLeft: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>,
  Zap: () => <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
  Upload: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>,
  Star: () => <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
  MessageSquare: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
  TrendUp: () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>,
  Briefcase2: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /><line x1="12" y1="12" x2="12" y2="12" /></svg>,
  Menu: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>,
};

export function Btn({ children, variant = "primary", size = "md", loading, icon, style: s, ...props }) {
  const sizes = {
    sm: { padding: "6px 12px", fontSize: 12 },
    md: { padding: "9px 18px", fontSize: 13.5 },
    lg: { padding: "12px 24px", fontSize: 14 },
  };

  const variants = {
    primary: { background: T.text, color: "#fff", border: "none" },
    secondary: { background: T.white, color: T.text, border: `1px solid ${T.border}` },
    danger: { background: T.danger, color: "#fff", border: "none" },
    ghost: { background: "transparent", color: T.textMid, border: "none" },
    lime: { background: T.lime, color: "#253300", border: "none" },
  };

  return (
    <motion.button
      whileHover={{ opacity: props.disabled ? 1 : 0.9 }}
      whileTap={{ scale: props.disabled ? 1 : 0.98 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        borderRadius: T.r10,
        fontWeight: 700,
        fontFamily: T.font,
        cursor: props.disabled ? "not-allowed" : "pointer",
        opacity: props.disabled ? 0.5 : 1,
        transition: "all 0.15s",
        ...sizes[size],
        ...variants[variant],
        ...s,
      }}
      {...props}
    >
      {loading ? <Spinner size={13} color="currentColor" /> : icon}
      {children}
    </motion.button>
  );
}

export function Input({ label, error, icon, style: s, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 12.5, fontWeight: 700, color: T.textMid }}>{label}</label>}
      <div style={{ position: "relative" }}>
        {icon && <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: T.textLight, display: "flex" }}>{icon}</span>}
        <input
          style={{
            width: "100%",
            padding: icon ? "9px 12px 9px 36px" : "9px 12px",
            border: `1px solid ${error ? T.danger : T.border}`,
            borderRadius: T.r10,
            fontSize: 13.5,
            color: T.text,
            background: T.white,
            outline: "none",
            transition: "border-color 0.15s, box-shadow 0.15s",
            ...s,
          }}
          onFocus={(e) => {
            e.target.style.borderColor = T.indigo;
            e.target.style.boxShadow = "0 0 0 3px rgba(79,70,229,0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? T.danger : T.border;
            e.target.style.boxShadow = "none";
          }}
          {...props}
        />
      </div>
      {error && <span style={{ fontSize: 11.5, color: T.danger, fontWeight: 600 }}>{error}</span>}
    </div>
  );
}

export function Textarea({ label, error, style: s, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 12.5, fontWeight: 700, color: T.textMid }}>{label}</label>}
      <textarea
        rows={4}
        style={{
          width: "100%",
          padding: "9px 12px",
          border: `1px solid ${error ? T.danger : T.border}`,
          borderRadius: T.r10,
          fontSize: 13.5,
          color: T.text,
          background: T.white,
          outline: "none",
          resize: "vertical",
          transition: "border-color 0.15s, box-shadow 0.15s",
          ...s,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = T.indigo;
          e.target.style.boxShadow = "0 0 0 3px rgba(79,70,229,0.1)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? T.danger : T.border;
          e.target.style.boxShadow = "none";
        }}
        {...props}
      />
      {error && <span style={{ fontSize: 11.5, color: T.danger, fontWeight: 600 }}>{error}</span>}
    </div>
  );
}

export function Badge({ status }) {
  const { bg, text } = statusColor(status);
  return <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 99, fontSize: 11.5, fontWeight: 700, background: bg, color: text }}>{status}</span>;
}

export function Card({ children, style: s, hover, onClick }) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" } : {}}
      onClick={onClick}
      style={{
        background: T.white,
        border: `1px solid ${T.border}`,
        borderRadius: T.r14,
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        ...s,
      }}
    >
      {children}
    </motion.div>
  );
}

export function Spinner({ size = 18, color = T.indigo }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      style={{ width: size, height: size, border: `2px solid ${color}30`, borderTop: `2px solid ${color}`, borderRadius: "50%", flexShrink: 0 }}
    />
  );
}

export function Skeleton({ style: s }) {
  return (
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.4, repeat: Infinity }}
      style={{ background: "#e8eaed", borderRadius: T.r10, ...s }}
    />
  );
}

export function Modal({ open, title, onClose, children, width = 520 }) {
  useEffect(() => {
    const fn = (e) => e.key === "Escape" && onClose?.();
    if (open) window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, zIndex: 120, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(2px)" }} onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            style={{ position: "relative", width: "100%", maxWidth: width, background: T.white, borderRadius: T.r16, boxShadow: "0 24px 64px rgba(0,0,0,0.14)", overflow: "hidden" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${T.border}` }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: T.text }}>{title}</h3>
              <motion.button whileHover={{ background: T.bg }} whileTap={{ scale: 0.92 }} onClick={onClose} style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, border: "none", background: "transparent", color: T.textLight }}>
                <Icon.X />
              </motion.button>
            </div>
            <div style={{ padding: 20 }}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function PageWrap({ children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}

export function EmptyState({ icon, title, sub, action }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "56px 24px", textAlign: "center" }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 15, fontWeight: 800, color: T.text, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13.5, color: T.textLight, marginBottom: 18, maxWidth: 320 }}>{sub}</div>
      {action}
    </div>
  );
}

export function ScoreRing({ score = 0, size = 64 }) {
  const r = size / 2 - 5;
  const circ = 2 * Math.PI * r;
  const fill = circ - (score / 100) * circ;
  const color = score >= 75 ? T.success : score >= 50 ? T.warning : T.danger;

  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={T.border} strokeWidth={4} />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={4}
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: fill }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize={size < 50 ? 11 : 13} fontWeight="800" fill={color}>
        {score}
      </text>
    </svg>
  );
}
