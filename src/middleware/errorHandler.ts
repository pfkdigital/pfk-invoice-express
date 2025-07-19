import { AppError } from '../errors/AppError';
import { PrismaError } from '../errors/PrismaError';
import { ValidationError } from '../errors/ValidationError';

export const errorHandlerMiddleWare = (
  err: Error,
  req: any,
  res: any,
  next: any,
) => {
  if (err instanceof AppError) {
    // Handle operational errors
    return res.status(err.statusCode).json({
      status: 'error',
      statusCode: err.statusCode,
      message: err.message,
    });
  }

  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      message: 'validation error',
      statusCode: err.statusCode,
      errors: [...err.errors],
    });
  }

  if (err instanceof PrismaError) {
    return res.status(err.statusCode).json({
      code: err.code,
      statusCode: err.statusCode,
      message: err.message,
      description: 'prisma-error',
    });
  }

  // Handle unexpected errors
  console.error('Unexpected error:', err);
  return res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: 'Internal Server Error',
  });
};
