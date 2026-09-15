const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  getDashboard,
  getStatistics,
} = require("../controllers/adminController");

router.get(
  "/dashboard",
  protect,
  authorize("ADMIN"),
  getDashboard
);

router.get(
  "/statistics",
  protect,
  authorize("ADMIN"),
  getStatistics
);

module.exports = router;