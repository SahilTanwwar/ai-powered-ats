import { ChevronDown, CheckCircle, AlertCircle, Calendar, User, FileText } from "lucide-react";

const ACTION_ICONS = {
  "CANDIDATE_CREATED": FileText,
  "CANDIDATE_STATUS_UPDATED": CheckCircle,
  "INTERVIEW_SCHEDULED": Calendar,
  "INTERVIEW_COMPLETED": CheckCircle,
  "INTERVIEW_CANCELLED": AlertCircle,
  "FEEDBACK_PROVIDED": User,
  "RESUME_UPDATED": FileText,
};

const ACTION_LABELS = {
  "CANDIDATE_CREATED": "Candidate Created",
  "CANDIDATE_STATUS_UPDATED": "Status Updated",
  "INTERVIEW_SCHEDULED": "Interview Scheduled",
  "INTERVIEW_COMPLETED": "Interview Completed",
  "INTERVIEW_CANCELLED": "Interview Cancelled",
  "FEEDBACK_PROVIDED": "Feedback Provided",
  "RESUME_UPDATED": "Resume Updated",
};

const ACTION_COLORS = {
  "CANDIDATE_CREATED": "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
  "CANDIDATE_STATUS_UPDATED": "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20",
  "INTERVIEW_SCHEDULED": "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20",
  "INTERVIEW_COMPLETED": "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20",
  "INTERVIEW_CANCELLED": "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20",
  "FEEDBACK_PROVIDED": "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20",
  "RESUME_UPDATED": "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20",
};

function formatDate(date) {
  const now = new Date();
  const actDate = new Date(date);
  const diffMs = now - actDate;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return actDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getActionDescription(log) {
  const { action, details = {} } = log;
  
  switch (action) {
    case "CANDIDATE_CREATED":
      return `Candidate uploaded to ${details.jobTitle || "job"}`;
    case "CANDIDATE_STATUS_UPDATED":
      return `Status changed to ${details.newStatus || "unknown"}`;
    case "INTERVIEW_SCHEDULED":
      return `${details.interviewType || "Interview"} scheduled for ${details.interviewDate ? new Date(details.interviewDate).toLocaleDateString() : "later"}`;
    case "INTERVIEW_COMPLETED":
      return `Interview completed with rating: ${details.rating || "N/A"}/5`;
    case "INTERVIEW_CANCELLED":
      return `Interview cancelled`;
    case "FEEDBACK_PROVIDED":
      return `Feedback: ${details.feedback || "No details"}`;
    case "RESUME_UPDATED":
      return `Resume updated`;
    default:
      return action.replace(/_/g, " ");
  }
}

export default function ActivityTimeline({ activities = [], loading = false }) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 animate-pulse">
            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full" />
            <div className="flex-1">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="py-8 text-center">
        <ChevronDown size={24} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
        <p className="text-slate-500 dark:text-slate-400 text-sm">No activity yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {activities.map((log, index) => {
        const IconComponent = ACTION_ICONS[log.action] || FileText;
        const colorClass = ACTION_COLORS[log.action] || "text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20";
        
        return (
          <div key={log.id || index} className="flex gap-4 py-3 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            {/* Timeline dot and line */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${colorClass} border-2 border-current`}>
                <IconComponent size={16} />
              </div>
              {index < activities.length - 1 && (
                <div className="w-0.5 h-8 bg-slate-200 dark:bg-slate-700 my-1" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {ACTION_LABELS[log.action] || log.action}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {getActionDescription(log)}
                  </p>
                  {log.userEmail && (
                    <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-1">
                      by <span className="font-medium">{log.userEmail}</span>
                    </p>
                  )}
                </div>
                <time className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap ml-2">
                  {formatDate(log.createdAt)}
                </time>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
