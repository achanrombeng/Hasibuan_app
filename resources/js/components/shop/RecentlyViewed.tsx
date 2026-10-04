import { ApiProduct } from '@/types/shop';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Star } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ProductImagePlaceholder } from './ProductImagePlaceholder';

const STORAGE_KEY = 'recently_viewed_products';
const MAX_ITEMS = 10;
const PLACEHOLDER_PRODUCT = '/images/placeholder-product.svg';

export interface RecentlyViewedProduct {
  id: number;
  name: string;
  slug: string;
  sku?: string;
  image_url?: string;
  average_rating: number;
  viewedAt: number;
}

// Helper to save product to recently viewed
export function saveToRecentlyViewed(product: ApiProduct) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    let items: RecentlyViewedProduct[] = stored ? JSON.parse(stored) : [];

    // Remove if already exists
    items = items.filter((item) => item.id !== product.id);

    // Add to beginning
    items.unshift({
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      image_url:
        product.primary_image?.image_url ||
        product.images?.[0]?.image_url ||
        '',
      average_rating: product.average_rating,
      viewedAt: Date.now(),
    });

    // Keep only max items
    items = items.slice(0, MAX_ITEMS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving to recently viewed:', e);
  }
}

// Get recently viewed products
export function getRecentlyViewed(): RecentlyViewedProduct[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

interface RecentlyViewedSectionProps {
  excludeProductId?: number;
  maxItems?: number;
  className?: string;
}

function getFilteredProducts(
  excludeProductId: number | undefined,
  maxItems: number,
): RecentlyViewedProduct[] {
  let items = getRecentlyViewed();
  if (excludeProductId) {
    items = items.filter((p) => p.id !== excludeProductId);
  }
  return items.slice(0, maxItems);
}

export function RecentlyViewedSection({
  excludeProductId,
  maxItems = 6,
  className = '',
}: RecentlyViewedSectionProps) {
  const initialProducts = useMemo(
    () => getFilteredProducts(excludeProductId, maxItems),
    [excludeProductId, maxItems],
  );
  const [products, setProducts] =
    useState<RecentlyViewedProduct[]>(initialProducts);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    // Update products when localStorage changes (e.g., from another tab)
    const handleStorageChange = () => {
      setProducts(getFilteredProducts(excludeProductId, maxItems));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [excludeProductId, maxItems]);

  if (products.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('recently-viewed-container');
    if (!container) return;
    const scrollAmount = 280;
    const newPosition =
      direction === 'left'
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;
    container.scrollTo({ left: newPosition, behavior: 'smooth' });
    setScrollPosition(newPosition);
  };

  return (
    <section className={`py-12 ${className}`}>
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock size={24} className="text-terra-500" />
            <h2 className="font-serif text-xl text-terra-900">
              Recently Viewed
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="rounded-full bg-terra-100 p-2 text-terra-700 transition-colors hover:bg-terra-200"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="rounded-full bg-terra-100 p-2 text-terra-700 transition-colors hover:bg-terra-200"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div
          id="recently-viewed-container"
          className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-4"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id || `recently-viewed-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="w-[260px] flex-shrink-0"
            >
              <Link
                href={`/shop/products/${product.slug}`}
                className="group block overflow-hidden rounded-sm border border-terra-100 bg-white transition-all hover:shadow-lg"
              >
                <div className="relative flex aspect-square items-center justify-center overflow-hidden">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <ProductImagePlaceholder
                      name={product.name}
                      sku={product.sku}
                      size="sm"
                    />
                  )}
                </div>
                <div className="p-3">
                  <h3 className="mb-1 line-clamp-2 text-sm font-medium text-terra-900 transition-colors group-hover:text-wood">
                    {product.name}
                  </h3>
                  <div className="mb-1 flex items-center gap-1">
                    <Star
                      size={12}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span className="text-xs text-terra-500">
                      {Number(product.average_rating || 0).toFixed(1)}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-wood">
                    View Details &rarr;
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
