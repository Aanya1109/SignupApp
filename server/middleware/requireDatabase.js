const mongoose = require('mongoose');

// If MongoDB is disconnected, answer with 503 instead of hanging or lying.
module.exports = function requireDatabase(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'The database is currently unavailable. Please try again later.',
    });
  }
  next();
};
