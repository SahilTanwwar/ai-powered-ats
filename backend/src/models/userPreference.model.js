const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const UserPreference = sequelize.define(
  "UserPreference",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    candidateProfile: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    candidateAlerts: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    candidateResume: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: null,
    },
    candidateNotifications: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    employerNotifications: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    employerCompanyProfile: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    employerSubscription: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        currentPlan: "free",
        billingHistory: [],
      },
    },
    adminSettings: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        authRate: "5",
        apiRate: "100",
        corsOrigin: "http://localhost:5173",
      },
    },
  },
  {
    tableName: "user_preferences",
    timestamps: true,
  }
);

module.exports = UserPreference;
