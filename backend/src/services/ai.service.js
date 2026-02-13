const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: process.env.GEMINI_MODEL,
});

// Safe JSON parser
function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("Invalid JSON from AI");
  }
}

// 🔹 Resume → Structured JSON
async function parseResumeToJson(resumeText) {
  const prompt = `
Extract structured information from this resume.
Return ONLY valid JSON. No explanation.

Format:
{
  "name": "",
  "email": "",
  "phone": "",
  "skills": [],
  "education": [],
  "experience": [],
  "projects": [],
  "certifications": [],
  "summary": ""
}

Resume:
${resumeText}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return safeJsonParse(text);
}

// 🔹 Resume → Job Matching Score
async function scoreResumeAgainstJob(resumeText, job) {
  const prompt = `
You are an expert AI recruiter.

Compare this resume with the job description.

Job Title: ${job.title}
Job Description: ${job.description}
Required Skills: ${job.requiredSkills.join(", ")}

Resume:
${resumeText}

Return ONLY JSON:
{
  "score": number (0-100),
  "reason": "",
  "matchedSkills": [],
  "missingSkills": []
}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return safeJsonParse(text);
}

module.exports = {
  parseResumeToJson,
  scoreResumeAgainstJob,
};
