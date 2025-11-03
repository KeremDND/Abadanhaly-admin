import { redirect } from 'next/navigation';
import { hasAdminSession } from '@/lib/auth';
import TranslationsTab from './translations-tab';

export default async function TranslationsPage() {
  const isAuthenticated = await hasAdminSession();

  if (!isAuthenticated) {
    redirect('/admin-login');
  }

  return <TranslationsTab />;
}
