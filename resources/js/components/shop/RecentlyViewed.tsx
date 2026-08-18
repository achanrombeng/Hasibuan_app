import { useState, useEffect, useMemo } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Clock, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { ApiProduct } from '@/types/shop';

const STORAGE_KEY = 'recently_viewed_products';
const MAX_ITEMS = 10;
const PLACEHOLDER_PRODUCT = '/images/placeholder-product.svg';

export interface RecentlyViewedProduct {
    id: number;
    name: string;
    slug: string;
    price_formatted: string;
    final_price_formatted: string;
    has_discount: boolean;
    discount_percentage: number;
    image_url: string;
    average_rating: number;
    viewedAt: number;
}

// Helper to save product to recently viewed
export function saveToRecentlyViewed(product: ApiProduct) {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        let items: RecentlyViewedProduct[] = stored ? JSON.parse(stored) : [];

        // Remove if already exists
        items = items.filter(item => item.id !== product.id);

        // Add to beginning
        items.unshift({
            id: product.id,
            name: product.name,
            slug: product.slug,
            price_formatted: product.price_formatted,
            final_price_formatted: product.final_price_formatted,
            has_discount: product.has_discount,
            discount_percentage: product.discount_percentage,
            image_url: product.primary_image?.image_url || product.images?.[0]?.image_url || PLACEHOLDER_PRODUCT,
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

function getFilteredProducts(excludeProductId: number | undefined, maxItems: number): RecentlyViewedProduct[] {
    let items = getRecentlyViewed();
    if (excludeProductId) {
        items = items.filter(p => p.id !== excludeProductId);
    }
    return items.slice(0, maxItems);
}

export function RecentlyViewedSection({ excludeProductId, maxItems = 6, className = '' }: RecentlyViewedSectionProps) {
    const initialProducts = useMemo(() => getFilteredProducts(excludeProductId, maxItems), [excludeProductId, maxItems]);
    const [products, setProducts] = useState<RecentlyViewedProduct[]>(initialProducts);
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
        const newPosition = direction === 'left'
            ? Math.max(0, scrollPosition - scrollAmount)
            : scrollPosition + scrollAmount;
        container.scrollTo({ left: newPosition, behavior: 'smooth' });
        setScrollPosition(newPosition);
    };

    return (
        <section className={`py-12 ${className}`}>
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Clock size={24} className="text-terra-500" />
                        <h2 className="text-xl font-serif text-terra-900">Terakhir Dilihat</h2>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => scroll('left')} className="p-2 rounded-full bg-terra-100 hover:bg-terra-200 text-terra-700 transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={() => scroll('right')} className="p-2 rounded-full bg-terra-100 hover:bg-terra-200 text-terra-700 transition-colors">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div id="recently-viewed-container" className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-4">
                    {products.map((product, index) => (
                        <motion.div key={product.id || `recently-viewed-${index}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="flex-shrink-0 w-[260px]">
                            <Link href={`/shop/products/${product.slug}`} className="group block bg-white rounded-sm overflow-hidden border border-terra-100 hover:shadow-lg transition-all">
                                <div className="relative aspect-square overflow-hidden">
                                    <img src={product.image_url || '/images/placeholder-product.svg'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    {product.has_discount && (
                                        <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">-{product.discount_percentage}%</span>
                                    )}
                                </div>
                                <div className="p-3">
                                    <h3 className="font-medium text-terra-900 text-sm line-clamp-2 mb-1 group-hover:text-wood transition-colors">{product.name}</h3>
                                    <div className="flex items-center gap-1 mb-1">
                                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                                        <span className="text-xs text-terra-500">{Number(product.average_rating || 0).toFixed(1)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-terra-900 text-sm">{product.final_price_formatted}</span>
                                        {product.has_discount && <span className="text-xs text-terra-400 line-through">{product.price_formatted}</span>}
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

