import { Package } from 'lucide-react';
import React from 'react';

interface ProductImagePlaceholderProps {
  name?: string;
  sku?: string;
  category?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ProductImagePlaceholder: React.FC<
  ProductImagePlaceholderProps
> = ({ name = '', sku = '', category, className = '', size = 'md' }) => {
  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-neutral-200/80 bg-gradient-to-br from-neutral-100 via-sand-50/90 to-neutral-200/60 p-4 text-center select-none ${className}`}
    >
      {/* Subtle background decorative watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.05]">
        <Package
          size={size === 'sm' ? 60 : size === 'lg' || size === 'xl' ? 180 : 120}
        />
      </div>

      {/* Central Icon Badge */}
      <div className="relative mb-2.5 flex items-center justify-center rounded-2xl border border-neutral-200/70 bg-white/90 p-2.5 shadow-xs">
        <Package
          className="text-teal-700/80"
          size={size === 'sm' ? 16 : size === 'lg' || size === 'xl' ? 28 : 20}
        />
      </div>

      {/* Product Name */}
      {name && (
        <p
          className={`relative line-clamp-2 max-w-[90%] font-serif leading-snug font-bold text-neutral-800 ${
            size === 'sm'
              ? 'text-xs'
              : size === 'lg' || size === 'xl'
                ? 'text-lg sm:text-2xl'
                : 'text-sm sm:text-base'
          }`}
        >
          {name}
        </p>
      )}

      {/* SKU Badge */}
      {sku && (
        <span
          className={`relative mt-2 inline-flex items-center rounded-md border border-neutral-300/80 bg-white/95 font-mono font-semibold tracking-wider text-neutral-600 shadow-2xs ${
            size === 'sm'
              ? 'px-1.5 py-0.5 text-[9px]'
              : size === 'lg' || size === 'xl'
                ? 'px-3 py-1 text-xs'
                : 'px-2.5 py-0.5 text-[10px]'
          }`}
        >
          {sku}
        </span>
      )}
    </div>
  );
};
