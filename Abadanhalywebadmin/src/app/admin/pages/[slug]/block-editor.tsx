"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Block = {
  id: string;
  kind: string;
  position: number;
  data: string;
};

type Page = {
  id: string;
  slug: string;
  title: string;
  blocks: Block[];
};

export default function BlockEditor({ page }: { page: Page }) {
  const router = useRouter();
  const [blocks, setBlocks] = useState(
    page.blocks.map((b) => ({
      id: b.id,
      kind: b.kind,
      position: b.position,
      data: JSON.parse(b.data),
    }))
  );
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await fetch(`/api/admin/pages/${page.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocks }),
      });
      router.refresh();
      toast.success("✓ Page saved");
    } catch (e) {
      toast.error("Error saving page");
    } finally {
      setSaving(false);
    }
  }

  function updateBlock(index: number, data: any) {
    const updated = [...blocks];
    updated[index].data = data;
    setBlocks(updated);
  }

  return (
    <div className="space-y-6">
      {blocks.map((block, i) => (
        <div key={block.id || i} className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
            {block.kind} Block
          </h3>
          {block.kind === "hero" && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title Key</label>
                <input
                  type="text"
                  value={block.data.titleKey || ""}
                  onChange={(e) => updateBlock(i, { ...block.data, titleKey: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subtitle Key
                </label>
                <input
                  type="text"
                  value={block.data.subtitleKey || ""}
                  onChange={(e) => updateBlock(i, { ...block.data, subtitleKey: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={block.data.image || ""}
                  onChange={(e) => updateBlock(i, { ...block.data, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
            </div>
          )}
          {block.kind === "services" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title Key</label>
              <input
                type="text"
                value={block.data.titleKey || ""}
                onChange={(e) => updateBlock(i, { ...block.data, titleKey: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
          )}
          {block.kind === "milestones" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title Key</label>
              <input
                type="text"
                value={block.data.titleKey || ""}
                onChange={(e) => updateBlock(i, { ...block.data, titleKey: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
          )}
          {block.kind === "stores" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title Key</label>
              <input
                type="text"
                value={block.data.titleKey || ""}
                onChange={(e) => updateBlock(i, { ...block.data, titleKey: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
          )}
        </div>
      ))}
      <button
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}

