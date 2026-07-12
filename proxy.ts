import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

const protectedPaths = ["/admin/dashboard", "/admin/certificates", "/admin/workshops", "/admin/messages"];
const authPaths = ["/admin/login"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply to /admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin_token")?.value;

  // If trying to access login while already authenticated, redirect to dashboard
  if (authPaths.includes(pathname)) {
    if (token && verifyToken(token)) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // For protected admin routes, check auth
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!token || !verifyToken(token)) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
