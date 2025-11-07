import { cookies } from 'next/headers';
import { compare, hash } from 'bcryptjs';
import { prisma } from './prisma';

const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'change-me-in-production';

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword);
}

export async function createSession(adminId: string): Promise<string> {
  const sessionToken = `${adminId}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
  // In production, store sessions in database
  // For now, we'll use a simple cookie-based approach
  return sessionToken;
}

export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return session?.value || null;
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
  });
}

export async function verifySession(sessionToken: string): Promise<boolean> {
  // In production, verify against database
  // For now, simple check if token exists
  return !!sessionToken;
}

