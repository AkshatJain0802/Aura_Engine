function validateBody(schema) {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const firstIssueMessage = parsed.error.issues?.[0]?.message;
      const error = new Error('Validation failed');
      error.statusCode = 400;
      if (firstIssueMessage) {
        error.message = firstIssueMessage;
      }
      error.details = parsed.error.flatten();
      return next(error);
    }

    req.body = parsed.data;
    next();
  };
}

module.exports = { validateBody };
