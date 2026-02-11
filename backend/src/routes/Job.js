const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Job = require("../models/job");

const router = express.Router();

// CREATE JOB
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, requiredSkills, experienceRequired } = req.body;

    const job = await Job.create({
      title,
      description,
      requiredSkills,
      experienceRequired,
      userId: req.user.id,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: "Error creating job" });
  }
});

// GET ALL JOBS (only for logged recruiter)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.findAll({
      where: { userId: req.user.id },
    });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs" });
  }
});

// GET SINGLE JOB
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const job = await Job.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Error fetching job" });
  }
});

module.exports = router;
