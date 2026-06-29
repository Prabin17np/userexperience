import User from '../models/user.model';
import { IUser } from '../types/auth.types';
import AppError from '../utils/AppError';

interface UpdateProfileBody {
  name?: string;
  email?: string;
}

interface ChangePasswordBody {
  currentPassword: string;
  newPassword: string;
}

class UserService {
  async getProfile(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found.', 404);
    return user;
  }

  async updateProfile(
    userId: string,
    body: UpdateProfileBody
  ): Promise<IUser> {
    const { name, email } = body;

    if (email) {
      const existing = await User.findOne({ email, _id: { $ne: userId } });
      if (existing) {
        throw new AppError('Email is already in use by another account.', 409);
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true }
    );

    if (!user) throw new AppError('User not found.', 404);
    return user;
  }

  async changePassword(
    userId: string,
    body: ChangePasswordBody
  ): Promise<void> {
    const { currentPassword, newPassword } = body;

    const user = await User.findById(userId).select('+password');
    if (!user) throw new AppError('User not found.', 404);

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new AppError('Current password is incorrect.', 400);
    }

    user.password = newPassword;
    await user.save();
  }
}

export default new UserService();