import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = { title: "Abadan Haly Admin", description: "Admin Dashboard" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-dvh grid grid-cols-[220px_1fr] grid-rows-[48px_1fr]">
      <header className="col-span-2 h-12 border-b flex items-center justify-between px-4 bg-white">
        <div className="font-semibold text-green-700">Abadan Haly Admin</div>
        <nav className="text-sm flex gap-4">
          <Link className="hover:underline" href="/admin/pages">Pages</Link>
          <Link className="hover:underline" href="/admin/products">Products</Link>
          <Link className="hover:underline" href="/admin/translations">Translations</Link>
          <Link className="hover:underline" href="/admin/stores">Stores</Link>
          <Link className="hover:underline" href="/admin/settings">Settings</Link>
        </nav>
      </header>
      <aside className="border-r bg-gray-50 p-3">
        <ul className="space-y-2 text-sm">
          <li><Link className="block rounded px-2 py-1 hover:bg-white" href="/admin">Dashboard</Link></li>
          <li><Link className="block rounded px-2 py-1 hover:bg-white" href="/admin/pages">Pages</Link></li>
          <li><Link className="block rounded px-2 py-1 hover:bg-white" href="/admin/products">Products</Link></li>
          <li><Link className="block rounded px-2 py-1 hover:bg-white" href="/admin/translations">Translations</Link></li>
          <li><Link className="block rounded px-2 py-1 hover:bg-white" href="/admin/stores">Stores</Link></li>
          <li><Link className="block rounded px-2 py-1 hover:bg-white" href="/admin/settings">Settings</Link></li>
        </ul>
      </aside>
      <main className="bg-white">{children}</main>
    </div>
  );
}
