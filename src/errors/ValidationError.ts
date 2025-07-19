import { HttpStatus } from '../enums/http-status.enum';

export class ValidationError extends Error {
  public readonly statusCode: number;
  public readonly errors: Record<string, string[]>[];

  constructor(
    errors: Record<string, string[]>[],
    statusCode = HttpStatus.BAD_REQUEST,
  ) {
    super('Validation Error');
    this.statusCode = statusCode;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}
