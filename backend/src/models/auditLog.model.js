const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const AuditLog = sequelize.define(
  "AuditLog",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
      // Examples: "CANDIDATE_CREATED", "CANDIDATE_STATUS_UPDATED", "JOB_CREATED", "JOB_DELETED"
    },
    resourceType: {
      type: DataTypes.STRING,
      allowNull: false,
      // Examples: "CANDIDATE", "JOB", "USER"
    },
    resourceId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    details: {
      type: DataTypes.JSONB,
      allowNull: true,
      // Store additional context like: { oldStatus: "APPLIED", newStatus: "SHORTLISTED" }
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "audit_logs",
    timestamps: true,
    updatedAt: false, // Only need createdAt for audit logs
  }
);

module.exports = AuditLog;
