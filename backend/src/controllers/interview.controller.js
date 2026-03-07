const { Interview, Candidate, Job, User } = require("../models");
const { sendEmail, interviewScheduledEmail } = require("../services/email.service");
const { createAuditLog } = require("../middleware/auditMiddleware");

// Helper to check if user has access to this candidate/job
const canAccessInterview = async (user, candidateId) => {
  if (user.role === "ADMIN") return true;

  const candidate = await Candidate.findByPk(candidateId, {
    include: [{ model: Job, as: "Job" }],
  });

  if (!candidate || !candidate.Job) return false;
  return Number(candidate.Job.userId) === Number(user.id);
};

const scheduleInterview = async (req, res) => {
  try {
    const { candidateId, jobId, interviewDate, duration, interviewType, meetingLink, location, notes } = req.body;

    if (!candidateId || !jobId || !interviewDate) {
      return res.status(400).json({ message: "Candidate, Job, and Date are required" });
    }

    const hasAccess = await canAccessInterview(req.user, candidateId);
    if (!hasAccess) {
      return res.status(403).json({ message: "Forbidden: You don't have access to this candidate" });
    }

    const candidate = await Candidate.findByPk(candidateId);
    const job = await Job.findByPk(jobId);

    const interview = await Interview.create({
      candidateId,
      jobId,
      scheduledBy: req.user.id,
      interviewDate,
      duration: duration || 60,
      interviewType: interviewType || "VIDEO",
      meetingLink,
      location,
      notes,
      status: "SCHEDULED"
    });

    // 📧 Send email to candidate
    try {
      const emailTemplate = interviewScheduledEmail(
        candidate.name,
        job.title,
        new Date(interviewDate).toLocaleString(),
        interview.meetingLink || interview.location || null
      );

      await sendEmail({
        to: candidate.email,
        ...emailTemplate,
      });
    } catch (err) {
      console.error("Failed to send interview email:", err);
    }

    // 📝 Audit log
    createAuditLog({
      userId: req.user.id,
      userEmail: req.user.email,
      action: "INTERVIEW_SCHEDULED",
      resourceType: "INTERVIEW",
      resourceId: interview.id,
      details: { candidateName: candidate.name, interviewDate },
      req,
    });

    // Return the full interview with related data for the frontend
    const fullInterview = await Interview.findByPk(interview.id, {
      include: [
        { model: User, as: "scheduler", attributes: ["id", "email"] }
      ]
    });

    return res.status(201).json({ success: true, data: fullInterview });
  } catch (error) {
    console.error("Schedule interview error:", error);
    return res.status(500).json({ message: "Server error scheduling interview" });
  }
};

const getInterviewsByCandidate = async (req, res) => {
  try {
    const { candidateId } = req.params;

    const hasAccess = await canAccessInterview(req.user, candidateId);
    if (!hasAccess) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const interviews = await Interview.findAll({
      where: { candidateId },
      include: [
        { model: User, as: "scheduler", attributes: ["id", "email"] }
      ],
      order: [["interviewDate", "DESC"]],
    });

    return res.status(200).json({ success: true, data: interviews });
  } catch (error) {
    console.error("Get interviews error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateInterviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, feedback, rating } = req.body;

    const interview = await Interview.findByPk(id);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    const hasAccess = await canAccessInterview(req.user, interview.candidateId);
    if (!hasAccess) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (status) interview.status = status;
    if (feedback) interview.feedback = feedback;
    if (rating) interview.rating = rating;

    await interview.save();

    return res.status(200).json({ success: true, data: interview });
  } catch (error) {
    console.error("Update interview error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  scheduleInterview,
  getInterviewsByCandidate,
  updateInterviewStatus
};
