export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const error = {
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  };

  // OpenAI specific errors
  if (err.response?.status === 429) {
    return res.status(429).json({
      message: 'AI service rate limit reached. Please try again in a moment.',
      retryAfter: 60,
    });
  }

  if (err.response?.status === 401) {
    return res.status(500).json({
      message: 'AI service configuration error. Please contact support.',
    });
  }

  // MongoDB errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message),
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid ID format',
    });
  }

  // Default error
  res.status(err.statusCode || 500).json(error);
};