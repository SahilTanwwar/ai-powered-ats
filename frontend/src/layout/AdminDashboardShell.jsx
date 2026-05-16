import { Home, Users, Briefcase, UserRound, Settings, MessageSquare } from "lucide-react";
import RoleDashboardLayout from "./RoleDashboardLayout";

const items = [
  { to: "/dashboard/admin", label: "Overview", icon: Home },
  { to: "/dashboard/admin/recruiters", label: "Recruiters", icon: Users },
  { to: "/dashboard/admin/jobs", label: "Jobs", icon: Briefcase },
  { to: "/dashboard/admin/candidates", label: "Candidates", icon: UserRound },
  { to: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { to: "/dashboard/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminDashboardShell() {
  return <RoleDashboardLayout title="Admin Dashboard" items={items} />;
}
