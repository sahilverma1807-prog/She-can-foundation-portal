function errorHandler(error, req, res, next) {
  const statusCode = error.status || 500;

  res.status(statusCode).json({
    error: error.message || 'Internal Server Error',
  });
}

module.exports = errorHandler;
