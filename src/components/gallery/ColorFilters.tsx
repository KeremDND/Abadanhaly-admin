
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { products } from '../../../data/products';

interface ColorFiltersProps {
  selectedColor: string | null;
  onColorChange: (color: string | null) => void;
}

// Color mapping for visual indicators
const colorMap: Record<string, { bg: string; border: string; name: string }> = {
  'Cream': { bg: '#F5F5DC', border: '#E8E8D0', name: 'Cream' },
  'Dark Grey': { bg: '#2F2F2F', border: '#1F1F1F', name: 'Dark Grey' },
  'Green': { bg: '#90EE90', border: '#7ACC7A', name: 'Green' },
  'Grey': { bg: '#808080', border: '#606060', name: 'Grey' },
  'Grey Green': { bg: '#A9A9A9', border: '#8B8B8B', name: 'Grey Green' },
  'Red': { bg: '#DC143C', border: '#B22222', name: 'Red' },
  'Yellow Grey': { bg: '#D3D3D3', border: '#B8B8B8', name: 'Yellow Grey' },
};

export function ColorFilters({ selectedColor, onColorChange }: ColorFiltersProps) {
  const { t } = useTranslation();
  // Extract unique colors from products
  const availableColors = useMemo(() => {
    const colors = [...new Set(products.map(product => product.color))].sort();
    return colors;
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
      {/* All Colors Button - Color Circle Only */}
      <button
        onClick={() => onColorChange(null)}
        className={`flex items-center justify-center w-10 h-10 rounded-full liquid-glass ${
          selectedColor === null
            ? 'bg-[#0F3B2F] border-2 border-[#0F3B2F] shadow-lg scale-110 ring-2 ring-[#0F3B2F] ring-offset-2'
            : 'bg-white/4 border-2 border-white/40'
        }`}
        title={t('gallery.colors.all')}
      >
        <div className={`w-5 h-5 rounded-full border-2 ${
          selectedColor === null ? 'bg-white border-white' : 'bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 border-white/60'
        }`}></div>
      </button>

      {/* Color Swatches - Only Color Circles, No Text */}
      {availableColors.map((color) => {
        const colorStyle = colorMap[color] || { bg: '#808080', border: '#606060', name: color };
        return (
          <button
            key={color}
            onClick={() => onColorChange(color)}
            className={`flex items-center justify-center w-10 h-10 rounded-full liquid-glass ${
              selectedColor === color
                ? 'bg-[#0F3B2F] border-2 border-[#0F3B2F] shadow-lg scale-110 ring-2 ring-[#0F3B2F] ring-offset-2'
                : 'bg-white/4 border-2 border-white/40'
            }`}
            title={colorStyle.name}
          >
            <div 
              className="w-5 h-5 rounded-full border-2 shadow-sm"
              style={{
                backgroundColor: colorStyle.bg,
                borderColor: selectedColor === color ? 'white' : colorStyle.border
              }}
            ></div>
          </button>
        );
      })}
    </div>
  );
}
