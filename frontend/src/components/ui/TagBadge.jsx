export default function TagBadge({ type }) {
  if (!type) return null;
  const t = typeof type === "string" ? type.toLowerCase() : "";
  let bg = "bg-gray-100", text = "text-gray-600", label = type;

  if (t.includes("full")) {
    bg = "bg-[#E8F1FF]"; text = "text-[#0A65CC]"; label = "Full Time";
  } else if (t.includes("part")) {
    bg = "bg-[#FFF6E6]"; text = "text-[#E05151]"; label = "Part Time";
  } else if (t.includes("remote")) {
    bg = "bg-[#E6F6EC]"; text = "text-[#0BA02C]"; label = "Remote";
  } else if (t.includes("contract")) {
    bg = "bg-[#FFF0EA]"; text = "text-[#FF6636]"; label = "Contract";
  } else if (t.includes("freelance")) {
    bg = "bg-[#F0EDFF]"; text = "text-[#7C6FCD]"; label = "Freelance";
  }

  return (
    <span className={`px-2.5 py-1 rounded-[3px] text-[12px] font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
}
