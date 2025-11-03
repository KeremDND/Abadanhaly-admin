'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { 
  Globe, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Plus, 
  Save, 
  Check, 
  X, 
  AlertCircle,
  Copy,
  Trash2,
  Eye,
  RefreshCw
} from 'lucide-react';

interface Translation {
  id: string;
  page: string;
  section: string;
  key: string;
  en: string;
  tk: string;
  ru: string;
  updatedAt: string;
  createdAt: string;
}

interface TranslationsResponse {
  translations: Translation[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    pages: number;
  };
}

interface Stats {
  total: number;
  missingTk: number;
  missingRu: number;
}

const PAGES = [
  { id: 'layout', name: 'Layout' },
  { id: 'home', name: 'Home' },
  { id: 'gallery', name: 'Gallery' },
  { id: 'about', name: 'About' },
  { id: 'collaboration', name: 'Collaboration' },
  { id: 'stores', name: 'Stores' },
  { id: 'contact', name: 'Contact' }
];

const SECTIONS = {
  layout: ['header', 'footer'],
  home: ['hero', 'services', 'stores', 'certificates'],
  gallery: ['header', 'filters', 'card', 'modal'],
  about: ['hero', 'story', 'capacity', 'milestones'],
  collaboration: ['hero', 'benefits', 'process', 'contact'],
  stores: ['page', 'card'],
  contact: ['form']
};

export default function TranslationsManager() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Filters and search
  const [selectedPage, setSelectedPage] = useState('home');
  const [selectedSection, setSelectedSection] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMissingOnly, setShowMissingOnly] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  // Editing state
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [pendingChanges, setPendingChanges] = useState<Map<string, Partial<Translation>>>(new Map());
  
  // Stats
  const [stats, setStats] = useState<Stats>({ total: 0, missingTk: 0, missingRu: 0 });
  
  const t = useTranslations('admin.translations');

  // Get available sections for selected page
  const availableSections = useMemo(() => {
    return SECTIONS[selectedPage as keyof typeof SECTIONS] || [];
  }, [selectedPage]);

  // Reset section when page changes
  useEffect(() => {
    if (availableSections.length > 0) {
      setSelectedSection(availableSections[0]);
    } else {
      setSelectedSection('');
    }
  }, [availableSections]);

  // Fetch translations
  const fetchTranslations = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '50',
        ...(searchQuery && { query: searchQuery }),
        ...(selectedPage && { page: selectedPage }),
        ...(selectedSection && { section: selectedSection })
      });

      const response = await fetch(`/api/translations?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch translations');
      }

      const data: TranslationsResponse = await response.json();
      setTranslations(data.translations);
      setTotalPages(data.pagination.pages);
      setTotalCount(data.pagination.total);
      
      // Calculate stats
      const missingTk = data.translations.filter(t => !t.tk.trim()).length;
      const missingRu = data.translations.filter(t => !t.ru.trim()).length;
      setStats({
        total: data.pagination.total,
        missingTk,
        missingRu
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, selectedPage, selectedSection]);

  useEffect(() => {
    fetchTranslations();
  }, [fetchTranslations]);

  // Filter translations based on missing only
  const filteredTranslations = useMemo(() => {
    if (!showMissingOnly) return translations;
    
    return translations.filter(t => !t.tk.trim() || !t.ru.trim());
  }, [translations, showMissingOnly]);

  // Handle cell editing
  const startEditing = (id: string, field: 'en' | 'tk' | 'ru', value: string) => {
    setEditingCell(`${id}-${field}`);
    setEditValue(value);
  };

  const cancelEditing = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const saveCellEdit = async (id: string, field: 'en' | 'tk' | 'ru') => {
    const newValue = editValue.trim();
    const translation = translations.find(t => t.id === id);
    if (!translation) return;

    // Update pending changes
    const existingChanges = pendingChanges.get(id) || {};
    const updatedChanges = { ...existingChanges, [field]: newValue };
    setPendingChanges(new Map(pendingChanges.set(id, updatedChanges)));

    // Update local state immediately for optimistic UI
    setTranslations(prev => 
      prev.map(t => 
        t.id === id ? { ...t, [field]: newValue } : t
      )
    );

    setEditingCell(null);
    setEditValue('');
  };

  // Save all pending changes
  const saveChanges = async () => {
    if (pendingChanges.size === 0) return;

    setSaving(true);
    setError(null);

    try {
      const rows = Array.from(pendingChanges.entries()).map(([id, changes]) => {
        const translation = translations.find(t => t.id === id);
        return {
          id,
          page: translation?.page,
          section: translation?.section,
          key: translation?.key,
          en: changes.en ?? translation?.en ?? '',
          tk: changes.tk ?? translation?.tk ?? '',
          ru: changes.ru ?? translation?.ru ?? ''
        };
      });

      const response = await fetch('/api/translations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows })
      });

      if (!response.ok) {
        throw new Error('Failed to save changes');
      }

      setPendingChanges(new Map());
      setSuccess('Changes saved successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Publish changes
  const publishChanges = async () => {
    await saveChanges();
    
    setPublishing(true);
    setError(null);

    try {
      const response = await fetch('/api/translations/sync-json', {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Failed to publish changes');
      }

      setSuccess('Changes published successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPublishing(false);
    }
  };

  // Create missing keys
  const createMissingKeys = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/translations/create-missing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keys: [] }) // Use registry
      });

      if (!response.ok) {
        throw new Error('Failed to create missing keys');
      }

      const data = await response.json();
      setSuccess(`Created ${data.created} missing keys`);
      setTimeout(() => setSuccess(null), 3000);
      
      fetchTranslations();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Export translations
  const exportTranslations = async (format: 'json' | 'csv') => {
    try {
      const params = new URLSearchParams({
        format,
        scope: selectedPage ? `page:${selectedPage}` : 'all'
      });

      const response = await fetch(`/api/translations/export?${params}`);
      if (!response.ok) {
        throw new Error('Failed to export translations');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `translations-${selectedPage || 'all'}-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Copy key to clipboard
  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setSuccess('Key copied to clipboard');
    setTimeout(() => setSuccess(null), 2000);
  };

  // Get cell validation class
  const getCellClass = (value: string, field: 'en' | 'tk' | 'ru') => {
    if (!value.trim()) return 'bg-yellow-50 border-yellow-200';
    if (field !== 'en' && value.includes('{}')) return 'bg-red-50 border-red-200';
    return 'bg-white border-gray-200';
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <Globe className="w-8 h-8 text-emerald-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t('title')}</h2>
            <p className="text-gray-600">Manage all website translations</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => exportTranslations('json')}
            className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export JSON
          </button>
          <button
            onClick={() => exportTranslations('csv')}
            className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
          <button
            onClick={createMissingKeys}
            className="flex items-center px-4 py-2 text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Missing
          </button>
          <button
            onClick={saveChanges}
            disabled={saving || pendingChanges.size === 0}
            className="flex items-center px-4 py-2 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {saving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </button>
          <button
            onClick={publishChanges}
            disabled={publishing || pendingChanges.size === 0}
            className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {publishing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
            Publish
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Total Keys</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-sm text-yellow-600">Missing Turkmen</div>
          <div className="text-2xl font-bold text-yellow-700">{stats.missingTk}</div>
        </div>
        <div className="bg-red-50 rounded-lg p-4">
          <div className="text-sm text-red-600">Missing Russian</div>
          <div className="text-2xl font-bold text-red-700">{stats.missingRu}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search translations..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          value={selectedPage}
          onChange={(e) => setSelectedPage(e.target.value)}
        >
          {PAGES.map(page => (
            <option key={page.id} value={page.id}>{page.name}</option>
          ))}
        </select>
        
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
        >
          <option value="">All Sections</option>
          {availableSections.map(section => (
            <option key={section} value={section}>
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </option>
          ))}
        </select>
        
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showMissingOnly}
            onChange={(e) => setShowMissingOnly(e.target.checked)}
            className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700">Show missing only</span>
        </label>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center">
          <Check className="w-5 h-5 mr-2" />
          {success}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Translations Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Key
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  English
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Turkmen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Russian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading translations...
                  </td>
                </tr>
              ) : filteredTranslations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No translations found
                  </td>
                </tr>
              ) : (
                filteredTranslations.map((translation) => (
                  <tr key={translation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <code className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                          {translation.key}
                        </code>
                        <button
                          onClick={() => copyKey(translation.key)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Copy key"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {translation.page}.{translation.section}
                      </div>
                    </td>
                    
                    {/* English */}
                    <td className="px-6 py-4">
                      <div className={`border rounded-lg p-2 ${getCellClass(translation.en, 'en')}`}>
                        {editingCell === `${translation.id}-en` ? (
                          <div className="flex items-center space-x-2">
                            <textarea
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="flex-1 border-0 focus:ring-0 resize-none"
                              rows={2}
                              autoFocus
                            />
                            <button
                              onClick={() => saveCellEdit(translation.id, 'en')}
                              className="text-green-600 hover:text-green-800"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => startEditing(translation.id, 'en', translation.en)}
                            className="cursor-pointer min-h-[2rem] whitespace-pre-wrap"
                          >
                            {translation.en || <span className="text-gray-400 italic">Empty</span>}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    {/* Turkmen */}
                    <td className="px-6 py-4">
                      <div className={`border rounded-lg p-2 ${getCellClass(translation.tk, 'tk')}`}>
                        {editingCell === `${translation.id}-tk` ? (
                          <div className="flex items-center space-x-2">
                            <textarea
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="flex-1 border-0 focus:ring-0 resize-none"
                              rows={2}
                              autoFocus
                            />
                            <button
                              onClick={() => saveCellEdit(translation.id, 'tk')}
                              className="text-green-600 hover:text-green-800"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => startEditing(translation.id, 'tk', translation.tk)}
                            className="cursor-pointer min-h-[2rem] whitespace-pre-wrap"
                          >
                            {translation.tk || <span className="text-gray-400 italic">Empty</span>}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    {/* Russian */}
                    <td className="px-6 py-4">
                      <div className={`border rounded-lg p-2 ${getCellClass(translation.ru, 'ru')}`}>
                        {editingCell === `${translation.id}-ru` ? (
                          <div className="flex items-center space-x-2">
                            <textarea
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="flex-1 border-0 focus:ring-0 resize-none"
                              rows={2}
                              autoFocus
                            />
                            <button
                              onClick={() => saveCellEdit(translation.id, 'ru')}
                              className="text-green-600 hover:text-green-800"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => startEditing(translation.id, 'ru', translation.ru)}
                            className="cursor-pointer min-h-[2rem] whitespace-pre-wrap"
                          >
                            {translation.ru || <span className="text-gray-400 italic">Empty</span>}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(translation.updatedAt).toLocaleDateString()}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          title="View context"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * 50) + 1} to {Math.min(currentPage * 50, totalCount)} of {totalCount} translations
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}