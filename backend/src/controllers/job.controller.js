const Job = require("../models/job");
const Candidate = require("../models/candidate.model");
const fs = require("fs/promises");
const path = require("path");

async function safeDeleteResume(filePath) {
  if (!filePath) return;
  const absolute = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(__dirname, "../../", filePath);
  try {
    await fs.unlink(absolute);
  } catch {
    // Ignore missing file or filesystem errors so DB cleanup can continue.
  }
}

const createJob = async (req, res) => {
  try {
    const { title, description, requiredSkills, experienceRequired } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ message: "Job title is required" });
    }
    if (!description || typeof description !== "string" || !description.trim()) {
      return res.status(400).json({ message: "Job description is required" });
    }

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

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (
      req.user.role !== "ADMIN" &&
      !(req.user.role === "RECRUITER" && Number(job.userId) === Number(req.user.id))
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const candidates = await Candidate.findAll({
      where: { jobId: job.id },
      attributes: ["id", "resumePath"],
    });

    await Promise.all(candidates.map((c) => safeDeleteResume(c.resumePath)));
    await Candidate.destroy({ where: { jobId: job.id } });
    await job.destroy();

    return res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createJob,
  listJobs,
  getJobById,
  deleteJob,
};
