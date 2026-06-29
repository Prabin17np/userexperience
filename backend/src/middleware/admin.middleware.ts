import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/auth.types';
import AppError from '../utils/AppError';

export const requireAdmin = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    throw new AppError('Authentication required.', 401);
  }

  if (req.user.role !== 'admin') {
    throw new AppError(
      'Access forbidden. Admin privileges required.',
      403
    );
  }

  next();
};