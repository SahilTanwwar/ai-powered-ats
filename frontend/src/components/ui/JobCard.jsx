import { Bookmark } from "lucide-react";

export default function JobCard({ logo, title, company, location, salary, type, onSave }) {
  return (
    <div className="bg-[#18191C]/95 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-primary/20 relative overflow-hidden flex flex-col h-full group transition-all duration-300">
      {/* Background Glow on hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="flex items-start justify-between mb-5 relative z-10">
        <div className="flex gap-4 items-start">
          <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
            {logo ? <img src={logo} alt={company} className="w-full h-full object-cover" /> : <span className="font-bold text-white/50 text-xl">{company?.charAt(0)}</span>}
          </div>
          <div>
            <h3 className="font-head font-bold text-lg text-white mb-1 group-hover:text-primary transition-colors line-clamp-1">{title}</h3>
            <div className="flex items-center gap-2 text-sm text-[#9199A3]">
              <span className="font-medium text-white/80 line-clamp-1">{company}</span>
              <span>•</span>
              <span className="line-clamp-1">{location}</span>
            </div>
          </div>
        </div>
        {onSave && (
          <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSave(); }} className="p-2 text-[#9199A3] hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Save Job">
            <Bookmark size={20} />
          </button>
        )}
      </div>

      <div className="mt-auto pt-5 border-t border-white/10 flex items-center gap-3 relative z-10 flex-wrap">
        <div className="bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-lg text-xs font-semibold">
          {type || "Full Time"}
        </div>
        <div className="bg-white/5 text-white/80 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-medium">
          {salary || "Unspecified"}
        </div>
      </div>
    </div>
  );
}
