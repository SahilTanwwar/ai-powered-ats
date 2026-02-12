const Candidate = require("./candidate.model");
const Job = require("./job");
const User = require("./User");

// Job has many candidates
Job.hasMany(Candidate, { foreignKey: "jobId", onDelete: "CASCADE" });
Candidate.belongsTo(Job, { foreignKey: "jobId" });

// User (recruiter) has many candidates
User.hasMany(Candidate, { foreignKey: "recruiterId", onDelete: "CASCADE" });
Candidate.belongsTo(User, { foreignKey: "recruiterId" });

module.exports = { Candidate, Job, User };
