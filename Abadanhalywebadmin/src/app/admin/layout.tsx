import { requireRole } from "@/lib/auth";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole("editor");

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/admin" className="flex items-center px-2 text-gray-900 font-semibold text-lg">
                Abadan Haly Admin
              </Link>
              <div className="ml-6 flex space-x-4">
                <Link
                  href="/admin/pages"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-gray-100 rounded-md"
                >
                  Pages
                </Link>
                <Link
                  href="/admin/products"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-gray-100 rounded-md"
                >
                  Products
                </Link>
                <Link
                  href="/admin/translations"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-gray-100 rounded-md"
                >
                  Translations
                </Link>
                <Link
                  href="/admin/stores"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-gray-100 rounded-md"
                >
                  Stores
                </Link>
                <Link
                  href="/admin/settings"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-gray-100 rounded-md"
                >
                  Settings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

