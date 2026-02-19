const Job = require("../models/job");

const createJob = async (req, res) => {
  try {
    const { title, description, requiredSkills, experienceRequired } = req.body;

    const job = await Job.create({
      title,
      description,
      requiredSkills,
      experienceRequired,
      userId: req.user.id,
    });

    return res.status(201).json(job);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const listJobs = async (req, res) => {
  try {
    let jobs;

    if (req.user.role === "ADMIN") {
      jobs = await Job.findAll({
        order: [["createdAt", "DESC"]],
      });
    } else if (req.user.role === "RECRUITER") {
      jobs = await Job.findAll({
        where: { userId: req.user.id },
        order: [["createdAt", "DESC"]],
      });
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.status(200).json(jobs);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (req.user.role === "ADMIN") {
      return res.status(200).json(job);
    }

    if (req.user.role === "RECRUITER" && Number(job.userId) === Number(req.user.id)) {
      return res.status(200).json(job);
    }

    return res.status(403).json({ message: "Forbidden" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createJob,
  listJobs,
  getJobById,
};
