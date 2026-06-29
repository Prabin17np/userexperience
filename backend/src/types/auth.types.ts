import { Request } from 'express';
import { Document, Types } from 'mongoose';

export type UserRole = 'user' | 'admin';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface ForgotPasswordBody {
  email: string;
}

export interface ResetPasswordBody {
  token: string;
  password: string;
}

export interface JwtPayload {
  id: string;
  role: UserRole;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}