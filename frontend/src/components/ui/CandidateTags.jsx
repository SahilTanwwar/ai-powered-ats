import { useState } from "react";
import { Tag, X, Plus, Loader2 } from "lucide-react";
import { candidates } from "../../services/api";
import toast from "react-hot-toast";

// 20 beautiful pre-defined tag colors that cycle
const TAG_COLORS = [
    "bg-indigo-100 text-indigo-700 border-indigo-200",
    "bg-violet-100 text-violet-700 border-violet-200",
    "bg-rose-100 text-rose-700 border-rose-200",
    "bg-amber-100 text-amber-700 border-amber-200",
    "bg-emerald-100 text-emerald-700 border-emerald-200",
    "bg-cyan-100 text-cyan-700 border-cyan-200",
    "bg-pink-100 text-pink-700 border-pink-200",
    "bg-orange-100 text-orange-700 border-orange-200",
    "bg-teal-100 text-teal-700 border-teal-200",
    "bg-blue-100 text-blue-700 border-blue-200",
];

function getTagColor(tag) {
    // Consistent color per tag label
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
        hash = ((hash << 5) - hash) + tag.charCodeAt(i);
        hash |= 0;
    }
    return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}

export default function CandidateTags({ candidateId, initialTags = [] }) {
    const [tags, setTags] = useState(initialTags);
    const [inputValue, setInputValue] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [loadingTag, setLoadingTag] = useState(null);

    const handleAddTag = async () => {
        const trimmed = inputValue.trim();
        if (!trimmed) return;

        const formatted = trimmed.toUpperCase();
        if (tags.includes(formatted)) {
            toast("Tag already exists", { icon: "⚠️" });
            return;
        }

        setIsAdding(true);
        try {
            const res = await candidates.addTag(candidateId, trimmed);
            setTags(res.data.tags || [...tags, formatted]);
            setInputValue("");
        } catch (error) {
            console.error("Failed to add tag:", error);
            toast.error("Failed to add tag");
        } finally {
            setIsAdding(false);
        }
    };

    const handleRemoveTag = async (tag) => {
        setLoadingTag(tag);
        try {
            const res = await candidates.removeTag(candidateId, tag);
            setTags(res.data.tags || tags.filter((t) => t !== tag));
        } catch (error) {
            console.error("Failed to remove tag:", error);
            toast.error("Failed to remove tag");
        } finally {
            setLoadingTag(null);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddTag();
        }
    };

    return (
        <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-md bg-violet-100 flex items-center justify-center text-violet-600">
                    <Tag size={13} />
                </div>
                <h4 className="text-sm font-bold text-slate-700">Tags</h4>
                <span className="text-[10px] text-slate-400 font-medium ml-auto">
                    {tags.length} tag{tags.length !== 1 && "s"}
                </span>
            </div>

            {/* Existing Tags */}
            <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
                {tags.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No tags yet. Add one below.</p>
                ) : (
                    tags.map((tag) => (
                        <span
                            key={tag}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${getTagColor(tag)} transition-all group`}
                        >
                            {tag}
                            <button
                                onClick={() => handleRemoveTag(tag)}
                                disabled={loadingTag === tag}
                                className="ml-0.5 hover:scale-110 transition-transform"
                            >
                                {loadingTag === tag ? (
                                    <Loader2 size={10} className="animate-spin" />
                                ) : (
                                    <X size={10} className="opacity-60 group-hover:opacity-100" />
                                )}
                            </button>
                        </span>
                    ))
                )}
            </div>

            {/* Input Row */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add tag (e.g. Top Pick)"
                    maxLength={30}
                    className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white transition-all"
                />
                <button
                    onClick={handleAddTag}
                    disabled={!inputValue.trim() || isAdding}
                    className="flex items-center gap-1.5 px-3 py-2 bg-violet-500 hover:bg-violet-600 text-white text-[11px] font-bold rounded-lg disabled:opacity-40 transition-colors shadow-sm shadow-violet-200"
                >
                    {isAdding ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                    Add
                </button>
            </div>
        </div>
    );
}
