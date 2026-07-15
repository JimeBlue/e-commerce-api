import { type ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // Console log only runs in dev, to avoid spamming production logs or leaking server internals
  process.env.NODE_ENV !== 'production' && console.log(`\x1b[31m${err.stack}\x1b[0m`);

  let statusCode = 500;
  let message = 'Internal server error';

  if (err instanceof Error) {
    if (err.cause && typeof err.cause === 'object' && 'status' in err.cause) {
      statusCode = err.cause.status as number;
    }
    message = err.message;
  }

  res.status(statusCode).json({ message });
};

export default errorHandler;
