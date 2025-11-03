"use client";
import { useState } from "react";

async function saveOne(slug: string, id: string, data: any) {
  const res = await fetch(`/api/pages/${slug}/blocks/${id}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ data }),
  });
  if (!res.ok) throw new Error("Save failed");
}

async function upload(file: File) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Upload failed");
  return json.url as string;
}

export default function ContentForm({ page }: { page: any }) {
  const [drafts, setDrafts] = useState<Record<string, any>>(() => {
    const m: Record<string, any> = {};
    for (const b of page.blocks) m[b.id] = b.data || {};
    return m;
  });
  const [saving, setSaving] = useState(false);
  const slug = page.slug as string;

  async function saveAll() {
    setSaving(true);
    try {
      for (const b of page.blocks) {
        await saveOne(slug, b.id, drafts[b.id]);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit “{page.slug}”</h1>
        <button disabled={saving} onClick={saveAll} className="bg-green-600 text-white py-2 px-3 rounded disabled:opacity-50">
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>

      {page.blocks.map((b: any) => (
        <div key={b.id} className="border rounded p-4 space-y-3">
          <div className="text-xs uppercase text-gray-500">{b.type}</div>

          {"title" in (drafts[b.id] || {}) && (
            <div>
              <label className="text-sm">Title</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={drafts[b.id].title || ""}
                onChange={(e) => setDrafts({ ...drafts, [b.id]: { ...drafts[b.id], title: e.target.value } })}
              />
            </div>
          )}

          {"subtitle" in (drafts[b.id] || {}) && (
            <div>
              <label className="text-sm">Subtitle</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={drafts[b.id].subtitle || ""}
                onChange={(e) => setDrafts({ ...drafts, [b.id]: { ...drafts[b.id], subtitle: e.target.value } })}
              />
            </div>
          )}

          {"body" in (drafts[b.id] || {}) && (
            <div>
              <label className="text-sm">Paragraph</label>
              <textarea
                className="w-full border rounded px-3 py-2"
                value={drafts[b.id].body || ""}
                onChange={(e) => setDrafts({ ...drafts, [b.id]: { ...drafts[b.id], body: e.target.value } })}
              />
            </div>
          )}

          {"image" in (drafts[b.id] || {}) && (
            <div className="flex items-center gap-3">
              {drafts[b.id].image && <img src={drafts[b.id].image} className="h-16 rounded" alt="" />}
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const url = await upload(f);
                  setDrafts({ ...drafts, [b.id]: { ...drafts[b.id], image: url } });
                }}
              />
            </div>
          )}

          {"ctaLabel" in (drafts[b.id] || {}) && (
            <div className="grid grid-cols-2 gap-3">
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="CTA Label"
                value={drafts[b.id].ctaLabel || ""}
                onChange={(e) => setDrafts({ ...drafts, [b.id]: { ...drafts[b.id], ctaLabel: e.target.value } })}
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="CTA Href"
                value={drafts[b.id].ctaHref || ""}
                onChange={(e) => setDrafts({ ...drafts, [b.id]: { ...drafts[b.id], ctaHref: e.target.value } })}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
