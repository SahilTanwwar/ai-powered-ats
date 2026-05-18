import { Briefcase, Users, FilePlus, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import SearchBar from "../components/ui/SearchBar";
import JobCard from "../components/ui/JobCard";
import api from "../api/api";
import { PUBLIC_COMPANIES } from "../data/publicData";

const normalizeCompanyName = (value) => (value || "").trim().toLowerCase();

export default function Home() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [publicJobs, setPublicJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/jobs/public");
        const availableJobs = response.data || [];
        setPublicJobs(availableJobs);
        setJobs(availableJobs.slice(0, 6)); // Show first 6 jobs
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const jobCountsByCompany = useMemo(() => {
    return publicJobs.reduce((counts, job) => {
      const companyName = normalizeCompanyName(job.Employer?.companyName || job.companyName || job.company);
      if (!companyName) return counts;
      counts[companyName] = (counts[companyName] || 0) + 1;
      return counts;
    }, {});
  }, [publicJobs]);

  const handleSearch = (query, location) => {
    const search = new URLSearchParams();
    if (query?.trim()) search.set("q", query.trim());
    if (location?.trim()) search.set("location", location.trim());
    navigate(`/find-jobs${search.toString() ? `?${search.toString()}` : ""}`);
  };

  return (
    <div className="bg-[#18191C] text-white font-sans selection:bg-primary selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-primary/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
        
        <div className="max-w-[1200px] mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm font-medium text-primary-light mb-8 animate-fade-in-up">
            AI-Powered Job Hunting & ATS
          </div>
          <h1 className="font-head text-[48px] md:text-[72px] font-bold leading-tight tracking-tight mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Find a job that suits <br className="hidden md:block" />
            <span className="text-primary">your interest & skills.</span>
          </h1>
          <p className="text-[#9199A3] text-lg md:text-[20px] max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Search through thousands of job opportunities from top companies. Connect with employers looking for talented professionals like you.
          </p>
        </div>
      </section>

      {/* 01 - The Search */}
      <section className="py-24 px-4 bg-white text-[#18191C]">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-5/12">
              <span className="text-[#0A65CC] font-bold tracking-widest uppercase text-[12px] mb-2 block">01 — The Search</span>
              <h2 className="font-head text-[40px] md:text-[48px] font-bold mb-6 leading-tight">We Search <br/>While You Sleep.</h2>
              <p className="text-[#515B6F] mb-10 text-[18px] leading-relaxed">
                Discover your perfect job opportunity. Enter your desired role and let our intelligent platform handle the heavy lifting.
              </p>
              
              <div className="flex flex-col gap-4 text-[14px]">
                <span className="font-semibold text-[#18191C]">Popular searches:</span>
                <div className="flex gap-2 flex-wrap">
                  {["UI Designer", "Frontend Developer", "Full Stack Developer", "Marketing Manager", "Product Manager"].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleSearch(tag, "")}
                      className="px-5 py-2.5 rounded-full bg-[#F1F2F4] text-[#515B6F] hover:bg-[#0A65CC] hover:text-white transition-all cursor-pointer font-medium"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="lg:w-7/12 w-full bg-[#F1F2F4] p-6 md:p-10 rounded-[32px] shadow-glass border border-white relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/60 rounded-[32px] pointer-events-none"></div>
              <div className="bg-white p-6 rounded-2xl shadow-sm relative z-10">
                 <SearchBar onSearch={handleSearch} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 02 - The Process */}
      <section className="py-24 px-4 bg-[#18191C] border-t border-white/10 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="mb-16 md:w-2/3">
            <span className="text-primary font-bold tracking-widest uppercase text-[12px] mb-2 block">02 — The Process</span>
            <h2 className="font-head text-[40px] md:text-[48px] font-bold mb-4 text-white">How JobPilot Works</h2>
            <p className="text-[#9199A3] text-[18px]">Get hired in just 3 simple steps. Find your perfect job, upload your resume, and wait for recruiters to respond.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Browse & Apply", desc: "Explore thousands of job listings from top companies. Click on jobs that match your skills and interests.", icon: <Briefcase size={28} /> },
              { title: "Upload Resume", desc: "Complete your profile by uploading your resume. Make sure all your qualifications are clearly visible.", icon: <FilePlus size={28} /> },
              { title: "Recruiter Responds", desc: "Recruiters review your application and send you updates instantly. Receive decisions quickly.", icon: <Users size={28} /> }
            ].map((step, i) => (
              <div key={i} className="bg-[#1F2023] border border-white/5 p-10 rounded-[28px] hover:bg-white/5 hover:border-white/10 transition-all group relative overflow-hidden">
                <div className="absolute top-4 right-6 text-[80px] font-head font-bold text-white/5 group-hover:text-white/10 transition-colors pointer-events-none select-none">
                  0{i+1}
                </div>
                <div className="w-[60px] h-[60px] bg-[#0A65CC]/20 text-[#0A65CC] flex items-center justify-center rounded-[18px] mb-8 group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <h4 className="font-head text-[22px] font-bold text-white mb-4 relative z-10">{step.title}</h4>
                <p className="text-[#9199A3] leading-relaxed relative z-10">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 03 - Featured Jobs */}
      <section className="py-24 px-4 bg-white text-[#18191C]">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-14 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-200 pb-6">
            <div>
              <span className="text-[#0A65CC] font-bold tracking-widest uppercase text-[12px] mb-2 block">03 — Opportunities</span>
              <h2 className="font-head text-[40px] md:text-[48px] font-bold">Featured Jobs</h2>
            </div>
            <button onClick={() => navigate('/find-jobs')} className="text-[#0A65CC] font-semibold hover:text-[#0854AE] transition-colors flex items-center gap-2 text-[16px] mb-2">
              Explore All <span className="text-[20px]">→</span>
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader className="animate-spin text-[#0A65CC]" size={36} />
            </div>
          ) : jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/find-jobs?q=${job.title}`)}
                  className="text-left cursor-pointer hover:-translate-y-2 transition-transform duration-300"
                >
                  <JobCard
                    title={job.title}
                    company={job.Employer?.companyName || "Employer"}
                    location={job.location || "Remote"}
                    salary={job.salaryMin && job.salaryMax ? `$${job.salaryMin} - $${job.salaryMax}` : "Unspecified"}
                    type={job.type || "Full Time"}
                  />
                </div>
              ))}
            </div>
          ) : (
             <div className="text-center py-16 text-[#515B6F] bg-[#F1F2F4] rounded-[24px]">
              No jobs available at the moment. Check back soon!
            </div>
          )}
        </div>
      </section>

      {/* 04 - Top Companies */}
      <section className="py-24 px-4 bg-[#18191C] text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="mb-14 border-b border-white/10 pb-6 flex flex-col md:flex-row items-end justify-between">
            <div>
              <span className="text-primary font-bold tracking-widest uppercase text-[12px] mb-2 block">04 — Top Companies</span>
              <h2 className="font-head text-[40px] md:text-[48px] font-bold">Explore Companies</h2>
            </div>
            <button onClick={() => navigate('/companies')} className="text-primary font-semibold hover:text-white transition-colors flex items-center gap-2 text-[16px] mb-2">
              View All Companies <span className="text-[20px]">→</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PUBLIC_COMPANIES.map((company) => {
              const openJobs = jobCountsByCompany[normalizeCompanyName(company.name)] || 0;
              return (
              <div key={company.id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 group flex flex-col h-full hover:-translate-y-2">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-3 shadow-inner">
                    <img src={company.logoUrl} alt={company.name} className="w-full h-full object-contain" />
                  </div>
                  <div className={`${openJobs > 0 ? "bg-primary/20 text-primary border-primary/30" : "bg-white/5 text-white/50 border-white/10"} border px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1`}>
                    <Briefcase size={12} />
                    {openJobs > 0 ? `${openJobs} ${openJobs === 1 ? "Job" : "Jobs"}` : "No jobs"}
                  </div>
                </div>
                
                <h3 className="font-head font-bold text-xl text-white mb-1 group-hover:text-primary transition-colors">{company.name}</h3>
                <div className="flex items-center gap-2 text-sm text-[#9199A3] mb-4">
                  <span>{company.industry}</span>
                  <span>•</span>
                  <span>{company.size}</span>
                </div>
                
                <p className="text-white/60 text-sm leading-relaxed mb-6 flex-grow">
                  {company.description}
                </p>
                
                <button 
                  onClick={() => navigate(`/companies/${company.id}`)} 
                  className="w-full py-3 bg-white/5 border border-white/10 text-white rounded-xl font-medium hover:bg-primary hover:border-primary hover:text-white transition-colors mt-auto"
                >
                  View Profile
                </button>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 05 - CTA Banner */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="bg-[#18191C] rounded-[32px] p-12 lg:p-20 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0A65CC] blur-[150px] rounded-full opacity-30 pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
            <div className="max-w-[600px] relative z-10">
              <span className="text-primary font-bold tracking-widest uppercase text-[12px] mb-3 block">05 — Recruiting</span>
              <h2 className="font-head text-[40px] md:text-[56px] leading-[1.1] font-bold text-white mb-6">Ready to Hire Top Talent?</h2>
              <p className="text-[#9199A3] text-[18px] mb-10 leading-relaxed">Join thousands of employers and start hiring the best candidates today. Post jobs, review applications, and build your dream team with our AI-powered ATS.</p>
              <button 
                type="button" 
                onClick={() => navigate("/register?role=RECRUITER")} 
                className="bg-[#0A65CC] text-white font-semibold text-[16px] px-10 py-4 rounded-full hover:bg-[#0854AE] transition-colors shadow-glow hover:shadow-none hover:-translate-y-1"
              >
                Become a Recruiter
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
