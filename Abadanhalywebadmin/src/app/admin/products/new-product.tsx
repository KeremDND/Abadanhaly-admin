"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = { colors: string[] };

export default function NewProduct({ colors }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [sku, setSku] = useState("");
  const [color, setColor] = useState(colors[0] || "");
  const [active, setActive] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    if (!sku.trim()) {
      toast.error("SKU is required");
      return;
    }
    if (!color) {
      toast.error("Color is required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku, color, isActive: active }),
      });
      if (!res.ok) throw new Error("Failed to create product");
      const product = await res.json();

      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        const up = await fetch(`/api/admin/products/${product.id}/images`, {
          method: "POST",
          body: fd,
        });
        if (!up.ok) throw new Error("Image upload failed");
      }

      toast.success("✓ Product created");
      setOpen(false);
      setSku("");
      setFile(null);
      router.refresh();
    } catch (e: any) {
      toast.error(e?.message || "Error creating product");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="flex gap-3">
        <button
          className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800"
          onClick={() => setOpen(true)}
        >
          New Product
        </button>
        <button
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
          onClick={() => router.refresh()}
        >
          Save changes
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create Product</h3>
              <button className="text-gray-500" onClick={() => setOpen(false)}>✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">SKU</label>
                <input
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="e.g., gunes-2361"
                  className="w-full px-3 py-2 border rounded bg-white text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Color</label>
                <select
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full px-3 py-2 border rounded bg-white text-gray-900"
                >
                  {colors.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
                Active
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button className="px-4 py-2 rounded border" onClick={() => setOpen(false)} disabled={saving}>Cancel</button>
              <button className={`px-4 py-2 rounded text-white ${saving ? "bg-green-400" : "bg-green-700 hover:bg-green-800"}`} onClick={handleCreate} disabled={saving}>
                {saving ? "Saving..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


