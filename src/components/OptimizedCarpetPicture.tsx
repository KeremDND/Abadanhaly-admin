import { getAssetPath } from '../lib/paths';

type Rendition = { src: string; w: number };
type Item = {
  name: string; alt: string; width: number; height: number;
  srcset: { avif: Rendition[]; webp: Rendition[]; jpg: Rendition[] };
};

const toSrcset = (arr: Rendition[]) =>
  arr.sort((a,b)=>a.w-b.w).map(r => `${getAssetPath(r.src)} ${r.w}w`).join(', ');

export function OptimizedCarpetPicture({
  item,
  sizes = '(min-width:1280px) 25vw, (min-width:768px) 33vw, 100vw',
  className = ''
}: { item: Item; sizes?: string; className?: string }) {
  const ratio = item.width && item.height ? `${item.width}/${item.height}` : '1440/2020';
  const fallback = [...item.srcset.jpg].sort((a,b)=>a.w-b.w)[0]?.src || '';
  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`} style={{ aspectRatio: ratio }}>
      <picture>
        <source type="image/avif" srcSet={toSrcset(item.srcset.avif)} sizes={sizes} />
        <source type="image/webp" srcSet={toSrcset(item.srcset.webp)} sizes={sizes} />
        <img
          src={getAssetPath(fallback)}
          alt={item.alt}
          loading="eager"
          decoding="async"
          style={{ width:'100%', height:'100%', objectFit:'cover' }}
          onError={(e) => {
            if (import.meta.env.DEV) {
              console.error('OptimizedCarpetPicture image failed to load:', e.currentTarget.src);
            }
            const fallbackImg = getAssetPath('/Images/Halylar/Cream/abadan-haly-Gunes- Cream- 2004- carpet.jpg');
            if (e.currentTarget.src !== fallbackImg) {
              e.currentTarget.src = fallbackImg;
            }
          }}
        />
      </picture>
    </div>
  );
}