"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function NewStore() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "Retail",
    address: "",
    city: "",
    district: "",
    phone: "",
    email: "",
    googleMapsUrl: "",
    isActive: true,
  });

  function edit<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit() {
    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.city.trim()) return toast.error("City is required");
    setSaving(true);
    try {
      const res = await fetch("/api/admin/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to create store");
      toast.success("✓ Store created");
      setOpen(false);
      router.refresh();
    } catch (e: any) {
      toast.error(e?.message || "Error creating store");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="flex gap-3">
        <button className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800" onClick={() => setOpen(true)}>Add Store</button>
        <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md" onClick={() => router.refresh()}>Save changes</button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-2xl bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Store</h3>
              <button className="text-gray-500" onClick={() => setOpen(false)}>✕</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Name</label>
                <input className="w-full px-3 py-2 border rounded bg-white text-gray-900" value={form.name} onChange={(e)=>edit("name", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Type</label>
                <input className="w-full px-3 py-2 border rounded bg-white text-gray-900" value={form.type} onChange={(e)=>edit("type", e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Address</label>
                <input className="w-full px-3 py-2 border rounded bg-white text-gray-900" value={form.address} onChange={(e)=>edit("address", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">City</label>
                <input className="w-full px-3 py-2 border rounded bg-white text-gray-900" value={form.city} onChange={(e)=>edit("city", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">District</label>
                <input className="w-full px-3 py-2 border rounded bg-white text-gray-900" value={form.district} onChange={(e)=>edit("district", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Phone</label>
                <input className="w-full px-3 py-2 border rounded bg-white text-gray-900" value={form.phone} onChange={(e)=>edit("phone", e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email</label>
                <input className="w-full px-3 py-2 border rounded bg-white text-gray-900" value={form.email} onChange={(e)=>edit("email", e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Google Maps URL</label>
                <input className="w-full px-3 py-2 border rounded bg-white text-gray-900" value={form.googleMapsUrl} onChange={(e)=>edit("googleMapsUrl", e.target.value)} />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700 col-span-2">
                <input type="checkbox" checked={form.isActive} onChange={(e)=>edit("isActive", e.target.checked)} /> Active
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button className="px-4 py-2 rounded border" onClick={()=>setOpen(false)} disabled={saving}>Cancel</button>
              <button className={`px-4 py-2 rounded text-white ${saving ? "bg-green-400" : "bg-green-700 hover:bg-green-800"}`} onClick={submit} disabled={saving}>{saving?"Saving...":"Create"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


