const {
  createCandidate,
  getCandidatesByJob,
} = require("../services/candidate.service");


// 🚀 Upload Candidate
const uploadCandidate = async (req, res) => {
  try {
    const { name, email, phone, jobId } = req.body;

    if (!name || !email || !jobId) {
      return res.status(400).json({
        message: "Name, email and jobId are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Resume file is required",
      });
    }

    const parsedJobId = parseInt(jobId, 10);

    if (isNaN(parsedJobId)) {
      return res.status(400).json({
        message: "jobId must be a valid integer",
      });
    }

    const candidate = await createCandidate({
      name,
      email,
      phone,
      jobId: parsedJobId,
      recruiterId: parseInt(req.user.id, 10),
      resumePath: req.file.path,
      filePath: req.file.path,
    });

    return res.status(201).json({
      success: true,
      data: {
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone,
        jobId: candidate.jobId,
        status: candidate.status,
        aiScore: candidate.aiScore,
        aiMatchReason: candidate.aiMatchReason,
        summary: candidate.aiParsedJson?.summary || null,
        createdAt: candidate.createdAt,
      },
    });

  } catch (error) {
    console.error("Upload Candidate Error:", error);

    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};



// 📊 List Candidates (Ranked + Sanitized)
const listCandidates = async (req, res) => {
  try {
    const parsedJobId = parseInt(req.params.jobId, 10);

    if (isNaN(parsedJobId)) {
      return res.status(400).json({
        message: "jobId must be a valid integer",
      });
    }

    const candidates = await getCandidatesByJob(
      parsedJobId,
      parseInt(req.user.id, 10)
    );

    return res.status(200).json({
      success: true,
      data: candidates.map((candidate, index) => ({
        rank: index + 1, // 🏆 Ranked based on aiScore
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        status: candidate.status,
        aiScore: candidate.aiScore,
        aiMatchReason: candidate.aiMatchReason,
        summary: candidate.aiParsedJson?.summary || null,
        createdAt: candidate.createdAt,
      })),
    });

  } catch (error) {
    console.error("List Candidates Error:", error);

    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};


module.exports = {
  uploadCandidate,
  listCandidates,
};
