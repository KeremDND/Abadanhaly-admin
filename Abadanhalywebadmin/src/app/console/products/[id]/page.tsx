import { db } from "@/server/db";
import { notFound } from "next/navigation";
import ProductForm from "./product-form";

export default async function ProductEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await db.product.findUnique({
    where: { id },
    include: { images: { include: { media: true }, orderBy: { position: "asc" } } },
  });

  if (!product) notFound();

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Product</h1>
      <ProductForm product={product} />
    </div>
  );
}

