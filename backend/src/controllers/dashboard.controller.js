const { Op, fn, col, literal } = require("sequelize");
const Candidate = require("../models/candidate.model");

// =============================
// 1️⃣ Summary Stats
// =============================
exports.getSummary = async (req, res) => {
  try {
    const total = await Candidate.count();

    const shortlisted = await Candidate.count({
      where: { status: "SHORTLISTED" },
    });

    const rejected = await Candidate.count({
      where: { status: "REJECTED" },
    });

    res.json({
      applications: total,
      shortlisted,
      rejected,
      hired: 0, // Update if HIRED status added
    });
  } catch (error) {
    console.error("Dashboard Summary Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =============================
// 2️⃣ Applications Chart
// =============================
exports.getApplicationsChart = async (req, res) => {
  try {
    const { period } = req.query;

    let groupFormat;

    if (period === "Weekly") {
      groupFormat = "DAY";
    } else if (period === "Yearly") {
      groupFormat = "YEAR";
    } else {
      groupFormat = "MONTH";
    }

    const data = await Candidate.findAll({
      attributes: [
        [fn("DATE_TRUNC", groupFormat, col("createdAt")), "date"],
        [fn("COUNT", col("id")), "value"],
      ],
      group: [literal("date")],
      order: [[literal("date"), "ASC"]],
    });

    const formatted = data.map((item) => ({
      label: item.get("date"),
      value: parseInt(item.get("value")),
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Dashboard Chart Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// =============================
// 3️⃣ Department Breakdown
// =============================
exports.getDepartments = async (req, res) => {
  try {
    const data = await Candidate.findAll({
      attributes: [
        "jobId",
        [fn("COUNT", col("id")), "value"],
      ],
      group: ["jobId"],
    });

    const formatted = data.map((item) => ({
      name: `Job ${item.jobId}`,
      value: parseInt(item.get("value")),
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Dashboard Department Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
