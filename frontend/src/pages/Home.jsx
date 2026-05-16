import { Briefcase, Building2, Users, FilePlus, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SearchBar from "../components/ui/SearchBar";
import SectionHeader from "../components/ui/SectionHeader";
import JobCard from "../components/ui/JobCard";
import CompanyCard from "../components/ui/CompanyCard";
import api from "../api/api";

export default function Home() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/jobs/public");
        setJobs(response.data.slice(0, 6)); // Show first 6 jobs
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleSearch = (query, location) => {
    const search = new URLSearchParams();
    if (query?.trim()) search.set("q", query.trim());
    if (location?.trim()) search.set("location", location.trim());
    navigate(`/find-jobs${search.toString() ? `?${search.toString()}` : ""}`);
  };

  return (
    <div className="bg-white">
      {/* 3.1 Hero Section */}
      <section className="bg-[#F1F2F4] pt-[80px] pb-[80px] px-4">
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row items-center gap-10">
          <div className="lg:w-[60%] w-full">
            <span className="text-[#18191C] font-semibold text-[14px] mb-4 block">Discover Your Perfect Job Opportunity</span>
            <h1 className="font-head text-[48px] lg:text-[56px] font-bold text-[#18191C] leading-[1.1] mb-6">
              Find a job that suits <br/>your interest & skills
            </h1>
            <p className="text-[#515B6F] text-[16px] mb-8 max-w-2xl leading-relaxed">
              Search through thousands of job opportunities from top companies. Connect with employers looking for talented professionals like you. Start your career journey today.
            </p>
            
            <SearchBar onSearch={handleSearch} />

            <div className="mt-6 flex items-center gap-3 text-[14px]">
              <span className="text-[#767F8C]">Popular searches:</span>
              <div className="flex gap-2 flex-wrap">
                {["UI Designer", "Frontend Developer", "Full Stack Developer", "Marketing Manager", "Product Manager"].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleSearch(tag, "")}
                    className="text-[#515B6F] hover:text-[#0A65CC] cursor-pointer transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:w-[40%] w-full hidden lg:flex justify-end">
            <img src="https://ui-avatars.com/api/?name=Find+Jobs&background=0A65CC&color=fff&size=400" alt="Find Jobs" className="rounded-2xl" />
          </div>
        </div>
      </section>

      {/* 3.4 How Jobpilot Works */}
      <section className="py-[80px] px-4 bg-[#F1F2F4]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-head text-[32px] font-semibold text-[#18191C] mb-4">How JobPilot Works</h2>
            <p className="text-[#515B6F]">Get hired in just 3 simple steps. Find your perfect job, upload your resume, and wait for recruiters to respond.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "1. Browse & Apply", desc: "Explore thousands of job listings from top companies. Click on jobs that match your skills and interests, then submit your application instantly." },
              { title: "2. Upload Resume", desc: "Complete your profile by uploading your resume and CV. Make sure all your qualifications and experience are clearly visible to recruiters." },
              { title: "3. Recruiter Responds", desc: "Recruiters review your application and send you updates via email. You'll receive acceptance or rejection decisions quickly so you can plan next steps." }
            ].map((step, i) => (
              <div key={i} className="text-center group flex flex-col items-center">
                <div className="w-16 h-16 bg-white flex items-center justify-center rounded-full text-[#0A65CC] shadow-sm mb-6 group-hover:bg-[#0A65CC] group-hover:text-white transition-colors">
                  <span className="font-head font-bold text-xl">{i+1}</span>
                </div>
                <h4 className="font-head text-[18px] font-medium text-[#18191C] mb-3">{step.title}</h4>
                <p className="text-[14px] text-[#515B6F] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3.6 Featured Jobs */}
      <section className="py-[80px] px-4 max-w-[1200px] mx-auto">
        <SectionHeader title="Featured Jobs" linkText="View All" linkUrl="/find-jobs" />
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="animate-spin text-[#0A65CC]" size={32} />
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/find-jobs?q=${job.title}`)}
                onKeyDown={(event) => event.key === "Enter" && navigate(`/find-jobs?q=${job.title}`)}
                className="text-left cursor-pointer"
              >
                <JobCard
                  title={job.title}
                  company="Company Name"
                  location={job.location || "Location"}
                  salary="Salary Range"
                  type="Full Time"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-[#515B6F]">
            No jobs available at the moment. Check back soon!
          </div>
        )}
      </section>

      {/* 3.7 Top Companies */}
      <section className="py-[80px] px-4 bg-[#F1F2F4]">
        <div className="max-w-[1200px] mx-auto">
          <SectionHeader title="Top Companies Hiring" linkText="View All" linkUrl="/companies" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CompanyCard name="Google" industry="Tech & Cloud" openJobs={12} onOpenPosition={() => navigate("/companies")} />
            <CompanyCard name="Microsoft" industry="Enterprise Software" openJobs={8} onOpenPosition={() => navigate("/companies")} />
            <CompanyCard name="Amazon" industry="E-Commerce & Cloud" openJobs={15} onOpenPosition={() => navigate("/companies")} />
            <CompanyCard name="Apple" industry="Consumer Electronics" openJobs={5} onOpenPosition={() => navigate("/companies")} />
            <CompanyCard name="Meta (Facebook)" industry="Social Media" openJobs={10} onOpenPosition={() => navigate("/companies")} />
            <CompanyCard name="Netflix" industry="Entertainment" openJobs={7} onOpenPosition={() => navigate("/companies")} />
          </div>
        </div>
      </section>

      {/* 3.9 CTA Banner */}
      <section className="max-w-[1200px] mx-auto px-4 py-[80px]">
        <div className="bg-[#0A65CC] rounded-[8px] p-10 lg:p-16 overflow-hidden relative">
          <div className="max-w-[600px]">
            <h2 className="font-head text-[40px] font-semibold text-white mb-4">Ready to Hire Top Talent?</h2>
            <p className="text-white/90 text-[16px] mb-8 leading-relaxed">Join thousands of employers and start hiring the best candidates today. Post jobs, review applications, and build your dream team on JobPilot.</p>
            <button type="button" onClick={() => navigate("/register?role=RECRUITER")} className="bg-white text-[#0A65CC] font-semibold px-8 py-3 rounded-[4px] hover:bg-gray-100 transition-colors">Become a Recruiter</button>
          </div>
        </div>
      </section>
    </div>
  );
}
