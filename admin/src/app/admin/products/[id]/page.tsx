import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function ProductEditor({ params: { id } }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({ where: { id }, include: { variants: true, category: true } });
  if (!product) return <div className="p-6">Not found</div>;

  async function update(formData: FormData) {
    "use server";
    const name = String(formData.get("name"));
    const slug = String(formData.get("slug"));
    const isActive = formData.get("isActive") === "on";
    await prisma.product.update({ where: { id }, data: { name, slug, isActive } });
    revalidatePath(`/admin/products/${id}`);
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Edit Product</h1>
      <form action={update} className="space-y-3 max-w-lg">
        <div>
          <label className="text-sm">Name</label>
          <input name="name" defaultValue={product.name} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="text-sm">Slug</label>
          <input name="slug" defaultValue={product.slug} className="w-full border rounded px-3 py-2" />
        </div>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="isActive" defaultChecked={product.isActive} /> Active
        </label>
        <div>
          <button className="bg-green-600 text-white py-2 px-3 rounded" type="submit">Save</button>
        </div>
      </form>

      <div>
        <h2 className="font-semibold">Variants</h2>
        <ul className="mt-2 space-y-1">
          {product.variants.map((v) => (
            <li key={v.id} className="text-sm">{v.color} — {v.size} — {v.priceCents / 100} {v.currency} — stock {v.stock}</li>
          ))}
          {!product.variants.length && <li className="text-sm text-gray-600">No variants yet.</li>}
        </ul>
      </div>
    </div>
  );
}
