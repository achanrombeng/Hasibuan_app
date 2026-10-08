import { ApiProduct } from '@/types/shop';
import { Link } from '@inertiajs/react';
import React from 'react';
import { ProductImagePlaceholder } from './ProductImagePlaceholder';

interface ProductCardProps {
  product: ApiProduct;
  className?: string;
  onClick?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className = '',
  onClick,
}) => {
  const imageUrl =
    product.primary_image?.image_url || product.images?.[0]?.image_url;

  return (
    <Link
      href={`/shop/products/${product.slug}`}
      onClick={onClick}
      className={`group flex flex-col bg-[#fafaf9] border border-neutral-200/80 p-4 transition-all duration-300 hover:border-neutral-400 ${className}`}
    >
      {/* Product Image Frame */}
      <div className="relative aspect-square w-full overflow-hidden bg-white mb-4">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-contain p-2 rh-image-zoom transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <ProductImagePlaceholder
            name={product.name}
            sku={product.sku}
            category={product.category?.name}
            size="md"
          />
        )}

        {/* Hasibuan Hover Overlay Action */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-5 py-2.5 bg-white text-neutral-900 text-[10px] tracking-[0.25em] uppercase font-medium shadow-md">
            VIEW PIECE
          </span>
        </div>
      </div>

      {/* Product Meta & Typography */}
      <div className="space-y-1.5 mt-auto">
        <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-light block">
          {product.category?.name || 'COLLECTION'}
        </span>
        <h4 className="font-serif text-base tracking-[0.04em] uppercase text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-1 font-normal">
          {product.name}
        </h4>
        <p className="text-[11px] text-neutral-500 tracking-wide font-light line-clamp-1">
          {product.sku ? `SKU: ${product.sku}` : 'Handcrafted Teak & All-Weather Fiber'}
        </p>

        {/* Pricing & Trade Note */}
        <div className="pt-2 border-t border-neutral-200/60 flex items-center justify-between text-[11px] tracking-wider text-neutral-800">
          <span className="font-medium">TRADE & RESIDENCE</span>
          <span className="text-[10px] tracking-[0.2em] text-neutral-500 uppercase">
            EXPLORE
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
