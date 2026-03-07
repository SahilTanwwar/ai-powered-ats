const AuditLog = require("../models/auditLog.model");

/**
 * Audit log helper function
 * Call this manually in controllers for important actions
 */
async function createAuditLog({
  userId,
  userEmail,
  action,
  resourceType,
  resourceId,
  details,
  req,
}) {
  try {
    await AuditLog.create({
      userId,
      userEmail,
      action,
      resourceType,
      resourceId,
      details,
      ipAddress: req?.ip || req?.headers?.["x-forwarded-for"] || req?.connection?.remoteAddress,
      userAgent: req?.headers?.["user-agent"],
    });
  } catch (error) {
    // Don't fail the main operation if audit logging fails
    console.error("❌ Audit log creation failed:", error.message);
  }
}

/**
 * Middleware to automatically log certain route actions
 * Add this middleware to specific routes that need auditing
 */
function auditMiddleware(action, resourceType) {
  return async (req, res, next) => {
    // Store audit info in request object for later use
    req.auditInfo = {
      action,
      resourceType,
      userId: req.user?.id,
      userEmail: req.user?.email,
      ipAddress: req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress,
      userAgent: req.headers["user-agent"],
    };
    next();
  };
}

module.exports = {
  createAuditLog,
  auditMiddleware,
};
