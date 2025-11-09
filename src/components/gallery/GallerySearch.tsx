
import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface GallerySearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function GallerySearch({ searchTerm, onSearchChange }: GallerySearchProps) {
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative flex-1">
      <div className={`relative liquid-glass rounded-full overflow-hidden ${
        isFocused ? 'shadow-xl' : 'shadow-lg'
      }`}>
        <div className="flex items-center px-6 py-3.5">
          <Search className={`w-5 h-5 transition-colors duration-300 ${
            isFocused ? 'text-[#0F3B2F]' : 'text-gray-700'
          }`} />
          <input
            type="text"
            placeholder={t('gallery.search.placeholder')}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="flex-1 ml-4 bg-transparent border-none outline-none text-gray-900 placeholder-gray-600 text-sm font-semibold"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="ml-2 p-1 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-gray-500 hover:text-gray-700" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

