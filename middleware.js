import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthPage = pathname === "/admin/auth";

  // if trying to access admin (not auth page) without token → redirect to login
  if (isAdminRoute && !isAuthPage && !token) {
    return NextResponse.redirect(new URL("/admin/auth", request.url));
  }

  // if already logged in and trying to access auth page → redirect to admin
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};