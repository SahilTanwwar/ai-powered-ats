const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const path = require("path");
const User = require("../models/User");
const UserPreference = require("../models/userPreference.model");
const authMiddleware = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/role.middleware");
const upload = require("../config/multer");

const router = express.Router();

const safeDeleteResume = async (filePath) => {
    if (!filePath) return;
    const absolute = path.isAbsolute(filePath)
        ? filePath
        : path.resolve(__dirname, "../../", filePath);
    try {
        await fs.unlink(absolute);
    } catch {
    }
};

const getOrCreatePreferences = async (userId) => {
    const [preferences] = await UserPreference.findOrCreate({
        where: { userId },
        defaults: { userId },
    });
    return preferences;
};

const PREFERENCE_FIELDS = {
    "candidate-profile": "candidateProfile",
    "candidate-alerts": "candidateAlerts",
    "candidate-notifications": "candidateNotifications",
    "employer-notifications": "employerNotifications",
};

router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ["id", "email", "role", "status", "createdAt"],
        });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ data: user });
    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

router.patch("/me/email", authMiddleware, async (req, res) => {
    try {
        const { email } = req.body || {};
        if (!email || typeof email !== "string") {
            return res.status(400).json({ message: "Valid email is required" });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const existing = await User.findOne({ where: { email: normalizedEmail } });
        if (existing && Number(existing.id) !== Number(req.user.id)) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await user.update({ email: normalizedEmail });
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, status: user.status },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ message: "Email updated", token });
    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

router.delete("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.role === "ADMIN") {
            return res.status(403).json({ message: "Admin account cannot be self-deleted" });
        }

        const preferences = await UserPreference.findOne({ where: { userId: user.id } });
        if (preferences?.candidateResume?.path) {
            await safeDeleteResume(preferences.candidateResume.path);
        }

        await user.destroy();
        res.json({ message: "Account deleted" });
    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/me/preferences/:key", authMiddleware, async (req, res) => {
    try {
        const field = PREFERENCE_FIELDS[req.params.key];
        if (!field) return res.status(400).json({ message: "Invalid preference key" });
        const preferences = await getOrCreatePreferences(req.user.id);
        res.json({ data: preferences[field] });
    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

router.put("/me/preferences/:key", authMiddleware, async (req, res) => {
    try {
        const field = PREFERENCE_FIELDS[req.params.key];
        if (!field) return res.status(400).json({ message: "Invalid preference key" });
        const preferences = await getOrCreatePreferences(req.user.id);
        await preferences.update({ [field]: req.body?.value ?? {} });
        res.json({ message: "Preference updated", data: preferences[field] });
    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/me/company-profile", authMiddleware, async (req, res) => {
    try {
        const preferences = await getOrCreatePreferences(req.user.id);
        res.json({ data: preferences.employerCompanyProfile || {} });
    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

router.put("/me/company-profile", authMiddleware, async (req, res) => {
    try {
        const profile = req.body?.profile || {};
        const preferences = await getOrCreatePreferences(req.user.id);
        await preferences.update({ employerCompanyProfile: profile });
        res.json({ message: "Company profile updated", data: preferences.employerCompanyProfile });
    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/me/subscription", authMiddleware, async (req, res) => {
    try {
        const preferences = await getOrCreatePreferences(req.user.id);
        res.json({ data: preferences.employerSubscription });
    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/me/subscription/upgrade", authMiddleware, async (req, res) => {
    try {
        const { plan } = req.body || {};
        if (!plan || typeof plan !== "string") {
            return res.status(400).json({ message: "Plan is required" });
        }

        const preferences = await getOrCreatePreferences(req.user.id);
        const existing = preferences.employerSubscription || { currentPlan: "free", billingHistory: [] };
        const amountMap = { free: "$0", basic: "$29", premium: "$79" };
        const lower = plan.toLowerCase();
        const next = {
            currentPlan: lower,
            billingHistory: [
                {
                    date: new Date().toISOString().slice(0, 10),
                    plan: lower.charAt(0).toUpperCase() + lower.slice(1),
                    amount: amountMap[lower] || "$0",
                },
                ...(existing.billingHistory || []),
            ].slice(0, 24),
        };

        await preferences.update({ employerSubscription: next });
        res.json({ message: "Subscription upgraded", data: next });
    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/me/admin-settings", authMiddleware, requireRole("ADMIN"), async (req, res) => {
    try {
        const preferences = await getOrCreatePreferences(req.user.id);
        res.json({ data: preferences.adminSettings });
    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

router.put("/me/admin-settings", authMiddleware, requireRole("ADMIN"), async (req, res) => {
    try {
        const settings = req.body?.settings || {};
        const preferences = await getOrCreatePreferences(req.user.id);
        await preferences.update({ adminSettings: settings });
        res.json({ message: "Admin settings updated", data: preferences.adminSettings });
    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/me/resume", authMiddleware, upload.single("resume"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "Resume file is required" });
        const preferences = await getOrCreatePreferences(req.user.id);
        if (preferences.candidateResume?.path) {
            await safeDeleteResume(preferences.candidateResume.path);
        }

        const payload = {
            name: req.file.originalname,
            size: req.file.size,
            path: req.file.path,
            url: `/${req.file.path.replace(/\\/g, "/")}`,
            uploadedAt: new Date().toISOString(),
        };

        await preferences.update({ candidateResume: payload });
        res.status(201).json({ message: "Resume uploaded", data: payload });
    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/me/resume", authMiddleware, async (req, res) => {
    try {
        const preferences = await getOrCreatePreferences(req.user.id);
        res.json({ data: preferences.candidateResume });
    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

router.delete("/me/resume", authMiddleware, async (req, res) => {
    try {
        const preferences = await getOrCreatePreferences(req.user.id);
        if (preferences.candidateResume?.path) {
            await safeDeleteResume(preferences.candidateResume.path);
        }
        await preferences.update({ candidateResume: null });
        res.json({ message: "Resume deleted" });
    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * GET /api/users/public
 * Authenticated but non-admin route to get all active users for 'Network'
 */
router.get("/public", authMiddleware, async (req, res) => {
    try {
        const users = await User.findAll({
            where: { role: "RECRUITER", status: "ACTIVE" },
            attributes: ["id", "email", "role", "status", "createdAt"],
            order: [["createdAt", "DESC"]],
        });
        res.json({ data: users });
    } catch {
        res.status(500).json({ message: "Server error" });
    }
});

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
