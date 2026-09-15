const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Barber = require('../models/Barber');
const EVENTS = require('../constants/socketEvents');
let io;
const initializeSocket = server => {
  io = new (require('socket.io').Server)(server, { cors: { origin: require('../config/origins'), credentials: true } });
  io.use(async (socket, next) => {
    try {
      const decoded = jwt.verify(socket.handshake.auth?.token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
      const user = await User.findById(decoded.id);
      if (!user || !['ADMIN', 'BARBER'].includes(user.role)) return next(new Error('Authentication required.'));
      let barber;
      if (user.role === 'BARBER') {
        barber = await Barber.findOne({ user: user._id, isActive: true });
        if (!barber) return next(new Error('Account is inactive.'));
      }
      socket.user = user; socket.barberId = barber?._id; socket.expiresAt = decoded.exp * 1000;
      next();
    } catch { next(new Error('Invalid or expired token.')); }
  });
  io.on('connection', socket => {
    socket.join(`user-${socket.user._id}`);
    if (socket.user.role === 'ADMIN') socket.join('admins');
    else socket.join(`barber-${socket.barberId}`);
    const expiryTimer = setTimeout(() => socket.disconnect(true), Math.max(0, socket.expiresAt - Date.now()));
    expiryTimer.unref();
    socket.on('disconnect', () => clearTimeout(expiryTimer));
    socket.on(EVENTS.JOIN_ADMIN_ROOM, () => { if (socket.user.role === 'ADMIN') socket.join('admins'); });
    socket.on(EVENTS.JOIN_BARBER_ROOM, id => {
      if (typeof id === 'string' && /^[a-f0-9]{24}$/i.test(id) && (socket.user.role === 'ADMIN' || id === String(socket.barberId))) socket.join(`barber-${id}`);
    });
  });
  return io;
};
const emitQueueUpdate = (barberId, payload) => {
  if (!io) return;
  const safe = { barberId: String(barberId), event: payload.event };
  io.to(`barber-${barberId}`).to('admins').emit(EVENTS.QUEUE_UPDATED, safe);
  io.to('admins').emit(EVENTS.DASHBOARD_UPDATED, safe);
};
const emitStatusUpdate = payload => {
  if (!io) return;
  const safe = { barberId: String(payload.barberId), status: payload.status };
  io.to(`barber-${payload.barberId}`).to('admins').emit(EVENTS.BARBER_STATUS_CHANGED, safe);
  io.to('admins').emit(EVENTS.DASHBOARD_UPDATED, safe);
};
const disconnectUser = id => io?.in(`user-${id}`).disconnectSockets(true);
module.exports = { initializeSocket, emitQueueUpdate, emitStatusUpdate, disconnectUser };
