const express = require("express");
const upload = require("../config/multer");
const { 
  uploadCandidate, 
  listCandidates,
  getInterviewQuestions 
} = require("../controllers/candidate.controller");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  upload.single("resume"),
  uploadCandidate
);

router.get(
  "/job/:jobId",
  authMiddleware,
  listCandidates
);

router.get(
  "/:candidateId/interview-questions",
  authMiddleware,
  getInterviewQuestions
);


module.exports = router;
