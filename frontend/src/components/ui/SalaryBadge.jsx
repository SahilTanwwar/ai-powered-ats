export default function SalaryBadge({ value }) {
  return (
    <span className="px-2.5 py-1 rounded-[3px] text-[12px] font-medium bg-[#F1F2F4] text-[#515B6F]">
      {value || "Salary Undisclosed"}
    </span>
  );
}
