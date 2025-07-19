// src/middleware/errorHandler.ts
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
  PrismaClientInitializationError,
  PrismaClientRustPanicError,
} from '@prisma/client/runtime/library';
import { Request, Response, NextFunction } from 'express';
import { PrismaError } from '../errors/PrismaError';
import { HttpStatus } from '../enum/http-status.enum';

export const prismaErrorHandler = (err: any) => {
  if (err instanceof PrismaClientKnownRequestError) {
    let statusCode = HttpStatus.BAD_REQUEST;
    let message = err.message;

    switch (err.code) {
      case 'P2002':
        statusCode = HttpStatus.CONFLICT;
        message = 'Unique constraint failed';
        break;
      case 'P2003':
        statusCode = HttpStatus.BAD_REQUEST;
        message = 'Foreign key constraint failed';
        break;
      case 'P2004':
        statusCode = HttpStatus.BAD_REQUEST;
        message = 'Constraint failed on the database';
        break;
      case 'P2025':
        statusCode = HttpStatus.NOT_FOUND;
        message = 'Record not found';
        break;
      default:
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'An unknown database error occurred';
    }

    // ✅ Throw for global error handler to catch
    throw new PrismaError(err.code, statusCode, message);
  }

  if (err instanceof PrismaClientValidationError) {
    throw new PrismaError(
      'VALIDATION_ERROR',
      HttpStatus.BAD_REQUEST,
      err.message,
    );
  }

  if (err instanceof PrismaClientInitializationError) {
    throw new PrismaError(
      'INITIALIZATION_ERROR',
      HttpStatus.SERVICE_UNAVAILABLE,
      err.message,
    );
  }

  if (err instanceof PrismaClientRustPanicError) {
    throw new PrismaError(
      'RUST_PANIC',
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Prisma engine panic occurred',
    );
  }

  throw new PrismaError(
    err.code || 'UNKNOWN_ERROR',
    HttpStatus.INTERNAL_SERVER_ERROR,
    `Error performing operation on ${err.meta.modelName}`,
  );
};
