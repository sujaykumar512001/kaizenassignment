/**
 * Global Error Handler Middleware
 * Handles all types of errors and provides consistent error responses
 */

// Custom error classes
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, errors) {
    super(message, 400);
    this.errors = errors;
  }
}

class DatabaseError extends AppError {
  constructor(message) {
    super(message, 500);
  }
}

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const message = 'Validation failed';
    const errors = err.errors.map(error => ({
      field: error.path,
      message: error.message,
      value: error.value
    }));
    error = new ValidationError(message, errors);
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    const message = 'Duplicate field value entered';
    const errors = err.errors.map(error => ({
      field: error.path,
      message: `${error.path} already exists`,
      value: error.value
    }));
    error = new ValidationError(message, errors);
  }

  // Sequelize foreign key constraint error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    const message = 'Referenced record does not exist';
    error = new ValidationError(message);
  }

  // Sequelize database connection error
  if (err.name === 'SequelizeConnectionError') {
    const message = 'Database connection failed';
    error = new DatabaseError(message);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new AppError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new AppError(message, 401);
  }

  // Cast error (MongoDB specific, but keeping for consistency)
  if (err.name === 'CastError') {
    const message = 'Invalid ID format';
    error = new AppError(message, 400);
  }

  // Duplicate key error
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ValidationError(message);
  }

  // Default error response
  const errorResponse = {
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: {
        name: err.name,
        code: err.code
      }
    })
  };

  // Add validation errors if they exist
  if (error.errors) {
    errorResponse.errors = error.errors;
  }

  res.status(error.statusCode || 500).json(errorResponse);
};

// 404 handler for undefined routes
const notFound = (req, res, next) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

// Async error wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  AppError,
  ValidationError,
  DatabaseError,
  errorHandler,
  notFound,
  asyncHandler
}; 