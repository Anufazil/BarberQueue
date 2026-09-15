const compression = require("compression");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

const securityMiddleware = [
  compression(),
  hpp(),
];

module.exports = {
  apiLimiter,
  securityMiddleware,
};