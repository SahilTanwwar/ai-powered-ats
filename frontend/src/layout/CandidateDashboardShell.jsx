import { Home, Briefcase, Heart, Bell, User, FileText, Settings, MessageSquare } from "lucide-react";
import RoleDashboardLayout from "./RoleDashboardLayout";

const items = [
  { to: "/dashboard/candidate", label: "Overview", icon: Home },
  { to: "/dashboard/candidate/applied", label: "Applied Jobs", icon: Briefcase },
  { to: "/dashboard/candidate/favourites", label: "Favourite Jobs", icon: Heart },
  { to: "/dashboard/candidate/alerts", label: "Job Alerts", icon: Bell },
  { to: "/dashboard/candidate/messages", label: "Messages", icon: MessageSquare },
  { to: "/dashboard/candidate/profile", label: "My Profile", icon: User },
  { to: "/dashboard/candidate/resume", label: "My Resume", icon: FileText },
  { to: "/dashboard/candidate/settings", label: "Settings", icon: Settings },
];

export default function CandidateDashboardShell() {
  return <RoleDashboardLayout title="Candidate Dashboard" items={items} />;
}
