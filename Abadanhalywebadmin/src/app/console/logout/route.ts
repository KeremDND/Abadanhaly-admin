import { NextResponse } from 'next/server';
import { clearAdminSession } from '@/lib/adminSession';

export async function POST() {
  clearAdminSession();
  return NextResponse.json({ ok:true });
}
