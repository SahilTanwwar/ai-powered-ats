export default function EmployerOverview() {
  const stats = [
    { label: "Open Jobs", value: 12 },
    { label: "Total Applicants", value: 148 },
    { label: "Saved Candidates", value: 21 },
    { label: "Total Views", value: 932 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-head font-semibold text-dark">Employer Overview</h1>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((card) => (
          <div key={card.label} className="border border-border rounded-xl p-4">
            <p className="text-sm text-secondary">{card.label}</p>
            <p className="text-2xl font-head font-semibold text-dark mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="border border-border rounded-xl p-4">
          <h2 className="font-head font-semibold text-dark mb-3">Recently Posted Jobs</h2>
          <ul className="space-y-2 text-sm text-secondary">
            <li>Senior Frontend Developer — 34 applications</li>
            <li>Product Designer — 19 applications</li>
            <li>QA Engineer — 12 applications</li>
          </ul>
        </div>
        <div className="border border-border rounded-xl p-4">
          <h2 className="font-head font-semibold text-dark mb-3">Recent Applicants</h2>
          <ul className="space-y-2 text-sm text-secondary">
            <li>Aarav Sharma — Frontend Developer</li>
            <li>Priya Singh — Product Designer</li>
            <li>Karan Mehta — Backend Engineer</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
