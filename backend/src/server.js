require("dotenv").config();
const app = require("./app");
const { connectDB, sequelize } = require("./config/db");
require("./models");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const syncOptions = process.env.DB_SYNC_ALTER === "true" ? { alter: true } : {};
  await sequelize.sync(syncOptions);
  console.log("Tables synced");

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
