import { Response } from 'express';
import userService from '../services/user.service';
import { AuthRequest } from '../types/auth.types';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../middleware/error.middleware';

export const getProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = await userService.getProfile(req.user!._id.toString());
    sendSuccess(res, 'Profile retrieved successfully.', { user });
  }
);

export const updateProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = await userService.updateProfile(
      req.user!._id.toString(),
      req.body
    );
    sendSuccess(res, 'Profile updated successfully.', { user });
  }
);

export const changePassword = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    await userService.changePassword(req.user!._id.toString(), req.body);
    sendSuccess(res, 'Password changed successfully.');
  }
);