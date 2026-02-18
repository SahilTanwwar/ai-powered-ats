const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");

router.get("/summary", dashboardController.getSummary);
router.get("/applications", dashboardController.getApplicationsChart);
router.get("/departments", dashboardController.getDepartments);

module.exports = router;
