'use client';

import { useState, useEffect, useRef } from 'react';
import { Save, Search, Upload, Download, FileText, X } from 'lucide-react';

type Locale = 'en' | 'tk' | 'ru';
type Page = 'home' | 'gallery' | 'about' | 'collaboration' | 'header' | 'footer';

interface Translation {
  id: string;
  page: string;
  section: string;
  locale: string;
  value: string;
}

interface TranslationsTabProps {}

export default function TranslationsTab({}: TranslationsTabProps) {
  const [selectedPage, setSelectedPage] = useState<Page>('home');
  const [translations, setTranslations] = useState<Record<string, Record<string, Translation[]>>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [autosave, setAutosave] = useState(false);
  const [editedValues, setEditedValues] = useState<Record<string, Record<string, Record<Locale, string>>>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pages: Page[] = ['home', 'gallery', 'about', 'collaboration', 'header', 'footer'];
  const locales: Locale[] = ['tk', 'ru', 'en'];

  useEffect(() => {
    fetchTranslations();
  }, [selectedPage]);

  const fetchTranslations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/translations?page=${selectedPage}`);
      const data = await response.json();

      if (data.ok) {
        setTranslations(data.data || {});
      } else {
        showToast('Failed to load translations', 'error');
      }
    } catch (error) {
      console.error('Error fetching translations:', error);
      showToast('Error loading translations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleValueChange = (page: string, section: string, locale: Locale, value: string) => {
    if (!editedValues[page]) {
      editedValues[page] = {};
    }
    if (!editedValues[page][section]) {
      editedValues[page][section] = {} as Record<Locale, string>;
    }
    editedValues[page][section][locale] = value;
    setEditedValues({ ...editedValues });

    if (autosave) {
      setTimeout(() => {
        handleSave();
      }, 1000);
    }
  };

  const handleSave = async () => {
    try {
      const updates: Array<{ page: string; section: string; locale: Locale; value: string }> = [];

      Object.keys(editedValues).forEach((page) => {
        Object.keys(editedValues[page]).forEach((section) => {
          Object.keys(editedValues[page][section]).forEach((locale) => {
            updates.push({
              page,
              section,
              locale: locale as Locale,
              value: editedValues[page][section][locale as Locale],
            });
          });
        });
      });

      if (updates.length === 0) {
        showToast('No changes to save', 'error');
        return;
      }

      const response = await fetch('/api/admin/translations/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ translations: updates }),
      });

      const data = await response.json();

      if (data.ok) {
        showToast(`Saved ${updates.length} translations`, 'success');
        setEditedValues({});
        fetchTranslations();
      } else {
        showToast(data.message || 'Failed to save translations', 'error');
      }
    } catch (error) {
      console.error('Error saving translations:', error);
      showToast('Error saving translations', 'error');
    }
  };

  const handleExport = async () => {
    try {
      const allTranslations: Array<{ key: string; tk: string; ru: string; en: string }> = [];

      Object.keys(translations).forEach((page) => {
        Object.keys(translations[page]).forEach((section) => {
          const sectionTranslations = translations[page][section];
          const tk = sectionTranslations.find((t) => t.locale === 'tk')?.value || '';
          const ru = sectionTranslations.find((t) => t.locale === 'ru')?.value || '';
          const en = sectionTranslations.find((t) => t.locale === 'en')?.value || '';

          allTranslations.push({
            key: `${page}.${section}`,
            tk,
            ru,
            en,
          });
        });
      });

      const csv = [
        'Key,Turkmen,Russian,English',
        ...allTranslations.map((t) =>
          `"${t.key}","${t.tk.replace(/"/g, '""')}","${t.ru.replace(/"/g, '""')}","${t.en.replace(/"/g, '""')}"`
        ),
      ].join('\n');

      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `translations-${selectedPage}-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      showToast('Translations exported successfully', 'success');
    } catch (error) {
      console.error('Error exporting translations:', error);
      showToast('Error exporting translations', 'error');
    }
  };

  const handleImport = async (file: File) => {
    try {
      const text = await file.text();
      const lines = text.split('\n').filter((line) => line.trim());
      const headers = lines[0]?.split(',') || [];

      if (!headers.includes('Key') || !headers.includes('Turkmen') || !headers.includes('Russian') || !headers.includes('English')) {
        showToast('Invalid CSV format. Expected columns: Key, Turkmen, Russian, English', 'error');
        return;
      }

      const updates: Array<{ page: string; section: string; locale: Locale; value: string }> = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
        
        if (values.length < 4) continue;

        const key = values[0].replace(/^"|"$/g, '').trim();
        const tk = values[1]?.replace(/^"|"$/g, '').replace(/""/g, '"').trim() || '';
        const ru = values[2]?.replace(/^"|"$/g, '').replace(/""/g, '"').trim() || '';
        const en = values[3]?.replace(/^"|"$/g, '').replace(/""/g, '"').trim() || '';

        const [page, section] = key.split('.');
        if (!page || !section) continue;

        if (tk) updates.push({ page, section, locale: 'tk', value: tk });
        if (ru) updates.push({ page, section, locale: 'ru', value: ru });
        if (en) updates.push({ page, section, locale: 'en', value: en });
      }

      if (updates.length === 0) {
        showToast('No valid translations found in file', 'error');
        return;
      }

      const response = await fetch('/api/admin/translations/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ translations: updates }),
      });

      const data = await response.json();

      if (data.ok) {
        showToast(`Imported ${updates.length} translations`, 'success');
        fetchTranslations();
      } else {
        showToast(data.message || 'Failed to import translations', 'error');
      }
    } catch (error) {
      console.error('Error importing translations:', error);
      showToast('Error importing translations', 'error');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImport(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/csv' || file.name.endsWith('.csv')) {
      handleImport(file);
    } else {
      showToast('Please drop a CSV file', 'error');
    }
  };

  const pageTranslations = translations[selectedPage] || {};

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 text-sm">Loading translations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-xl z-50 animate-slide-in ${
            toast.type === 'success' 
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white' 
              : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Translations
          </h1>
          <p className="text-gray-600 mt-1">
            Manage translations for {selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1)} page
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-700 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              checked={autosave}
              onChange={(e) => setAutosave(e.target.checked)}
              className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded"
            />
            Autosave
          </label>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl transition-all duration-200 hover:shadow-lg flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Upload/Export Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Export Box */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Download className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Export Translations</h3>
              <p className="text-sm text-gray-600">Download as CSV file</p>
            </div>
          </div>
          <button
            onClick={handleExport}
            className="w-full px-4 py-3 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Upload Box */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border-2 border-dashed transition-all duration-200 p-6 ${
            isDragging
              ? 'border-emerald-500 bg-emerald-50/50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              isDragging ? 'bg-emerald-100' : 'bg-gray-100'
            }`}>
              <Upload className={`w-5 h-5 ${isDragging ? 'text-emerald-600' : 'text-gray-600'}`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Import Translations</h3>
              <p className="text-sm text-gray-600">Drop CSV file or click to browse</p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
            id="csv-upload"
          />
          <label
            htmlFor="csv-upload"
            className="w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border border-gray-300"
          >
            <FileText className="w-4 h-4" />
            Choose CSV File
          </label>
        </div>
      </div>

      {/* Page Selector */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-4">
        <div className="flex flex-wrap gap-2">
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => setSelectedPage(page)}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                selectedPage === page
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {page.charAt(0).toUpperCase() + page.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search translations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 bg-white/80 backdrop-blur-sm"
        />
      </div>

      {/* Translations Grid */}
      <div className="space-y-6">
        {Object.keys(pageTranslations).length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No translations found</h3>
            <p className="text-gray-600">No translations available for this page</p>
          </div>
        ) : (
          Object.keys(pageTranslations).map((section) => {
            const sectionTranslations = pageTranslations[section];
            const tkValue = sectionTranslations.find((t) => t.locale === 'tk')?.value || '';
            const ruValue = sectionTranslations.find((t) => t.locale === 'ru')?.value || '';
            const enValue = sectionTranslations.find((t) => t.locale === 'en')?.value || '';

            // Filter by search query
            if (searchQuery && 
                !section.toLowerCase().includes(searchQuery.toLowerCase()) &&
                !tkValue.toLowerCase().includes(searchQuery.toLowerCase()) &&
                !ruValue.toLowerCase().includes(searchQuery.toLowerCase()) &&
                !enValue.toLowerCase().includes(searchQuery.toLowerCase())) {
              return null;
            }

            const editedTk = editedValues[selectedPage]?.[section]?.['tk'] ?? tkValue;
            const editedRu = editedValues[selectedPage]?.[section]?.['ru'] ?? ruValue;
            const editedEn = editedValues[selectedPage]?.[section]?.['en'] ?? enValue;

            return (
              <div key={section} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-shadow duration-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  {section}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Turkmen */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Turkmen (TK)
                    </label>
                    <textarea
                      value={editedTk}
                      onChange={(e) => handleValueChange(selectedPage, section, 'tk', e.target.value)}
                      rows={4}
                      maxLength={300}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none transition-all duration-200 bg-white"
                    />
                    <div className="text-xs text-gray-500 mt-1.5">
                      {editedTk.length} / 300 characters
                    </div>
                  </div>

                  {/* Russian */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Russian (RU)
                    </label>
                    <textarea
                      value={editedRu}
                      onChange={(e) => handleValueChange(selectedPage, section, 'ru', e.target.value)}
                      rows={4}
                      maxLength={300}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none transition-all duration-200 bg-white"
                    />
                    <div className="text-xs text-gray-500 mt-1.5">
                      {editedRu.length} / 300 characters
                    </div>
                  </div>

                  {/* English */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      English (EN)
                    </label>
                    <textarea
                      value={editedEn}
                      onChange={(e) => handleValueChange(selectedPage, section, 'en', e.target.value)}
                      rows={4}
                      maxLength={300}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none transition-all duration-200 bg-white"
                    />
                    <div className="text-xs text-gray-500 mt-1.5">
                      {editedEn.length} / 300 characters
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
