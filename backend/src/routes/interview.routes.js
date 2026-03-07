const express = require("express");
const { scheduleInterview, getInterviewsByCandidate, updateInterviewStatus } = require("../controllers/interview.controller");
const authMiddleware = require("../middleware/authMiddleware");
const { requireAnyRole } = require("../middleware/role.middleware");

const router = express.Router();

/**
 * 📅 Schedule Interview
 * POST /api/interviews
 * Protected
 */
router.post(
  "/",
  authMiddleware,
  requireAnyRole(["ADMIN", "RECRUITER"]),
  scheduleInterview
);

/**
 * 📅 Get Interviews by Candidate
 * GET /api/interviews/candidate/:candidateId
 * Protected
 */
router.get(
  "/candidate/:candidateId",
  authMiddleware,
  requireAnyRole(["ADMIN", "RECRUITER"]),
  getInterviewsByCandidate
);

/**
 * Update Interview
 * PATCH /api/interviews/:id
 * Protected
 */
router.patch(
  "/:id",
  authMiddleware,
  requireAnyRole(["ADMIN", "RECRUITER"]),
  updateInterviewStatus
);

module.exports = router;
