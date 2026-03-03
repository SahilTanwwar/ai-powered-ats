require("dotenv").config();
const app = require("./app");
const { connectDB, sequelize } = require("./config/db");
require("./models");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect Database
    await connectDB();

    // Decide Sync Mode
    const syncOptions =
      process.env.DB_SYNC_FORCE === "true"
        ? { force: true }
        : process.env.DB_SYNC_ALTER === "true"
        ? { alter: true }
        : {};

    await sequelize.sync(syncOptions);
    console.log("Tables synced");

    // Start Server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
};

if (!process.env.JWT_SECRET) {
  console.error("❌ FATAL: JWT_SECRET environment variable is not set.");
  process.exit(1);
}

startServer();
