'use client';
import { useTranslation } from 'react-i18next';

interface GalleryTabsProps {
  selectedCategory: 'all' | 'new';
  onCategoryChange: (category: 'all' | 'new') => void;
}

export function GalleryTabs({ selectedCategory, onCategoryChange }: GalleryTabsProps) {
  const { t } = useTranslation();

  const categories = [
    { key: 'all' as const, label: t('gallery.tabs.all') },
    { key: 'new' as const, label: t('gallery.tabs.new') }
  ];

  return (
    <div className="flex gap-2">
      {categories.map((category) => (
        <button
          key={category.key}
          onClick={() => onCategoryChange(category.key)}
          className={`px-5 py-2.5 rounded-full text-sm font-medium liquid-glass ${
            selectedCategory === category.key
              ? 'bg-white/8 text-gray-900 shadow-lg scale-105 font-semibold border-2 border-[#0F3B2F]'
              : 'bg-white/4 text-gray-900 font-semibold border border-white/30'
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
