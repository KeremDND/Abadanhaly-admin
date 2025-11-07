'use client';

import { useState, useEffect } from 'react';
import { Save, Search, Globe } from 'lucide-react';

interface Translation {
  id: string;
  page: string;
  section: string;
  key: string;
  locale: string;
  value: string;
}

const LOCALES = ['en', 'tk', 'ru'];
const PAGES = ['home', 'gallery', 'collaboration', 'about', 'nav', 'footer'];

export default function TranslationsManager() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [editing, setEditing] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTranslations();
  }, [selectedPage]);

  const fetchTranslations = async () => {
    try {
      const response = await fetch(`/api/translations?page=${selectedPage}`);
      const data = await response.json();
      setTranslations(data);
    } catch (error) {
      console.error('Error fetching translations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(editing).map(([id, value]) => {
        const translation = translations.find((t) => t.id === id);
        return {
          page: translation?.page || selectedPage,
          section: translation?.section || '',
          key: translation?.key || '',
          locale: translation?.locale || 'en',
          value,
        };
      });

      const response = await fetch('/api/translations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ translations: updates }),
      });

      if (response.ok) {
        setEditing({});
        fetchTranslations();
      }
    } catch (error) {
      console.error('Error saving translations:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (id: string, value: string) => {
    setEditing({ ...editing, [id]: value });
  };

  const groupedTranslations = translations.reduce((acc, t) => {
    const key = `${t.section}.${t.key}`;
    if (!acc[key]) {
      acc[key] = {};
    }
    acc[key][t.locale] = { ...t, editingValue: editing[t.id] ?? t.value };
    return acc;
  }, {} as Record<string, Record<string, Translation & { editingValue: string }>>);

  const filteredGroups = Object.entries(groupedTranslations).filter(([key]) =>
    key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <select
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          >
            {PAGES.map((page) => (
              <option key={page} value={page}>
                {page.charAt(0).toUpperCase() + page.slice(1)}
              </option>
            ))}
          </select>
          <div className="flex-1 max-w-lg relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search translations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>
        {Object.keys(editing).length > 0 && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        )}
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Key
                </th>
                {LOCALES.map((locale) => (
                  <th
                    key={locale}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-1" />
                      {locale.toUpperCase()}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGroups.map(([key, translationsByLocale]) => (
                <tr key={key}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {key}
                  </td>
                  {LOCALES.map((locale) => {
                    const translation = translationsByLocale[locale];
                    const value = translation?.editingValue ?? '';
                    const id = translation?.id ?? '';

                    return (
                      <td key={locale} className="px-6 py-4">
                        <textarea
                          value={value}
                          onChange={(e) => handleChange(id, e.target.value)}
                          onBlur={() => {
                            if (id && value !== translation?.value) {
                              handleChange(id, value);
                            }
                          }}
                          rows={2}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder={`${locale.toUpperCase()} translation`}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredGroups.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No translations found
          </div>
        )}
      </div>
    </div>
  );
}

