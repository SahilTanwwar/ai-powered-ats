import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import CompanyCard from "../components/ui/CompanyCard";
import { PUBLIC_COMPANIES } from "../data/publicData";
import { jobs } from "../services/api";

const normalizeCompanyName = (value) => (value || "").trim().toLowerCase();

export default function Companies() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);
  const [publicJobs, setPublicJobs] = useState([]);

  useEffect(() => {
    jobs.getPublic()
      .then((response) => setPublicJobs(response.data || []))
      .catch(() => setPublicJobs([]));
  }, []);

  const jobCountsByCompany = useMemo(() => {
    return publicJobs.reduce((counts, job) => {
      const companyName = normalizeCompanyName(job.Employer?.companyName || job.companyName || job.company);
      if (!companyName) return counts;
      counts[companyName] = (counts[companyName] || 0) + 1;
      return counts;
    }, {});
  }, [publicJobs]);

  const filteredCompanies = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return PUBLIC_COMPANIES;
    return PUBLIC_COMPANIES.filter((company) =>
      `${company.name} ${company.description}`.toLowerCase().includes(normalized)
    );
  }, [query]);

  const visibleCompanies = filteredCompanies.slice(0, visibleCount);

  return (
    <div className="bg-[#18191C] min-h-screen pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-head font-bold text-white mb-4">Discover great companies</h1>
          <p className="text-[#9199A3] text-lg">
            Explore company profiles and see real open-position availability from current job listings.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl flex flex-col sm:flex-row gap-4 mb-10 shadow-lg">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search companies by name or industry..." 
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 text-white rounded-lg outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-white/30 transition-all"
            />
          </div>
          <button type="button" onClick={() => setVisibleCount(6)} className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-glow hover:shadow-none hover:-translate-y-0.5">Search</button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleCompanies.map((company) => (
            <CompanyCard
              key={company.id}
              logo={company.logoUrl}
              name={company.name}
              industry={company.description}
              openJobs={jobCountsByCompany[normalizeCompanyName(company.name)] || 0}
              onOpenJobs={() => navigate(`/find-jobs?company=${encodeURIComponent(company.name)}`)}
              onViewProfile={() => navigate(`/companies/${company.id}`)}
            />
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center text-[#9199A3] mt-6 backdrop-blur-md">
            No companies found for your search.
          </div>
        )}

        {/* Pagination */}
        {visibleCount < filteredCompanies.length && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setVisibleCount((count) => count + 6);
                setTimeout(() => {
                  window.scrollBy({ top: 300, behavior: 'smooth' });
                }, 100);
              }}
              className="px-8 py-3 rounded-xl border border-white/20 text-white font-medium hover:bg-white/10 transition-colors"
            >
              Load More Companies
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
