import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import CandidateCard from "../components/ui/CandidateCard";
import { PUBLIC_CANDIDATES } from "../data/publicData";

export default function PublicCandidates() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PUBLIC_CANDIDATES;
    return PUBLIC_CANDIDATES.filter((candidate) =>
      `${candidate.name} ${candidate.title} ${candidate.skills.join(" ")}`.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="bg-bg min-h-screen pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-head font-bold text-dark mb-2">Browse Candidates</h1>
          <p className="text-secondary">Find skilled candidates and review their profiles.</p>
        </div>

        <div className="bg-white border border-border p-4 rounded-xl flex items-center gap-3 mb-8">
          <Search className="text-secondary" size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full outline-none text-dark"
            placeholder="Search by name, title, or skill"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              name={candidate.name}
              title={candidate.title}
              skills={candidate.skills}
              location={candidate.location}
              onViewProfile={() => navigate(`/candidates-public/${candidate.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
