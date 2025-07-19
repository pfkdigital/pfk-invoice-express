// src/middlewares/validate.ts
import { ZodType, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { HttpStatus } from '../enum/http-status.enum';
import { ValidationError } from '../errors/ValidationError';

export const validationHandler =
  (schema: ZodType<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errorMap = err.issues.reduce(
          (acc, issue) => {
            const field = issue.path.join('.');

            if (!acc[field]) {
              acc[field] = [];
            }

            acc[field].push(issue.message);
            return acc;
          },
          {} as Record<string, string[]>,
        );

        const issues = Object.entries(errorMap).map(([key, value]) => ({
          [key]: value,
        }));

        return next(new ValidationError(issues, HttpStatus.BAD_REQUEST));
      }
      next(err);
    }
  };
