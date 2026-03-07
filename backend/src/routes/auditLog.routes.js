const express = require("express");
const { getAuditLogs, getAuditLogsByCandidate } = require("../controllers/auditLog.controller");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// All routes require authentication
router.get("/", authMiddleware, getAuditLogs);
router.get("/candidate/:candidateId", authMiddleware, getAuditLogsByCandidate);

module.exports = router;
