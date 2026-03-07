import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Search, MapPin, Briefcase, Mail, Phone, ChevronRight } from "lucide-react";
import Layout from "../components/layout/Layout";
import { candidates as candidatesApi } from "../services/api";

export default function SearchResults() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const navigate = useNavigate();

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!query) {
            setLoading(false);
            return;
        }

        setLoading(true);
        candidatesApi.search(query)
            .then((res) => {
                setResults(res.data.data || []);
            })
            .catch((err) => {
                console.error("Search fetch error:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [query]);

    return (
        <Layout title={`Search: "${query}"`}>
            <div className="mb-6">
                <h2 className="font-head font-bold text-2xl text-slate-900 tracking-tight mb-1">
                    Search Results
                </h2>
                <p className="text-slate-500 text-sm">
                    Found {results.length} candidate{results.length !== 1 && "s"} for "{query}"
                </p>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="card p-5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full skeleton" />
                            <div className="flex-1 space-y-2">
                                <div className="h-5 w-48 skeleton rounded" />
                                <div className="h-3 w-32 skeleton rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : results.length === 0 ? (
                <div className="card py-16 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <Search size={28} className="text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">No candidates found</h3>
                    <p className="text-slate-500 text-sm max-w-sm">
                        We couldn't find any candidates matching "{query}". Try searching by a different name, email, or skill.
                    </p>
                    <button
                        onClick={() => navigate("/")}
                        className="mt-6 px-4 py-2 bg-indigo-50 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                        Back to Dashboard
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {results.map((candidate) => (
                        <Link
                            key={candidate.id}
                            to={`/candidates/${candidate.id}`}
                            className="card p-5 flex flex-col sm:flex-row sm:items-center gap-5 hover:border-indigo-200 transition-all group cursor-pointer"
                        >
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                                {candidate.name.charAt(0).toUpperCase()}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-semibold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">
                                        {candidate.name}
                                    </h3>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                    ${candidate.status === 'HIRED' ? 'bg-emerald-100 text-emerald-700' :
                                            candidate.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                candidate.status === 'SHORTLISTED' ? 'bg-violet-100 text-violet-700' :
                                                    'bg-blue-100 text-blue-700'}`}
                                    >
                                        {candidate.status}
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-slate-500">
                                    <div className="flex items-center gap-1.5">
                                        <Briefcase size={14} className="text-slate-400" />
                                        <span className="font-medium text-slate-700">{candidate.jobTitle}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Mail size={14} className="text-slate-400" />
                                        <span>{candidate.email}</span>
                                    </div>
                                    {candidate.atsScore !== null && (
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                            <span>ATS Score: <span className="font-semibold text-slate-700">{candidate.atsScore}%</span></span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center text-slate-400 group-hover:text-indigo-500 transition-colors shrink-0">
                                <span className="text-sm font-medium mr-1 opacity-0 group-hover:opacity-100 transition-opacity">View Profile</span>
                                <ChevronRight size={18} />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </Layout>
    );
}
