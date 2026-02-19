const {
  createCandidate,
  getCandidatesByJob,
  generateCandidateInterviewQuestions,
} = require("../services/candidate.service");

const { validate: isUuid } = require("uuid");
const Candidate = require("../models/candidate.model");
const Job = require("../models/job");

const canAccessJob = (user, job) => {
  if (user.role === "ADMIN") {
    return true;
  }

  if (user.role === "RECRUITER") {
    return Number(job.userId) === Number(user.id);
  }

  return false;
};



// 🚀 Upload Candidate
const uploadCandidate = async (req, res) => {
  try {
    const { name, email, phone, jobId } = req.body;

    if (!name || !email || !jobId) {
      return res.status(400).json({
        message: "Name, email and jobId are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Resume file is required",
      });
    }

    const parsedJobId = parseInt(jobId, 10);

    if (isNaN(parsedJobId)) {
      return res.status(400).json({
        message: "jobId must be a valid integer",
      });
    }

    const job = await Job.findByPk(parsedJobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    if (!canAccessJob(req.user, job)) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const candidate = await createCandidate({
      name,
      email,
      phone,
      jobId: parsedJobId,
      recruiterId: parseInt(req.user.id, 10),
      resumePath: req.file.path,
      filePath: req.file.path,
    });

    return res.status(201).json({
      success: true,
      data: {
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone,
        jobId: candidate.jobId,
        status: candidate.status,

        // ✅ ATS Score (hybrid: skills 50% + semantic 30% + experience 20%)
        atsScore: candidate.hybridScore,

        // 📊 Score Breakdown — how the ATS score was computed
        breakdown: {
          skills: candidate.scoreBreakdown?.skills || 0,
          semantic: candidate.scoreBreakdown?.semantic || 0,
          experience: candidate.scoreBreakdown?.experience || 0,
        },

        // 🎯 Matched & Missing Skills (extracted by AI)
        matchedSkills: candidate.scoreBreakdown?.matchedSkills || [],
        missingSkills: candidate.scoreBreakdown?.missingSkills || [],

        // 🤖 AI Insight
        aiMatchReason: candidate.aiMatchReason,
        summary: candidate.aiParsedJson?.summary || null,
        createdAt: candidate.createdAt,
      },
    });

  } catch (error) {
    console.error("Upload Candidate Error:", error);

    return res.status(error.statusCode || 500).json({
      message: error.message || "Internal Server Error",
    });
  }
};
const updateCandidateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["APPLIED", "SHORTLISTED", "REJECTED", "HIRED"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const candidate = await Candidate.findByPk(id);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const job = await Job.findByPk(candidate.jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (!canAccessJob(req.user, job)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    candidate.status = status;
    await candidate.save();

    res.json({ message: "Status updated successfully", candidate });
  } catch (error) {
    console.error("Status update error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// 📊 List Candidates (HYBRID Ranked + Clean)
const listCandidates = async (req, res) => {
  try {
    const parsedJobId = parseInt(req.params.jobId, 10);

    if (isNaN(parsedJobId)) {
      return res.status(400).json({
        message: "jobId must be a valid integer",
      });
    }

    const job = await Job.findByPk(parsedJobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    if (!canAccessJob(req.user, job)) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const candidates = await getCandidatesByJob(
      parsedJobId,
      req.user.role === "ADMIN" ? null : parseInt(req.user.id, 10)
    );

    return res.status(200).json({
      success: true,
      data: candidates.map((candidate, index) => ({
        rank: index + 1, // 🏆 Ranked based on hybridScore

        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        status: candidate.status,

        // ✅ ATS Score (hybrid: skills 50% + semantic 30% + experience 20%)
        atsScore: candidate.hybridScore,

        // 📊 Score Breakdown
        breakdown: {
          skills: candidate.scoreBreakdown?.skills || 0,
          semantic: candidate.scoreBreakdown?.semantic || 0,
          experience: candidate.scoreBreakdown?.experience || 0,
        },

        // 🎯 Matched & Missing Skills
        matchedSkills: candidate.scoreBreakdown?.matchedSkills || [],
        missingSkills: candidate.scoreBreakdown?.missingSkills || [],

        // 🤖 AI Insight
        aiMatchReason: candidate.aiMatchReason,
        summary: candidate.aiParsedJson?.summary || null,
        createdAt: candidate.createdAt,
      })),
    });

  } catch (error) {
    console.error("List Candidates Error:", error);

    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};


// 🎯 Generate Interview Questions
const getInterviewQuestions = async (req, res) => {
  try {
    const { candidateId } = req.params;

    if (!isUuid(candidateId)) {
      return res.status(400).json({
        message: "Invalid candidateId format",
      });
    }

    const questions = await generateCandidateInterviewQuestions(
      candidateId,
      req.user
    );

    return res.status(200).json({
      success: true,
      questions,
    });

  } catch (error) {
    console.error("Interview Questions Error:", error);

    return res.status(error.statusCode || 500).json({
      message: error.message || "Internal Server Error",
    });
  }
};


module.exports = {
  uploadCandidate,
  listCandidates,
  getInterviewQuestions,
  updateCandidateStatus,
};
