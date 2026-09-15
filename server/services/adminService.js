const User = require("../models/User");
const Barber = require("../models/Barber");
const Queue = require("../models/Queue");

const {
  calculateAverageServiceTime,
} = require("../utils/queueUtils");

const getDashboard = async () => {

  // -------------------------
  // Overview
  // -------------------------

  const totalUsers = await User.countDocuments();

  const totalBarbers = await Barber.countDocuments();

  const activeBarbers = await Barber.countDocuments({
    isActive: true,
  });

  const availableBarbers = await Barber.countDocuments({
    status: "AVAILABLE",
  });

  const occupiedBarbers = await Barber.countDocuments({
    status: "BUSY",
  });

  // -------------------------
  // Queue
  // -------------------------

  const waiting = await Queue.countDocuments({
    status: "WAITING",
  });

  const serving = await Queue.countDocuments({
    status: "SERVING",
  });

  const completed = await Queue.countDocuments({
    status: "COMPLETED",
  });

  const cancelled = await Queue.countDocuments({
    status: "CANCELLED",
  });

  // -------------------------
  // Analytics
  // -------------------------

  const averageServiceTime =
    await calculateAverageServiceTime();

  const occupancyRate =
    totalBarbers === 0
      ? 0
      : Number(
          ((occupiedBarbers / totalBarbers) * 100).toFixed(1)
        );

  const completionRate =
    completed + cancelled === 0
      ? 0
      : Number(
          (
            (completed / (completed + cancelled)) *
            100
          ).toFixed(1)
        );

  // -------------------------
  // Recent Customers
  // -------------------------

  const recentCustomers =
    await Queue.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select(
        "customerName tokenNumber status createdAt barber"
      )
      .populate("barber", "displayName");

  // -------------------------
  // Recent Barbers
  // -------------------------

  const recentBarbers =
    await Barber.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate(
        "user",
        "name email"
      );

  return {

    overview: {
      totalUsers,
      totalBarbers,
      activeBarbers,
      availableBarbers,
      occupiedBarbers,
    },

    queue: {
      waiting,
      serving,
      completed,
      cancelled,
    },

    analytics: {
      averageServiceTime,
      occupancyRate,
      completionRate,
    },

    recentCustomers,

    recentBarbers,

  };

};

const getStatistics = async () => {

  // -------------------------
  // Today's Date
  // -------------------------

  const today = new Date();

  today.setUTCHours(0, 0, 0, 0);

  // -------------------------
  // Today's Statistics
  // -------------------------

  const joinedToday =
    await Queue.countDocuments({
      createdAt: {
        $gte: today,
      },
    });

  const completedToday =
    await Queue.countDocuments({
      status: "COMPLETED",
      completedAt: {
        $gte: today,
      },
    });

  const cancelledToday =
    await Queue.countDocuments({
      status: "CANCELLED",
      updatedAt: {
        $gte: today,
      },
    });

  // -------------------------
  // Queue Status
  // -------------------------

  const waiting =
    await Queue.countDocuments({
      status: "WAITING",
    });

  const serving =
    await Queue.countDocuments({
      status: "SERVING",
    });

  const completed =
    await Queue.countDocuments({
      status: "COMPLETED",
    });

  const cancelled =
    await Queue.countDocuments({
      status: "CANCELLED",
    });

  // -------------------------
  // Barbers
  // -------------------------

  const totalBarbers =
    await Barber.countDocuments();

  const occupiedBarbers =
    await Barber.countDocuments({
      status: "BUSY",
    });

  // -------------------------
  // Performance
  // -------------------------

  const averageServiceTime =
    await calculateAverageServiceTime();

  const occupancyRate =
    totalBarbers === 0
      ? 0
      : Number(
          (
            (occupiedBarbers / totalBarbers) *
            100
          ).toFixed(1)
        );

  const completionRate =
    completed + cancelled === 0
      ? 0
      : Number(
          (
            (completed /
              (completed + cancelled)) *
            100
          ).toFixed(1)
        );

  return {

    today: {

      joined: joinedToday,

      completed: completedToday,

      cancelled: cancelledToday,

    },

    queueStatus: {

      waiting,

      serving,

      completed,

      cancelled,

    },

    performance: {

      averageServiceTime,

      occupancyRate,

      completionRate,

    },

  };

};

module.exports = {
  getDashboard,
  getStatistics,
};
