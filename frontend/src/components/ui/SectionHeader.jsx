import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function SectionHeader({ title, subtitle, linkText, linkUrl }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
      <div>
        <h2 className="font-head text-[32px] font-semibold text-text-primary mb-2">{title}</h2>
        {subtitle && <p className="text-[16px] text-text-muted">{subtitle}</p>}
      </div>
      {linkText && linkUrl && (
        <Link to={linkUrl} className="flex items-center gap-2 text-primary font-medium hover:text-primary-hover group transition-colors">
          {linkText}
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </div>
  );
}
