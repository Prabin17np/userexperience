import { cookies } from "next/headers";

export const setAuthCookies = async (
  accessToken: string,
  refreshToken: string
): Promise<void> => {
  const cookieStore = await cookies();

  cookieStore.set("accessToken", accessToken, {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60,           // 15 min
    path: "/",
  });

  cookieStore.set("refreshToken", refreshToken, {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });
};

export const clearAuthCookies = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
};

export const getAuthToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value ?? null;
};

export const getRefreshToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get("refreshToken")?.value ?? null;
};