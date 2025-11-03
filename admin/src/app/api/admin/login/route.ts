import { NextRequest, NextResponse } from 'next/server';
import { validateAdminPassword, createAdminCookieHeader } from '@/lib/auth';

// Simple rate limiter (in-memory, reset on restart)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  record.count += 1;
  if (record.count > MAX_ATTEMPTS) {
    return true;
  }

  return false;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.ip || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

    // Rate limiting
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { ok: false, message: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { ok: false, message: 'Password is required' },
        { status: 400 }
      );
    }

    // Validate password
    if (!validateAdminPassword(password)) {
      return NextResponse.json(
        { ok: false, message: 'Invalid password' },
        { status: 401 }
      );
    }

    // Set admin cookie
    const response = NextResponse.json({
      ok: true,
      message: 'Login successful'
    });

    response.headers.set('Set-Cookie', createAdminCookieHeader());

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { ok: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

