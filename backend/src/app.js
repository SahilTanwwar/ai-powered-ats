const express = require("express");
const cors = require("cors");
const path = require("path");

const jobRoutes = require("./routes/job");
const candidateRoutes = require("./routes/candidate.routes");
const authRoutes = require("./routes/auth");
const protectedRoutes = require("./routes/protected");
const healthRoutes = require("./routes/health");

const app = express();

app.use(cors());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads folder
app.use(
  "/uploads",
  express.static(path.resolve(__dirname, "../uploads"))
);

// ROUTES (IMPORTANT ORDER)

app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/candidates", candidateRoutes);

// KEEP GENERIC /api LAST
app.use("/api", protectedRoutes);

module.exports = app;
