import { Bookmark } from "lucide-react";
import TagBadge from "./TagBadge";
import SalaryBadge from "./SalaryBadge";

export default function JobCard({ logo, title, company, location, salary, type, onSave }) {
  return (
    <div className="card-modern flex flex-col h-full group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-4 items-start">
          <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-md flex items-center justify-center shrink-0 overflow-hidden">
            {logo ? <img src={logo} alt={company} className="w-full h-full object-cover" /> : <span className="font-bold text-gray-400 text-lg">{company?.charAt(0)}</span>}
          </div>
          <div>
            <h3 className="font-head font-medium text-[16px] text-text-primary mb-1 group-hover:text-primary transition-colors">{title}</h3>
            <div className="flex items-center gap-2 text-[14px] text-text-muted">
              <span>{company}</span>
              <span className="text-border">•</span>
              <span>{location}</span>
            </div>
          </div>
        </div>
        {onSave && (
          <button type="button" onClick={onSave} className="p-2 text-text-muted hover:text-primary hover:bg-primary-light rounded-md transition-colors" title="Save Job">
            <Bookmark size={20} />
          </button>
        )}
      </div>

      <div className="mt-auto pt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SalaryBadge value={salary} />
          <TagBadge type={type} />
        </div>
      </div>
    </div>
  );
}
