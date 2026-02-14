function normalizeSkill(s) {
  return (s || "")
    .toLowerCase()
    .replace(/[\.\+\(\)\-_/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildSkillSet(skills = []) {
  return new Set(skills.map(normalizeSkill).filter(Boolean));
}

const computeSkillMatchScore = (requiredSkills, candidateSkills) => {
  if (!requiredSkills.length) {
    return {
      score: 0,
      matchedSkills: [],
      missingSkills: [],
    };
  }

  // Normalize skills to lowercase
  const normalizedRequired = requiredSkills.map(skill =>
    skill.toLowerCase().trim()
  );

  const normalizedCandidate = candidateSkills.map(skill =>
    skill.toLowerCase().trim()
  );

  const matchedSkills = [];
  const missingSkills = [];

  normalizedRequired.forEach(reqSkill => {
    const found = normalizedCandidate.some(candidateSkill =>
      candidateSkill.includes(reqSkill)
    );

    if (found) {
      matchedSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  });

  const score = Math.round(
    (matchedSkills.length / normalizedRequired.length) * 100
  );

  return {
    score,
    matchedSkills,
    missingSkills,
  };
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
};

