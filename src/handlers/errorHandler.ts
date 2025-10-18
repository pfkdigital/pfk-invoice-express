import { HttpStatus } from '../enums/http-status.enum';
import { AppError } from '../errors/AppError';
import { ClientNotFoundError } from '../errors/ClientNotFoundError';
import { PrismaError } from '../errors/PrismaError';

export const errorHandler = (err: any) => {
  if (err instanceof PrismaError) {
    throw new PrismaError(
      `Error performing operation on ${err.meta.modelName}, please check the value of the field: ${err.meta.target.join(',')}`,
      err.code || 'UNKNOWN_ERROR',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  if (err instanceof ClientNotFoundError) {
    throw new ClientNotFoundError(err.message);
  }

  throw new AppError(
    err.message || 'An unexpected error occurred',
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
};
