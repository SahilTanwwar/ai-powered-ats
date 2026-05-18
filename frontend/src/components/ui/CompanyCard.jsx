import { Briefcase } from "lucide-react";

export default function CompanyCard({ logo, name, industry, openJobs, onOpenJobs, onViewProfile }) {
  const hasOpenJobs = Number(openJobs) > 0;

  return (
    <div className="bg-[#18191C]/95 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 flex flex-col h-full items-center text-center group hover:-translate-y-2 relative overflow-hidden">
      
      {/* Background Glow on hover */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="w-16 h-16 bg-white/5 border border-white/10 shadow-inner rounded-xl flex items-center justify-center mb-5 overflow-hidden p-3 relative z-10">
        {logo ? <img src={logo} alt={name} className="w-full h-full object-contain" /> : <span className="font-bold text-white/50 text-2xl">{name?.charAt(0)}</span>}
      </div>

      <h3 className="font-head font-bold text-xl text-white mb-1 group-hover:text-primary transition-colors relative z-10">{name}</h3>
      <p className="text-sm text-[#9199A3] mb-6 relative z-10 line-clamp-2">{industry}</p>

      <div className={`mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold relative z-10 ${hasOpenJobs ? "border-primary/30 bg-primary/15 text-primary" : "border-white/10 bg-white/5 text-white/50"}`}>
        <Briefcase size={13} />
        {hasOpenJobs ? `${openJobs} open ${openJobs === 1 ? "position" : "positions"}` : "No open positions"}
      </div>
      
      <div className="flex flex-col gap-3 w-full mt-auto relative z-10">
        <button onClick={onViewProfile} className="w-full text-center py-3 bg-white/5 border border-white/10 text-white font-medium text-sm rounded-xl hover:bg-primary hover:border-primary hover:text-white transition-colors flex items-center justify-center gap-2">
          View Profile
        </button>
        {hasOpenJobs && (
          <button onClick={onOpenJobs} className="w-full text-center py-3 bg-primary/10 border border-primary/20 text-primary font-medium text-sm rounded-xl hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2">
            Open Positions
          </button>
        )}
      </div>
    </div>
  );
}
