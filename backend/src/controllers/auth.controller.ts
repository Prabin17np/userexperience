import { Response } from 'express';
import authService from '../services/auth.service';
import { AuthRequest } from '../types/auth.types';
import { sendSuccess, sendCreated } from '../utils/response';
import { asyncHandler } from '../middleware/error.middleware';

export const register = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { user, tokens } = await authService.register(req.body);
    sendCreated(res, 'Registration successful.', { user, tokens });
  }
);

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { user, tokens } = await authService.login(req.body);
  sendSuccess(res, 'Login successful.', { user, tokens });
});

export const refreshToken = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { refreshToken: token } = req.body;
    const tokens = await authService.refreshTokens(token);
    sendSuccess(res, 'Token refreshed successfully.', { tokens });
  }
);

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  await authService.logout(req.user!._id.toString());
  sendSuccess(res, 'Logged out successfully.');
});

export const forgotPassword = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    await authService.forgotPassword(req.body);
    sendSuccess(
      res,
      'If an account with that email exists, a reset link has been sent.'
    );
  }
);

export const resetPassword = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { user, tokens } = await authService.resetPassword(req.body);
    sendSuccess(res, 'Password reset successfully.', { user, tokens });
  }
);