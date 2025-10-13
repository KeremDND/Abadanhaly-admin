import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ADMIN_PATH = "/(tk|ru|en)/admin";
const API_PATH = "/api";

// Simple in-memory rate limiter (best-effort; for prod use Redis)
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 60; // per IP per window
const ipHits = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const rec = ipHits.get(ip);
  if (!rec || now - rec.windowStart > WINDOW_MS) {
    ipHits.set(ip, { count: 1, windowStart: now });
    return false;
  }
  rec.count += 1;
  if (rec.count > MAX_REQUESTS) return true;
  return false;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // API rate limiting (skip health)
  if (pathname.startsWith(API_PATH) && pathname !== "/api/health") {
    const ip = req.ip || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return new NextResponse(JSON.stringify({ error: "Rate limit exceeded" }), {
        status: 429,
        headers: { "content-type": "application/json" },
      });
    }
  }

  // Admin auth protection (allow locale-aware login page)
  const loginRegex = new RegExp("^/(tk|ru|en)/admin/login$");
  const adminRegex = new RegExp("^/(tk|ru|en)/admin(?!/login).*");
  if (adminRegex.test(pathname) && !loginRegex.test(pathname)) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const locale = pathname.split("/")[1] || "tk";
      const loginUrl = new URL(`/${locale}/admin/login`, req.url);
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname + req.nextUrl.search);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/tk/admin/:path*", "/ru/admin/:path*", "/en/admin/:path*", "/api/:path*", "/admin"],
};
