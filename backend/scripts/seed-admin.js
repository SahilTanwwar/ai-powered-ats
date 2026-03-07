/**
 * seed-admin.js
 * Run once to create the first ADMIN account.
 * Usage: node scripts/seed-admin.js
 */
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const bcrypt = require("bcrypt");
const { sequelize } = require("../src/config/db");
const User = require("../src/models/User");

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@hireai.com";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "Admin@123";

(async () => {
    try {
        await sequelize.authenticate();
        // Sync only User table (alter: add new columns if missing)
        await User.sync({ alter: true });

        const existing = await User.findOne({ where: { email: ADMIN_EMAIL } });
        if (existing) {
            // Make sure it's ADMIN + ACTIVE regardless
            await existing.update({ role: "ADMIN", status: "ACTIVE" });
            console.log(`✅ Existing user updated to ADMIN + ACTIVE: ${ADMIN_EMAIL}`);
        } else {
            const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
            await User.create({
                email: ADMIN_EMAIL,
                password: hashed,
                role: "ADMIN",
                status: "ACTIVE",
            });
            console.log(`✅ Admin account created: ${ADMIN_EMAIL}`);
            console.log(`   Password: ${ADMIN_PASSWORD}`);
        }
        console.log("🎉 Seed done. Change the password after first login!");
    } catch (err) {
        console.error("❌ Seed failed:", err.message);
    } finally {
        await sequelize.close();
        process.exit(0);
    }
})();
