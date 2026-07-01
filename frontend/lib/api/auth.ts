// ─── AUTH API ─────────────────────────────────────────────────────────────────
// Client-side API calls only.
// Token storage is handled by Server Actions (cookie.server.ts).
// This file must NOT import next/headers or cookie.server.

import axiosInstance from './axios';
import { ENDPOINTS } from './endpoint';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult {
  user: User;
  tokens: Tokens;
}

export const authApi = {
  //Public (no token needed)
  register: async (payload: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResult> => {
    const { data } = await axiosInstance.post(ENDPOINTS.AUTH.REGISTER, payload);
    return data.data as AuthResult;
  },

  login: async (payload: {
    email: string;
    password: string;
  }): Promise<AuthResult> => {
    const { data } = await axiosInstance.post(ENDPOINTS.AUTH.LOGIN, payload);
    return data.data as AuthResult;
  },

  forgotPassword: async (email: string): Promise<string> => {
    const { data } = await axiosInstance.post(
      ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { email }
    );
    return data.message as string;
  },

  resetPassword: async (
    token: string,
    password: string
  ): Promise<AuthResult> => {
    const { data } = await axiosInstance.post(ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      password,
    });
    return data.data as AuthResult;
  },

  //Protected (token attached by axios interceptor)
  logout: async (): Promise<void> => {
    await axiosInstance.post(ENDPOINTS.AUTH.LOGOUT);
  },

  getProfile: async (): Promise<User> => {
    const { data } = await axiosInstance.get(ENDPOINTS.USER.ME);
    return data.data.user as User;
  },

  updateProfile: async (payload: {
    name?: string;
    email?: string;
  }): Promise<User> => {
    const { data } = await axiosInstance.put(ENDPOINTS.USER.ME, payload);
    return data.data.user as User;
  },

  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    await axiosInstance.put(ENDPOINTS.USER.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
  },
};