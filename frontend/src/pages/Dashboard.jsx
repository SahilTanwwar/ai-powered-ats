import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

import {
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";


const StatCard = ({ title, value, accent }) => (
  <div
    className={`rounded-2xl p-6 shadow-sm border ${
      accent ? "bg-[#caff5a] border-transparent" : "bg-white border-gray-200"
    }`}
  >
    <p className="text-sm text-gray-600">{title}</p>
    <h3 className="mt-2 text-3xl font-bold text-gray-900">{value}</h3>
  </div>
);

const Dashboard = () => {

  // 📊 Applications Chart Data
  const applicationData = [
    { month: "Jan", applications: 120 },
    { month: "Feb", applications: 210 },
    { month: "Mar", applications: 180 },
    { month: "Apr", applications: 250 },
    { month: "May", applications: 300 },
    { month: "Jun", applications: 280 },
  ];

  const departmentData = [
  { name: "Engineering", value: 400 },
  { name: "Marketing", value: 250 },
  { name: "Sales", value: 200 },
  { name: "HR", value: 150 },
];

const COLORS = ["#caff5a", "#1f2937", "#9ca3af", "#d1d5db"];


  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-6">
        Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard title="Applications" value="1,534" accent />
        <StatCard title="Shortlisted" value="869" />
        <StatCard title="Hired" value="236" />
        <StatCard title="Rejected" value="429" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-3 gap-6 mt-8">
        
        {/* Applications Chart */}
        <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">
            Applications
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={applicationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="applications"
                  fill="#caff5a"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Chart (Still Placeholder) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">
            Application by Department
          </h3>
         <div className="h-64">
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie
        data={departmentData}
        dataKey="value"
        nameKey="name"
        outerRadius={90}
        innerRadius={50}
        paddingAngle={4}
      >
        {departmentData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
</div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
