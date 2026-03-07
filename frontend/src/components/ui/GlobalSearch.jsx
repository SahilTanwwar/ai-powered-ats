import { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { candidates } from "../../services/api";

export default function GlobalSearch() {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close when route changes
    useEffect(() => {
        setIsOpen(false);
        setQuery("");
    }, [location.pathname]);

    // Debounced Search
    useEffect(() => {
        if (query.trim().length < 2) {
            setResults([]);
            setLoading(false);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await candidates.search(query);
                setResults(res.data.data || []);
            } catch (err) {
                console.error("Search failed:", err);
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 400); // 400ms debounce

        return () => clearTimeout(timer);
    }, [query]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && query.trim().length >= 2) {
            setIsOpen(false);
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <div className="relative hidden md:block z-50" ref={wrapperRef}>
            <div className="relative flex items-center">
                <Search size={15} className="absolute left-3 text-slate-500 z-10" />
                <input
                    type="text"
                    placeholder="Search candidates, skills..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                        if (query.trim().length >= 2) setIsOpen(true);
                    }}
                    className="pl-9 pr-8 py-2 text-sm bg-white/50 border border-slate-200/80 rounded-xl w-64 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/80 transition-all text-slate-900 placeholder-slate-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                />
                {loading && (
                    <Loader2 size={14} className="absolute right-3 text-indigo-500 animate-spin" />
                )}
            </div>

            {/* Floating Dropdown Results */}
            {isOpen && query.trim().length >= 2 && (
                <div className="absolute top-12 left-0 w-[400px] bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Candidates</span>
                        {results.length > 0 && (
                            <span className="text-xs text-slate-400">{results.length} found</span>
                        )}
                    </div>

                    <div className="max-h-[300px] overflow-y-auto">
                        {!loading && results.length === 0 ? (
                            <div className="p-4 text-center text-sm text-slate-500">
                                No candidates found for "{query}"
                            </div>
                        ) : (
                            <ul className="py-1">
                                {results.slice(0, 5).map((candidate) => (
                                    <li key={candidate.id}>
                                        <Link
                                            to={`/candidates/${candidate.id}`}
                                            className="block px-4 py-2.5 hover:bg-slate-50 transition-colors group"
                                        >
                                            <div className="flex items-center justify-between pointer-events-none">
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                                        {candidate.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-0.5">{candidate.email}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-medium text-slate-600 uppercase">
                                                        {candidate.status}
                                                    </span>
                                                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-1 w-24">
                                                        {candidate.jobTitle}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {results.length > 5 && (
                        <div className="border-t border-slate-100 p-2">
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
                                }}
                                className="w-full py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md transition-colors text-center"
                            >
                                View all {results.length} results
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
