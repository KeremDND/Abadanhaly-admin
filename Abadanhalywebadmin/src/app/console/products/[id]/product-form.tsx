"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ProductWithImages = {
  id: string;
  sku: string;
  slug: string;
  color: string;
  sizes: string;
  tags: string;
  isActive: boolean;
  images: Array<{ id: string; position: number; media: { id: string; url: string } }>;
};

export default function ProductForm({ product }: { product: ProductWithImages }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    sku: product.sku,
    slug: product.slug,
    color: product.color,
    sizes: product.sizes || "",
    tags: product.tags || "",
    isActive: product.isActive,
  });
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      router.refresh();
      toast.success("✓ Product saved");
    } catch (e) {
      toast.error("Error saving product");
    } finally {
      setSaving(false);
    }
  }

  async function uploadImage(file: File) {
    const form = new FormData();
    form.append("file", file);

    try {
      await fetch(`/api/admin/products/${product.id}/images`, {
        method: "POST",
        body: form,
      });
      router.refresh();
      toast.success("✓ Image uploaded");
    } catch (e) {
      toast.error("Error uploading image");
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadImage(file);
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      await uploadImage(file);
    }
  }

  async function handleDeleteProduct() {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    try {
      await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
      toast.success("✓ Product deleted");
      router.push("/admin/products");
      router.refresh();
    } catch (e) {
      toast.error("Error deleting product");
    }
  }

  async function handleDeleteImage(imageId: string) {
    if (!confirm("Delete this image?")) return;
    try {
      await fetch(`/api/admin/products/${product.id}/images?imageId=${imageId}`, {
        method: "DELETE",
      });
      router.refresh();
      toast.success("✓ Image deleted");
    } catch (e) {
      toast.error("Error deleting image");
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Basics</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <select
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="grey">Grey</option>
              <option value="dark-grey">Dark Grey</option>
              <option value="cream">Cream</option>
              <option value="red">Red</option>
              <option value="green">Green</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sizes (comma-separated)
            </label>
            <input
              type="text"
              value={formData.sizes}
              onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
              placeholder="160x230,200x300,300x400"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Active</label>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Images</h2>
        <div className="grid grid-cols-4 gap-4 mb-4">
          {product.images.map((img) => (
            <div key={img.id} className="relative group">
              <img
                src={img.media.url}
                alt=""
                className="w-full h-32 object-cover rounded-md"
              />
              <button
                onClick={() => handleDeleteImage(img.id)}
                className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver ? "border-green-600 bg-green-50" : "border-gray-300"
          }`}
        >
          <p className="text-sm text-gray-600 mb-2">Drag and drop images here, or click to browse</p>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={handleDeleteProduct}
          className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Delete Product
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

