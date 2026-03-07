import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar, Clock, Video, Phone, MapPin, User, CheckCircle, XCircle } from "lucide-react";
import { interviews } from "../../services/api";
import ScheduleInterviewModal from "./ScheduleInterviewModal";

export default function ScheduledInterviews({ candidateId, jobId }) {
    const [interviewList, setInterviewList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchInterviews();
    }, [candidateId]);

    const fetchInterviews = async () => {
        try {
            setLoading(true);
            const res = await interviews.getByCandidate(candidateId);
            setInterviewList(res.data.data || []);
        } catch (error) {
            console.error("Failed to fetch interviews:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInterviewAdded = (newInterview) => {
        setInterviewList([newInterview, ...interviewList].sort((a, b) => new Date(b.interviewDate) - new Date(a.interviewDate)));
    };

    const getIcon = (type) => {
        switch (type) {
            case "VIDEO": return <Video size={14} className="text-blue-500" />;
            case "PHONE": return <Phone size={14} className="text-amber-500" />;
            case "IN_PERSON": return <MapPin size={14} className="text-emerald-500" />;
            default: return <User size={14} className="text-indigo-500" />;
        }
    };

    return (
        <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <Calendar size={16} />
                    </div>
                    <div>
                        <h3 className="font-head font-semibold text-slate-900">Interviews</h3>
                        <p className="text-xs text-slate-500">Scheduled rounds</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
                >
                    <Calendar size={14} /> Schedule New
                </button>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[1, 2].map((i) => (
                        <div key={i} className="h-20 bg-slate-50 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : interviewList.length === 0 ? (
                <div className="py-8 text-center bg-slate-50 border border-slate-100 border-dashed rounded-xl">
                    <p className="text-sm text-slate-500 font-medium">No interviews scheduled yet</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {interviewList.map((interview) => {
                        const dateObj = new Date(interview.interviewDate);
                        const isPast = dateObj < new Date();

                        return (
                            <div
                                key={interview.id}
                                className={`p-4 border rounded-xl flex flex-col sm:flex-row gap-4 justify-between transition-colors
                  ${isPast && interview.status === 'SCHEDULED' ? 'bg-rose-50/50 border-rose-100' :
                                        interview.status === 'COMPLETED' ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200 hover:border-indigo-200'}`}
                            >
                                <div className="flex gap-4">
                                    <div className="hidden sm:flex flex-col items-center justify-center bg-slate-50 rounded-lg px-3 py-2 min-w-[70px]">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                            {format(dateObj, 'MMM')}
                                        </span>
                                        <span className="text-xl font-black text-slate-700 leading-none my-0.5">
                                            {format(dateObj, 'dd')}
                                        </span>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider
                        ${interview.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                                                    interview.status === 'CANCELLED' ? 'bg-slate-200 text-slate-600' :
                                                        'bg-indigo-100 text-indigo-700'}`}
                                            >
                                                {interview.status}
                                            </span>
                                            {isPast && interview.status === 'SCHEDULED' && (
                                                <span className="text-[10px] font-bold text-rose-500 flex items-center gap-1">
                                                    <XCircle size={10} /> Overdue
                                                </span>
                                            )}
                                        </div>

                                        <h4 className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
                                            {getIcon(interview.interviewType)}
                                            {interview.interviewType.replace('_', ' ')} Interview
                                        </h4>

                                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5">
                                            <span className="flex items-center gap-1"><Clock size={12} /> {format(dateObj, 'h:mm a')} ({interview.duration}m)</span>
                                            {interview.scheduler && (
                                                <span className="flex items-center gap-1"><User size={12} /> {interview.scheduler.email.split('@')[0]}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex sm:flex-col justify-end gap-2 shrink-0">
                                    {interview.meetingLink && (
                                        <a
                                            href={interview.meetingLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 text-[11px] font-semibold rounded-lg transition-colors text-center"
                                        >
                                            Join Meeting
                                        </a>
                                    )}
                                    {interview.status === 'SCHEDULED' && dateObj < new Date() && (
                                        <button className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-[11px] font-semibold rounded-lg transition-colors flex items-center justify-center gap-1">
                                            <CheckCircle size={12} /> Mark Done
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <ScheduleInterviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                candidateId={candidateId}
                jobId={jobId}
                onSuccess={handleInterviewAdded}
            />
        </div>
    );
}
