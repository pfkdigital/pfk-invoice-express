export class PrismaError extends Error {
  [x: string]: any;
  public readonly errorCode: string;
  public readonly statusCode: number;

  constructor(message: string, errorCode: string, statusCode: number) {
    super(message);
    this.errorCode = errorCode;
    this.statusCode = statusCode;
  }
}
