export default function CompanyCard({ logo, name, industry, openJobs, onOpenPosition }) {
  return (
    <div className="bg-white border border-[#E4E5E8] rounded-[8px] p-6 hover:shadow-md transition-all duration-200 flex flex-col h-full items-center text-center">
      <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-md flex items-center justify-center mb-4 overflow-hidden">
        {logo ? <img src={logo} alt={name} className="w-full h-full object-cover" /> : <span className="font-bold text-gray-400 text-xl">{name?.charAt(0)}</span>}
      </div>
      <h3 className="font-head font-medium text-[18px] text-text-primary mb-1">{name}</h3>
      <p className="text-[14px] text-text-muted mb-4">{industry}</p>
      
      <div className="flex flex-col gap-3 w-full mt-auto">
        <button onClick={onOpenPosition} className="w-full text-center py-2.5 bg-primary-light text-primary font-medium text-[14px] rounded-[4px] hover:bg-primary-hover hover:text-white transition-colors">
          Open Position ({openJobs})
        </button>
      </div>
    </div>
  );
}
