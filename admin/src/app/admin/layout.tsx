import { redirect } from 'next/navigation';
import { hasAdminSession } from '@/lib/auth';
import AdminLayoutClient from './layout-client';

// This layout applies to all /admin/* routes EXCEPT /admin-login
// /admin-login has its own layout that renders without this parent layout
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication for all admin pages
  // Login page has its own layout at /admin-login/layout.tsx which renders
  // without going through this layout due to Next.js layout hierarchy
  const isAuthenticated = await hasAdminSession();

  if (!isAuthenticated) {
    redirect('/admin-login');
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
