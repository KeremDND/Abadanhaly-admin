'use client';

import { useState } from 'react';
import { RefreshCw, Activity } from 'lucide-react';

interface PublishTabProps {}

export default function PublishTab({}: PublishTabProps) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleRevalidateAll = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      });

      const data = await response.json();

      if (data.ok) {
        showToast('All pages revalidated successfully', 'success');
      } else {
        showToast(data.message || 'Failed to revalidate', 'error');
      }
    } catch (error) {
      console.error('Error revalidating:', error);
      showToast('Error revalidating pages', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRevalidateRoute = async (route: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: route }),
      });

      const data = await response.json();

      if (data.ok) {
        showToast(`Route ${route} revalidated successfully`, 'success');
      } else {
        showToast(data.message || 'Failed to revalidate', 'error');
      }
    } catch (error) {
      console.error('Error revalidating:', error);
      showToast('Error revalidating route', 'error');
    } finally {
      setLoading(false);
    }
  };

  const routes = [
    { path: '/', label: 'Home' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/about', label: 'About' },
    { path: '/collaboration', label: 'Collaboration' },
  ];

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 ${
            toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Publish & Status</h1>
        <p className="text-gray-600">Revalidate routes to update the public site after changes</p>
      </div>

      {/* Revalidate All Button */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Revalidate All Routes</h2>
            <p className="text-sm text-gray-600">Revalidate all public pages at once</p>
          </div>
          <button
            onClick={handleRevalidateAll}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Revalidate All
          </button>
        </div>
      </div>

      {/* Individual Routes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Individual Routes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {routes.map((route) => (
            <div
              key={route.path}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">{route.label}</div>
                  <div className="text-sm text-gray-500">{route.path}</div>
                </div>
              </div>
              <button
                onClick={() => handleRevalidateRoute(route.path)}
                disabled={loading}
                className="px-3 py-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Revalidate
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Status Info */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Activity className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900 mb-1">About Revalidation</h3>
            <p className="text-sm text-blue-700">
              Revalidation updates the cached content for public pages. This is automatically done
              after creating or updating products or translations. Use manual revalidation to force
              an immediate update.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

