import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { hasAdminSessionFromRequest } from "./lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow login page and login API without authentication check
  if (pathname === '/admin-login' || pathname === '/api/admin/login') {
    return NextResponse.next();
  }

  // Protect /admin routes (except login which is now at /admin-login)
  if (pathname.startsWith('/admin') && pathname !== '/admin-login') {
    if (!hasAdminSessionFromRequest(req)) {
      const loginUrl = new URL('/admin-login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname + req.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect /api/admin routes (except login)
  if (pathname.startsWith('/api/admin') && pathname !== '/api/admin/login') {
    if (!hasAdminSessionFromRequest(req)) {
      return NextResponse.json(
        { ok: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/admin-login',
    '/api/admin/:path*'
  ],
};
