import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { products } from '../../../data/products';
import { GalleryTabs } from './GalleryTabs';
import { GalleryGrid } from './GalleryGrid';
import { ColorFilters } from './ColorFilters';
import { GallerySearch } from './GallerySearch';

export default function Gallery() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'new'>('all');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <main className="min-h-screen bg-white pt-32 pb-16">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <header className="text-center mb-24">
          <h1 className="text-4xl md:text-5xl font-semibold text-green-800 mb-2">
            {t('gallery.title')}
          </h1>
          <p className="text-neutral-600 text-base md:text-lg max-w-2xl mx-auto">
            {t('gallery.subtitle')}
          </p>
        </header>

        {/* Sticky Filters Bar */}
        <div className="sticky top-20 z-40 mb-12 pt-8 -mx-4 sm:-mx-6 px-4 sm:px-6 transition-all duration-300">
          <div className="liquid-glass rounded-2xl p-5 backdrop-blur-md">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-center">
              {/* Search Bar and Category Buttons - Centered */}
              <div className="flex flex-1 max-w-2xl gap-3 w-full items-center">
                <GallerySearch 
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                />
                <div className="flex-shrink-0">
                  <GalleryTabs 
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                  />
                </div>
              </div>
              
              {/* Color Filters - Centered */}
              <div className="w-full lg:w-auto flex justify-center">
                <ColorFilters 
                  selectedColor={selectedColor}
                  onColorChange={setSelectedColor}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <GalleryGrid 
          products={products}
          selectedCategory={selectedCategory}
          selectedColor={selectedColor}
          searchTerm={searchTerm}
        />
      </div>
    </main>
  );
}
