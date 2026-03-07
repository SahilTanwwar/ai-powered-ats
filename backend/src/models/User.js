const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    required: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("ADMIN", "RECRUITER"),
    allowNull: false,
    defaultValue: "RECRUITER",
  },
  status: {
    type: DataTypes.ENUM("PENDING", "ACTIVE", "BLOCKED"),
    allowNull: false,
    defaultValue: "PENDING",
  },
}, {
  timestamps: true,
});

module.exports = User;
