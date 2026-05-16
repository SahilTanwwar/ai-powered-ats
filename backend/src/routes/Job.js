const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { requireAnyRole, requireRole } = require("../middleware/role.middleware");
const jobController = require("../controllers/job.controller");

const router = express.Router();

// PUBLIC JOB DISCOVERY
router.get("/public", jobController.listPublicJobs);
router.get("/public/:id", jobController.getPublicJobById);

// CREATE JOB
router.post(
  "/",
  authMiddleware,
  requireAnyRole(["ADMIN", "RECRUITER"]),
  jobController.createJob
);

// GET ALL JOBS
router.get(
  "/",
  authMiddleware,
  requireAnyRole(["ADMIN", "RECRUITER"]),
  jobController.listJobs
);

// GET SINGLE JOB
router.get(
  "/:id",
  authMiddleware,
  requireAnyRole(["ADMIN", "RECRUITER"]),
  jobController.getJobById
);

// DELETE JOB — ADMIN and recruiters who own the job
router.delete(
  "/:id",
  authMiddleware,
  requireAnyRole(["ADMIN", "RECRUITER"]),
  jobController.deleteJob
);

module.exports = router;
