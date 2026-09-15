module.exports = (err, req, res, next) => {
  if (res.headersSent) return next(err);
  let status = err.statusCode || err.status || 500;
  let message = err.message;
  if (err.code === 11000) { status = 409; message = 'This email, chair or active queue entry already exists.'; }
  if (err.name === 'ValidationError' || err.name === 'CastError') { status = 400; message = 'Invalid request data.'; }
  if (status >= 500) { console.error('Request failed:', err.name); message = 'Internal server error.'; }
  res.status(status).json({ success: false, message });
};
