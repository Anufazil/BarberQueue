require('dotenv').config();
const mongoose = require('mongoose');
const http = require('node:http');
async function start() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || process.env.JWT_SECRET.includes('replace')) throw new Error('Set a random JWT_SECRET of at least 32 characters.');
  if (process.env.NODE_ENV === 'production' && !process.env.CLIENT_URL) throw new Error('CLIENT_URL is required in production.');
  await require('./config/db')();
  for (const model of [require('./models/User'), require('./models/Barber'), require('./models/Queue')]) await model.init();
  const server = http.createServer(require('./app'));
  const io = require('./services/socketService').initializeSocket(server);
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(process.env.PORT || 5000, () => {
      server.off('error', reject);
      resolve();
    });
  });
  console.info('BarberQueue API listening.');
  const stop = () => { io.close(); server.close(async () => { await mongoose.disconnect(); process.exit(0); }); };
  process.once('SIGTERM', stop); process.once('SIGINT', stop);
}
start().catch((error) => {
  const message = String(error?.message || 'Unknown startup error')
    .replace(/mongodb(?:\+srv)?:\/\/[^\s]+/gi, '[MongoDB URI]');
  console.error(`Startup failed: ${message}`);
  process.exit(1);
});
