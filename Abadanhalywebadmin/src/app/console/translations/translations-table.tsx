"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type TranslationKey = {
  id: string;
  page: string;
  section: string;
  key: string;
  values: Array<{ id: string; locale: string; value: string }>;
};

type Locale = "tk" | "ru" | "en";

export default function TranslationsTable({ keys }: { keys: TranslationKey[] }) {
  const router = useRouter();
  // Base values from props
  const baseValues = useMemo(() => {
    const map = new Map<string, Record<Locale, string>>();
    for (const k of keys) {
      const tk = (k.values.find((v) => v.locale === "tk")?.value || "") as string;
      const ru = (k.values.find((v) => v.locale === "ru")?.value || "") as string;
      const en = (k.values.find((v) => v.locale === "en")?.value || "") as string;
      map.set(k.id, { tk, ru, en });
    }
    return map;
  }, [keys]);

  // Edits buffer keyed by keyId → locale → value
  const [edits, setEdits] = useState<Record<string, Partial<Record<Locale, string>>>>({});

  const hasEdits = Object.keys(edits).length > 0;

  function getValue(keyId: string, locale: Locale): string {
    const fromEdits = edits[keyId]?.[locale];
    if (typeof fromEdits === "string") return fromEdits;
    return baseValues.get(keyId)?.[locale] ?? "";
  }

  function setValue(keyId: string, locale: Locale, value: string) {
    const base = baseValues.get(keyId)?.[locale] ?? "";
    setEdits((prev) => {
      const nextKey = { ...(prev[keyId] || {}) } as Partial<Record<Locale, string>>;
      if (value === base) {
        // remove locale override if equal to base
        delete nextKey[locale];
      } else {
        nextKey[locale] = value;
      }
      const next = { ...prev } as Record<string, Partial<Record<Locale, string>>>;
      if (Object.keys(nextKey).length === 0) {
        delete next[keyId];
      } else {
        next[keyId] = nextKey;
      }
      return next;
    });
  }

  async function saveAll() {
    if (!hasEdits) return;
    try {
      const tasks: Promise<any>[] = [];
      for (const [keyId, locales] of Object.entries(edits)) {
        for (const [locale, value] of Object.entries(locales) as [Locale, string][]) {
          tasks.push(
            fetch(`/api/admin/translations/${keyId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ locale, value }),
            })
          );
        }
      }
      await Promise.all(tasks);
      toast.success("✓ Changes saved");
      setEdits({});
      router.refresh();
    } catch (e) {
      toast.error("Error saving changes");
    }
  }

  // Filters
  const [pageFilter, setPageFilter] = useState<string>("");
  const [sectionFilter, setSectionFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const filtered = useMemo(() => {
    return keys.filter(k => {
      if (pageFilter && k.page !== pageFilter) return false;
      if (sectionFilter && k.section !== sectionFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        const values = baseValues.get(k.id) || { tk:"", ru:"", en:"" } as any;
        if (!(`${k.page}.${k.section}.${k.key}`.toLowerCase().includes(s) ||
              values.tk?.toLowerCase().includes(s) ||
              values.ru?.toLowerCase().includes(s) ||
              values.en?.toLowerCase().includes(s))) return false;
      }
      return true;
    });
  }, [keys, pageFilter, sectionFilter, search, baseValues]);

  const pages = Array.from(new Set(keys.map(k=>k.page)));
  const sections = Array.from(new Set(keys.filter(k=>!pageFilter || k.page===pageFilter).map(k=>k.section)));

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b bg-gray-50 grid grid-cols-3 gap-3">
        <select className="px-2 py-2 border rounded bg-white text-gray-900" value={pageFilter} onChange={(e)=>{ setPageFilter(e.target.value); setSectionFilter(""); }}>
          <option value="">All pages</option>
          {pages.map(p=> <option key={p} value={p}>{p}</option>)}
        </select>
        <select className="px-2 py-2 border rounded bg-white text-gray-900" value={sectionFilter} onChange={(e)=>setSectionFilter(e.target.value)}>
          <option value="">All sections</option>
          {sections.map(s=> <option key={s} value={s}>{s}</option>)}
        </select>
        <input className="px-2 py-2 border rounded bg-white text-gray-900" placeholder="Search key or value..." value={search} onChange={(e)=>setSearch(e.target.value)} />
      </div>
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
        <h2 className="text-sm font-semibold text-gray-800">Translations</h2>
        <button
          onClick={saveAll}
          disabled={!hasEdits}
          className={`px-4 py-2 rounded-md text-white ${hasEdits ? "bg-green-700 hover:bg-green-800" : "bg-gray-300 cursor-not-allowed"}`}
        >
          Save changes{hasEdits ? ` (${Object.keys(edits).length})` : ""}
        </button>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">
              Page
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">
              Section
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-48">
              Key
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              TK
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              RU
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              EN
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
            {filtered.map((k) => {
            return (
              <tr key={k.id}>
                <td className="px-6 py-4 text-sm text-gray-700">{k.page}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{k.section}</td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{k.key}</td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={getValue(k.id, "tk")}
                    onChange={(e) => setValue(k.id, "tk", e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-green-600"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={getValue(k.id, "ru")}
                    onChange={(e) => setValue(k.id, "ru", e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-green-600"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    value={getValue(k.id, "en")}
                    onChange={(e) => setValue(k.id, "en", e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-green-600"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

