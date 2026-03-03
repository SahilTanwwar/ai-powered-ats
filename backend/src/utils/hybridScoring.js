function normalizeSkill(s) {
  return (s || "")
    .toLowerCase()
    .replace(/[\.\+\(\)\-_/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Common tech skill synonyms — maps any alias to a canonical key.
// Both required and candidate skills are resolved before comparing.
const SKILL_SYNONYMS = {
  // AI / ML
  "ai":          ["artificial intelligence", "ai/ml", "ai ml"],
  "ml":          ["machine learning", "ml algorithms"],
  "llm":         ["large language model", "large language models", "llms", "language model", "language models"],
  "nlp":         ["natural language processing", "natural language"],
  "dl":          ["deep learning"],
  "cv":          ["computer vision"],
  "genai":       ["generative ai", "gen ai", "generative artificial intelligence"],
  "rag":         ["retrieval augmented generation", "retrieval-augmented generation"],
  // Languages
  "js":          ["javascript", "java script", "es6", "es2015", "ecmascript"],
  "javascript":  ["js", "es6"],
  "ts":          ["typescript", "type script"],
  "python":      ["py", "python3", "python 3"],
  "cpp":         ["c++", "cplusplus", "c plus plus"],
  // Frameworks
  "react":       ["reactjs", "react js", "react.js"],
  "vue":         ["vuejs", "vue js", "vue.js"],
  "angular":     ["angularjs", "angular js"],
  "node":        ["nodejs", "node js", "node.js"],
  "next":        ["nextjs", "next js", "next.js"],
  "express":     ["expressjs", "express js"],
  // Cloud / DevOps
  "aws":         ["amazon web services", "amazon aws"],
  "gcp":         ["google cloud", "google cloud platform"],
  "azure":       ["microsoft azure", "ms azure"],
  "k8s":         ["kubernetes", "kube"],
  "kubernetes":  ["k8s"],
  "docker":      ["containerization", "containers"],
  "ci/cd":       ["cicd", "ci cd", "continuous integration", "continuous deployment"],
  // Databases
  "sql":         ["mysql", "postgresql", "postgres", "mssql", "sqlite", "structured query language"],
  "postgres":    ["postgresql", "pg"],
  "nosql":       ["mongodb", "dynamodb", "cassandra"],
  "mongodb":     ["mongo"],
  // Data / Other
  "tensorflow":  ["tf"],
  "pytorch":     ["torch"],
  "api":         ["rest api", "restful api", "rest", "restful", "graphql"],
  "rest":        ["rest api", "restful", "restful api"],
  "git":         ["github", "gitlab", "version control", "bitbucket"],
  "oop":         ["object oriented", "object-oriented", "object oriented programming"],
};

function resolveCanonical(skill) {
  const n = normalizeSkill(skill);
  if (SKILL_SYNONYMS[n]) return n;
  for (const [canonical, aliases] of Object.entries(SKILL_SYNONYMS)) {
    if (aliases.includes(n)) return canonical;
  }
  return n;
}

const computeSkillMatchScore = (requiredSkills, candidateSkills) => {
  if (!requiredSkills.length) {
    return { score: 50, matchedSkills: [], missingSkills: [] };
  }

  const resolvedRequired  = requiredSkills.map(resolveCanonical);
  const resolvedCandidate = candidateSkills.map(resolveCanonical);

  const matchedSkills = [];
  const missingSkills = [];

  resolvedRequired.forEach((reqCanon, idx) => {
    // 1. Exact canonical match
    let found = resolvedCandidate.includes(reqCanon);

    // 2. Bidirectional substring (e.g. "react" in "reactjs", "ml" in "sklearn ml")
    if (!found) {
      found = resolvedCandidate.some(
        (cs) => cs.includes(reqCanon) || reqCanon.includes(cs)
      );
    }

    // 3. Fallback: compare raw normalized originals
    if (!found) {
      const origReq = normalizeSkill(requiredSkills[idx]);
      found = candidateSkills.some((cs) => {
        const origCs = normalizeSkill(cs);
        return origCs.includes(origReq) || origReq.includes(origCs);
      });
    }

    if (found) {
      matchedSkills.push(requiredSkills[idx]);
    } else {
      missingSkills.push(requiredSkills[idx]);
    }
  });

  const score = Math.round((matchedSkills.length / resolvedRequired.length) * 100);
  return { score, matchedSkills, missingSkills };
};


function parseRequiredYears(expStr = "") {
  // "2-4 years", "3 years", "1+ years"
  const m = expStr.match(/(\d+)(?:\s*-\s*(\d+))?/);
  if (!m) return null;
  const min = parseInt(m[1], 10);
  return Number.isNaN(min) ? null : min;
}

function computeExperienceScore(candidateYears, requiredMinYears) {
  if (!requiredMinYears || requiredMinYears <= 0) return 100;
  if (!candidateYears || candidateYears <= 0) return 0;

  const ratio = candidateYears / requiredMinYears;
  return Math.max(0, Math.min(100, Math.round(ratio * 100)));
}

module.exports = {
  computeSkillMatchScore,
  parseRequiredYears,
  computeExperienceScore,
  resolveCanonical,
};

