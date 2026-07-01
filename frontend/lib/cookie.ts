// ─── CLIENT-SIDE ONLY ─────────────────────────────────────────────────────────
// This file is safe to import anywhere (client components, axios, zustand).
// Never import next/headers here.

export const getAccessToken = (): string | null => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith('accessToken='));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
};

export const getRefreshToken = (): string | null => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith('refreshToken='));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
};

// Called client-side after login (before server action sets httpOnly cookies)
export const setClientTokens = (
  accessToken: string,
  refreshToken: string
): void => {
  if (typeof document === 'undefined') return;
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `accessToken=${encodeURIComponent(accessToken)}; path=/; max-age=${15 * 60}; SameSite=Lax${secure}`;
  document.cookie = `refreshToken=${encodeURIComponent(refreshToken)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax${secure}`;
};

export const clearClientTokens = (): void => {
  if (typeof document === 'undefined') return;
  document.cookie = 'accessToken=; path=/; max-age=0';
  document.cookie = 'refreshToken=; path=/; max-age=0';
};