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

// Resume -> Structured JSON
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
  "summary": "",
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

// Resume -> Job Matching Score
async function scoreResumeAgainstJob(resumeText, job) {
  const prompt = `
You are a strict ATS (Applicant Tracking System) scoring engine.
Score the resume against the job using the rubric below. Be accurate, not generous.

━━━ SCORING RUBRIC (Total 100 points) ━━━

[A] SKILLS MATCH — 40 points
  • For each required skill found clearly in the resume: award (40 / total required skills) points
  • Partial credit (50%): close variant counts (e.g. "React.js" for "React")
  • Zero credit: skill not mentioned anywhere
  • If no required skills listed: award 20 points by default

[B] PROFESSIONAL EXPERIENCE — 35 points
  IMPORTANT DISTINCTION — projects ≠ professional experience:
  • 35 pts: Has paid professional work experience directly relevant to this role
  • 20 pts: Has internship experience relevant to this role
  • 10 pts: Has ONLY personal/academic projects (no job or internship)
  • 0 pts:  No relevant experience of any kind
  Students with only projects must receive 10 pts MAX in this section.

[C] JOB DESCRIPTION ALIGNMENT — 25 points
  • 25 pts: Resume directly addresses most core responsibilities in the JD
  • 15 pts: Resume partially addresses the JD responsibilities
  • 5 pts:  Resume loosely aligns with the JD
  • 0 pts:  No clear alignment

━━━ STRICT RULES ━━━
  • Do NOT reward soft skills, certifications, or education unless the JD specifically asks
  • Do NOT treat side projects as professional experience — they are different categories
  • Do NOT inflate scores. A student with great skills but 0 work experience should score 55-65, not 85+
  • Calculate each section separately then sum for final score

━━━ JOB DETAILS ━━━
Job Title: ${job.title}
Job Description: ${job.description}
Required Skills: ${(job.requiredSkills || []).join(", ")}

━━━ RESUME ━━━
${resumeText}

━━━ OUTPUT ━━━
Return ONLY this JSON (no markdown, no explanation outside JSON):
{
  "score": <number 0-100, sum of A+B+C>,
  "sectionScores": { "skills": <0-40>, "experience": <0-35>, "alignment": <0-25> },
  "reason": "<2-3 sentences: what matched, what was missing, why this score>",
  "matchedSkills": [],
  "missingSkills": []
}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return safeJsonParse(text);
}

// Generate Interview Questions
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
Required Skills: ${(job.requiredSkills || []).join(", ")}

Resume:
${resumeText}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return safeJsonParse(text);
}

function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (!normA || !normB) {
    return 0;
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function getEmbedding(text) {
  const embedModel = genAI.getGenerativeModel({
    model: process.env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-001",
  });
  const result = await embedModel.embedContent(text);
  return result.embedding.values;
}

async function semanticMatchScore(resumeText, job) {
  const jobText = `Title: ${job.title}\nDescription: ${job.description}\nSkills: ${(job.requiredSkills || []).join(", ")}`;

  const [resumeVec, jobVec] = await Promise.all([
    getEmbedding(resumeText.slice(0, 12000)),
    getEmbedding(jobText.slice(0, 12000)),
  ]);

  const sim = cosineSimilarity(resumeVec, jobVec);
  const score = Math.max(0, Math.min(100, Math.round(sim * 100)));

  return { similarity: sim, score };
}

module.exports = {
  parseResumeToJson,
  scoreResumeAgainstJob,
  generateInterviewQuestions,
  semanticMatchScore,
};
