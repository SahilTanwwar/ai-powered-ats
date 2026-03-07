/**
 * fix-pending-users.js
 * Fixes any stuck users who registered but got no role/status set.
 * Run: node scripts/fix-pending-users.js
 */
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const { sequelize } = require("../src/config/db");
const User = require("../src/models/User");
const { Op } = require("sequelize");

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Connected to DB...\n");

        // Show all users
        const all = await User.findAll({ attributes: ["id", "email", "role", "status", "createdAt"], order: [["createdAt", "DESC"]] });
        console.log("=== All Users ===");
        all.forEach(u => console.log(`  [${u.id}] ${u.email} | role=${u.role} | status=${u.status}`));

        // Fix any user without a proper role (shouldn't happen but just in case)
        const broken = all.filter(u => !u.role || !u.status);
        if (broken.length > 0) {
            console.log(`\nFixing ${broken.length} user(s) with missing role/status...`);
            for (const u of broken) {
                await u.update({ role: "RECRUITER", status: "PENDING" });
                console.log(`  Fixed: ${u.email}`);
            }
        } else {
            console.log("\n✅ All users have correct role and status.");
        }

        console.log("\nDone!");
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await sequelize.close();
        process.exit(0);
    }
})();
