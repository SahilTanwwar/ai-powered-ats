const { extractResumeText } = require("../utils/resumeTextExtractor");
const Candidate = require("../models/candidate.model");
const Job = require("../models/job.js");

const {
  parseResumeToJson,
  scoreResumeAgainstJob,
  generateInterviewQuestions,
  semanticMatchScore,
} = require("./ai.service");

const {
  computeSkillMatchScore,
  parseRequiredYears,
  computeExperienceScore,
} = require("../utils/hybridScoring");

// CREATE CANDIDATE WITH HYBRID SCORING
const createCandidate = async (data) => {
  const { filePath, jobId, recruiterId } = data;

  const job = await Job.findOne({
    where: { id: jobId, userId: recruiterId },
  });

  if (!job) {
    const error = new Error("Job not found");
    error.statusCode = 404;
    throw error;
  }

  const candidate = await Candidate.create(data);

  if (!filePath) return candidate;

  try {
    const extractedText = await extractResumeText(filePath);
    await candidate.update({ extractedText });

    try {
      const parsedJson = await parseResumeToJson(extractedText);

      const skillResult = computeSkillMatchScore(
        job.requiredSkills || [],
        parsedJson.skills || []
      );

      const requiredMinYears = parseRequiredYears(job.experienceRequired || "");
      const candidateYears = Number(parsedJson.totalExperienceYears || 0);

      const expScore = computeExperienceScore(candidateYears, requiredMinYears);
      const semanticResult = await semanticMatchScore(extractedText, job);

      const WEIGHTS = { skills: 0.5, semantic: 0.3, experience: 0.2 };

      const hybridScore = Math.round(
        skillResult.score * WEIGHTS.skills
          + semanticResult.score * WEIGHTS.semantic
          + expScore * WEIGHTS.experience
      );

      let newStatus = "APPLIED";
      if (hybridScore >= 80) newStatus = "SHORTLISTED";
      else if (hybridScore < 40) newStatus = "REJECTED";

      const scoreData = await scoreResumeAgainstJob(extractedText, job);

      await candidate.update({
        aiParsedJson: parsedJson,
        aiScore: scoreData.score,
        aiMatchReason: scoreData.reason,
        hybridScore,
        scoreBreakdown: {
          skills: skillResult.score,
          semantic: semanticResult.score,
          experience: expScore,
          matchedSkills: skillResult.matchedSkills,
          missingSkills: skillResult.missingSkills,
          requiredMinYears,
          candidateYears,
        },
        status: newStatus,
        aiUpdatedAt: new Date(),
      });
    } catch (aiError) {
      console.error("AI Processing Failed:", aiError.message);

      await candidate.update({
        aiMatchReason: "AI processing failed",
      });
    }
  } catch (extractError) {
    console.error("Resume Extraction Failed:", extractError.message);
  }

  return candidate;
};

// Get Candidates By Job
const getCandidatesByJob = async (jobId, recruiterId) => {
  return await Candidate.findAll({
    where: { jobId, recruiterId },
    order: [
      [Candidate.sequelize.literal('"hybridScore" IS NULL'), "ASC"],
      ["hybridScore", "DESC"],
      ["createdAt", "ASC"],
    ],
  });
};

// Generate Interview Questions
const generateCandidateInterviewQuestions = async (candidateId, recruiterId) => {
  const candidate = await Candidate.findOne({
    where: { id: candidateId, recruiterId },
  });

  if (!candidate) {
    throw new Error("Candidate not found");
  }

  const job = await Job.findByPk(candidate.jobId);

  if (!job) {
    throw new Error("Job not found");
  }

  if (!candidate.extractedText) {
    throw new Error("Resume text not available");
  }

  const questionsData = await generateInterviewQuestions(
    candidate.extractedText,
    job
  );

  return questionsData.questions;
};

module.exports = {
  createCandidate,
  getCandidatesByJob,
  generateCandidateInterviewQuestions,
};
