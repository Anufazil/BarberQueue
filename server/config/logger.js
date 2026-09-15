const morgan = require('morgan');
// Never log URLs: queue access credentials appear in status paths.
module.exports = () => morgan(':method :status :response-time ms');
