const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const { getProfile } = require("../controllers/userController");

router.get("/profile", protect, getProfile);

router.get(
  "/admin",
  protect,
  authorize("ADMIN"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Admin",
    });
  }
);

router.get(
  "/barber",
  protect,
  authorize("BARBER"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Barber",
    });
  }
);

module.exports = router;