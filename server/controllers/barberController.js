const mongoose = require('mongoose');
const User = require('../models/User');
const Barber = require('../models/Barber');
const Queue = require('../models/Queue');
const bcrypt = require('bcrypt');
const asyncHandler = require('../utils/asyncHandler');
const fail = require('../utils/httpError');
const { withBarber } = require('../services/transactionService');
const { emitStatusUpdate, disconnectUser } = require('../services/socketService');
const announce = barber => emitStatusUpdate({ barberId: String(barber._id), status: barber.status });
exports.createBarber = asyncHandler(async (req, res) => {
  const { name, email, password, displayName, chairNumber, phone, experience, specialization } = req.body;
  const hashed = await bcrypt.hash(password, 12);
  const barber = await mongoose.connection.transaction(async session => {
    const [user] = await User.create([{ name, email, password: hashed, role: 'BARBER' }], { session });
    const [profile] = await Barber.create([{ user: user._id, displayName, chairNumber, phone, experience, specialization }], { session });
    return profile;
  });
  announce(barber);
  res.status(201).json({ success: true, message: 'Barber created successfully.', barber });
});
exports.getAllBarbers = asyncHandler(async (req, res) => {
  const barbers = await Barber.find().populate('user', 'name email role').sort({ chairNumber: 1 });
  res.json({ success: true, count: barbers.length, barbers });
});
exports.getBarberById = asyncHandler(async (req, res) => {
  const barber = await Barber.findById(req.params.id).populate('user', 'name email role');
  if (!barber) throw fail(404, 'Barber not found.');
  res.json({ success: true, barber });
});
exports.updateBarber = asyncHandler(async (req, res) => {
  const barber = await withBarber(req.params.id, async (barber, session) => {
    if (req.body.isActive === false && await Queue.exists({ barber: barber._id, status: { $in: ['WAITING','SERVING'] } }).session(session)) throw fail(409, 'Finish or cancel active queue entries before deactivation.');
    for (const key of ['displayName','chairNumber','phone','experience','specialization','isActive']) {
      if (req.body[key] !== undefined) barber[key] = req.body[key];
    }
    if (!barber.isActive) barber.status = 'OFFLINE';
    await barber.save({ session }); return barber;
  });
  if (!barber.isActive) disconnectUser(barber.user);
  announce(barber);
  res.json({ success: true, message: 'Barber updated successfully.', barber });
});
// Preserve queue history and its references by deactivating rather than hard deleting.
exports.deleteBarber = asyncHandler(async (req, res) => {
  const barber = await withBarber(req.params.id, async (barber, session) => {
    if (
      await Queue.exists({
        barber: barber._id,
        status: { $in: ["WAITING", "SERVING"] },
      }).session(session)
    ) {
      throw fail(
        409,
        "Finish or cancel active queue entries before deactivation."
      );
    }

    barber.isActive = false;
    barber.status = "OFFLINE";

    await barber.save({ session });

    return barber;
  });

  disconnectUser(barber.user);
  announce(barber);

  res.json({
    success: true,
    message: "Barber deactivated. Queue history retained.",
  });
});
exports.permanentlyDeleteBarber = asyncHandler(async (req, res) => {
  const result = await mongoose.connection.transaction(async (session) => {
    const barber = await Barber.findById(req.params.id).session(session);

    if (!barber) {
      throw fail(404, "Barber not found.");
    }

    const hasQueueHistory = await Queue.exists({
      barber: barber._id,
    }).session(session);

    if (hasQueueHistory) {
      throw fail(
        409,
        "This barber has queue history and cannot be permanently deleted. Deactivate the barber instead."
      );
    }

    const userId = barber.user;

    await Barber.deleteOne(
      { _id: barber._id },
      { session }
    );

    await User.deleteOne(
      { _id: userId },
      { session }
    );

    return {
      barberId: barber._id,
      userId,
    };
  });

  disconnectUser(result.userId);
  
  res.json({
    success: true,
    message: "Barber permanently deleted.",
  });
});
exports.reactivateBarber = asyncHandler(async (req, res) => {
  const barber = await withBarber(req.params.id, async (barber, session) => {
    if (barber.isActive) {
      throw fail(409, "Barber is already active.");
    }

    barber.isActive = true;
    barber.status = "AVAILABLE";

    await barber.save({ session });

    return barber;
  });

  announce(barber);

  res.json({
    success: true,
    message: "Barber reactivated successfully.",
    barber,
  });
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const barber = await withBarber(req.params.id, async (barber, session) => {
    if (!barber.isActive) throw fail(409, 'Reactivate this barber before changing status.');
    const serving = await Queue.exists({ barber: barber._id, status: 'SERVING' }).session(session);
    if (serving && req.body.status !== 'BUSY') throw fail(409, 'Finish or skip the current customer before changing status.');
    barber.status = req.body.status; await barber.save({ session }); return barber;
  });
  announce(barber);
  res.json({ success: true, message: 'Status updated successfully.', barber });
});
exports.getBarberDashboard = asyncHandler(async (req, res) => {
  const data = await require('../services/barberService').getDashboard(req.user.id);
  res.json({ success: true, data });
});
