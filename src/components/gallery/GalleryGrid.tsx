
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { GalleryCard } from './GalleryCard';
import { Product } from '../../../data/products';
import { getAssetPath } from '../../lib/paths';

interface GalleryGridProps {
  products: Product[];
  selectedCategory: 'all' | 'new';
  selectedColor: string | null;
  searchTerm?: string;
}

export function GalleryGrid({ products, selectedCategory, selectedColor, searchTerm = '' }: GalleryGridProps) {
  const { t, i18n } = useTranslation();
  const language = i18n.language;

  // Filter products by selected category, color, search term, and remove duplicates
  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    // Remove duplicates based on name and image
    const seen = new Set();
    filtered = filtered.filter(product => {
      const key = `${product.name}-${product.image}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Filter by color
    if (selectedColor) {
      filtered = filtered.filter(product => product.color === selectedColor);
    }
    
    // Filter by search term (case-insensitive)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(term) ||
        product.id.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  }, [products, selectedCategory, selectedColor, searchTerm]);

  // Get alt text based on language
  const getAltText = (product: Product) => {
    switch (language) {
      case 'tk':
        return product.altTK;
      case 'ru':
        return product.altRU;
      default:
        return product.altEN;
    }
  };

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">📋</span>
        </div>
        <h3 className="text-xl font-semibold text-neutral-600 mb-2">
          {searchTerm.trim()
            ? (language === 'tk' ? 'Gözleg netijesi tapylmady' :
               language === 'ru' ? 'Результаты поиска не найдены' :
               'No search results found')
            : (language === 'tk' ? 'Bu kategoriýada haly ýok' :
               language === 'ru' ? 'В этой категории нет ковров' :
               'No carpets in this category')}
        </h3>
        <p className="text-neutral-500">
          {searchTerm.trim()
            ? (language === 'tk' ? 'Başga at bilen gözleg geçiriň' :
               language === 'ru' ? 'Попробуйте поиск с другим названием' :
               'Try searching with a different name')
            : (language === 'tk' ? 'Başga kategoriýa saýlaň' :
               language === 'ru' ? 'Выберите другую категорию' :
               'Try selecting a different category or color')}
        </p>
      </div>
    );
  }

  // Prepare filtered products for lightbox navigation
  const filteredProductsForLightbox = useMemo(() => {
    return filteredProducts.map(product => ({
      id: product.id,
      name: product.name,
      image: getAssetPath(product.image),
      alt: getAltText(product)
    }));
  }, [filteredProducts, language]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
      {filteredProducts.map((product) => (
        <GalleryCard
          key={product.id}
          name={product.name}
          image={getAssetPath(product.image)}
          alt={getAltText(product)}
          zoomLabel={t('gallery.zoom')}
          filteredProducts={filteredProductsForLightbox}
        />
      ))}
    </div>
  );
}
