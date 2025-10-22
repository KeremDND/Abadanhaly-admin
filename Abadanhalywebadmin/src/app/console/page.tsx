import { redirect } from 'next/navigation';
import { isAdmin, setAdminSession } from '@/lib/adminSession';
import { cookies } from 'next/headers';

const KEY = 'abadan_attempts';

async function verify(formData: FormData) {
  'use server';
  const pass = formData.get('password')?.toString() || '';
  const key  = formData.get('keyword')?.toString() || '';

  // Simple in-cookie rate limit (swap to KV/Upstash if you prefer)
  const c = cookies();
  const raw = c.get(KEY)?.value;
  const attempts = raw ? Number(raw) : 0;
  if (attempts >= 5) return { ok:false, msg:'Too many attempts. Try later.' };

  const ok = pass === process.env.ADMIN_PASSWORD && key === process.env.ADMIN_KEYWORD;
  if (!ok) {
    c.set(KEY, String(attempts + 1), { httpOnly:true, sameSite:'lax', path:'/', maxAge: 15*60 });
    return { ok:false, msg:'Invalid credentials.' };
  }

  // success
  setAdminSession();
  c.delete(KEY);
  redirect('/console/dashboard');
}

export default async function ConsolePage() {
  if (isAdmin()) redirect('/console/dashboard');

  return (
    <div className="min-h-screen grid place-items-center bg-neutral-50">
      <form action={verify} className="w-full max-w-sm bg-white p-6 rounded-xl shadow-sm space-y-4">
        <h1 className="text-xl font-semibold text-neutral-900">Admin Access</h1>
        <div className="space-y-1">
          <label className="text-sm text-neutral-700">Admin Password</label>
          <input name="password" type="password" className="w-full border rounded-md px-3 py-2" required />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-neutral-700">Admin Keyword</label>
          <input name="keyword" type="text" className="w-full border rounded-md px-3 py-2" required />
        </div>
        <button className="w-full bg-emerald-700 text-white py-2 rounded-md hover:bg-emerald-600 transition">
          Enter
        </button>
        <p className="text-xs text-neutral-500">Protected area — authorized personnel only.</p>
      </form>
    </div>
  );
}
