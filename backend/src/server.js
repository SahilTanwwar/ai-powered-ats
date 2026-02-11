require("dotenv").config();
const app = require("./app");
const { connectDB, sequelize } = require("./config/db");
require("./models/User");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await sequelize.sync({ alter: true });
  console.log("✅ Tables synced");

  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

startServer();
