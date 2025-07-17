import { AppError } from "../errors/AppError";

export const errorHandler = (err: Error, req: any, res: any, next: any) => {
  if (err instanceof AppError) {
    // Handle operational errors
    return res.status(err.statusCode).json({
      status: "error",
      statusCode: err.statusCode,
      message: err.message,
    });
  }

  // Handle unexpected errors
  console.error("Unexpected error:", err);
  return res.status(500).json({
    status: "error",
    statusCode: 500,
    message: "Internal Server Error",
  });
};
