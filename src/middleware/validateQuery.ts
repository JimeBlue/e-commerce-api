import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { z } from 'zod';

// validates req.query (e.g. ?categoryId=...) against a zod schema before it reaches the controller
const validateQuery =
  (schema: ZodType): RequestHandler =>
  (req, res, next) => {
    const { data, error, success } = schema.safeParse(req.query);

    if (!success) {
      next(new Error(z.prettifyError(error), { cause: { status: 400 } }));
      return;
    }

    // Express 5 made req.query a getter-only property — can't reassign it directly, must redefine it
    Object.defineProperty(req, 'query', { value: data, writable: true, configurable: true, enumerable: true });
    next();
  };

export default validateQuery;
