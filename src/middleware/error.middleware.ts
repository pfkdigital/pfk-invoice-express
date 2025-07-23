import { AppError } from '../errors/AppError';
import { ClientNotFoundError } from '../errors/ClientNotFoundError';
import { PrismaError } from '../errors/PrismaError';
import { ValidationError } from '../errors/ValidationError';

export const errorHandlerMiddleWare = (
  err: Error,
  req: any,
  res: any,
  next: any,
) => {
  if (err instanceof AppError) {
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
      prismaErrorCode: err.errorCode,
      statusCode: err.statusCode,
      message: err.message,
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
