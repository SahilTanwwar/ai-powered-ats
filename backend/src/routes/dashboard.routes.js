const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/dashboard.controller");
const authMiddleware = require("../middleware/authMiddleware");
const { requireAnyRole } = require("../middleware/role.middleware");

router.get(
  "/",
  authMiddleware,
  requireAnyRole(["ADMIN", "RECRUITER"]),
  getDashboardStats
);

module.exports = router;
