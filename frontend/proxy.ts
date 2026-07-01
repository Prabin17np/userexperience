import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

const publicRoutes = [
  "/login",
  "/register",
  "/forgot_password",
  "/reset-password",
];

const adminRoutes = ["/admin"];
const userRoutes  = ["/user"];

interface JwtPayload {
  id: string;
  role: "user" | "admin";
  exp: number;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read token from cookie
  const token = request.cookies.get("accessToken")?.value ?? null;

  const isPublicRoute = publicRoutes.some((r) => pathname.startsWith(r));
  const isAdminRoute  = adminRoutes.some((r)  => pathname.startsWith(r));
  const isUserRoute   = userRoutes.some((r)   => pathname.startsWith(r));

  // ─── No token ───────────────────────────────────────────────────────────────
  if (!token) {
    // Allow public routes
    if (isPublicRoute) return NextResponse.next();
    // Redirect protected routes to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ─── Has token — decode to get role ─────────────────────────────────────────
  let role: "user" | "admin" | null = null;
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    // Check token expiry
    if (decoded.exp * 1000 < Date.now()) {
      // Token expired — clear and redirect to login
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return response;
    }
    role = decoded.role;
  } catch {
    // Invalid token — redirect to login
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }

  // ─── Role-based protection ───────────────────────────────────────────────────
  if (isAdminRoute && role !== "admin") {
    // Non-admin trying to access admin — redirect to home
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isUserRoute && role !== "user" && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ─── Logged-in user trying to access public routes ───────────────────────────
  if (isPublicRoute && token) {
    // Redirect to appropriate dashboard
    if (role === "admin") return NextResponse.redirect(new URL("/admin", request.url));
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/user/:path*",
    "/login",
    "/register",
    "/forgot_password",
    "/reset-password",
  ],
};