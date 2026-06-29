import { Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import User from '../models/user.model';
import { AuthRequest } from '../types/auth.types';
import AppError from '../utils/AppError';
import { asyncHandler } from './error.middleware';

export const protect = asyncHandler(
  async (req: AuthRequest, _res: Response, next: NextFunction) => {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      throw new AppError('Access denied. No token provided.', 401);
    }

    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user) {
      throw new AppError('User belonging to this token no longer exists.', 401);
    }

    req.user = user;
    next();
  }
);