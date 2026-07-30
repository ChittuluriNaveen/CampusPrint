import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';

export class AppError extends Error {
  public statusCode: number;
  public errors?: unknown[];

  constructor(message: string, statusCode = 500, errors?: unknown[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';
  const errors = err instanceof AppError ? err.errors || [] : [];

  if (statusCode >= 500) {
    logger.error(`[Unhandled Error] ${err.stack || err.message}`);
  } else {
    logger.warn(`[Client Error] Status ${statusCode}: ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
