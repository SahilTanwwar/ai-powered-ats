import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Briefcase } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#18191C] text-white pt-[80px]">
      <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white">
              <Briefcase size={18} />
            </div>
            <span className="font-head text-[22px] font-bold tracking-tight">Jobpilot</span>
          </Link>
          <p className="text-[#9199A3] text-[14px] leading-relaxed mb-6">
          </p>
          <div className="flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-colors"><Facebook size={18} /></a>
            <a href="https://x.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-colors"><Twitter size={18} /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-colors"><Instagram size={18} /></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-colors"><Youtube size={18} /></a>
          </div>
        </div>

        <div>
          <h4 className="font-head text-[18px] font-medium mb-6">Quick Link</h4>
          <ul className="flex flex-col gap-4 text-[#9199A3] text-[14px]">
            <li><Link to="/" className="hover:text-white transition-colors">About</Link></li>
            <li><Link to="/find-jobs" className="hover:text-white transition-colors">Find a Job</Link></li>
            <li><Link to="/companies" className="hover:text-white transition-colors">Find Employer</Link></li>
            <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
            <li><Link to="/blog" className="hover:text-white transition-colors">Pricing Plan</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-head text-[18px] font-medium mb-6">Candidate</h4>
          <ul className="flex flex-col gap-4 text-[#9199A3] text-[14px]">
            <li><Link to="/find-jobs" className="hover:text-white transition-colors">Browse Jobs</Link></li>
            <li><Link to="/companies" className="hover:text-white transition-colors">Browse Employers</Link></li>
            <li><Link to="/dashboard" className="hover:text-white transition-colors">Candidate Dashboard</Link></li>
            <li><Link to="/dashboard" className="hover:text-white transition-colors">Job Alerts</Link></li>
            <li><Link to="/dashboard" className="hover:text-white transition-colors">Saved Jobs</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-head text-[18px] font-medium mb-6">Employers</h4>
          <ul className="flex flex-col gap-4 text-[#9199A3] text-[14px]">
            <li><Link to="/login" className="hover:text-white transition-colors">Post a Job</Link></li>
            <li><Link to="/candidates" className="hover:text-white transition-colors">Browse Candidates</Link></li>
            <li><Link to="/dashboard" className="hover:text-white transition-colors">Employers Dashboard</Link></li>
            <li><Link to="/dashboard" className="hover:text-white transition-colors">Applications</Link></li>
            <li><Link to="/blog" className="hover:text-white transition-colors">Plans</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#9199A3] text-[14px]">© 2026 Jobpilot - Job Portal. All rights Rerserved.</p>
          <div className="flex gap-6 text-[#9199A3] text-[14px]">
            <Link to="/blog" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/blog" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
