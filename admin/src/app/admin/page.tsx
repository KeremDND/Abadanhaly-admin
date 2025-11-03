import { redirect } from 'next/navigation';
import { hasAdminSession } from '@/lib/auth';
import ProductsTab from './products-tab';

export default async function AdminPage() {
  const isAuthenticated = await hasAdminSession();

  if (!isAuthenticated) {
    redirect('/admin-login');
  }

  return <ProductsTab />;
}
