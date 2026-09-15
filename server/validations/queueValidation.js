const { body } = require("express-validator");

const joinQueueValidation = [
  body("barberId")
    .notEmpty()
    .withMessage("Barber ID is required")
    .isMongoId()
    .withMessage("Invalid Barber ID"),

  body("customerName")
    .trim()
    .notEmpty()
    .withMessage("Customer name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Customer name must be between 2 and 50 characters"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[0-9]{10}$/)
    .withMessage("Phone number must contain exactly 10 digits"),
];

module.exports = {
  joinQueueValidation,
};