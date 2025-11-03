"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Settings = {
  brandName: string;
  primaryHex: string;
  arEnabled: boolean;
  defaultLocale?: "tk" | "ru" | "en";
  faviconUrl?: string;
  enable3d?: boolean;
  enableAi?: boolean;
};

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [s, setS] = useState<Settings>({
    brandName: "Abadan Haly",
    primaryHex: "#0B6A43",
    arEnabled: true,
    defaultLocale: "tk",
    enable3d: true,
    enableAi: true,
  });

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setS((prev) => ({ ...prev, ...data }));
      }
    })();
  }, []);

  async function save() {
    setSaving(true);
    try {
      let faviconUrl = s.faviconUrl;
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        const up = await fetch("/api/admin/settings/favicon", { method: "POST", body: fd });
        if (!up.ok) throw new Error("Favicon upload failed");
        const json = await up.json();
        faviconUrl = json.url;
      }

      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...s, faviconUrl }),
      });
      if (!res.ok) throw new Error("Failed to save settings");
      toast.success("✓ Settings saved");
    } catch (e: any) {
      toast.error(e?.message || "Error saving settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <div className="bg-white rounded-lg shadow p-4 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Brand name</label>
          <input className="w-full px-3 py-2 border rounded bg-white text-gray-900" value={s.brandName} onChange={(e)=>setS({...s, brandName:e.target.value})} />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Primary color</label>
          <input type="color" className="w-16 h-10 p-0 border rounded" value={s.primaryHex} onChange={(e)=>setS({...s, primaryHex:e.target.value})} />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Default language</label>
          <select className="w-full px-3 py-2 border rounded bg-white text-gray-900" value={s.defaultLocale} onChange={(e)=>setS({...s, defaultLocale:e.target.value as any})}>
            <option value="tk">Turkmen</option>
            <option value="ru">Russian</option>
            <option value="en">English</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={s.arEnabled} onChange={(e)=>setS({...s, arEnabled:e.target.checked})} /> Enable AR
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={!!s.enable3d} onChange={(e)=>setS({...s, enable3d:e.target.checked})} /> Enable 3D Viewer
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={!!s.enableAi} onChange={(e)=>setS({...s, enableAi:e.target.checked})} /> Enable Abadan AI
        </label>
        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-1">Favicon</label>
          <input type="file" accept="image/x-icon,image/png" onChange={(e)=>setFile(e.target.files?.[0]||null)} />
          {s.faviconUrl && <p className="text-xs text-gray-500 mt-1">Current: {s.faviconUrl}</p>}
        </div>
      </div>

      <div className="flex justify-end">
        <button className={`px-4 py-2 rounded text-white ${saving?"bg-green-400":"bg-green-700 hover:bg-green-800"}`} onClick={save} disabled={saving}>
          {saving?"Saving...":"Save changes"}
        </button>
      </div>
    </div>
  );
}

