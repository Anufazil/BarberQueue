const express = require("express");

const router = express.Router();

const {
  registerAdmin,
  login,
  getMe,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const { loginLimiter } = require("../middleware/rateLimiter");

const { loginValidation, adminValidation } = require('../validations/authValidation');
const validate = require('../middleware/validationMiddleware');
// Admin registration — ADMIN only
router.post(
  "/register-admin",
  protect,
  authorize("ADMIN"),
  adminValidation, validate, registerAdmin
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@barberqueue.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

router.post("/login", loginLimiter, loginValidation, validate, login);

router.get("/me", protect, getMe);

module.exports = router;