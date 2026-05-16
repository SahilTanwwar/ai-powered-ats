import { Briefcase, Bell, Heart } from "lucide-react";

export default function CandidateOverview() {
  const stats = [
    { label: "Applied Jobs", value: 14, icon: Briefcase, tone: "text-primary" },
    { label: "Favourite Jobs", value: 8, icon: Heart, tone: "text-yellow" },
    { label: "Jobs Alerted", value: 5, icon: Bell, tone: "text-success" },
  ];

  const recent = [
    { title: "Frontend Engineer", company: "Figma", date: "Mar 24", status: "Pending" },
    { title: "Product Designer", company: "Notion", date: "Mar 22", status: "Viewed" },
    { title: "Backend Developer", company: "Stripe", date: "Mar 20", status: "Rejected" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-head font-semibold text-dark">Candidate Overview</h1>

      <div className="grid md:grid-cols-3 gap-4">
        {stats.map((item) => (
          <div key={item.label} className="border border-border rounded-xl p-4 bg-white">
            <div className="flex items-center justify-between">
              <p className="text-sm text-secondary">{item.label}</p>
              <item.icon className={item.tone} size={18} />
            </div>
            <p className="text-2xl font-head font-semibold text-dark mt-2">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-head font-semibold text-dark">Profile Completed</h2>
          <span className="text-sm text-secondary">80%</span>
        </div>
        <div className="h-2 rounded-full bg-primary-light overflow-hidden">
          <div className="h-full bg-primary" style={{ width: "80%" }} />
        </div>
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="font-head font-semibold text-dark">Recently Applied Jobs</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th>Job</th>
              <th>Company</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((row) => (
              <tr key={`${row.title}-${row.company}`}>
                <td>{row.title}</td>
                <td>{row.company}</td>
                <td>{row.date}</td>
                <td>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
