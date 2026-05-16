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
    <div className="space-y-4">
      <h1 className="text-2xl font-head font-semibold text-dark">Company Profile</h1>
      <div className="grid md:grid-cols-2 gap-3">
        <input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} placeholder="Company Name" className="border border-border rounded-lg px-3 py-2.5" />
        <select value={form.industry} onChange={(event) => setForm((prev) => ({ ...prev, industry: event.target.value }))} className="border border-border rounded-lg px-3 py-2.5"><option>Technology</option><option>Finance</option><option>Healthcare</option></select>
        <select value={form.size} onChange={(event) => setForm((prev) => ({ ...prev, size: event.target.value }))} className="border border-border rounded-lg px-3 py-2.5"><option>1-10</option><option>11-50</option><option>51-200</option><option>201+</option></select>
        <input value={form.founded} onChange={(event) => setForm((prev) => ({ ...prev, founded: event.target.value }))} placeholder="Founded Year" className="border border-border rounded-lg px-3 py-2.5" />
        <input value={form.website} onChange={(event) => setForm((prev) => ({ ...prev, website: event.target.value }))} placeholder="Website" className="border border-border rounded-lg px-3 py-2.5" />
        <input value={form.phone} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))} placeholder="Phone" className="border border-border rounded-lg px-3 py-2.5" />
        <input value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} placeholder="Email" className="border border-border rounded-lg px-3 py-2.5" />
        <input value={form.country} onChange={(event) => setForm((prev) => ({ ...prev, country: event.target.value }))} placeholder="Country" className="border border-border rounded-lg px-3 py-2.5" />
        <input value={form.city} onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))} placeholder="City" className="border border-border rounded-lg px-3 py-2.5" />
        <input value={form.address} onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))} placeholder="Address" className="border border-border rounded-lg px-3 py-2.5" />
        <textarea value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} placeholder="Company Description" className="md:col-span-2 border border-border rounded-lg px-3 py-2.5" rows={4} />
      </div>
      <button type="button" onClick={saveProfile} className="btn btn-primary px-4 py-2.5">Save Changes</button>
    </div>
  );
}
