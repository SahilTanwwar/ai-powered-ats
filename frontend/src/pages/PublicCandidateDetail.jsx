import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BriefcaseBusiness, Mail, MapPin } from "lucide-react";
import { PUBLIC_CANDIDATES } from "../data/publicData";

export default function PublicCandidateDetail() {
  const { id } = useParams();
  const candidate = PUBLIC_CANDIDATES.find((item) => String(item.id) === String(id));

  if (!candidate) {
    return (
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <Link to="/candidates-public" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Candidates
        </Link>
        <div className="mt-6 rounded-xl border border-border bg-white p-8 text-center">
          <h1 className="text-xl font-head font-semibold text-secondary-900">Candidate not found</h1>
          <p className="mt-2 text-sm text-secondary-600">The profile you are looking for does not exist.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-6">
      <Link to="/candidates-public" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to Candidates
      </Link>

      <div className="rounded-xl border border-border bg-white p-6 sm:p-8">
        <h1 className="text-2xl font-head font-semibold text-secondary-900">{candidate.name}</h1>
        <p className="mt-1 text-sm text-secondary-600">{candidate.title}</p>

        <div className="mt-5 grid sm:grid-cols-2 gap-4 text-sm text-secondary-700">
          <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{candidate.location}</div>
          <div className="flex items-center gap-2"><BriefcaseBusiness className="h-4 w-4 text-primary" />{candidate.experience}</div>
          <a href={`mailto:${candidate.email}`} className="flex items-center gap-2 text-primary hover:underline">
            <Mail className="h-4 w-4" /> {candidate.email}
          </a>
        </div>

        <p className="mt-6 text-sm leading-7 text-secondary-700">{candidate.bio}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {candidate.skills.map((skill) => (
            <span key={skill} className="rounded-full border border-primary/25 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
