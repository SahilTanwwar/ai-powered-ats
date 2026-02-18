import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Legend
} from "recharts";

import { useState } from "react";

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
  const [period, setPeriod] = useState("Monthly");

  // 📊 Chart Data
  const dataSets = {
    Weekly: [
      { label: "Mon", value: 40 },
      { label: "Tue", value: 65 },
      { label: "Wed", value: 55 },
      { label: "Thu", value: 80 },
      { label: "Fri", value: 70 },
    ],
    Monthly: [
      { label: "Jan", value: 120 },
      { label: "Feb", value: 210 },
      { label: "Mar", value: 180 },
      { label: "Apr", value: 250 },
      { label: "May", value: 300 },
      { label: "Jun", value: 280 },
    ],
    Yearly: [
      { label: "2021", value: 1200 },
      { label: "2022", value: 1800 },
      { label: "2023", value: 2400 },
      { label: "2024", value: 3200 },
    ],
  };

  const applicationData = dataSets[period];

  // 📈 Dynamic Stats Data
  const statsData = {
    Weekly: {
      applications: "310",
      shortlisted: "120",
      hired: "32",
      rejected: "158",
    },
    Monthly: {
      applications: "1,534",
      shortlisted: "869",
      hired: "236",
      rejected: "429",
    },
    Yearly: {
      applications: "8,600",
      shortlisted: "4,300",
      hired: "1,200",
      rejected: "3,100",
    },
  };

  const currentStats = statsData[period];

  // 🥧 Pie Chart Data
  const departmentData = [
    { name: "Engineering", value: 400, fill: "#caff5a" },
    { name: "Marketing", value: 250, fill: "#1f2937" },
    { name: "Sales", value: 200, fill: "#9ca3af" },
    { name: "HR", value: 150, fill: "#d1d5db" },
  ];

  const totalDepartments = departmentData.reduce(
    (acc, item) => acc + item.value,
    0
  );

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-900 mb-6">
        Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard title="Applications" value={currentStats.applications} accent />
        <StatCard title="Shortlisted" value={currentStats.shortlisted} />
        <StatCard title="Hired" value={currentStats.hired} />
        <StatCard title="Rejected" value={currentStats.rejected} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-3 gap-6 mt-8">
        
        {/* Applications Chart */}
        <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Applications</h3>

            <div className="flex bg-gray-100 rounded-xl p-1">
              {["Weekly", "Monthly", "Yearly"].map((item) => (
                <button
                  key={item}
                  onClick={() => setPeriod(item)}
                  className={`px-4 py-1.5 text-sm rounded-lg transition-all duration-200 ${
                    period === item
                      ? "bg-white shadow text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={applicationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="#caff5a"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Pie Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">
            Application by Department
          </h3>

          <div className="relative h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  innerRadius={50}
                  paddingAngle={4}
                />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Total */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-gray-900">
                {totalDepartments}
              </span>
              <span className="text-xs text-gray-500">
                Total
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
