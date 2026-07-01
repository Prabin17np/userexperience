'use server';

// ─── SERVER ACTIONS ───────────────────────────────────────────────────────────
// These run on the server only.
// They call the backend via authApi (which uses axios — safe because
// server actions don't bundle client interceptors).
// They set/clear httpOnly cookies via cookie.server.ts.

import { authApi, AuthResult } from '@/lib/api/auth';
import { setAuthCookies, clearAuthCookies } from '@/lib/cookie.server';

interface ActionResult<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

//Register
export const handleRegister = async (payload: {
  name: string;
  email: string;
  password: string;
  role?: string;
}): Promise<ActionResult> => {
  try {
    const result = await authApi.register({
      name: payload.name,
      email: payload.email,
      password: payload.password,
    });
    // Don't set cookies on register — user must log in
    return {
      success: true,
      message: 'Account created successfully',
      data: result.user,
    };
  } catch (err) {
    return { success: false, message: extractError(err) };
  }
};

//Login
export const handleLogin = async (payload: {
  email: string;
  password: string;
}): Promise<ActionResult<AuthResult['user']>> => {
  try {
    const result = await authApi.login(payload);

    // Set httpOnly cookies server-side (most secure)
    await setAuthCookies(
      result.tokens.accessToken,
      result.tokens.refreshToken
    );

    return {
      success: true,
      message: 'Login successful',
      data: result.user,
    };
  } catch (err) {
    return { success: false, message: extractError(err) };
  }
};

//Logout
export const handleLogout = async (): Promise<ActionResult> => {
  try {
    await authApi.logout();
  } catch {
    // ignore — clear cookies regardless
  } finally {
    await clearAuthCookies();
  }
  return { success: true, message: 'Logged out successfully' };
};

//Forgot Password
export const handleRequestPasswordReset = async (
  email: string
): Promise<ActionResult> => {
  try {
    const message = await authApi.forgotPassword(email);
    return { success: true, message };
  } catch (err) {
    return { success: false, message: extractError(err) };
  }
};

//Reset Password
export const handleResetPassword = async (
  token: string,
  password: string
): Promise<ActionResult> => {
  try {
    const result = await authApi.resetPassword(token, password);
    await setAuthCookies(
      result.tokens.accessToken,
      result.tokens.refreshToken
    );
    return { success: true, message: 'Password reset successfully' };
  } catch (err) {
    return { success: false, message: extractError(err) };
  }
};

//Get Profile
export const handleGetProfile = async (): Promise<ActionResult> => {
  try {
    const user = await authApi.getProfile();
    return { success: true, message: 'Profile retrieved', data: user };
  } catch (err) {
    return { success: false, message: extractError(err) };
  }
};

//Update Profile
export const handleUpdateProfile = async (payload: {
  name?: string;
  email?: string;
}): Promise<ActionResult> => {
  try {
    const user = await authApi.updateProfile(payload);
    return { success: true, message: 'Profile updated', data: user };
  } catch (err) {
    return { success: false, message: extractError(err) };
  }
};

//Change Password
export const handleChangePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<ActionResult> => {
  try {
    await authApi.changePassword(currentPassword, newPassword);
    return { success: true, message: 'Password changed successfully' };
  } catch (err) {
    return { success: false, message: extractError(err) };
  }
};

//Helper
const extractError = (err: unknown): string => {
  if (
    err &&
    typeof err === 'object' &&
    'response' in err &&
    err.response &&
    typeof err.response === 'object' &&
    'data' in err.response
  ) {
    const d = err.response.data as { message?: string };
    return d.message || 'Something went wrong';
  }
  if (err instanceof Error) return err.message;
  return 'Something went wrong';
};