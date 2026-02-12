const Candidate = require("../models/candidate.model");

const createCandidate = async (data) => {
  return await Candidate.create(data);
};

const getCandidatesByJob = async (jobId, recruiterId) => {
  return await Candidate.findAll({
    where: { jobId, recruiterId },
  });
};

module.exports = { createCandidate, getCandidatesByJob };
