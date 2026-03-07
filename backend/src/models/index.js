const Candidate = require("./candidate.model");
const Job = require("./job");
const User = require("./User");
const Interview = require("./interview.model");
const AuditLog = require("./auditLog.model");
const CandidateNote = require("./candidateNote.model");

// Job has many candidates
Job.hasMany(Candidate, { foreignKey: "jobId", onDelete: "CASCADE" });
Candidate.belongsTo(Job, { foreignKey: "jobId" });

// User (recruiter) has many candidates
User.hasMany(Candidate, { foreignKey: "recruiterId", onDelete: "CASCADE" });
Candidate.belongsTo(User, { foreignKey: "recruiterId" });

// Interview associations
Candidate.hasMany(Interview, { foreignKey: "candidateId", onDelete: "CASCADE" });
Interview.belongsTo(Candidate, { foreignKey: "candidateId", as: "candidate" });

Job.hasMany(Interview, { foreignKey: "jobId", onDelete: "CASCADE" });
Interview.belongsTo(Job, { foreignKey: "jobId", as: "job" });

// Notes
Candidate.hasMany(CandidateNote, { foreignKey: "candidateId", onDelete: "CASCADE", as: "notes" });
CandidateNote.belongsTo(Candidate, { foreignKey: "candidateId" });
User.hasMany(CandidateNote, { foreignKey: "userId", onDelete: "CASCADE" });
CandidateNote.belongsTo(User, { foreignKey: "userId", as: "author" });

// Interviews & Scheduling
Interview.belongsTo(User, { foreignKey: "scheduledBy", as: "scheduler" });

module.exports = { Candidate, Job, User, Interview, AuditLog, CandidateNote };
