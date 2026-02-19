export const T = {
  // Colors
  lime: "#C8F135",
  limeSoft: "#f0fccf",
  indigo: "#4f46e5",
  indigoSoft: "#eef2ff",
  bg: "#f7f8fa",
  white: "#ffffff",
  text: "#0d1117",
  textMid: "#5a6474",
  textLight: "#9ea8b3",
  border: "#e8eaed",
  borderHover: "#d1d5db",
  danger: "#ef4444",
  dangerSoft: "#fef2f2",
  success: "#16a34a",
  successSoft: "#f0fdf4",
  warning: "#d97706",
  warningSoft: "#fffbeb",

  // Radius
  r8: 8,
  r10: 10,
  r12: 12,
  r14: 14,
  r16: 16,

  // Font
  font: "'Plus Jakarta Sans', sans-serif",
};

export const statusColor = (s) => ({
  APPLIED:     { bg: "#f1f5f9", text: "#475569" },
  SHORTLISTED: { bg: T.indigoSoft, text: T.indigo },
  HIRED:       { bg: T.successSoft, text: T.success },
  REJECTED:    { bg: T.dangerSoft, text: T.danger },
}[s] || { bg: "#f1f5f9", text: "#475569" });
