import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  handleRegister,
  handleLogin,
  handleLogout,
  handleRequestPasswordReset,
  handleResetPassword,
  handleGetProfile,
  handleUpdateProfile,
  handleChangePassword,
} from '@/lib/action/auth.action';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  hasHydrated: boolean;

  register: (payload: { name: string; email: string; password: string }) => Promise<void>;
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<string>;
  resetPassword: (token: string, password: string) => Promise<void>;
  getProfile: () => Promise<void>;
  updateProfile: (payload: { name?: string; email?: string }) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;

  clearError: () => void;
  setUser: (user: User) => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      hasHydrated: false,

   
      // REGISTER
      register: async (payload) => {
        set({ isLoading: true, error: null });

        try {
          const res = await handleRegister(payload);

          if (!res.success) throw new Error(res.message);

          set({
            user: res.data as User,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err) {
          const message = extractError(err);
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },
      // LOGIN
      login: async (payload) => {
        set({ isLoading: true, error: null });

        try {
          const res = await handleLogin(payload);

          if (!res.success) throw new Error(res.message);

          set({
            user: res.data as User,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err) {
          const message = extractError(err);
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },
      // LOGOUT
      logout: async () => {
        set({ isLoading: true });

        try {
          await handleLogout();
        } catch {
          // ignore errors, still clear state
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },
      // FORGOT PASSWORD
      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });

        try {
          const res = await handleRequestPasswordReset(email);

          if (!res.success) throw new Error(res.message);

          set({ isLoading: false });
          return res.message;
        } catch (err) {
          const message = extractError(err);
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },
      // RESET PASSWORD
      resetPassword: async (token, password) => {
        set({ isLoading: true, error: null });

        try {
          const res = await handleResetPassword(token, password);

          if (!res.success) throw new Error(res.message);

          set({
            user: res.data as User,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err) {
          const message = extractError(err);
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },
      // PROFILE
      getProfile: async () => {
        set({ isLoading: true, error: null });

        try {
          const res = await handleGetProfile();

          if (!res.success) throw new Error(res.message);

          set({
            user: res.data as User,
            isLoading: false,
          });
        } catch (err) {
          set({
            error: extractError(err),
            isLoading: false,
          });
        }
      },

      updateProfile: async (payload) => {
        set({ isLoading: true, error: null });

        try {
          const res = await handleUpdateProfile(payload);

          if (!res.success) throw new Error(res.message);

          set({
            user: res.data as User,
            isLoading: false,
          });
        } catch (err) {
          const message = extractError(err);
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },
      // CHANGE PASSWORD
      changePassword: async (currentPassword, newPassword) => {
        set({ isLoading: true, error: null });

        try {
          const res = await handleChangePassword(currentPassword, newPassword);

          if (!res.success) throw new Error(res.message);

          set({ isLoading: false });
        } catch (err) {
          const message = extractError(err);
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },

      clearError: () => set({ error: null }),

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'solely-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
// ERROR PARSER
const extractError = (err: unknown): string => {
  if (
    err &&
    typeof err === 'object' &&
    'response' in err &&
    (err as any).response?.data?.message
  ) {
    return (err as any).response.data.message;
  }

  if (err instanceof Error) return err.message;

  return 'Something went wrong';
};