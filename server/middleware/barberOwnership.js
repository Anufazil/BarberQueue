const Barber = require("../models/Barber");

const verifyBarberOwnership = async (req, res, next) => {
  try {
    // Admins can access any barber queue
    if (req.user.role === "ADMIN") {
      return next();
    }

    // Only barber users continue
    if (req.user.role !== "BARBER") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to manage this queue.",
      });
    }

    const barberId = req.params.barberId || req.params.id;

    const barber = await Barber.findById(barberId);

    if (!barber) {
      return res.status(404).json({
        success: false,
        message: "Barber not found.",
      });
    }

    if (barber.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only manage your own queue.",
      });
    }

    next();
  } catch (error) {
    console.error("Barber ownership error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = verifyBarberOwnership;