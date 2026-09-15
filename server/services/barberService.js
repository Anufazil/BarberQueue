const Barber = require("../models/Barber");
const Queue = require("../models/Queue");

const {
  calculateAverageServiceTime,
} = require("../utils/queueUtils");

const getDashboard = async (userId) => {

  const barber = await Barber.findOne({
    user: userId,
  }).populate("user", "name email");

  if (!barber) {
    throw new Error("Barber not found.");
  }

  const currentCustomer = await Queue.findOne({
    barber: barber._id,
    status: "SERVING",
  });

  const waitingQueue = await Queue.find({
    barber: barber._id,
    status: "WAITING",
  }).sort({
    tokenNumber: 1,
  });

  const waiting = waitingQueue.length;
  const serving = currentCustomer ? 1 : 0;

  const today = new Date(); today.setUTCHours(0, 0, 0, 0);
  const completed = await Queue.countDocuments({
    barber: barber._id,
    status: "COMPLETED",
    completedAt: { $gte: today },
  });

  const cancelled = await Queue.countDocuments({
    barber: barber._id,
    status: "CANCELLED",
    updatedAt: { $gte: today },
  });

  const averageServiceTime =
    await calculateAverageServiceTime(barber._id);

  return {
    barber,
    currentCustomer,
    waitingQueue,

    summary: {
      waiting,
      serving,
      completed,
      cancelled,
    },

    analytics: {
      averageServiceTime,
      estimatedWait: (waiting + serving) * averageServiceTime,
    },
  };
};

module.exports = {
  getDashboard,
};