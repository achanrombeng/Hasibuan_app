import { SEOHead } from '@/components/seo';
import { FlashSaleCountdown } from '@/components/shop';
import { ShopLayout } from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import { ApiCategory, ApiProduct, PaginatedResponse } from '@/types/shop';
import { Link, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ChevronDown, Filter, Flame, Star } from 'lucide-react';
import { useState } from 'react';

// Calculate end date outside component to avoid impure function in render
const SALE_END_DATE = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

interface Props {
    products: PaginatedResponse<ApiProduct>;
    categories: ApiCategory[];
    currentCategory?: ApiCategory;
    filters: { filter?: Record<string, string>; sort?: string };
}

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' as const },
    },
};

export default function HotSale({
    products,
    categories,
    currentCategory,
    filters,
}: Props) {
    const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
    const siteName = siteSettings?.site_name || 'Ronica';
    const safeFilters = Array.isArray(filters) ? {} : filters;

    // Normalize categories to handle API wrapping
    const normalizedCategories = Array.isArray(categories)
        ? categories
        : (categories as any)?.data || [];

    const [showFilters, setShowFilters] = useState(false);

    const handleSort = (sort: string) => {
        router.get(
            '/shop/hot-sale',
            { ...safeFilters, sort },
            { preserveState: true },
        );
    };

    const handleCategoryFilter = (categoryId: number | null) => {
        const newFilters = { ...safeFilters.filter };
        if (categoryId) {
            newFilters.category_id = String(categoryId);
        } else {
            delete newFilters.category_id;
        }
        router.get(
            '/shop/hot-sale',
            { filter: newFilters, sort: safeFilters.sort },
            { preserveState: true },
        );
    };

    return (
        <>
            <SEOHead
                title="Hot Sale - Big Discounts"
                description={`Hot Sale at ${siteName}! Get up to 50% off on quality furniture. Limited time offer, shop now!`}
                keywords={[
                    'hot sale',
                    'furniture discount',
                    'promo furniture',
                    'cheap furniture',
                ]}
            />
            <div className="bg-noise" />
            <ShopLayout>
                <main className="min-h-screen bg-neutral-50 pb-20">
                    {/* Hero Banner - Updated to new design */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="mb-12 bg-gradient-to-r from-teal-600 to-teal-500 py-16 text-white"
                    >
                        <div className="mx-auto max-w-[1400px] px-6 text-center md:px-12">
                            <motion.div
                                variants={itemVariants}
                                className="mb-4 flex items-center justify-center gap-3"
                            >
                                <Flame
                                    size={40}
                                    className="animate-pulse text-accent-500"
                                />
                                <h1 className="font-display text-4xl font-bold md:text-5xl">
                                    HOT SALE
                                </h1>
                                <Flame
                                    size={40}
                                    className="animate-pulse text-accent-500"
                                />
                            </motion.div>
                            <motion.p
                                variants={itemVariants}
                                className="text-xl opacity-90"
                            >
                                Up to 70% off on selected products!
                            </motion.p>
                            <motion.p
                                variants={itemVariants}
                                className="mt-2 text-sm opacity-75"
                            >
                                Limited time offer, hurry before stocks run out!
                            </motion.p>

                            {/* Flash Sale Countdown */}
                            <motion.div
                                variants={itemVariants}
                                className="mx-auto mt-8 max-w-xl"
                            >
                                <FlashSaleCountdown
                                    endDate={SALE_END_DATE}
                                    title="Offer Ends In"
                                    className="bg-white/10 backdrop-blur-sm"
                                />
                            </motion.div>
                        </div>
                    </motion.div>

                    <div className="mx-auto max-w-[1400px] px-6 md:px-12">
                        {/* Filters Bar */}
                        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center gap-2 rounded-sm border border-neutral-200 bg-white px-4 py-2 hover:border-teal-500"
                                >
                                    <Filter size={18} />
                                    <span>Filter</span>
                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform ${showFilters ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                <span className="text-neutral-500">
                                    {products.meta.total} products
                                </span>
                            </div>
                            <select
                                value={safeFilters.sort || ''}
                                onChange={(e) => handleSort(e.target.value)}
                                className="rounded-sm border border-neutral-200 bg-white px-4 py-2 outline-none focus:border-teal-500"
                            >
                                <option value="">Sort By</option>
                                <option value="-sold_count">Best Seller</option>
                                <option value="-created_at">Newest</option>
                            </select>
                        </div>

                        {/* Category Filter */}
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-8 rounded-sm bg-white p-6"
                            >
                                <h3 className="mb-4 font-medium text-neutral-800">
                                    Category
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() =>
                                            handleCategoryFilter(null)
                                        }
                                        className={`rounded-sm px-4 py-2 text-sm ${!safeFilters.filter?.category_id ? 'bg-teal-500 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
                                    >
                                        All
                                    </button>
                                    {normalizedCategories.map(
                                        (cat: ApiCategory) => (
                                            <button
                                                key={cat.id}
                                                onClick={() =>
                                                    handleCategoryFilter(cat.id)
                                                }
                                                className={`rounded-sm px-4 py-2 text-sm ${safeFilters.filter?.category_id === String(cat.id) ? 'bg-teal-500 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
                                            >
                                                {cat.name}
                                            </button>
                                        ),
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Products Grid */}
                        {products.data.length > 0 ? (
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={containerVariants}
                                className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4"
                            >
                                {products.data.map((product) => (
                                    <motion.div
                                        key={product.id}
                                        variants={itemVariants}
                                    >
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <div className="rounded-sm bg-white py-20 text-center">
                                <Flame
                                    size={48}
                                    className="mx-auto mb-4 text-neutral-300"
                                />
                                <h3 className="mb-2 text-xl font-medium text-neutral-800">
                                    No Hot Sale Products Yet
                                </h3>
                                <p className="mb-6 text-neutral-500">
                                    Stay tuned for exciting offers!
                                </p>
                                <Link
                                    href="/shop/products"
                                    className="inline-flex items-center gap-2 rounded-sm bg-teal-500 px-6 py-3 text-white hover:bg-teal-600"
                                >
                                    View All Products
                                </Link>
                            </div>
                        )}

                        {/* Pagination */}
                        {products.meta.last_page > 1 && (
                            <div className="mt-12 flex justify-center gap-2">
                                {products.meta.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        className={`rounded-sm px-4 py-2 text-sm ${link.active ? 'bg-teal-500 text-white' : link.url ? 'bg-white text-neutral-700 hover:bg-neutral-100' : 'cursor-not-allowed bg-neutral-100 text-neutral-400'}`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </ShopLayout>
        </>
    );
}

function ProductCard({ product }: { product: ApiProduct }) {
    const imageUrl =
        product.primary_image?.image_url ||
        product.images?.[0]?.image_url ||
        '/images/placeholder-product.svg';
    return (
        <Link
            href={`/shop/products/${product.slug}`}
            className="group overflow-hidden rounded-sm border border-neutral-100 bg-white transition-all hover:shadow-lg"
        >
            <div className="relative aspect-square overflow-hidden">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 right-3 flex items-center gap-1 rounded-sm bg-accent-500 px-3 py-1 text-xs font-medium text-neutral-800">
                    <Flame size={14} />
                    HOT
                </span>
            </div>
            <div className="p-4">
                <h3 className="mb-2 line-clamp-2 font-medium text-neutral-800 transition-colors group-hover:text-teal-500">
                    {product.name}
                </h3>
                <div className="mb-2 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                            key={s}
                            size={14}
                            className={
                                s <= Math.round(product.average_rating)
                                    ? 'fill-accent-500 text-accent-500'
                                    : 'text-neutral-200'
                            }
                        />
                    ))}
                    <span className="ml-1 text-xs text-neutral-500">
                        ({product.review_count})
                    </span>
                </div>
                <span className="text-xs font-medium text-teal-600">
                    View Details &rarr;
                </span>
            </div>
        </Link>
    );
}
