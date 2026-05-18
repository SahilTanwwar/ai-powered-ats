import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Briefcase, Building2, Globe, MapPin, Users } from "lucide-react";
import { PUBLIC_COMPANIES } from "../data/publicData";
import { jobs } from "../services/api";

const normalizeCompanyName = (value) => (value || "").trim().toLowerCase();

export default function CompanyDetail() {
  const { id } = useParams();
  const company = PUBLIC_COMPANIES.find((item) => String(item.id) === String(id));
  const [publicJobs, setPublicJobs] = useState([]);

  useEffect(() => {
    jobs.getPublic()
      .then((response) => setPublicJobs(response.data || []))
      .catch(() => setPublicJobs([]));
  }, []);

  const companyJobs = useMemo(() => {
    if (!company) return [];
    const companyName = normalizeCompanyName(company.name);
    return publicJobs.filter((job) =>
      normalizeCompanyName(job.Employer?.companyName || job.companyName || job.company) === companyName
    );
  }, [company, publicJobs]);

  if (!company) {
    return (
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <Link to="/companies" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Companies
        </Link>
        <div className="mt-6 rounded-xl border border-border bg-white p-8 text-center">
          <h1 className="text-xl font-head font-semibold text-secondary-900">Company not found</h1>
          <p className="mt-2 text-sm text-secondary-600">The company you are looking for does not exist.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-6">
      <Link to="/companies" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to Companies
      </Link>

      <div className="rounded-xl border border-border bg-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="flex items-center gap-4">
            <img src={company.logoUrl} alt={company.name} className="h-16 w-16 rounded-xl border border-border bg-white object-contain p-2" />
            <div>
              <h1 className="text-2xl font-head font-semibold text-secondary-900">{company.name}</h1>
              <p className="text-sm text-secondary-600">{company.industry}</p>
            </div>
          </div>
          {companyJobs.length > 0 ? (
            <Link to={`/find-jobs?company=${encodeURIComponent(company.name)}`} className="btn btn-primary">
              <Briefcase className="h-4 w-4" />
              {companyJobs.length} open {companyJobs.length === 1 ? "position" : "positions"}
            </Link>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-secondary-600">
              <Briefcase className="h-4 w-4" />
              No open positions
            </span>
          )}
        </div>

        <p className="mt-6 text-sm leading-6 text-secondary-700">{company.description}</p>

        <div className="mt-6 grid sm:grid-cols-2 gap-4 text-sm text-secondary-700">
          <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{company.location}</div>
          <div className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" />{company.size}</div>
          <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" />Founded {company.founded}</div>
          <a
            href={company.website}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-primary hover:underline"
          >
            <Globe className="h-4 w-4" /> Visit Website
          </a>
        </div>
      </div>
    </section>
  );
}
