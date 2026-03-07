const express = require("express");
const upload = require("../config/multer");
const candidateController = require("../controllers/candidate.controller");
const candidateNoteController = require("../controllers/candidateNote.controller");

const { uploadCandidate, listCandidates, getInterviewQuestions, searchCandidates, addTag, removeTag } =
  candidateController;
const authMiddleware = require("../middleware/authMiddleware");
const { requireAnyRole, requireRole } = require("../middleware/role.middleware");

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
 * 🔍 Global Candidate Search
 * GET /api/candidates/search?q=query
 * Protected
 */
router.get(
  "/search",
  authMiddleware,
  requireAnyRole(["ADMIN", "RECRUITER"]),
  searchCandidates
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
 * Delete Candidate — ADMIN only
 * DELETE /api/candidates/:id
 * Protected
 */
router.delete(
  "/:id",
  authMiddleware,
  requireRole("ADMIN"),
  candidateController.deleteCandidate
);

// --- CANDIDATE NOTES ROUTES ---

router.get(
  "/:candidateId/notes",
  authMiddleware,
  requireAnyRole(["ADMIN", "RECRUITER"]),
  candidateNoteController.getNotes
);

router.post(
  "/:candidateId/notes",
  authMiddleware,
  requireAnyRole(["ADMIN", "RECRUITER"]),
  candidateNoteController.createNote
);

router.delete(
  "/:candidateId/notes/:noteId",
  authMiddleware,
  requireAnyRole(["ADMIN", "RECRUITER"]),
  candidateNoteController.deleteNote
);

// --- CANDIDATE TAGS ROUTES ---

router.post(
  "/:id/tags",
  authMiddleware,
  requireAnyRole(["ADMIN", "RECRUITER"]),
  addTag
);

router.delete(
  "/:id/tags/:tag",
  authMiddleware,
  requireAnyRole(["ADMIN", "RECRUITER"]),
  removeTag
);

module.exports = router;
