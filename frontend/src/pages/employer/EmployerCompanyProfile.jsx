import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { users } from "../../services/api";

export default function EmployerCompanyProfile() {
  const defaults = {
    name: "",
    industry: "Technology",
    size: "11-50",
    founded: "",
    website: "",
    phone: "",
    email: "",
    country: "",
    city: "",
    address: "",
    description: "",
  };

  const [form, setForm] = useState(defaults);
  const loadedRef = useRef(false);

  useEffect(() => {
    // Prevent double-loading in React Strict Mode
    if (loadedRef.current) return;
    loadedRef.current = true;

    const load = async () => {
      try {
        const response = await users.getCompanyProfile();
        const profile = response?.data?.data;
        if (profile && typeof profile === "object") {
          setForm((prev) => ({ ...prev, ...profile }));
        }
      } catch (error) {
        // Silently fail - company profile might not exist yet
        console.log("Company profile not found - that's okay");
      }
    };
    load();
  }, []);

  const saveProfile = async () => {
    if (!form.name.trim()) {
      toast.error("Company name is required.");
      return;
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Enter a valid company email.");
      return;
    }

    try {
      await users.saveCompanyProfile(form);
      toast.success("Company profile saved.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save company profile.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="bg-[#18191C]/95 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3"></div>

        <div className="mb-8 border-b border-white/10 pb-6 relative z-10">
          <h1 className="text-3xl font-head font-bold text-white mb-2">Company Profile</h1>
          <p className="text-[#9199A3]">Manage your brand's presence and visibility on the platform.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 relative z-10">
          <div className="md:col-span-2 space-y-1.5">
             <label className="text-sm font-medium text-white/80">Company Name</label>
             <input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} placeholder="e.g. Acme Corp" className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-white/30" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-white/80">Industry</label>
            <select value={form.industry} onChange={(event) => setForm((prev) => ({ ...prev, industry: event.target.value }))} className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none">
              <optgroup className="bg-slate-800 text-white">
                <option>Technology</option><option>Finance</option><option>Healthcare</option><option>Education</option><option>Retail</option>
              </optgroup>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-white/80">Company Size</label>
            <select value={form.size} onChange={(event) => setForm((prev) => ({ ...prev, size: event.target.value }))} className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none">
              <optgroup className="bg-slate-800 text-white">
                <option>1-10</option><option>11-50</option><option>51-200</option><option>201-500</option><option>500+</option>
              </optgroup>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-white/80">Founded Year</label>
            <input value={form.founded} onChange={(event) => setForm((prev) => ({ ...prev, founded: event.target.value }))} placeholder="e.g. 2010" className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-white/30" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-white/80">Website</label>
            <input value={form.website} onChange={(event) => setForm((prev) => ({ ...prev, website: event.target.value }))} placeholder="https://example.com" className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-white/30" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-white/80">Contact Phone</label>
            <input value={form.phone} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))} placeholder="+1 (555) 000-0000" className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-white/30" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-white/80">Contact Email</label>
            <input value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} placeholder="careers@example.com" className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-white/30" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-white/80">Country</label>
            <input value={form.country} onChange={(event) => setForm((prev) => ({ ...prev, country: event.target.value }))} placeholder="e.g. United States" className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-white/30" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-white/80">City</label>
            <input value={form.city} onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))} placeholder="e.g. San Francisco" className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-white/30" />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-sm font-medium text-white/80">Full Address</label>
            <input value={form.address} onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))} placeholder="123 Tech Lane, Suite 400" className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-white/30" />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-sm font-medium text-white/80">Company Description</label>
            <textarea value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} placeholder="Tell candidates about your company's mission and culture..." className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-white/30" rows={5} />
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex justify-end relative z-10">
          <button type="button" onClick={saveProfile} className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl font-medium transition-all shadow-glow hover:-translate-y-0.5">
            Save Profile Changes
          </button>
        </div>
      </div>
    </div>
  );
}
