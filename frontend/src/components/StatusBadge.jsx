const statusStyles = {
  APPLIED: "bg-gray-100 text-gray-700",
  SHORTLISTED: "bg-blue-100 text-blue-700",
  HIRED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

const StatusBadge = ({ status }) => {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        statusStyles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
