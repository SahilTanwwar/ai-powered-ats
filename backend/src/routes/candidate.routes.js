const express = require("express");
const upload = require("../config/multer");
const candidateController = require("../controllers/candidate.controller");

const { uploadCandidate, listCandidates, getInterviewQuestions } =
  candidateController;
const authMiddleware = require("../middleware/authMiddleware");
const { requireAnyRole } = require("../middleware/role.middleware");

const router = express.Router();

/**
 * 🚀 Upload Candidate Resume
 * POST /api/candidates/upload
 * Protected
 */
router.post(
  "/upload",
  authMiddleware,
  requireAnyRole(["ADMIN", "RECRUITER"]),
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
  requireAnyRole(["ADMIN", "RECRUITER"]),
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
  requireAnyRole(["ADMIN", "RECRUITER"]),
  getInterviewQuestions
);

/**
 * Update Candidate Status
 * PATCH /api/candidates/:id/status
 * Protected
 */
router.patch(
  "/:id/status",
  authMiddleware,
  requireAnyRole(["ADMIN", "RECRUITER"]),
  candidateController.updateCandidateStatus
);

/**
 * Delete Candidate
 * DELETE /api/candidates/:id
 * Protected
 */
router.delete(
  "/:id",
  authMiddleware,
  requireAnyRole(["ADMIN", "RECRUITER"]),
  candidateController.deleteCandidate
);

module.exports = router;
