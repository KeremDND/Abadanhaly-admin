import { redirect } from "next/navigation";
import { defaultLocale } from "@/i18n/config";

export default function AdminRootRedirect() {
  redirect(`/${defaultLocale}/admin`);
}

import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function AdminHome() {
  const session = await getServerSession();
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold text-green-700">Abadan Haly — Admin</h1>
      <p className="mt-2 text-sm text-gray-600">Welcome {session?.user?.name ?? session?.user?.email}. Role: {(session?.user as any)?.role ?? "unknown"}</p>
      <nav className="mt-6 grid gap-3">
        <Link className="text-green-700 underline" href="/admin/pages">Pages</Link>
        <Link className="text-green-700 underline" href="/admin/products">Products</Link>
        <Link className="text-green-700 underline" href="/admin/translations">Translations</Link>
        <Link className="text-green-700 underline" href="/admin/stores">Stores</Link>
        <Link className="text-green-700 underline" href="/admin/settings">Settings</Link>
        <Link className="text-green-700 underline" href="/admin/audit">Audit Log</Link>
      </nav>
    </main>
  );
}
