const {
  createCandidate,
  getCandidatesByJob,
} = require("../services/candidate.service");

const uploadCandidate = async (req, res) => {
  try {
    const { name, email, phone, jobId } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const candidate = await createCandidate({
      name,
      email,
      phone,
      jobId,
      recruiterId: req.user.id,
      resumePath: req.file.path,
    });

    res.status(201).json({
      success: true,
      data: candidate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const listCandidates = async (req, res) => {
  try {
    const { jobId } = req.params;

    const candidates = await getCandidatesByJob(
      jobId,
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: candidates,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadCandidate, listCandidates };
