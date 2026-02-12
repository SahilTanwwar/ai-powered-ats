const {
  createCandidate,
  getCandidatesByJob,
} = require("../services/candidate.service");

const uploadCandidate = async (req, res) => {
  try {
    const { name, email, phone, jobId } = req.body;

    // Basic validation
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

    // Convert jobId to integer
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
    });

    return res.status(201).json({
      success: true,
      data: candidate,
    });

  } catch (error) {
    console.error("Upload Candidate Error:", error);

    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

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
      data: candidates,
    });

  } catch (error) {
    console.error("List Candidates Error:", error);

    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = { uploadCandidate, listCandidates };
