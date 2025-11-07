import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import ProductsManager from '@/components/ProductsManager';

export default async function AdminPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Products Management</h2>
        <p className="mt-1 text-sm text-gray-600">
          Manage your product catalog
        </p>
      </div>
      <ProductsManager />
    </div>
  );
}

