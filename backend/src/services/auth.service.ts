import User from '../models/user.model';
import {
  RegisterBody,
  LoginBody,
  ForgotPasswordBody,
  ResetPasswordBody,
  TokenPair,
  IUser,
} from '../types/auth.types';
import {
  generateTokenPair,
  verifyRefreshToken,
} from '../utils/jwt';
import { generateResetToken, hashToken } from '../utils/password';
import { sendEmail } from '../utils/email';
import AppError from '../utils/AppError';

class AuthService {
  async register(body: RegisterBody): Promise<{ user: IUser; tokens: TokenPair }> {
    const { name, email, password } = body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('An account with this email already exists.', 409);
    }

    const user = await User.create({ name, email, password });

    const tokens = generateTokenPair({ id: user._id.toString(), role: user.role });

    // Store refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save({ validateBeforeSave: false });

    return { user, tokens };
  }

  async login(body: LoginBody): Promise<{ user: IUser; tokens: TokenPair }> {
    const { email, password } = body;

    const user = await User.findOne({ email }).select('+password +refreshToken');
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password.', 401);
    }

    const tokens = generateTokenPair({ id: user._id.toString(), role: user.role });

    user.refreshToken = tokens.refreshToken;
    await user.save({ validateBeforeSave: false });

    return { user, tokens };
  }

  async refreshTokens(token: string): Promise<TokenPair> {
    const decoded = verifyRefreshToken(token);

    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== token) {
      throw new AppError('Invalid or expired refresh token.', 401);
    }

    const tokens = generateTokenPair({ id: user._id.toString(), role: user.role });

    user.refreshToken = tokens.refreshToken;
    await user.save({ validateBeforeSave: false });

    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { refreshToken: undefined });
  }

  async forgotPassword(body: ForgotPasswordBody): Promise<void> {
    const { email } = body;

    const user = await User.findOne({ email });
    if (!user) {
      // Silent return — prevents email enumeration
      return;
    }

    const { token, hashedToken } = generateResetToken();

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await sendEmail(
      user.email,
      'Password Reset Request',
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hello ${user.name},</h2>
          <p>You requested a password reset. Click the button below to reset your password.</p>
          <p>This link is valid for <strong>10 minutes</strong>.</p>
          
            href="${resetUrl}"
            style="
              display: inline-block;
              background-color: #4F46E5;
              color: white;
              padding: 12px 24px;
              border-radius: 6px;
              text-decoration: none;
              margin: 16px 0;
            "
          >
            Reset Password
          </a>
          <p>If you did not request this, please ignore this email. Your password will remain unchanged.</p>
        </div>
      `
    );
  }

  async resetPassword(body: ResetPasswordBody): Promise<{ user: IUser; tokens: TokenPair }> {
    const { token, password } = body;

    const hashedToken = hashToken(token);

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) {
      throw new AppError('Password reset token is invalid or has expired.', 400);
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const tokens = generateTokenPair({ id: user._id.toString(), role: user.role });

    user.refreshToken = tokens.refreshToken;
    await user.save({ validateBeforeSave: false });

    return { user, tokens };
  }
}

export default new AuthService();