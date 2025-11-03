import { NextResponse } from 'next/server';
import { createDeleteCookieHeader } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json({
    ok: true,
    message: 'Logged out successfully'
  });

  response.headers.set('Set-Cookie', createDeleteCookieHeader());

  return response;
}

