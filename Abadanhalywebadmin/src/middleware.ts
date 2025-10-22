import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const COOKIE = 'abadan_admin';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const isAdminRoute = url.pathname.startsWith('/console') || url.pathname.startsWith('/api/admin');

  if (!isAdminRoute) return NextResponse.next();

  const token = req.cookies.get(COOKIE)?.value;
  if (!token) {
    if (url.pathname.startsWith('/api/admin')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    url.pathname = '/console'; // redirect to lock screen
    return NextResponse.redirect(url);
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next();
  } catch {
    if (url.pathname.startsWith('/api/admin')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    url.pathname = '/console';
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/console/:path*','/api/admin/:path*'],
};