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
  "totalExperienceYears": 0

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

// 🔹 Generate Interview Questions
async function generateInterviewQuestions(resumeText, job) {
  const prompt = `
You are an expert technical interviewer.

Based on the resume and job description below,
generate 5 technical interview questions.

Focus on:
- Required job skills
- Candidate's experience
- Real-world practical understanding

Return ONLY JSON in this format:
{
  "questions": [
    "Question 1",
    "Question 2",
    "Question 3",
    "Question 4",
    "Question 5"
  ]
}

Job Title: ${job.title}
Job Description: ${job.description}
Required Skills: ${job.requiredSkills.join(", ")}

Resume:
${resumeText}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return safeJsonParse(text);
}
function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function getEmbedding(text) {
  const embedModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const result = await embedModel.embedContent(text);
  return result.embedding.values;
}

async function semanticMatchScore(resumeText, job) {
  const jobText = `Title: ${job.title}\nDescription: ${job.description}\nSkills: ${job.requiredSkills.join(", ")}`;

  const [resumeVec, jobVec] = await Promise.all([
    getEmbedding(resumeText.slice(0, 12000)),
    getEmbedding(jobText.slice(0, 12000)),
  ]);

  const sim = cosineSimilarity(resumeVec, jobVec); // typically -1..1 but usually 0..1
  const score = Math.max(0, Math.min(100, Math.round(sim * 100)));

  return { similarity: sim, score };
}



module.exports = {
  parseResumeToJson,
  scoreResumeAgainstJob,
  generateInterviewQuestions,
  semanticMatchScore,
};
