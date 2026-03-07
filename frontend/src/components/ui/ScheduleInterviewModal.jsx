import { useState } from "react";
import { X, Calendar, Clock, Video, Phone, MapPin, AlignLeft, Loader2 } from "lucide-react";
import { interviews } from "../../services/api";
import toast from "react-hot-toast";

export default function ScheduleInterviewModal({ isOpen, onClose, candidateId, jobId, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        date: "",
        time: "",
        duration: 60,
        interviewType: "VIDEO",
        meetingLink: "",
        location: "",
        notes: ""
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.date || !formData.time) {
            toast.error("Date and time are required");
            return;
        }

        // Combine date and time
        const interviewDate = new Date(`${formData.date}T${formData.time}`).toISOString();

        setLoading(true);
        try {
            const payload = {
                candidateId,
                jobId,
                interviewDate,
                duration: parseInt(formData.duration),
                interviewType: formData.interviewType,
                meetingLink: formData.meetingLink,
                location: formData.location,
                notes: formData.notes
            };

            const res = await interviews.schedule(payload);
            toast.success("Interview scheduled successfully!");
            if (onSuccess) onSuccess(res.data.data);
            onClose();
        } catch (error) {
            console.error("Failed to schedule:", error);
            toast.error(error.response?.data?.message || "Failed to schedule interview");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="font-head font-bold text-lg text-slate-800">Schedule Interview</h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">Set up a meeting with this candidate</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <form id="schedule-form" onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    <Calendar size={14} className="text-indigo-500" /> Date *
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    <Clock size={14} className="text-amber-500" /> Time *
                                </label>
                                <input
                                    type="time"
                                    name="time"
                                    required
                                    value={formData.time}
                                    onChange={handleChange}
                                    className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    Duration (mins)
                                </label>
                                <select
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:bg-white transition-all shadow-sm cursor-pointer"
                                >
                                    <option value={15}>15 minutes</option>
                                    <option value={30}>30 minutes</option>
                                    <option value={45}>45 minutes</option>
                                    <option value={60}>60 minutes</option>
                                    <option value={90}>90 minutes</option>
                                    <option value={120}>2 hours</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    Interview Type
                                </label>
                                <select
                                    name="interviewType"
                                    value={formData.interviewType}
                                    onChange={handleChange}
                                    className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:bg-white transition-all shadow-sm cursor-pointer"
                                >
                                    <option value="VIDEO">Video Call</option>
                                    <option value="PHONE">Phone Call</option>
                                    <option value="IN_PERSON">In Person</option>
                                    <option value="TECHNICAL">Technical Assessment</option>
                                    <option value="HR">HR Screen</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                            {formData.interviewType === "IN_PERSON" ? (
                                <div>
                                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                        <MapPin size={14} className="text-emerald-500" /> Office Location
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        placeholder="e.g. Floor 3, Conference Room A"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white transition-all shadow-sm"
                                    />
                                </div>
                            ) : formData.interviewType !== "PHONE" ? (
                                <div>
                                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                        <Video size={14} className="text-blue-500" /> Meeting Link
                                    </label>
                                    <input
                                        type="url"
                                        name="meetingLink"
                                        placeholder="https://zoom.us/j/..."
                                        value={formData.meetingLink}
                                        onChange={handleChange}
                                        className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all shadow-sm"
                                    />
                                </div>
                            ) : null}
                        </div>

                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                <AlignLeft size={14} className="text-purple-500" /> Notes for candidate
                            </label>
                            <textarea
                                name="notes"
                                placeholder="Any instructions or topics to prepare for..."
                                value={formData.notes}
                                onChange={handleChange}
                                rows={3}
                                className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all shadow-sm resize-none"
                            />
                        </div>
                    </form>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 sticky bottom-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="schedule-form"
                        disabled={loading}
                        className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50 transition-colors shadow-sm shadow-indigo-200"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Calendar size={16} />}
                        Schedule Interview
                    </button>
                </div>
            </div>
        </div>
    );
}
