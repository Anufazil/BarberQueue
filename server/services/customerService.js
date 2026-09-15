const Barber = require("../models/Barber");
const Queue = require("../models/Queue");

const {
  calculateAverageServiceTime,
} = require("../utils/queueUtils");

const getCustomerHome = async () => {

  const barbers = await Barber.find({
    isActive: true,
  })
    .populate("user", "name")
    .sort({ chairNumber: 1 });

  const result = [];

  for (const barber of barbers) {

    const currentCustomer =
      await Queue.findOne({
        barber: barber._id,
        status: "SERVING",
      }).select(
        "tokenNumber -_id"
      );

    const waitingCustomers =
      await Queue.countDocuments({
        barber: barber._id,
        status: "WAITING",
      });

    const average =
      await calculateAverageServiceTime(
        barber._id
      );

    result.push({

      _id: barber._id,

      displayName: barber.displayName,

      chairNumber: barber.chairNumber,

      specialization:
        barber.specialization,

      experience:
        barber.experience,

      status: barber.status,

      queueLength:
        waitingCustomers,

      currentCustomer,

      estimatedWait:
        (waitingCustomers + (currentCustomer ? 1 : 0)) * average,

    });

  }

  return {
    barbers: result,
  };

};

module.exports = {
  getCustomerHome,
};