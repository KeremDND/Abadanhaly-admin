import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const COOKIE_NAME = 'ah_admin';
const COOKIE_VALUE = '1';
const MAX_AGE = 12 * 60 * 60; // 12 hours

/**
 * Simple password-based authentication
 * Validates password against ADMIN_PASSWORD env var
 */
export function validateAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error('ADMIN_PASSWORD env variable not set');
    return false;
  }
  return password === adminPassword;
}

/**
 * Check if user has admin session cookie
 */
export async function hasAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  return session?.value === COOKIE_VALUE;
}

/**
 * Check if request has admin session (for middleware/API routes)
 */
export function hasAdminSessionFromRequest(request: NextRequest): boolean {
  const session = request.cookies.get(COOKIE_NAME);
  return session?.value === COOKIE_VALUE;
}

/**
 * Set admin session cookie (httpOnly, SameSite=Lax)
 */
export async function setAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, COOKIE_VALUE, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: MAX_AGE,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
}

/**
 * Clear admin session cookie
 */
export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Create cookie header for Response (for API routes)
 */
export function createAdminCookieHeader(): string {
  const secure = process.env.NODE_ENV === 'production' ? 'Secure;' : '';
  return `${COOKIE_NAME}=${COOKIE_VALUE}; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}; Path=/; ${secure}`;
}

/**
 * Create delete cookie header for Response
 */
export function createDeleteCookieHeader(): string {
  return `${COOKIE_NAME}=; HttpOnly; SameSite=Lax; Max-Age=0; Path=/;`;
}
