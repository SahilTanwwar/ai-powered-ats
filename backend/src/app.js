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
app.use(express.json());
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/candidates", candidateRoutes);

module.exports = app;
