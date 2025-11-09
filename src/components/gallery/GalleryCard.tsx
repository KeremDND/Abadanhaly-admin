
import { useState, useEffect } from 'react';
import { ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { useTranslation } from 'react-i18next';
import { products } from '../../../data/products';
import { getAssetPath } from '../../lib/paths';

interface GalleryCardProps {
  name: string;
  image: string;
  alt: string;
  zoomLabel: string;
  filteredProducts?: Array<{ id: string; name: string; image: string; alt?: string }>;
}

export function GalleryCard({ name, image, alt, zoomLabel, filteredProducts }: GalleryCardProps) {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { i18n } = useTranslation();
  const language = i18n.language;

  // Use filtered products if provided, otherwise use all products
  const allProducts = filteredProducts || products.map(p => ({
    id: p.id,
    name: p.name,
    image: getAssetPath(p.image),
    alt: language === 'tk' ? p.altTK : language === 'ru' ? p.altRU : p.altEN
  }));

  // Find current product index in the filtered list
  const currentProductIndex = allProducts.findIndex(p => p.name === name);

  const goToPrevious = () => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : allProducts.length - 1);
  };

  const goToNext = () => {
    setCurrentIndex(prev => prev < allProducts.length - 1 ? prev + 1 : 0);
  };

  const currentProduct = allProducts[currentIndex];

  // Initialize current index when opening lightbox
  useEffect(() => {
    if (open && currentProductIndex >= 0) {
      setCurrentIndex(currentProductIndex);
    }
  }, [open, currentProductIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentIndex(prev => prev > 0 ? prev - 1 : allProducts.length - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentIndex(prev => prev < allProducts.length - 1 ? prev + 1 : 0);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, allProducts.length]);

  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startX = touch.clientX;
    
    const handleTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      const endX = touch.clientX;
      const diff = startX - endX;
      
      if (Math.abs(diff) > 50) { // Minimum swipe distance
        if (diff > 0) {
          goToNext();
        } else {
          goToPrevious();
        }
      }
      
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <div className="group relative">
      {/* Hover Zoom Icon */}
      <button
        aria-label={zoomLabel}
        onClick={() => {
          setCurrentIndex(currentProductIndex >= 0 ? currentProductIndex : 0);
          setOpen(true);
        }}
        className="absolute right-3 top-3 z-10 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200
                   rounded-full backdrop-blur bg-white/70 border p-2 hover:bg-white hover:scale-110"
      >
        <ZoomIn className="h-4 w-4" />
      </button>
      
      {/* Image Container */}
      <button 
        onClick={() => {
          setCurrentIndex(currentProductIndex >= 0 ? currentProductIndex : 0);
          setOpen(true);
        }} 
        className="block w-full text-left group"
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-neutral-50 border border-gray-200 flex items-center justify-center group-hover:scale-[1.02] group-hover:shadow-md transition-all duration-200 ease-out">
          <img
            src={getAssetPath(image)}
            alt={alt}
            className="w-full h-full object-contain transition-transform duration-300"
            loading="eager"
            decoding="async"
            onError={(e) => {
              console.log('Image failed to load:', e.currentTarget.src);
              e.currentTarget.src = getAssetPath('/Images/Halylar/Cream/abadan-haly-Gunes- Cream- 2004- carpet.jpg');
            }}
          />
        </div>
        
        {/* Product Name */}
        <div className="mt-3 text-center text-sm font-medium text-neutral-800 truncate">
          {name}
        </div>
      </button>

      {/* Lightbox Dialog */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 z-[1000]" />
          <Dialog.Content className="fixed inset-0 flex items-center justify-center z-[1000] p-4">
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-all duration-300 z-20 bg-white/20 backdrop-blur-xl rounded-full p-3 hover:bg-white/30 hover:scale-110 border border-white/30"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Navigation Buttons */}
            {allProducts.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center text-gray-800 shadow-xl hover:bg-white hover:scale-110 transition-all duration-200 z-20 border border-white/30"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center text-gray-800 shadow-xl hover:bg-white hover:scale-110 transition-all duration-200 z-20 border border-white/30"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
            
            {/* Image Container */}
            <div 
              className="relative max-w-[90vw] max-h-[90vh]"
              onTouchStart={handleTouchStart}
            >
              <img
                src={currentProduct?.image ? getAssetPath(currentProduct.image) : getAssetPath(image)}
                alt={currentProduct?.alt || currentProduct?.name || alt}
                className="object-contain w-auto h-auto max-w-[90vw] max-h-[90vh] rounded-md"
                loading="eager"
                onError={(e) => {
                  console.log('Image failed to load:', e.currentTarget.src);
                  e.currentTarget.src = getAssetPath('/Images/Halylar/Cream/abadan-haly-Gunes- Cream- 2004- carpet.jpg');
                }}
              />
              
              {/* Product Info */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center bg-black/70 backdrop-blur-sm text-sm px-6 py-3 rounded-full font-medium shadow-lg">
                {currentProduct?.name || name}
              </div>
              
              {/* Product Counter */}
              {allProducts.length > 1 && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-center bg-black/70 backdrop-blur-sm text-xs px-4 py-2 rounded-full font-medium">
                  {currentIndex + 1} / {allProducts.length}
                </div>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
