const {
  createCandidate,
  getCandidatesByJob,
  generateCandidateInterviewQuestions,
} = require("../services/candidate.service");

const {
  sendEmail,
  applicationReceivedEmail,
  statusUpdateEmail,
} = require("../services/email.service");

const { createAuditLog } = require("../middleware/auditMiddleware");

const { validate: isUuid } = require("uuid");
const Candidate = require("../models/candidate.model");
const Job = require("../models/job");
const fs = require("fs/promises");
const path = require("path");

const canAccessJob = (user, job) => {
  if (user.role === "ADMIN") {
    return true;
  }

  if (user.role === "RECRUITER") {
    return Number(job.userId) === Number(user.id);
  }

  return false;
};

const safeDeleteResume = async (filePath) => {
  if (!filePath) return;
  const absolute = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(__dirname, "../../", filePath);
  try {
    await fs.unlink(absolute);
  } catch {
    // Ignore missing files while deleting candidate.
  }
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

    // 🔍 DUPLICATE DETECTION: Check if candidate with same email already applied for this job
    const existingCandidate = await Candidate.findOne({
      where: { email: email.trim().toLowerCase(), jobId: parsedJobId },
    });

    if (existingCandidate) {
      // Delete uploaded file since we're rejecting the duplicate
      await safeDeleteResume(req.file.path);
      return res.status(409).json({
        message: "This candidate has already applied for this job",
        existingCandidateId: existingCandidate.id,
      });
    }

    const candidate = await createCandidate({
      name,
      email: email.trim().toLowerCase(),
      phone,
      jobId: parsedJobId,
      recruiterId: parseInt(req.user.id, 10),
      role: req.user.role,
      resumePath: req.file.path,
      filePath: req.file.path,
    });

    // 📧 Send application confirmation email (async, don't await)
    const emailTemplate = applicationReceivedEmail(name, job.title);
    sendEmail({
      to: email,
      ...emailTemplate,
    }).catch((err) => console.error("Email notification failed:", err.message));

    // 📝 Audit log
    createAuditLog({
      userId: req.user.id,
      userEmail: req.user.email,
      action: "CANDIDATE_CREATED",
      resourceType: "CANDIDATE",
      resourceId: candidate.id,
      details: { candidateName: name, jobTitle: job.title, jobId: parsedJobId },
      req,
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

    const oldStatus = candidate.status;
    candidate.status = status;
    await candidate.save();

    // 📧 Send status update email if status changed (async, don't await)
    if (oldStatus !== status && ["SHORTLISTED", "REJECTED", "HIRED"].includes(status)) {
      const emailTemplate = statusUpdateEmail(candidate.name, job.title, status);
      sendEmail({
        to: candidate.email,
        ...emailTemplate,
      }).catch((err) => console.error("Status email failed:", err.message));
    }

    // 📝 Audit log
    if (oldStatus !== status) {
      createAuditLog({
        userId: req.user.id,
        userEmail: req.user.email,
        action: "CANDIDATE_STATUS_UPDATED",
        resourceType: "CANDIDATE",
        resourceId: candidate.id,
        details: { oldStatus, newStatus: status, candidateName: candidate.name, jobTitle: job.title },
        req,
      });
    }

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

    // Extract filters from query parameters
    const filters = {
      status: req.query.status,
      minScore: req.query.minScore,
      maxScore: req.query.maxScore,
      search: req.query.search,
    };

    const candidates = await getCandidatesByJob(
      parsedJobId,
      req.user.role === "ADMIN" ? null : parseInt(req.user.id, 10),
      filters
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
        tags: candidate.tags || [],
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

const deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isUuid(id)) {
      return res.status(400).json({ message: "Invalid candidate id format" });
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

    await safeDeleteResume(candidate.resumePath);
    await candidate.destroy();

    return res.status(200).json({ message: "Candidate deleted successfully" });
  } catch (error) {
    console.error("Delete candidate error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


const searchCandidates = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.status(200).json({ success: true, data: [] });
    }

    const { Op } = require("sequelize");
    const searchTerm = `%${q.trim()}%`;

    // Base filter: If recruiter, only show candidates for their jobs
    let jobFilter = {};
    if (req.user.role === "RECRUITER") {
      const jobs = await Job.findAll({ where: { userId: req.user.id }, attributes: ["id"] });
      const jobIds = jobs.map((j) => j.id);
      jobFilter = { jobId: { [Op.in]: jobIds } };
    }

    const candidates = await Candidate.findAll({
      where: {
        ...jobFilter,
        [Op.or]: [
          { name: { [Op.iLike]: searchTerm } },
          { email: { [Op.iLike]: searchTerm } },
          { extractedText: { [Op.iLike]: searchTerm } },
        ],
      },
      include: [{ model: Job, as: "Job", attributes: ["title"] }],
      limit: 20,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: candidates.map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        status: c.status,
        jobTitle: c.Job?.title || "Unknown Job",
        atsScore: c.hybridScore,
      })),
    });
  } catch (error) {
    console.error("Search candidates error:", error);
    return res.status(500).json({ message: "Server error during search" });
  }
};

const addTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { tag } = req.body;

    if (!tag || !tag.trim()) {
      return res.status(400).json({ message: "Tag is required" });
    }

    const candidate = await Candidate.findByPk(id);
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    const job = await Job.findByPk(candidate.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (!canAccessJob(req.user, job)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const currentTags = candidate.tags || [];
    const formattedTag = tag.trim().toUpperCase();

    if (!currentTags.includes(formattedTag)) {
      candidate.tags = [...currentTags, formattedTag];
      await candidate.save();
    }

    return res.status(200).json({ success: true, tags: candidate.tags });
  } catch (error) {
    console.error("Add tag error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const removeTag = async (req, res) => {
  try {
    const { id, tag } = req.params;

    const candidate = await Candidate.findByPk(id);
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    const job = await Job.findByPk(candidate.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (!canAccessJob(req.user, job)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const currentTags = candidate.tags || [];
    const formattedTag = tag.toUpperCase();

    candidate.tags = currentTags.filter((t) => t !== formattedTag);
    await candidate.save();

    return res.status(200).json({ success: true, tags: candidate.tags });
  } catch (error) {
    console.error("Remove tag error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  uploadCandidate,
  listCandidates,
  getInterviewQuestions,
  updateCandidateStatus,
  deleteCandidate,
  searchCandidates,
  addTag,
  removeTag,
};
