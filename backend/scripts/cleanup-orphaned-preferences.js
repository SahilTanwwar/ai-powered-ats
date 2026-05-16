#!/usr/bin/env node
/**
 * cleanup-orphaned-preferences.js
 * Removes orphaned user_preferences records that reference non-existent users
 * Run: node scripts/cleanup-orphaned-preferences.js
 */

require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
});

(async () => {
  try {
    console.log("Connecting to database...");
    await sequelize.authenticate();
    console.log("✅ Connected to PostgreSQL\n");

    // Get counts before cleanup
    const [countBefore] = await sequelize.query(
      'SELECT COUNT(*) FROM user_preferences'
    );
    const countBeforeVal = parseInt(countBefore[0].count, 10);
    console.log(`📊 User preferences before cleanup: ${countBeforeVal}`);

    // Get orphaned records
    const [orphaned] = await sequelize.query(
      `SELECT "userId" FROM user_preferences 
       WHERE "userId" NOT IN (SELECT id FROM "Users")`
    );
    if (orphaned.length > 0) {
      console.log(`⚠️  Found ${orphaned.length} orphaned preference(s):`);
      orphaned.forEach(row => console.log(`   - userId: ${row.userId}`));
    }

    // Delete orphaned records
    if (orphaned.length > 0) {
      const [result] = await sequelize.query(
        `DELETE FROM user_preferences 
         WHERE "userId" NOT IN (SELECT id FROM "Users")`
      );
      console.log(`\n✅ Deleted ${orphaned.length} orphaned record(s)\n`);
    } else {
      console.log("✅ No orphaned records found\n");
    }

    // Get counts after cleanup
    const [countAfter] = await sequelize.query(
      'SELECT COUNT(*) FROM user_preferences'
    );
    const countAfterVal = parseInt(countAfter[0].count, 10);
    console.log(`📊 User preferences after cleanup: ${countAfterVal}`);
    console.log("✅ Cleanup complete!\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
})();
