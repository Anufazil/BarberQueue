const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validationMiddleware");
const validateObjectId = require("../middleware/validateObjectId");
const verifyBarberOwnership = require("../middleware/barberOwnership");
const { queueJoinLimiter } = require("../middleware/rateLimiter");


const {
  joinQueueValidation,
} = require("../validations/queueValidation");

const {
  joinQueue,
  getQueueByBarber,
  getQueueSummary,
  getQueueAnalytics,
  getQueueStatus,
  callNextCustomer,
  finishCurrentCustomer,
  skipCustomer,
  cancelQueue,
} = require("../controllers/queueController");

/**
 * @swagger
 * /api/queue/join:
 *   post:
 *     summary: Join a barber's queue
 *     tags:
 *       - Queue
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - barberId
 *               - customerName
 *               - phone
 *             properties:
 *               barberId:
 *                 type: string
 *               customerName:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Customer joined queue
 *       404:
 *         description: Barber not found
 */

// Customer
router.post(
  "/join",
  queueJoinLimiter,
  joinQueueValidation,
  validate,
  joinQueue
);

/**
 * @swagger
 * /api/queue/{barberId}:
 *   get:
 *     summary: Get queue by barber
 *     tags:
 *       - Queue
 *     parameters:
 *       - in: path
 *         name: barberId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Queue fetched successfully
 */

// View Queue
router.get(
  "/:barberId",
  protect,
  authorize("ADMIN", "BARBER"),
  validateObjectId("barberId"),
  verifyBarberOwnership,
  getQueueByBarber
);
router.get(
  "/:barberId/summary",
  protect,
  authorize("ADMIN", "BARBER"),
  validateObjectId("barberId"),
  verifyBarberOwnership,
  getQueueSummary
);
router.get(
  "/:barberId/analytics",
  protect,
  authorize("ADMIN", "BARBER"),
  validateObjectId("barberId"),
  verifyBarberOwnership,
  getQueueAnalytics
);


/**
 * @swagger
 * /api/queue/status/{token}:
 *   get:
 *     summary: Get queue status using token number
 *     tags:
 *       - Queue
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: integer
 *         description: Queue token number
 *     responses:
 *       200:
 *         description: Queue status fetched successfully
 *       400:
 *         description: Invalid token
 *       404:
 *         description: Queue entry not found
 */
// Queue Status
router.get('/status/:token', getQueueStatus);
router.patch('/public/cancel', require('../utils/asyncHandler')(async (req, res) => {
  const result = await require('../services/queueService').cancelPublicQueue(req.body?.accessToken);
  res.json({ success: true, ...result });
}));

// Queue Operations (Protected)
router.patch(
  "/:barberId/next",
  protect,
  authorize("ADMIN", "BARBER"),
  validateObjectId("barberId"),
  verifyBarberOwnership,
  callNextCustomer
);

router.patch(
  "/:barberId/finish",
  protect,
  authorize("ADMIN", "BARBER"),
  validateObjectId("barberId"),
  verifyBarberOwnership,
  finishCurrentCustomer
);

router.patch(
  "/skip/:id",
  protect,
  authorize("ADMIN", "BARBER"),
  validateObjectId("id"),
  skipCustomer
);

router.patch(
  "/cancel/:id",
  protect,
  authorize("ADMIN", "BARBER"),
  validateObjectId("id"),
  cancelQueue
);

module.exports = router;