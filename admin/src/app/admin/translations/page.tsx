import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import TranslationsManager from '@/components/TranslationsManager';

export default async function TranslationsPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Translations Management</h2>
        <p className="mt-1 text-sm text-gray-600">
          Manage website translations for all languages
        </p>
      </div>
      <TranslationsManager />
    </div>
  );
}

