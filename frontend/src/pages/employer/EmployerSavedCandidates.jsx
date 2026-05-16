import CandidateCard from "../../components/ui/CandidateCard";
import { useNavigate } from "react-router-dom";

const CANDIDATES = [
  { id: 1, name: "Aarav Sharma", title: "Frontend Developer", skills: ["React", "TypeScript", "Tailwind"], location: "Bengaluru" },
  { id: 2, name: "Priya Singh", title: "Product Designer", skills: ["Figma", "UX", "Design Systems"], location: "Delhi" },
];

export default function EmployerSavedCandidates() {
  const navigate = useNavigate();

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {CANDIDATES.map((candidate) => (
        <CandidateCard
          key={candidate.id}
          name={candidate.name}
          title={candidate.title}
          skills={candidate.skills}
          location={candidate.location}
          onViewProfile={() => navigate("/candidates-public")}
        />
      ))}
    </div>
  );
}
