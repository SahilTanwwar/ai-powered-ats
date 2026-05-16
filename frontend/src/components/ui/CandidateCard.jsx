export default function CandidateCard({ avatar, name, title, skills = [], location, onViewProfile }) {
  return (
    <div className="bg-white border border-[#E4E5E8] rounded-[8px] p-6 hover:shadow-md transition-all duration-200 flex flex-col h-full items-center text-center">
      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 mb-4 border border-gray-200">
        {avatar ? <img src={avatar} alt={name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-400">{name?.charAt(0)}</div>}
      </div>
      <h3 className="font-head font-medium text-[16px] text-text-primary mb-1">{name}</h3>
      <p className="text-[14px] text-text-secondary mb-3">{title || "Professional"}</p>
      
      <div className="flex flex-wrap gap-1.5 justify-center mb-5">
        {skills.slice(0, 3).map((s, i) => (
          <span key={i} className="px-2 py-0.5 bg-[#F1F2F4] text-[#515B6F] text-[12px] rounded-full">
            {s}
          </span>
        ))}
        {skills.length > 3 && (
          <span className="px-2 py-0.5 bg-[#F1F2F4] text-[#515B6F] text-[12px] rounded-full">+{skills.length - 3}</span>
        )}
      </div>

      <div className="mt-auto w-full">
        {location && <p className="text-[14px] text-text-muted mb-3 flex items-center justify-center gap-1"><span className="text-gray-400">📍</span> {location}</p>}
        <button onClick={onViewProfile} className="w-full py-2.5 border border-primary text-primary hover:bg-primary-light font-medium text-[14px] rounded-[4px] transition-colors">
          View Profile
        </button>
      </div>
    </div>
  );
}
