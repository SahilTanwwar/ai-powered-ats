const { AuditLog } = require("../models");

const getAuditLogs = async (req, res) => {
  try {
    const { resourceType, resourceId, limit = 50, offset = 0 } = req.query;

    // Build where clause
    const where = {};
    if (resourceType) where.resourceType = resourceType;
    if (resourceId) where.resourceId = resourceId;

    const logs = await AuditLog.findAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const total = await AuditLog.count({ where });

    res.json({
      success: true,
      data: logs,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: offset + logs.length < total,
      },
    });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch audit logs",
      error: error.message,
    });
  }
};

const getAuditLogsByCandidate = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { limit = 50 } = req.query;

    const logs = await AuditLog.findAll({
      where: {
        resourceType: "CANDIDATE",
        resourceId: candidateId,
      },
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
    });

    res.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    console.error("Error fetching candidate audit logs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch audit logs",
      error: error.message,
    });
  }
};

module.exports = { getAuditLogs, getAuditLogsByCandidate };

