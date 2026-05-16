const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500, // Increased for development - React Strict Mode double-invokes effects
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV !== "production", // Skip rate limiting in development
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // Increased for development
  message: "Too many login attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV !== "production", // Skip rate limiting in development
});

module.exports = { apiLimiter, authLimiter };
