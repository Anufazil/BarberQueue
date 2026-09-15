const mongoose = require('mongoose');
const Barber = require('../models/Barber');
const fail = require('../utils/httpError');
// Queue and status writes serialize on the barber document; MongoDB retries conflicts.
exports.withBarber = async (id, operation) => mongoose.connection.transaction(async (session) => {
  const barber = await Barber.findOneAndUpdate({ _id: id }, { $inc: { queueRevision: 1 } }, { returnDocument: 'after', session });
  if (!barber) throw fail(404, 'Barber not found.');
  return operation(barber, session);
});
