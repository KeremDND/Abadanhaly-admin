import { redirect } from 'next/navigation';
import { hasAdminSession } from '@/lib/auth';
import PublishTab from './publish-tab';

export default async function PublishPage() {
  const isAuthenticated = await hasAdminSession();

  if (!isAuthenticated) {
    redirect('/admin-login');
  }

  return <PublishTab />;
}

