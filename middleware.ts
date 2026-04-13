import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("daycare_auth_token")?.value;
  const { pathname } = request.nextUrl;

  const requiresAuth =
    pathname.startsWith("/parent") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/bookings") ||
    pathname.startsWith("/children") ||
    pathname.startsWith("/chat") ||
    pathname.startsWith("/reports");

  if (requiresAuth && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/bookings/:path*",
    "/children/:path*",
    "/chat/:path*",
    "/reports/:path*",
    "/parent",
    "/parent/:path*",
  ],
};
