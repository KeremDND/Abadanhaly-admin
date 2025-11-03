import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import AdminDashboard from '@/components/AdminDashboard';

export default async function AdminPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect('/tk/admin-login');
  }

  return <AdminDashboard />;
}