const VARIANTS = {
  active:       "bg-emerald-100 text-emerald-700",
  closed:       "bg-slate-100 text-slate-500",
  draft:        "bg-amber-100 text-amber-700",
  APPLIED:      "bg-blue-100 text-blue-700",
  SHORTLISTED:  "bg-violet-100 text-violet-700",
  HIRED:        "bg-emerald-100 text-emerald-700",
  REJECTED:     "bg-red-100 text-red-600",
  ADMIN:        "bg-indigo-100 text-indigo-700",
  RECRUITER:    "bg-sky-100 text-sky-700",
};

export default function Badge({ label, variant }) {
  const cls = VARIANTS[variant] || VARIANTS[label] || "bg-slate-100 text-slate-500";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
}
