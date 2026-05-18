import { Home, PlusSquare, Briefcase, Users, Bookmark, Building2, CreditCard, Settings, MessageSquare } from "lucide-react";
import RoleDashboardLayout from "./RoleDashboardLayout";

const items = [
  { to: "/dashboard/employer", label: "Overview", icon: Home },
  { to: "/dashboard/employer/post-job", label: "Post a Job", icon: PlusSquare },
  { to: "/dashboard/employer/jobs", label: "My Jobs", icon: Briefcase },
  { to: "/dashboard/employer/applicants", label: "Applicants", icon: Users },
  { to: "/dashboard/employer/messages", label: "Messages", icon: MessageSquare },
  { to: "/dashboard/employer/saved-candidates", label: "Saved Candidates", icon: Bookmark },
  { to: "/dashboard/employer/company-profile", label: "Company Profile", icon: Building2 },
  { to: "/dashboard/employer/subscriptions", label: "Subscriptions", icon: CreditCard },
  { to: "/dashboard/employer/settings", label: "Settings", icon: Settings },
];

export default function EmployerDashboardShell() {
  return <RoleDashboardLayout title="Employer Dashboard" items={items} />;
}
