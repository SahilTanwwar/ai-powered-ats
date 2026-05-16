import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { auth } from "../services/api";
import { Mail, Lock, Loader2, ArrowRight, Briefcase } from "lucide-react";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await auth.login(formData.email.trim(), formData.password);
      setToken(response.data?.token);
      toast.success("Successfully logged in");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const openSocialLogin = (provider) => {
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
            <h2 className="text-3xl font-head font-semibold text-dark mb-2">Sign in</h2>
            <p className="text-secondary text-sm">
              Don't have an account? <Link to="/register" className="text-primary hover:text-primary-dark font-medium">Create Account</Link>
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-5">
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

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 bg-white border-border rounded text-primary focus:ring-primary" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-secondary">Remember me</label>
                </div>
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-primary hover:text-primary-dark">Forgot password?</Link>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full btn btn-primary flex justify-center py-2.5">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign in <ArrowRight className="ml-2 w-5 h-5" /></>}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-secondary">Or Sign In With</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => openSocialLogin("google")} className="w-full border border-border rounded-lg py-2.5 text-sm font-medium text-dark hover:bg-primary-light transition-colors">Google</button>
                <button type="button" onClick={() => openSocialLogin("linkedin")} className="w-full border border-border rounded-lg py-2.5 text-sm font-medium text-dark hover:bg-primary-light transition-colors">LinkedIn</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="hidden lg:block relative w-0 flex-1 bg-dark-bg">
        <div className="absolute inset-0 h-full w-full opacity-40 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark to-dark/40" />
        <div className="absolute bottom-0 left-0 right-0 p-16 text-white">
          <blockquote className="space-y-6">
            <p className="text-3xl font-head font-medium leading-snug">
              "This platform has completely transformed how we find and hire talent. The AI-powered shortlisting saves us countless hours."
            </p>
            <footer className="flex items-center gap-4">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" className="w-12 h-12 rounded-full border-2 border-white/20" />
              <div>
                <div className="text-base font-semibold">Sarah Jenkins</div>
                <div className="text-sm text-gray-300">Director of Recruiting, TechCorp</div>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
