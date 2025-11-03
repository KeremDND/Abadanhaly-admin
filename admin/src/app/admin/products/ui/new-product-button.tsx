"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProductButton({ categories }: { categories: { id: string; name: string }[] }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  return (
    <>
      <button className="bg-green-600 text-white py-2 px-3 rounded" onClick={() => setOpen(true)}>New Product</button>
      {open && (
        <form
          className="fixed inset-0 bg-black/40 flex items-center justify-center"
          action={async (fd) => {
            const res = await fetch("/api/products", { method: "POST", body: fd });
            const json = await res.json();
            setOpen(false);
            router.push(`/admin/products/${json.id}`);
          }}
        >
          <div className="bg-white rounded p-6 w-[480px] space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="text-lg font-semibold">Create Product</div>
            <input name="sku" placeholder="SKU" required className="w-full border rounded px-3 py-2" />
            <input name="name" placeholder="Name" required className="w-full border rounded px-3 py-2" />
            <input name="slug" placeholder="slug" required className="w-full border rounded px-3 py-2" />
            <select name="categoryId" className="w-full border rounded px-3 py-2">
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button type="button" className="px-3 py-2" onClick={() => setOpen(false)}>Cancel</button>
              <button className="bg-green-600 text-white py-2 px-3 rounded" type="submit">Create</button>
            </div>
          </div>
        </form>
      )}
    </>
  );
}
