import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { auth } from "../services/api";
import { Mail, Lock, User, Loader2, ArrowRight, Briefcase } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({ name: "", username: "", email: "", password: "", confirmPassword: "" });
  const [selectedRole, setSelectedRole] = useState("CANDIDATE");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await auth.register({ email: formData.email.trim(), password: formData.password });
      toast.success("Registration successful! Verify your email.");
      navigate(`/verify-email?email=${encodeURIComponent(formData.email.trim())}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const openSocialSignup = (provider) => {
    const urls = {
      google: "https://accounts.google.com/signin",
      linkedin: "https://www.linkedin.com/login",
    };

    window.open(urls[provider], "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-white flex">
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
        <div className="mx-auto w-full max-w-sm lg:w-[400px]">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Briefcase className="w-6 h-6" />
            </div>
            <span className="text-2xl font-head font-bold text-dark">Jobpilot</span>
          </Link>
          
          <div>
            <h2 className="text-3xl font-head font-semibold text-dark mb-2">Create Account</h2>
            <p className="text-secondary text-sm">
              Already have an account? <Link to="/login" className="text-primary hover:text-primary-dark font-medium">Log In</Link>
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-secondary" />
                  </div>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-lg bg-white text-dark focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="John Doe" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-1">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-secondary" />
                  </div>
                  <input type="text" required value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-lg bg-white text-dark focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="john_doe" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-secondary" />
                  </div>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-lg bg-white text-dark focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="john@example.com" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-secondary" />
                  </div>
                  <input type="password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-lg bg-white text-dark focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="••••••••" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-1">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-secondary" />
                  </div>
                  <input type="password" required value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} className="block w-full pl-10 pr-3 py-2.5 border border-border rounded-lg bg-white text-dark focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="••••••••" />
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-dark mb-2">Select Role</p>
                <div className="grid grid-cols-1 gap-3">
                  <button type="button" onClick={() => setSelectedRole("CANDIDATE")} className={`rounded-lg py-2.5 text-sm font-medium border transition-colors ${selectedRole === "CANDIDATE" ? "bg-primary text-white border-primary" : "bg-white text-dark border-border hover:bg-primary-light"}`}>Candidate / Job Seeker</button>
                </div>
              </div>

              <div className="flex items-center">
                <input id="terms" name="terms" type="checkbox" required className="h-4 w-4 bg-white border-border rounded text-primary focus:ring-primary" />
                <label htmlFor="terms" className="ml-2 block text-sm text-secondary">
                  I agree to the <Link to="/blog" className="text-primary hover:text-primary-dark">Terms of Service</Link> & <Link to="/blog" className="text-primary hover:text-primary-dark">Privacy Policy</Link>
                </label>
              </div>

              <button type="submit" disabled={loading} className="w-full btn btn-primary flex justify-center py-2.5">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create Account <ArrowRight className="ml-2 w-5 h-5" /></>}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-secondary">Or Login With</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => openSocialSignup("google")} className="w-full border border-border rounded-lg py-2.5 text-sm font-medium text-dark hover:bg-primary-light transition-colors">Google</button>
                <button type="button" onClick={() => openSocialSignup("linkedin")} className="w-full border border-border rounded-lg py-2.5 text-sm font-medium text-dark hover:bg-primary-light transition-colors">LinkedIn</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="hidden lg:block relative w-0 flex-1 bg-dark-bg">
        <div className="absolute inset-0 h-full w-full opacity-40 bg-[url('https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark to-dark/40" />
        <div className="absolute bottom-0 left-0 right-0 p-16 text-white">
          <blockquote className="space-y-6">
            <p className="text-3xl font-head font-medium leading-snug">
              "We've cut our hiring time in half. Finding the right candidates has never been easier or more intuitive."
            </p>
            <footer className="flex items-center gap-4">
              <img src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" className="w-12 h-12 rounded-full border-2 border-white/20" />
              <div>
                <div className="text-base font-semibold">Michael Chen</div>
                <div className="text-sm text-gray-300">VP of Engineering, StartupInc</div>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
