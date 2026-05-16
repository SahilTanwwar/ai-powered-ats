import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import CompanyCard from "../components/ui/CompanyCard";
import { PUBLIC_COMPANIES } from "../data/publicData";

export default function Companies() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  const filteredCompanies = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return PUBLIC_COMPANIES;
    return PUBLIC_COMPANIES.filter((company) =>
      `${company.name} ${company.description}`.toLowerCase().includes(normalized)
    );
  }, [query]);

  const visibleCompanies = filteredCompanies.slice(0, visibleCount);

  return (
    <div className="bg-bg min-h-screen pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-head font-bold text-dark mb-4">Discover great companies</h1>
          <p className="text-secondary text-lg">
            Find your next career opportunity at top companies that are hiring right now.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="bg-white border border-border p-4 rounded-xl flex flex-col sm:flex-row gap-4 mb-10 shadow-sm">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search companies by name or industry..." 
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white text-dark rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button type="button" onClick={() => setVisibleCount(6)} className="btn btn-primary px-8 py-3">Search</button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleCompanies.map((company) => (
            <CompanyCard
              key={company.id}
              logo={company.logoUrl}
              name={company.name}
              industry={company.description}
              openJobs={company.openJobs}
              onOpenPosition={() => navigate(`/companies/${company.id}`)}
            />
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="bg-white border border-border rounded-xl p-8 text-center text-secondary mt-6">
            No companies found for your search.
          </div>
        )}

        {/* Pagination */}
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            disabled={visibleCount >= filteredCompanies.length}
            onClick={() => setVisibleCount((count) => count + 6)}
            className="btn btn-outline px-8 py-2.5 disabled:opacity-50"
          >
            Load More Companies
          </button>
        </div>

      </div>
    </div>
  );
}