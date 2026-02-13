const { extractResumeText } = require("../utils/resumeTextExtractor");
const Candidate = require("../models/candidate.model");
const Job = require("../models/job.js");
const { parseResumeToJson, scoreResumeAgainstJob } = require("./ai.service");

// 🔥 CREATE CANDIDATE WITH AI PIPELINE
const createCandidate = async (data) => {
  const { filePath, jobId } = data;

  const candidate = await Candidate.create(data);

  if (filePath) {
    try {
      // 🔹 Extract resume text
      const extractedText = await extractResumeText(filePath);
      await candidate.update({ extractedText });

      // 🔹 Fetch job
      const job = await Job.findByPk(jobId);

      if (job) {
        try {
          // 🔹 AI parsing
          const parsedJson = await parseResumeToJson(extractedText);

          // 🔹 AI scoring
          const scoreData = await scoreResumeAgainstJob(extractedText, job);

let newStatus = "APPLIED";

if (scoreData.score >= 80) {
  newStatus = "SHORTLISTED";
} else if (scoreData.score < 40) {
  newStatus = "REJECTED";
}

await candidate.update({
  aiParsedJson: parsedJson,
  aiScore: scoreData.score,
  aiMatchReason: scoreData.reason,
  status: newStatus,
  aiUpdatedAt: new Date(),
});

        } catch (aiError) {
          console.error("AI Processing Failed:", aiError.message);

          await candidate.update({
            aiMatchReason: "AI processing failed",
          });
        }
      }

    } catch (extractError) {
      console.error("Resume Extraction Failed:", extractError.message);
    }
  }

  return candidate;
};


// ✅ Get candidates by job
const getCandidatesByJob = async (jobId, recruiterId) => {
  return await Candidate.findAll({
    where: { jobId, recruiterId },
    order: [
      [Candidate.sequelize.literal('"aiScore" IS NULL'), 'ASC'],
      ['aiScore', 'DESC'],
      ['createdAt', 'ASC'],
    ],
  });
};

module.exports = { createCandidate, getCandidatesByJob };
