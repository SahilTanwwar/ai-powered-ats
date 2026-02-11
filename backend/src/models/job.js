const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User");

const Job = sequelize.define("Job", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  requiredSkills: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  experienceRequired: {
    type: DataTypes.STRING,
  },
}, {
  timestamps: true,
});

// Relation
User.hasMany(Job, { foreignKey: "userId" });
Job.belongsTo(User, { foreignKey: "userId" });

module.exports = Job;
