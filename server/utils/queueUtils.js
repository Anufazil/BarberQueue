const Queue = require('../models/Queue');
const calculateAverageServiceTime = async (barberId = null) => {
  const query = { status: 'COMPLETED', servedAt: { $type: 'date' }, completedAt: { $type: 'date' } };
  if (barberId) query.barber = barberId;
  const entries = await Queue.find(query).sort({ completedAt: -1 }).limit(100).select('servedAt completedAt');
  if (!entries.length) return 20;
  return Math.max(1, Math.round(entries.reduce((sum, q) => sum + Math.max(0, (q.completedAt - q.servedAt) / 60000), 0) / entries.length));
};
module.exports = { calculateAverageServiceTime, estimateWaitingTime: (position, average) => position * average };
