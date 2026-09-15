const express = require("express");

const router = express.Router();

const {
  getCustomerHome,
} = require("../controllers/customerController");

router.get(
  "/home",
  getCustomerHome
);

module.exports = router;