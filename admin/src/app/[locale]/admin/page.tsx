import Link from "next/link";

export default function AdminHomeLocale({ params }: { params: { locale: string } }) {
  const { locale } = params;
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold text-green-700">Abadan Haly — Admin</h1>
      <nav className="mt-6 grid gap-3">
        <Link className="text-green-700 underline" href={`/${locale}/admin/pages`}>Pages</Link>
        <Link className="text-green-700 underline" href={`/${locale}/admin/products`}>Products</Link>
        <Link className="text-green-700 underline" href={`/${locale}/admin/translations`}>Translations</Link>
        <Link className="text-green-700 underline" href={`/${locale}/admin/stores`}>Stores</Link>
        <Link className="text-green-700 underline" href={`/${locale}/admin/settings`}>Settings</Link>
        <Link className="text-green-700 underline" href={`/${locale}/admin/audit`}>Audit Log</Link>
      </nav>
    </main>
  );
}
