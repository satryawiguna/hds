import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger.config";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorMiddleware = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    logger.error("Application Error", {
      statusCode: err.statusCode,
      message: err.message,
      path: req.path,
    });

    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
    return;
  }

  logger.error("Unexpected Error", {
    message: err.message,
    stack: err.stack,
    path: req.path,
  });

  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};
