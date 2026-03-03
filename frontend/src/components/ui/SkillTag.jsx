/**
 * SkillTag â€” colored skill chip
 * type: "matched" | "missing" | "neutral"
 */
export default function SkillTag({ skill, type = "neutral" }) {
  const cls =
    type === "matched"
      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
      : type === "missing"
      ? "bg-red-50 text-red-600 border border-red-200 line-through"
      : "bg-slate-100 text-slate-600 border border-slate-200";

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${cls}`}>
      {type === "matched" && <span className="mr-1">âœ“</span>}
      {type === "missing" && <span className="mr-1">âœ—</span>}
      {skill}
    </span>
  );
}
