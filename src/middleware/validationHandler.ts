// src/middlewares/validate.ts
import { ZodType, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { HttpStatus } from '../enum/http-status.enum';

export const validationHandler =
  (schema: ZodType<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body); // mutate validated body
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const message = err.issues
          .map((e) => `${e.path.join('.')}: ${e.message}`)
          .join(', ');
        return next(
          new AppError(`Validation error: ${message}`, HttpStatus.BAD_REQUEST),
        );
      }
      next(err);
    }
  };
