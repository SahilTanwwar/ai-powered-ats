const { extractResumeText } = require("../utils/resumeTextExtractor");
const Candidate = require("../models/candidate.model");
const Job = require("../models/job.js");

const {
  parseResumeToJson,
  scoreResumeAgainstJob,
  generateInterviewQuestions,
} = require("./ai.service");

const {
  computeSkillMatchScore,
  parseRequiredYears,
  computeExperienceScore,
} = require("../utils/hybridScoring");


// 🔥 CREATE CANDIDATE WITH HYBRID SCORING (Debug Version)
const createCandidate = async (data) => {
  const { filePath, jobId } = data;

  const candidate = await Candidate.create(data);

  if (!filePath) return candidate;

  try {
    // 1️⃣ Extract Resume Text
    const extractedText = await extractResumeText(filePath);
    await candidate.update({ extractedText });

    // 2️⃣ Fetch Job
    const job = await Job.findByPk(jobId);
    if (!job) return candidate;

    try {
      // 3️⃣ Parse Resume → Structured JSON
      const parsedJson = await parseResumeToJson(extractedText);

      // 🔥 DEBUG START
      console.log("======== DEBUG START ========");
      console.log("Job requiredSkills:", job.requiredSkills);
      console.log("Parsed skills:", parsedJson.skills);
      console.log("Job experienceRequired:", job.experienceRequired);
      console.log("Parsed totalExperienceYears:", parsedJson.totalExperienceYears);
      console.log("======== DEBUG END ==========");
      // 🔥 DEBUG END

      // 4️⃣ Skill Match Score
      const skillResult = computeSkillMatchScore(
        job.requiredSkills || [],
        parsedJson.skills || []
      );

      // 5️⃣ Experience Score
      const requiredMinYears = parseRequiredYears(job.experienceRequired || "");
      const candidateYears = Number(parsedJson.totalExperienceYears || 0);

      const expScore = computeExperienceScore(
        candidateYears,
        requiredMinYears
      );

      // 🔥 6️⃣ Final Hybrid Score (70% skills, 30% experience)
      const WEIGHTS = { skills: 0.7, experience: 0.3 };

      const hybridScore = Math.round(
        skillResult.score * WEIGHTS.skills +
        expScore * WEIGHTS.experience
      );

      // 7️⃣ Auto Status Logic
      let newStatus = "APPLIED";

      if (hybridScore >= 80) newStatus = "SHORTLISTED";
      else if (hybridScore < 40) newStatus = "REJECTED";

      // 8️⃣ Optional LLM Explanation
      const scoreData = await scoreResumeAgainstJob(extractedText, job);

      // 9️⃣ Update Candidate Record
      await candidate.update({
        aiParsedJson: parsedJson,
        aiScore: scoreData.score,
        aiMatchReason: scoreData.reason,
        hybridScore,
        scoreBreakdown: {
          skills: skillResult.score,
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


// ✅ Get Candidates By Job
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


// ✅ Generate Interview Questions
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
