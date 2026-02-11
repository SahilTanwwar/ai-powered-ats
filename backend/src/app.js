const express = require("express");
const cors = require("cors");
const jobRoutes = require("./routes/job");

const authRoutes = require("./routes/auth");
const protectedRoutes = require("./routes/protected");
const healthRoutes = require("./routes/health");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/jobs", jobRoutes);

module.exports = app;
