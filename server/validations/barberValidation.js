const { body } = require("express-validator");

const createBarberValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please provide a valid email.")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 8 }).custom(v => typeof v === "string" && Buffer.byteLength(v, "utf8") <= 72)
    .withMessage("Password must be at least 8 characters."),

  body("displayName")
    .trim()
    .notEmpty()
    .withMessage("Display name is required.")
    .isLength({ min: 2, max: 50 })
    .withMessage(
      "Display name must be between 2 and 50 characters."
    ),

  body("chairNumber")
    .notEmpty()
    .withMessage("Chair number is required.")
    .isInt({ min: 1 })
    .withMessage("Chair number must be a positive integer.")
    .toInt(),

  body("phone")
    .optional({ values: "falsy" })
    .trim()
    .matches(/^[0-9]{10}$/)
    .withMessage("Phone number must contain exactly 10 digits."),

  body("experience")
    .optional({ values: "falsy" })
    .isInt({ min: 0 })
    .withMessage("Experience must be a non-negative integer.")
    .toInt(),

  body("specialization")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 100 })
    .withMessage(
      "Specialization cannot exceed 100 characters."
    ),
];

const updateBarberValidation = [
  body("displayName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage(
      "Display name must be between 2 and 50 characters."
    ),

  body("chairNumber")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Chair number must be a positive integer.")
    .toInt(),

  body("phone")
    .optional({ values: "falsy" })
    .trim()
    .matches(/^[0-9]{10}$/)
    .withMessage("Phone number must contain exactly 10 digits."),

  body("experience")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Experience must be a non-negative integer.")
    .toInt(),

  body("specialization")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage(
      "Specialization cannot exceed 100 characters."
    ),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean.")
    .toBoolean(),
];

const updateStatusValidation = [
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status is required.")
    .isIn([
      "AVAILABLE",
      "BUSY",
      "BREAK",
      "OFFLINE",
    ])
    .withMessage("Invalid status."),
];

module.exports = {
  createBarberValidation,
  updateBarberValidation,
  updateStatusValidation,
};