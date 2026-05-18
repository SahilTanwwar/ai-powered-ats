import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import JobCard from "../components/ui/JobCard";
import Pagination from "../components/ui/Pagination";
import SearchBar from "../components/ui/SearchBar";
import { jobs } from "../services/api";

export default function FindJobs() {
  const PAGE_SIZE = 6;
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobType, setJobType] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [searchLocation, setSearchLocation] = useState(searchParams.get("location") || "");
  const companyFilter = searchParams.get("company") || "";
  const [sortBy, setSortBy] = useState("Most Relevant");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await jobs.getPublic();
        const publicJobs = response.data || [];
        setAllJobs(publicJobs);
        setFilteredJobs(publicJobs);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  useEffect(() => {
    let nextJobs = [...allJobs];

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      nextJobs = nextJobs.filter((job) => {
        const title = (job.title || "").toLowerCase();
        const description = (job.description || "").toLowerCase();
        const skills = ((job.requiredSkills || []).join(" ") || "").toLowerCase();
        
        const inTitle = title.includes(query);
        const inDescription = description.includes(query);
        const inSkills = skills.includes(query);
        
        return inTitle || inDescription || inSkills;
      });
    }

    if (searchLocation.trim()) {
      const location = searchLocation.trim().toLowerCase();
      nextJobs = nextJobs.filter((job) =>
        `${job.location || ""} ${job.description || ""}`.toLowerCase().includes(location)
      );
    }

    if (companyFilter.trim()) {
      const company = companyFilter.trim().toLowerCase();
      nextJobs = nextJobs.filter((job) =>
        (job.Employer?.companyName || job.companyName || job.company || "").toLowerCase() === company
      );
    }

    if (jobType.length) {
      nextJobs = nextJobs.filter((job) => {
        const normalizedDescription = (job.description || "").toLowerCase();
        const normalizedRequired = (job.requiredSkills || []).join(" ").toLowerCase();
        return jobType.some((type) => {
          const normalizedType = type.toLowerCase();
          return (
            normalizedDescription.includes(normalizedType) ||
            normalizedRequired.includes(normalizedType)
          );
        });
      });
    }

    if (sortBy === "Newest First") {
      nextJobs.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    if (sortBy === "Salary (High to Low)") {
      nextJobs.sort((a, b) => (b.experienceRequired || "").localeCompare(a.experienceRequired || ""));
    }

    setFilteredJobs(nextJobs);
  }, [allJobs, searchQuery, searchLocation, companyFilter, jobType, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, searchLocation, companyFilter, jobType, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE));
  const pagedJobs = filteredJobs.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const typeCounts = useMemo(
    () => ({
      "Full-Time": allJobs.length,
      "Part-Time": 0,
      Remote: 0,
      Contract: 0,
      Internship: 0,
    }),
    [allJobs]
  );
  
  const toggleJobType = (type) => {
    setJobType((prev) =>
      prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]
    );
  };

  const handleSearch = (query, location) => {
    setSearchQuery(query || "");
    setSearchLocation(location || "");
    const next = new URLSearchParams();
    if (query?.trim()) next.set("q", query.trim());
    if (location?.trim()) next.set("location", location.trim());
    if (companyFilter.trim()) next.set("company", companyFilter.trim());
    setSearchParams(next);
  };

  return (
    <div className="bg-[#18191C] min-h-screen pt-8 pb-16">
      {/* Search Header */}
      <div className="bg-white/5 backdrop-blur-md border-b border-white/10 py-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-primary/10 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-3xl font-head font-bold text-white mb-6">Find your dream job</h1>
          {companyFilter && (
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-sm text-white">
              <span>Showing jobs at {companyFilter}</span>
              <button type="button" onClick={() => setSearchParams({})} className="text-primary hover:text-white transition-colors">
                Clear
              </button>
            </div>
          )}
          <SearchBar
            query={searchQuery}
            location={searchLocation}
            onQueryChange={setSearchQuery}
            onLocationChange={setSearchLocation}
            onSearch={handleSearch}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-[280px] shrink-0 space-y-6">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg">
              <h3 className="font-head font-bold text-lg text-white mb-4">Job Type</h3>
              <div className="space-y-3">
                {["Full-Time", "Part-Time", "Remote", "Contract", "Internship"].map((type) => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer"
                      checked={jobType.includes(type)}
                      onChange={() => toggleJobType(type)}
                    />
                    <span className="text-[#9199A3] group-hover:text-white transition-colors">{type} ({typeCounts[type] || 0})</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg">
              <h3 className="font-head font-bold text-lg text-white mb-4">Salary Range</h3>
              <div className="space-y-4">
                <input 
                  type="range" 
                  min="0" 
                  max="200" 
                  className="w-full accent-primary bg-white/10 rounded-full appearance-none h-1 shadow-inner" 
                />
                <div className="flex items-center justify-between text-sm text-[#9199A3]">
                  <span>$0k</span>
                  <span>$200k+</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg">
              <h3 className="font-head font-bold text-lg text-white mb-4">Experience Level</h3>
              <div className="space-y-3">
                {["Entry Level", "Mid Level", "Senior Level", "Director", "Executive"].map((lvl) => (
                  <label key={lvl} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer" />
                    <span className="text-[#9199A3] group-hover:text-white transition-colors">{lvl}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <p className="text-[#9199A3]">
                Showing <span className="font-semibold text-white">{pagedJobs.length}</span> of <span className="font-semibold text-white">{filteredJobs.length}</span> jobs
              </p>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#9199A3]">Sort by:</span>
                <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all [&>option]:bg-slate-800">
                  <option>Most Relevant</option>
                  <option>Newest First</option>
                  <option>Salary (High to Low)</option>
                </select>
              </div>
            </div>

            {loading && <p className="text-white/60">Loading jobs...</p>}
            {error && !loading && <p className="text-red-400">{error}</p>}

            {!loading && !error && (
              <div className="flex flex-col gap-4">
                {pagedJobs.map((job) => (
                  <Link key={job.id} to={`/job/${job.id}`} className="block transform transition-transform hover:-translate-y-1">
                    <JobCard
                      title={job.title}
                      company={job.Employer?.companyName || "Employer"}
                      location={job.location || "Remote"}
                      salary={job.salaryMin && job.salaryMax ? `$${job.salaryMin} - $${job.salaryMax}` : "Unspecified"}
                      type={job.type || "Full Time"}
                    />
                  </Link>
                ))}

                {filteredJobs.length === 0 && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-[#9199A3] backdrop-blur-md">
                    No jobs match your search.
                  </div>
                )}
              </div>
            )}

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </main>

        </div>
      </div>
    </div>
  );
}
