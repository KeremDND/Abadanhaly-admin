'use client';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Admin Panel</h1>
        <button 
          onClick={() => fetch('/console/logout', { method:'POST' }).then(()=>location.href='/console')}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Log out
        </button>
      </div>
      <nav className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Link className="p-4 border rounded-md hover:bg-neutral-50" href="/console/translations">
          <h3 className="font-medium">Translations</h3>
          <p className="text-sm text-neutral-600">Manage i18n content</p>
        </Link>
        <Link className="p-4 border rounded-md hover:bg-neutral-50" href="/console/products">
          <h3 className="font-medium">Products</h3>
          <p className="text-sm text-neutral-600">Manage carpet products</p>
        </Link>
        <Link className="p-4 border rounded-md hover:bg-neutral-50" href="/console/stores">
          <h3 className="font-medium">Stores</h3>
          <p className="text-sm text-neutral-600">Manage store locations</p>
        </Link>
        <Link className="p-4 border rounded-md hover:bg-neutral-50" href="/console/settings">
          <h3 className="font-medium">Settings</h3>
          <p className="text-sm text-neutral-600">Global configuration</p>
        </Link>
      </nav>
    </div>
  );
}
