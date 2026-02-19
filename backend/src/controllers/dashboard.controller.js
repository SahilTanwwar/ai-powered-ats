const Job = require("../models/job");
const Candidate = require("../models/candidate.model");
const { Op } = require("sequelize");

const DAY_MS = 24 * 60 * 60 * 1000;

function toYmd(date) {
  return date.toISOString().slice(0, 10);
}

function formatDay(date) {
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

const getDashboardStats = async (req, res) => {
  try {
    const jobFilter = {};

    if (req.user.role === "RECRUITER") {
      jobFilter.userId = req.user.id;
    }

    const jobs = await Job.findAll({ where: jobFilter });
    const jobIds = jobs.map((job) => job.id);

    const candidateFilter = {};

    if (req.user.role === "RECRUITER") {
      candidateFilter.jobId = { [Op.in]: jobIds };
    }

    const totalJobs = jobs.length;

    const [totalCandidates, hiredCount, shortlistedCount, rejectedCount] = await Promise.all([
      Candidate.count({ where: candidateFilter }),
      Candidate.count({ where: { ...candidateFilter, status: "HIRED" } }),
      Candidate.count({ where: { ...candidateFilter, status: "SHORTLISTED" } }),
      Candidate.count({ where: { ...candidateFilter, status: "REJECTED" } }),
    ]);

    const since = new Date(Date.now() - 6 * DAY_MS);

    const weeklyRows = await Candidate.findAll({
      where: { ...candidateFilter, createdAt: { [Op.gte]: since } },
      attributes: ["createdAt", "status"],
      raw: true,
    });

    const baseDays = Array.from({ length: 7 }).map((_, i) => {
      const dt = new Date(since.getTime() + i * DAY_MS);
      return {
        key: toYmd(dt),
        day: formatDay(dt),
        Applied: 0,
        Shortlisted: 0,
      };
    });

    const byDay = Object.fromEntries(baseDays.map((d) => [d.key, d]));

    for (const row of weeklyRows) {
      const key = toYmd(new Date(row.createdAt));
      if (!byDay[key]) continue;
      byDay[key].Applied += 1;
      if (row.status === "SHORTLISTED" || row.status === "HIRED") {
        byDay[key].Shortlisted += 1;
      }
    }

    return res.json({
      totalJobs,
      totalCandidates,
      hiredCount,
      shortlistedCount,
      rejectedCount,
      weeklyApplications: baseDays.map((d) => byDay[d.key]),
    });
  } catch (err) {
    return res.status(500).json({ message: "Dashboard error" });
  }
};

module.exports = { getDashboardStats };
