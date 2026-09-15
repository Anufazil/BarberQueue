const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validateObjectId = require("../middleware/validateObjectId");
const ownership = require('../middleware/barberOwnership');
const validate = require("../middleware/validationMiddleware");

const {
  createBarberValidation,
  updateBarberValidation,
  updateStatusValidation,
} = require("../validations/barberValidation");

const {
  createBarber,
  getAllBarbers,
  getBarberById,
  updateBarber,
  deleteBarber,
  permanentlyDeleteBarber,
  reactivateBarber,
  updateStatus,
  getBarberDashboard,
} = require("../controllers/barberController");

router.post(
  "/",
  protect,
  authorize("ADMIN"),
  createBarberValidation,
  validate,
  createBarber
);

router.get(
  "/",
  protect,
  authorize("ADMIN"),
  getAllBarbers
);
router.get(
  "/dashboard",
  protect,
  authorize("BARBER"),
  getBarberDashboard
);
router.get(
  "/:id",
  protect,
  validateObjectId("id"),
  ownership,
  getBarberById
);

router.put(
  "/:id",
  protect,
  authorize("ADMIN"),
  validateObjectId("id"),
  updateBarberValidation,
  validate,
  updateBarber
);

router.delete(
  "/:id",
  protect,
  authorize("ADMIN"),
  validateObjectId("id"),
  deleteBarber
);

router.delete(
  "/:id/permanent",
  protect,
  authorize("ADMIN"),
  validateObjectId("id"),
  permanentlyDeleteBarber
);

router.patch(
  "/:id/reactivate",
  protect,
  authorize("ADMIN"),
  validateObjectId("id"),
  reactivateBarber
);

router.patch(
  "/:id/status",
  protect,
  authorize("ADMIN", "BARBER"),
  validateObjectId("id"),
  updateStatusValidation,
  validate,
  ownership,
  updateStatus
);

module.exports = router;