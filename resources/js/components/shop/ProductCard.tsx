import { ApiProduct } from '@/types/shop';
import { Link } from '@inertiajs/react';
import { Star } from 'lucide-react';

interface ProductCardProps {
    product: ApiProduct;
    className?: string;
    onClick?: () => void;
}

// Placeholder images for products without images
const PLACEHOLDER_PRODUCTS = [
    '/images/placeholders/product-sofa.png',
    '/images/placeholders/product-dining-table.png',
    '/images/placeholders/product-chair.png',
];

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    className = '',
    onClick,
}) => {
    return (
        <Link
            href={`/shop/products/${product.slug}`}
            onClick={onClick}
            className={`group block transition-all duration-400 ease-out hover:scale-105 hover:-translate-y-2 ${className}`}
        >
            {/* Product Card Container */}
            <div className="relative mb-4 overflow-hidden rounded-xl border border-neutral-100 bg-white shadow-xs transition-all duration-500 group-hover:shadow-xl">
                {/* Image Container */}
                <div className="aspect-square overflow-hidden bg-white flex items-center justify-center p-3">
                    <img
                        src={
                            product.primary_image?.image_url ||
                            product.images?.[0]?.image_url ||
                            PLACEHOLDER_PRODUCTS[0]
                        }
                        alt={product.name}
                        className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                </div>

                {/* Hover Overlay Badge */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/15">
                    <span className="translate-y-3 rounded-sm bg-white/95 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-800 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-white">
                        View Detail
                    </span>
                </div>
            </div>

            {/* Product Info */}
            <div className="space-y-1">
                <span className="text-xs font-medium tracking-wider text-teal-600 uppercase">
                    {product.category?.name}
                </span>
                <h3 className="font-display text-lg leading-snug font-medium text-neutral-800 transition-colors group-hover:text-teal-600">
                    {product.name}
                </h3>
            </div>
        </Link>
    );
};
