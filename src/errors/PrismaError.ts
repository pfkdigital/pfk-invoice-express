export class PrismaError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'prisma-error';
    this.code = code;
    this.statusCode = statusCode;
  }
}
