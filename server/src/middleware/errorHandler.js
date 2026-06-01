function errorHandler(err, _req, res, _next) {
  const statusCode = Number(err.statusCode ?? 500);

  // Mongo duplicate key (e.g. unique SKU)
  if (err && err.code === 11000) {
    return res.status(409).json({ message: 'SKU must be unique' });
  }

  // Mongoose cast errors (invalid ObjectId)
  if (err && err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid id' });
  }

  // Mongoose validation
  if (err && err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  if (statusCode === 400) {
    return res.status(400).json({ message: err.message ?? 'Bad Request', details: err.details });
  }

  res.status(statusCode).json({ message: err.message ?? 'Internal Server Error' });
}

module.exports = { errorHandler };
