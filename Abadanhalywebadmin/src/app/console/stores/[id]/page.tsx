import { db } from "@/server/db";
import { notFound } from "next/navigation";
import StoreForm from "./store-form";

export default async function StoreEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const store = await db.store.findUnique({ where: { id } });

  if (!store) notFound();

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Store</h1>
      <StoreForm store={store} />
    </div>
  );
}

