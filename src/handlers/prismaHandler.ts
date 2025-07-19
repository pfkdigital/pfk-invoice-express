import { PrismaError } from '../errors/PrismaError';
import { HttpStatus } from '../enums/http-status.enum';

export const prismaErrorHandler = (err: any) => {
  throw new PrismaError(
    `Error performing operation on ${err.meta.modelName}, please check the value of the field: ${err.meta.target.join(',')}`,
    err.code || 'UNKNOWN_ERROR',
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
};
