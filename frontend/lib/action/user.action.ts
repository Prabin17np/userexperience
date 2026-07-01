import { authApi } from '../api/auth';

export const getUserProfileAction = async () => {
  return authApi.getProfile();
};

export const updateUserProfileAction = async (payload: {
  name?: string;
  email?: string;
}) => {
  return authApi.updateProfile(payload);
};

export const changeUserPasswordAction = async (
  currentPassword: string,
  newPassword: string
) => {
  return authApi.changePassword(currentPassword, newPassword);
};