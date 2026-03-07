import { useState, useEffect } from "react";
import { Send, MessageSquare, Trash2, Loader2, User } from "lucide-react";
import { candidates } from "../../services/api";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function TeamNotes({ candidateId }) {
    const { user } = useAuth();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newNote, setNewNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchNotes();
    }, [candidateId]);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const res = await candidates.getNotes(candidateId);
            setNotes(res.data.data || []);
        } catch (error) {
            console.error("Failed to load notes:", error);
            toast.error("Failed to load team notes");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newNote.trim()) return;

        setIsSubmitting(true);
        try {
            const res = await candidates.addNote(candidateId, newNote.trim());
            setNotes([res.data.data, ...notes]);
            setNewNote("");
        } catch (error) {
            console.error("Failed to add note:", error);
            toast.error("Failed to post note");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (noteId) => {
        if (!window.confirm("Delete this note?")) return;
        try {
            await candidates.deleteNote(candidateId, noteId);
            setNotes(notes.filter((n) => n.id !== noteId));
            toast.success("Note deleted");
        } catch (error) {
            console.error("Failed to delete note:", error);
            toast.error("Failed to delete note");
        }
    };

    return (
        <div className="card flex flex-col h-[500px]">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2 bg-gradient-to-r from-indigo-50/50 to-white">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <MessageSquare size={16} />
                </div>
                <div>
                    <h3 className="font-head font-semibold text-slate-900 text-sm">Team Notes</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Internal collaboration</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-slate-50/30">
                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="animate-spin text-slate-300" size={24} />
                    </div>
                ) : notes.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center px-4">
                        <MessageSquare size={32} className="mb-3 text-slate-300" />
                        <p className="text-sm font-medium text-slate-600 mb-1">No notes yet</p>
                        <p className="text-xs">Leave a note about the interview or candidate fit.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notes.map((note) => {
                            const isMine = note.author?.id === user?.id;
                            const isAdmin = user?.role === "ADMIN";
                            const canDelete = isMine || isAdmin;

                            return (
                                <div key={note.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 group">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                                                <User size={12} />
                                            </div>
                                            <span className="font-semibold text-xs text-slate-700">
                                                {note.author?.email?.split("@")[0] || "Unknown"}
                                            </span>
                                            <span className="text-[10px] text-slate-400">
                                                {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                        {canDelete && (
                                            <button
                                                onClick={() => handleDelete(note.id)}
                                                className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Delete note"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-600 whitespace-pre-wrap pl-8">{note.content}</p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-white">
                <form onSubmit={handleSubmit} className="relative">
                    <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Add a team note..."
                        className="w-full h-20 text-sm border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:outline-none focus:ring-2 focus:border-transparent focus:ring-indigo-400 focus:bg-white resize-none pr-12 transition-all"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!newNote.trim() || isSubmitting}
                        className="absolute bottom-3 right-3 w-8 h-8 flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:hover:bg-indigo-500 transition-colors"
                    >
                        {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                    </button>
                </form>
                <p className="text-[10px] text-slate-400 mt-2 text-right">Press Enter to send (Shift+Enter for newline)</p>
            </div>
        </div>
    );
}
