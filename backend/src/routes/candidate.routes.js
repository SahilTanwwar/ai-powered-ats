const express = require("express");
const upload = require("../config/multer");
const candidateController = require("../controllers/candidate.controller");

const { uploadCandidate, listCandidates, getInterviewQuestions } =
  candidateController;
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * 🚀 Upload Candidate Resume
 * POST /api/candidates/upload
 * Protected
 */
router.post(
  "/upload",
  authMiddleware,
  upload.single("resume"),
  uploadCandidate
);

/**
 * 📊 List Candidates by Job (Hybrid Ranked)
 * GET /api/candidates/job/:jobId
 * Protected
 */
router.get(
  "/job/:jobId",
  authMiddleware,
  listCandidates
);

/**
 * 🎯 Generate Interview Questions for Candidate
 * GET /api/candidates/:candidateId/interview-questions
 * Protected
 */
router.get(
  "/:candidateId/interview-questions",
  authMiddleware,
  getInterviewQuestions
);

/**
 * Update Candidate Status
 * PATCH /api/candidates/:id/status
 * Protected
 */
router.patch("/:id/status", authMiddleware, candidateController.updateCandidateStatus);

module.exports = router;
