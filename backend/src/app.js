const express = require("express");
const cors = require("cors");
const path = require("path");
const dashboardRoutes = require("./routes/dashboard.routes");

const jobRoutes = require("./routes/Job");
const candidateRoutes = require("./routes/candidate.routes");
const interviewRoutes = require("./routes/interview.routes");
const auditLogRoutes = require("./routes/auditLog.routes");
const authRoutes = require("./routes/auth");
const protectedRoutes = require("./routes/protected");
const healthRoutes = require("./routes/health");
const usersRoutes = require("./routes/users.routes");

const { apiLimiter, authLimiter } = require("./middleware/rateLimiter");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://localhost:5174",
];
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (e.g. Postman, curl)
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiters must be declared BEFORE routes
app.use("/api/auth", authLimiter);
app.use("/api/", apiLimiter);

app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/audit-logs", auditLogRoutes);
app.use("/api/users", usersRoutes);
app.use("/api", protectedRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
