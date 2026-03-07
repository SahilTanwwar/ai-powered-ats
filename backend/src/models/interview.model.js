const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Interview = sequelize.define(
  "Interview",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    candidateId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "candidates",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    jobId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Jobs",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    scheduledBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // User ID of recruiter who scheduled
    },
    interviewDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      defaultValue: 60,
      // Duration in minutes
    },
    interviewType: {
      type: DataTypes.ENUM("PHONE", "VIDEO", "IN_PERSON", "TECHNICAL", "HR"),
      defaultValue: "VIDEO",
    },
    meetingLink: {
      type: DataTypes.STRING,
      allowNull: true,
      // Zoom/Meet link
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
      // For in-person interviews
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("SCHEDULED", "COMPLETED", "CANCELLED", "RESCHEDULED"),
      defaultValue: "SCHEDULED",
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true,
      // Post-interview feedback
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      // 1-5 rating
      validate: {
        min: 1,
        max: 5,
      },
    },
  },
  {
    tableName: "interviews",
    timestamps: true,
  }
);

module.exports = Interview;
