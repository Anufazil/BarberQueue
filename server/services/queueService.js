const crypto = require('node:crypto');
const Queue = require('../models/Queue');
const Barber = require('../models/Barber');
const { withBarber } = require('./transactionService');
const fail = require('../utils/httpError');
const { calculateAverageServiceTime } = require('../utils/queueUtils');
const { emitQueueUpdate, emitStatusUpdate } = require('./socketService');
const active = ['WAITING', 'SERVING'];
const hash = token => crypto.createHash('sha256').update(token).digest('hex');
const tokenFilter = token => {
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) throw fail(400, 'Invalid queue access token.');
  return { accessTokenHash: hash(token) };
};
const notify = (id, event) => {
  emitQueueUpdate(id, { event, barberId: String(id) });
  emitStatusUpdate({ barberId: String(id) });
};
const recalculateQueuePositions = async (barberId, session) => {
  const waiting = await Queue.find({ barber: barberId, status: 'WAITING' }).sort({ tokenNumber: 1 }).session(session || null);
  if (waiting.length) await Queue.bulkWrite(waiting.map((entry, index) => ({ updateOne: {
    filter: { _id: entry._id, status: 'WAITING' }, update: { $set: { queuePosition: index + 1 } }
  } })), { session });
  return waiting;
};
const joinQueue = async ({ barberId, customerName, phone }) => {
  const accessToken = crypto.randomBytes(32).toString('hex');
  const queue = await withBarber(barberId, async (barber, session) => {
    if (!barber.isActive || !['AVAILABLE', 'BUSY'].includes(barber.status)) throw fail(409, 'This barber is not accepting customers.');
    if (await Queue.exists({ phone, status: { $in: active } }).session(session)) throw fail(409, 'This phone already has an active queue entry.');
    const last = await Queue.findOne({ barber: barberId }).sort({ tokenNumber: -1 }).session(session);
    const waiting = await Queue.countDocuments({ barber: barberId, status: 'WAITING' }).session(session);
    const [entry] = await Queue.create([{
      barber: barberId, customerName, phone, tokenNumber: (last?.tokenNumber || 0) + 1,
      queuePosition: waiting + 1, accessTokenHash: hash(accessToken), activePhone: phone
    }], { session });
    return { _id: entry._id, barber: barberId, tokenNumber: entry.tokenNumber,
      queuePosition: entry.queuePosition, status: entry.status, accessToken };
  });
  const status = await getQueueStatus(accessToken);
  notify(barberId, 'CUSTOMER_JOINED');
  return { message: 'Joined queue successfully.', queue, estimatedWait: status.estimatedWait };
};
const callNextCustomer = async barberId => {
  const customer = await withBarber(barberId, async (barber, session) => {
    if (!barber.isActive || !['AVAILABLE', 'BUSY'].includes(barber.status)) throw fail(409, 'Set the barber available before calling a customer.');
    if (await Queue.exists({ barber: barberId, status: 'SERVING' }).session(session)) throw fail(409, 'Finish the current customer first.');
    const entry = await Queue.findOneAndUpdate({ barber: barberId, status: 'WAITING' },
      { $set: { status: 'SERVING', servedAt: new Date(), queuePosition: 0 } },
      { sort: { tokenNumber: 1 }, returnDocument: 'after', session });
    if (!entry) throw fail(409, 'No customers waiting.');
    barber.status = 'BUSY'; await barber.save({ session });
    await recalculateQueuePositions(barberId, session);
    return entry;
  });
  notify(barberId, 'CUSTOMER_CALLED');
  return { message: 'Next customer called.', customer };
};
const transition = async (barberId, filter, status, allowed) => {
  const customer = await withBarber(barberId, async (barber, session) => {
    const entry = await Queue.findOne({ ...filter, barber: barberId }).select('+activePhone').session(session);
    if (!entry) throw fail(404, 'Queue entry not found.');
    if (!allowed.includes(entry.status)) throw fail(409, 'This queue entry can no longer be changed.');
    const wasServing = entry.status === 'SERVING';
    entry.status = status; entry.queuePosition = 0; entry.activePhone = undefined;
    if (status === 'COMPLETED') {
      entry.completedAt = new Date(); entry.serviceDuration = Math.max(0, (entry.completedAt - entry.servedAt) / 60000);
    }
    await entry.save({ session });
    if (wasServing && barber.status === 'BUSY') { barber.status = 'AVAILABLE'; await barber.save({ session }); }
    await recalculateQueuePositions(barberId, session);
    return entry;
  });
  notify(barberId, `CUSTOMER_${status}`);
  return { message: `Customer ${status.toLowerCase()}.`, customer };
};
const finishCurrentCustomer = (id, queueId) => {
  if (typeof queueId !== 'string' || !/^[a-f0-9]{24}$/i.test(queueId)) throw fail(400, 'The current queue entry ID is required.');
  return transition(id, { _id: queueId }, 'COMPLETED', ['SERVING']);
};
const staffTransition = async (id, user, status) => {
  const entry = await Queue.findById(id);
  if (!entry) throw fail(404, 'Queue entry not found.');
  const barber = await Barber.findById(entry.barber);
  if (!barber) throw fail(404, 'Barber not found.');
  if (user.role !== 'ADMIN' && !(user.role === 'BARBER' && String(barber.user) === String(user._id))) throw fail(403, 'You can only manage your own queue.');
  return transition(entry.barber, { _id: id }, status, active);
};
const skipCustomer = (id, user) => staffTransition(id, user, 'SKIPPED');
const cancelQueue = (id, user) => staffTransition(id, user, 'CANCELLED');
const cancelPublicQueue = async token => {
  const filter = tokenFilter(token);
  const entry = await Queue.findOne(filter);
  if (!entry) throw fail(404, 'Queue entry not found.');
  await transition(entry.barber, filter, 'CANCELLED', ['WAITING']);
  return { message: 'Queue cancelled successfully.' };
};
const getQueueStatus = async token => {
  const queue = await Queue.findOne(tokenFilter(token)).populate('barber', 'displayName chairNumber status');
  if (!queue || !queue.barber) throw fail(404, 'Queue entry not found.');
  const currentServing = await Queue.findOne({ barber: queue.barber._id, status: 'SERVING' }).select('tokenNumber -_id');
  const waitingAhead = queue.status === 'WAITING' ? await Queue.countDocuments({
    barber: queue.barber._id, status: 'WAITING', tokenNumber: { $lt: queue.tokenNumber }
  }) : 0;
  const customersAhead = queue.status === 'WAITING' ? waitingAhead + (currentServing ? 1 : 0) : 0;
  const average = await calculateAverageServiceTime(queue.barber._id);
  return { tokenNumber: queue.tokenNumber, status: queue.status,
    queuePosition: queue.status === 'WAITING' ? waitingAhead + 1 : 0,
    customersAhead, estimatedWait: customersAhead * average, barber: queue.barber, currentServing };
};
const getQueueByBarber = async id => {
  const barber = await Barber.findById(id).populate('user', 'name email');
  if (!barber) throw fail(404, 'Barber not found.');
  const currentCustomer = await Queue.findOne({ barber: id, status: 'SERVING' });
  const waitingQueue = await Queue.find({ barber: id, status: 'WAITING' }).sort({ tokenNumber: 1 });
  return { barber, currentCustomer, waitingQueue, waitingCount: waitingQueue.length };
};
const getQueueAnalytics = async id => {
  if (!await Barber.exists({ _id: id })) throw fail(404, 'Barber not found.');
  const analytics = {};
  for (const status of ['WAITING', 'SERVING', 'COMPLETED', 'SKIPPED', 'CANCELLED']) {
    analytics[status.toLowerCase()] = await Queue.countDocuments({ barber: id, status });
  }
  analytics.averageServiceTime = await calculateAverageServiceTime(id);
  analytics.estimatedWait = (analytics.waiting + analytics.serving) * analytics.averageServiceTime;
  return { analytics };
};
const getQueueSummary = async id => ({ summary: (await getQueueAnalytics(id)).analytics });
module.exports = { joinQueue, callNextCustomer, finishCurrentCustomer, skipCustomer, cancelQueue,
  cancelPublicQueue, getQueueStatus, getQueueByBarber, getQueueAnalytics, getQueueSummary, recalculateQueuePositions };
