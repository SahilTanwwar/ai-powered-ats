import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { 
  Building2, MapPin, Briefcase, DollarSign,
  Clock, Calendar, Share2, BookmarkPlus, ArrowRight 
} from "lucide-react";
import TagBadge from "../components/ui/TagBadge";
import { candidates, jobs } from "../services/api";

export default function PublicJobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [applySuccess, setApplySuccess] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [isSaved, setIsSaved] = useState(false);
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    resume: null,
  });

  useEffect(() => {
    const loadJob = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await jobs.getPublicById(id);
        setJob(response.data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadJob();
    }
  }, [id]);

  const details = useMemo(() => {
    if (!job) return null;
    return {
      title: job.title,
      company: "Company",
      location: "Not specified",
      type: "Full-Time",
      salary: job.experienceRequired ? `Experience: ${job.experienceRequired}` : "Experience not specified",
      postedAt: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Recently",
      experience: job.experienceRequired || "Not specified",
      description: job.description,
      requirements: job.requiredSkills || [],
    };
  }, [job]);

  const handleApplySubmit = async (event) => {
    event.preventDefault();
    setApplyError("");
    setApplySuccess("");

    if (!formData.resume) {
      setApplyError("Please upload your resume.");
      return;
    }

    try {
      setIsApplying(true);
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      payload.append("phone", formData.phone);
      payload.append("jobId", String(id));
      payload.append("resume", formData.resume);

      await candidates.applyPublic(payload);
      setApplySuccess("Application submitted successfully.");
      setFormData({ name: "", email: "", phone: "", resume: null });
    } catch (err) {
      setApplyError(err?.response?.data?.message || "Application failed. Please try again.");
    } finally {
      setIsApplying(false);
    }
  };

  const handleApplyNow = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setApplySuccess("Job link copied to clipboard.");
    } catch {
      setApplyError("Unable to copy link. Please copy the URL manually.");
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-16 text-secondary">Loading job details...</div>;
  }

  if (error || !details) {
    return <div className="max-w-7xl mx-auto px-4 py-16 text-warning">{error || "Job not found."}</div>;
  }

  return (
    <div className="bg-bg min-h-screen">
      {/* Header Banner */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-2xl bg-white border border-border p-4 flex items-center justify-center shrink-0 shadow-sm">
                <div className="w-full h-full rounded-md bg-primary/10 text-primary font-semibold flex items-center justify-center">
                  {details.title?.charAt(0) || "J"}
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-head font-bold text-dark mb-2">{details.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-secondary text-sm">
                  <span className="flex items-center gap-1.5"><Building2 size={16} /> {details.company}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={16} /> {details.location}</span>
                  <span className="flex items-center gap-1.5"><Clock size={16} /> {details.postedAt}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSaved((prev) => !prev)}
                className={`p-3 border border-border rounded-xl transition-colors shrink-0 ${isSaved ? "text-primary bg-primary-light" : "text-secondary hover:bg-surface"}`}
              >
                <BookmarkPlus size={20} />
              </button>
              <button type="button" onClick={handleShare} className="p-3 border border-border rounded-xl text-secondary hover:bg-surface transition-colors shrink-0">
                <Share2 size={20} />
              </button>
              <button type="button" onClick={handleApplyNow} className="btn btn-primary px-8 py-3 w-full lg:w-auto">
                Apply Now <ArrowRight size={18} className="ml-2 inline-block" />
              </button>
            </div>
            
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          
          <main className="flex-1 space-y-10">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <button type="button" onClick={() => setActiveTab("overview")} className={`px-3 py-1.5 rounded-md text-sm font-medium ${activeTab === "overview" ? "bg-primary-light text-primary" : "text-secondary hover:bg-surface"}`}>Overview</button>
              <button type="button" onClick={() => setActiveTab("details")} className={`px-3 py-1.5 rounded-md text-sm font-medium ${activeTab === "details" ? "bg-primary-light text-primary" : "text-secondary hover:bg-surface"}`}>Job Details</button>
              <button type="button" onClick={() => setActiveTab("company")} className={`px-3 py-1.5 rounded-md text-sm font-medium ${activeTab === "company" ? "bg-primary-light text-primary" : "text-secondary hover:bg-surface"}`}>Company</button>
            </div>

            {activeTab === "overview" && (
              <>
            <section>
              <h2 className="text-xl font-head font-bold text-dark mb-4">Job Description</h2>
              <div className="prose prose-slate max-w-none text-secondary">
                <p>{details.description}</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-head font-bold text-dark mb-4">Responsibilities</h2>
              <ul className="space-y-3">
                {(details.requirements.length ? details.requirements : ["Review full description for role responsibilities."]).map((req, i) => (
                  <li key={i} className="flex gap-3 text-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-head font-bold text-dark mb-4">Requirements</h2>
              <ul className="space-y-3">
                {(details.requirements.length ? details.requirements : ["No explicit required skills provided."]).map((req, i) => (
                  <li key={i} className="flex gap-3 text-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </section>

              </>
            )}

            {activeTab === "details" && (
              <section>
                <h2 className="text-xl font-head font-bold text-dark mb-4">Job Details</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="border border-border rounded-xl p-4">
                    <p className="text-sm text-secondary">Posted</p>
                    <p className="font-semibold text-dark">{details.postedAt}</p>
                  </div>
                  <div className="border border-border rounded-xl p-4">
                    <p className="text-sm text-secondary">Experience</p>
                    <p className="font-semibold text-dark">{details.experience}</p>
                  </div>
                  <div className="border border-border rounded-xl p-4">
                    <p className="text-sm text-secondary">Job Type</p>
                    <p className="font-semibold text-dark">{details.type}</p>
                  </div>
                  <div className="border border-border rounded-xl p-4">
                    <p className="text-sm text-secondary">Salary</p>
                    <p className="font-semibold text-dark">{details.salary}</p>
                  </div>
                </div>
              </section>
            )}

            {activeTab === "company" && (
              <section>
                <h2 className="text-xl font-head font-bold text-dark mb-4">Company</h2>
                <div className="border border-border rounded-xl p-5">
                  <p className="text-secondary">Company details for this public role will appear here as soon as employer profile data is connected.</p>
                </div>
              </section>
            )}
          </main>

          <aside className="w-full lg:w-80 shrink-0">
            <div className="bg-white border border-border rounded-2xl p-6 sticky top-6">
              <h3 className="font-head font-bold text-lg text-dark mb-6">Job Summary</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <div className="text-sm text-secondary mb-1">Job Type</div>
                    <div className="font-semibold text-dark">{details.type}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 shrink-0">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <div className="text-sm text-secondary mb-1">Salary</div>
                    <div className="font-semibold text-dark">{details.salary}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-600 shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div className="text-sm text-secondary mb-1">Location</div>
                    <div className="font-semibold text-dark">{details.location}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-600 shrink-0">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <div className="text-sm text-secondary mb-1">Experience</div>
                    <div className="font-semibold text-dark">{details.experience}</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <h4 className="font-semibold text-dark mb-4">Job Tags</h4>
                <div className="flex flex-wrap gap-2">
                  <TagBadge type="Full-Time" />
                </div>
              </div>

              <form ref={formRef} className="mt-8 pt-6 border-t border-border space-y-3" onSubmit={handleApplySubmit}>
                <h4 className="font-semibold text-dark">Apply for this role</h4>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm"
                  required
                />
                <input
                  type="text"
                  placeholder="Phone (optional)"
                  value={formData.phone}
                  onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm"
                />
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(event) => setFormData((prev) => ({ ...prev, resume: event.target.files?.[0] || null }))}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm"
                  required
                />

                {applyError && <p className="text-warning text-sm">{applyError}</p>}
                {applySuccess && <p className="text-success text-sm">{applySuccess}</p>}

                <button type="submit" disabled={isApplying} className="btn btn-primary w-full py-2.5">
                  {isApplying ? "Submitting..." : "Submit Application"}
                </button>
              </form>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
