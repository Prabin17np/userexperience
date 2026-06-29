import { Request, Response, NextFunction, RequestHandler } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError';

// Async handler wrapper — eliminates try/catch boilerplate in controllers
export const asyncHandler = (
  fn: (req: Request | any, res: Response, next: NextFunction) => Promise<void>
): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Map known Mongoose/JWT errors to AppError
const handleCastError = (err: mongoose.Error.CastError): AppError =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleValidationError = (
  err: mongoose.Error.ValidationError
): AppError => {
  const messages = Object.values(err.errors).map((e) => e.message);
  return new AppError(`Validation failed: ${messages.join('. ')}`, 400);
};

const handleDuplicateKeyError = (err: Record<string, unknown>): AppError => {
  const keyValue = err.keyValue as Record<string, string> | undefined;
  const field = keyValue ? Object.keys(keyValue)[0] : 'field';
  return new AppError(
    `Duplicate value for ${field}. Please use a different value.`,
    409
  );
};

const handleJwtError = (): AppError =>
  new AppError('Invalid token. Please log in again.', 401);

const handleJwtExpiredError = (): AppError =>
  new AppError('Your token has expired. Please log in again.', 401);

// Global error handler
export const globalErrorHandler = (
  err: Error | AppError | Record<string, unknown>,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  let error = err as AppError;

  // Normalize known errors
  if (err instanceof mongoose.Error.CastError) {
    error = handleCastError(err);
  } else if (err instanceof mongoose.Error.ValidationError) {
    error = handleValidationError(err);
  } else if ((err as Record<string, unknown>).code === 11000) {
    error = handleDuplicateKeyError(err as Record<string, unknown>);
  } else if (err instanceof jwt.JsonWebTokenError) {
    error = handleJwtError();
  } else if (err instanceof jwt.TokenExpiredError) {
    error = handleJwtExpiredError();
  }

  const statusCode = (error as AppError).statusCode || 500;
  const message = error.message || 'Internal Server Error';

  // Log unexpected server errors
  if (statusCode >= 500) {
    console.error('🔴 Server Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

// 404 handler
export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
};