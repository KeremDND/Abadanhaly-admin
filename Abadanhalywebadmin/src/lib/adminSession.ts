import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const COOKIE = 'abadan_admin';
const TTL_SECONDS = 60 * 60 * 8; // 8h

export function setAdminSession() {
  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET!, { expiresIn: TTL_SECONDS });
  cookies().set(COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: true, path: '/', maxAge: TTL_SECONDS });
}

export function clearAdminSession() {
  cookies().set(COOKIE, '', { httpOnly: true, sameSite: 'lax', secure: true, path: '/', maxAge: 0 });
}

export function isAdmin() {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return false;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return (decoded as any).role === 'admin';
  } catch {
    return false;
  }
}
