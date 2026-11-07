const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for developers
  if (process.env.NODE_ENV !== 'test') {
    console.error('[API Error]:', err);
  }

  // Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = { statusCode: 404, message };
  }

  // Mongoose Duplicate Key (11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate value entered for ${field}. Please use another value.`;
    error = { statusCode: 400, message };
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = { statusCode: 400, message: message.join(', ') };
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    error = { statusCode: 401, message: 'Invalid authentication token' };
  }
  if (err.name === 'TokenExpiredError') {
    error = { statusCode: 401, message: 'Authentication token has expired' };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error occurred',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
