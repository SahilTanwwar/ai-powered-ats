const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/role.middleware");

const router = express.Router();

// All routes below require ADMIN role
router.use(authMiddleware, requireRole("ADMIN"));

/**
 * GET /api/users
 * List all recruiters (with optional status filter)
 * Query: ?status=PENDING | ACTIVE | BLOCKED
 */
router.get("/", async (req, res) => {
    try {
        const { status } = req.query;
        const where = { role: "RECRUITER" };
        if (status && ["PENDING", "ACTIVE", "BLOCKED"].includes(status)) {
            where.status = status;
        }
        const users = await User.findAll({
            where,
            attributes: ["id", "email", "role", "status", "createdAt"],
            order: [["createdAt", "DESC"]],
        });
        res.json({ data: users });
    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * PATCH /api/users/:id/status
 * Approve (ACTIVE) or Block a recruiter
 * Body: { status: "ACTIVE" | "BLOCKED" }
 */
router.patch("/:id/status", async (req, res) => {
    try {
        const { status } = req.body;
        if (!["ACTIVE", "BLOCKED", "PENDING"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.role === "ADMIN") {
            return res.status(403).json({ message: "Cannot change another admin's status" });
        }
        await user.update({ status });
        res.json({ message: `User status updated to ${status}`, user: { id: user.id, email: user.email, status } });
    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * POST /api/users
 * Admin creates a new recruiter directly (ACTIVE from the start)
 */
router.post("/", async (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password || password.length < 6) {
            return res.status(400).json({ message: "Valid email and password (min 6 chars) required" });
        }
        const existing = await User.findOne({ where: { email: email.trim() } });
        if (existing) return res.status(400).json({ message: "Email already exists" });

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({
            email: email.trim(),
            password: hashed,
            role: "RECRUITER",
            status: "ACTIVE", // Admin-created accounts are active immediately
        });
        res.status(201).json({ message: "Recruiter created", userId: user.id, email: user.email });
    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * DELETE /api/users/:id
 * Delete a recruiter
 */
router.delete("/:id", async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.role === "ADMIN") {
            return res.status(403).json({ message: "Cannot delete an admin account" });
        }
        await user.destroy();
        res.json({ message: "Recruiter deleted" });
    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
