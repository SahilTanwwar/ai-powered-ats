const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Candidate = sequelize.define(
  "Candidate",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    jobId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    recruiterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    resumePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    extractedText: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    aiScore: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    // ✅ NEW AI STRUCTURED FIELDS

    aiParsedJson: {
      type: DataTypes.JSONB, // Postgres optimized JSON storage
      allowNull: true,
    },

    aiSummary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    aiMatchReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    aiUpdatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    hybridScore: {
  type: DataTypes.FLOAT,
  allowNull: true,
},
scoreBreakdown: {
  type: DataTypes.JSONB,
  allowNull: true,
},
hybridScore: {
  type: DataTypes.FLOAT,
  allowNull: true,
},
scoreBreakdown: {
  type: DataTypes.JSONB,
  allowNull: true,
},



    status: {
      type: DataTypes.ENUM("APPLIED", "SHORTLISTED", "REJECTED"),
      defaultValue: "APPLIED",
    },
  },
  {
    tableName: "candidates",
    timestamps: true, // ensures createdAt & updatedAt
  }
);

module.exports = Candidate;
