export class AppError extends Error {
  public readonly statusCode: number;
  public readonly message: string;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    // Capture the stack trace for debugging purposes
    Error.captureStackTrace(this);
  }
}
