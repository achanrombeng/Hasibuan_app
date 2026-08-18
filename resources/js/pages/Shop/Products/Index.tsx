import { BreadcrumbStructuredData, SEOHead } from '@/components/seo';
import { QuickViewModal } from '@/components/shop';
import { ShopLayout } from '@/layouts/ShopLayout';
import { SharedData } from '@/types';
import {
    ApiCategory,
    ApiProduct,
    PaginatedResponse,
    ProductFilters,
} from '@/types/shop';
import { Link, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    Eye,
    Grid3X3,
    Heart,
    LayoutList,
    Loader2,
    Search,
    ShoppingBag,
    SlidersHorizontal,
    Star,
    X,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
    products: PaginatedResponse<ApiProduct>;
    categories: ApiCategory[];
    currentCategory?: ApiCategory;
    filters: ProductFilters;
}

const SORT_OPTIONS = [
    { value: '-created_at', label: 'Terbaru' },
    { value: 'created_at', label: 'Terlama' },
    { value: 'name', label: 'A-Z' },
    { value: '-name', label: 'Z-A' },
];

export default function ProductsIndex({
    products,
    categories,
    currentCategory,
    filters,
}: Props) {
    const { siteSettings, featuredCategories: sharedCategories } =
        usePage<SharedData>().props;
    const siteName = siteSettings?.site_name || 'Ronica';
    const safeFilters = Array.isArray(filters) ? {} : filters;

    // Handle CategoryResource wrapping (data property)
    const normalizedCategories = Array.isArray(categories)
        ? categories
        : (categories as any)?.data || [];

    const normalizedCurrentCategory =
        currentCategory && 'data' in currentCategory
            ? (currentCategory as any).data
            : currentCategory;

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState(
        safeFilters.filter?.name || '',
    );
    const [selectedCategory, setSelectedCategory] = useState<number | null>(
        safeFilters.filter?.category_id
            ? Number(safeFilters.filter.category_id)
            : normalizedCurrentCategory?.id
                ? Number(normalizedCurrentCategory.id)
                : null,
    );
    const [selectedSort, setSelectedSort] = useState(
        safeFilters.sort || '-created_at',
    );
    const [priceRange, setPriceRange] = useState<{
        min?: number;
        max?: number;
    }>({
        min: safeFilters.filter?.price_min,
        max: safeFilters.filter?.price_max,
    });
    const [quickViewProduct, setQuickViewProduct] = useState<ApiProduct | null>(
        null,
    );

    const applyFilters = useCallback(() => {
        const params: Record<string, string> = {};

        if (searchQuery) params['filter[name]'] = searchQuery;
        if (selectedCategory)
            params['filter[category_id]'] = String(selectedCategory);
        if (priceRange.min)
            params['filter[price_min]'] = String(priceRange.min);
        if (priceRange.max)
            params['filter[price_max]'] = String(priceRange.max);
        if (selectedSort) params['sort'] = selectedSort;

        router.get('/shop/products', params, {
            preserveState: true,
            preserveScroll: true,
        });
    }, [searchQuery, selectedCategory, priceRange, selectedSort]);

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory(null);
        setPriceRange({});
        setSelectedSort('-created_at');
        router.get('/shop/products', {}, { preserveState: true });
    };

    // Debounced search - only trigger when user stops typing
    useEffect(() => {
        // Skip if searchQuery matches current filter (avoid loop on page load)
        const currentFilterName = safeFilters.filter?.name || '';
        if (searchQuery === currentFilterName) {
            return;
        }

        const timer = setTimeout(() => {
            const params: Record<string, string> = {};

            if (searchQuery) params['filter[name]'] = searchQuery;
            if (selectedCategory)
                params['filter[category_id]'] = String(selectedCategory);
            if (priceRange.min)
                params['filter[price_min]'] = String(priceRange.min);
            if (priceRange.max)
                params['filter[price_max]'] = String(priceRange.max);
            if (selectedSort) params['sort'] = selectedSort;

            router.get('/shop/products', params, {
                preserveState: true,
                preserveScroll: true,
            });
        }, 500);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery]);

    const hasActiveFilters =
        searchQuery || selectedCategory || priceRange.min || priceRange.max;

    // SEO Data
    const pageTitle = normalizedCurrentCategory
        ? normalizedCurrentCategory.name
        : 'Semua Produk';
    const pageDescription = normalizedCurrentCategory
        ? `Koleksi ${normalizedCurrentCategory.name} berkualitas tinggi di ${siteName}. Temukan berbagai pilihan ${normalizedCurrentCategory.name?.toLowerCase() || ''} dengan harga terbaik.`
        : `Jelajahi koleksi lengkap furnitur berkualitas di ${siteName}. Kursi, meja, lemari, dan berbagai furnitur lainnya dengan harga terjangkau.`;
    const breadcrumbItems = [
        {
            name: 'Beranda',
            url:
                typeof window !== 'undefined'
                    ? `${window.location.origin}/shop`
                    : '/shop',
        },
        ...(normalizedCurrentCategory
            ? [
                {
                    name: normalizedCurrentCategory.name,
                    url:
                        typeof window !== 'undefined'
                            ? `${window.location.origin}/shop/products?filter[category]=${normalizedCurrentCategory.slug}`
                            : `/shop/products?filter[category]=${normalizedCurrentCategory.slug}`,
                },
            ]
            : [
                {
                    name: 'Semua Produk',
                    url:
                        typeof window !== 'undefined'
                            ? `${window.location.origin}/shop/products`
                            : '/shop/products',
                },
            ]),
    ];

    return (
        <>
            <SEOHead
                title={pageTitle}
                description={pageDescription}
                keywords={
                    normalizedCurrentCategory
                        ? [normalizedCurrentCategory.name, 'furnitur', 'mebel']
                        : [
                            'furnitur',
                            'furniture',
                            'mebel',
                            'kursi',
                            'meja',
                            'lemari',
                        ]
                }
            />
            <BreadcrumbStructuredData items={breadcrumbItems} />
            <div className="bg-noise" />
            <ShopLayout>
                <main className="min-h-screen bg-white pt-8 pb-20">
                    <div className="mx-auto max-w-[1400px] px-6 md:px-12">
                        {/* Breadcrumb */}
                        <nav className="mb-8 flex items-center gap-2 text-sm text-neutral-500">
                            <Link href="/shop" className="hover:text-teal-500">
                                Beranda
                            </Link>
                            <span>/</span>
                            <span className="text-neutral-900">
                                {normalizedCurrentCategory
                                    ? normalizedCurrentCategory.name
                                    : 'Semua Produk'}
                            </span>
                        </nav>

                        {/* Header */}
                        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                            <div>
                                <h1 className="font-serif text-4xl text-neutral-900 md:text-5xl">
                                    {normalizedCurrentCategory
                                        ? normalizedCurrentCategory.name
                                        : 'Semua Produk'}
                                </h1>
                                <p className="mt-2 text-neutral-500">
                                    {products.meta.total} produk ditemukan
                                </p>
                            </div>

                            {/* Search & Filter Toggle */}
                            <div className="flex items-center gap-4">
                                <div className="relative flex-1 md:w-80">
                                    <Search
                                        className="absolute top-1/2 left-4 -translate-y-1/2 text-neutral-400"
                                        size={20}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Cari produk..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="w-full rounded-sm border border-neutral-200 py-3 pr-4 pl-12 transition-colors focus:border-teal-500 focus:outline-none"
                                    />
                                </div>
                                <button
                                    onClick={() => setShowFilters(true)}
                                    className="flex items-center gap-2 rounded-sm border border-neutral-200 bg-white px-4 py-3 text-neutral-700 transition-colors hover:border-teal-500 hover:text-teal-600"
                                >
                                    <SlidersHorizontal size={20} />
                                    <span className="hidden sm:inline">
                                        Filter
                                    </span>
                                </button>
                                <div className="hidden items-center gap-1 rounded-sm border border-neutral-200 p-1 md:flex">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`rounded-sm p-2 transition-colors ${viewMode === 'grid' ? 'bg-teal-500 text-white' : 'text-neutral-500 hover:bg-neutral-100'}`}
                                    >
                                        <Grid3X3 size={18} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`rounded-sm p-2 transition-colors ${viewMode === 'list' ? 'bg-teal-500 text-white' : 'text-neutral-500 hover:bg-neutral-100'}`}
                                    >
                                        <LayoutList size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Active Filters */}
                        {hasActiveFilters && (
                            <div className="mb-6 flex flex-wrap items-center gap-2">
                                <span className="text-sm text-neutral-500">
                                    Active Filters:
                                </span>

                                {selectedCategory && (
                                    <button
                                        onClick={() =>
                                            setSelectedCategory(null)
                                        }
                                        className="flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-100"
                                    >
                                        {normalizedCategories.find(
                                            (c: ApiCategory) =>
                                                Number(c.id) ===
                                                Number(selectedCategory),
                                        )?.name ||
                                            (normalizedCurrentCategory &&
                                                Number(
                                                    normalizedCurrentCategory.id,
                                                ) === Number(selectedCategory)
                                                ? normalizedCurrentCategory.name
                                                : 'Category')}
                                        <X size={14} />
                                    </button>
                                )}

                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="flex items-center gap-1 rounded-sm bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-100"
                                    >
                                        Search: {searchQuery}
                                        <X size={14} />
                                    </button>
                                )}

                                {(priceRange.min || priceRange.max) && (
                                    <button
                                        onClick={() => setPriceRange({})}
                                        className="flex items-center gap-1 rounded-sm bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-100"
                                    >
                                        Price
                                        <X size={14} />
                                    </button>
                                )}

                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-neutral-500 underline hover:text-neutral-900"
                                >
                                    Clear All
                                </button>
                            </div>
                        )}

                        {/* Product Content */}
                        <div className="flex-1">
                            <ProductGrid
                                products={products.data}
                                viewMode={viewMode}
                                onQuickView={setQuickViewProduct}
                            />
                            <Pagination meta={products.meta} />
                        </div>
                    </div>
                </main>

                <FilterDrawer
                    isOpen={showFilters}
                    onClose={() => setShowFilters(false)}
                    categories={normalizedCategories}
                    featuredCategories={sharedCategories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    selectedSort={selectedSort}
                    setSelectedSort={setSelectedSort}
                    onApply={() => {
                        applyFilters();
                        setShowFilters(false);
                    }}
                    onClear={clearFilters}
                    hasActiveFilters={!!hasActiveFilters}
                />

                <QuickViewModal
                    product={quickViewProduct}
                    isOpen={!!quickViewProduct}
                    onClose={() => setQuickViewProduct(null)}
                />
            </ShopLayout>
        </>
    );
}

// ==================== Filter Drawer ====================
interface FilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    categories: ApiCategory[];
    featuredCategories?: ApiCategory[];
    selectedCategory: number | null;
    setSelectedCategory: (id: number | null) => void;
    priceRange: { min?: number; max?: number };
    setPriceRange: (range: { min?: number; max?: number }) => void;
    selectedSort: string;
    setSelectedSort: (sort: string) => void;
    onApply: () => void;
    onClear: () => void;
    hasActiveFilters: boolean;
}

// ... (imports remain the same, just removing createPortal usually) but since I can't edit multiple distinct blocks easily without multi_replace, I will focus on the component function first.

// wait, I can do it in two steps or use standard replace for the component.

// Re-add import for createPortal if missing (I'll do it in a separate step or assume it's there? It was removed. Need to add it back).
// Actually, I can replace the component first, then add the import.

// Import CATEGORIES from constants at the top (need separate tool or do it here if possible? I cannot add import easily without messing up top of file. I will just use the prop categories first. If user insists on data, I will suggest checking backend)
// Wait, I can add fallback if I import it. I'll add the import in a previous step?
// No, I'll rewrite the component first.
// Actually, I can use the replace_file_content to replace the FilterDrawer AND the ShopLayout usage.

// First, let's fix the FilterDrawer component.

// Import CATEGORIES

function FilterDrawer({
    isOpen,
    onClose,
    categories,
    featuredCategories,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    selectedSort,
    setSelectedSort,
    onApply,
    onClear,
    hasActiveFilters,
}: FilterDrawerProps) {
    const [mounted, setMounted] = useState(false);
    // Two states for animation:
    // 1. shouldRender: controls whether the component is in the DOM (createPortal)
    // 2. isVisible: controls the CSS opacity/transform classes
    const [shouldRender, setShouldRender] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (isOpen) {
            // Mount first
            setShouldRender(true);
            // Then fade in (use double RAF to ensure paint happens first)
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsVisible(true);
                });
            });
        } else {
            // Fade out first
            setIsVisible(false);
            // Then unmount after transition matches duration (300ms)
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!mounted || typeof document === 'undefined' || !shouldRender)
        return null;

    // Safety check for categories
    const safeCategories = Array.isArray(categories) ? categories : [];
    const safeFeaturedCategories = Array.isArray(featuredCategories)
        ? featuredCategories
        : [];

    return createPortal(
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'
                    }`}
                onClick={onClose}
                aria-hidden="true"
            />
            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 z-[60] flex h-full w-full max-w-sm transform flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${isVisible ? 'translate-x-0' : 'translate-x-full'
                    }`}
                onTransitionEnd={() => {
                    if (!isOpen && !isVisible) {
                        // Optional cleanup if needed
                    }
                }}
            >
                <div className="flex items-center justify-between border-b border-neutral-100 p-6">
                    <h2 className="font-display text-xl font-semibold text-neutral-900">
                        Filter & Sort
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-sm p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 space-y-8 overflow-y-auto p-6">
                    {/* Sort */}
                    <div>
                        <h3 className="mb-4 font-medium text-neutral-900">
                            Urutkan
                        </h3>
                        <select
                            value={selectedSort}
                            onChange={(e) => {
                                setSelectedSort(e.target.value);
                            }}
                            className="w-full rounded-sm border border-neutral-200 p-3 ring-teal-500 focus:border-teal-500 focus:ring-1 focus:outline-none"
                        >
                            {SORT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="mb-4 font-medium text-neutral-900">
                            Kategori
                        </h3>
                        <div className="space-y-2">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`w-full rounded-sm px-4 py-2 text-left transition-colors ${!selectedCategory ? 'bg-teal-50 font-medium text-teal-700' : 'text-neutral-600 hover:bg-neutral-50'}`}
                            >
                                Semua Kategori
                            </button>
                            {safeCategories.length > 0 ? (
                                safeCategories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() =>
                                            setSelectedCategory(cat.id)
                                        }
                                        className={`w-full rounded-sm px-4 py-2 text-left transition-colors ${selectedCategory === cat.id ? 'bg-teal-50 font-medium text-teal-700' : 'text-neutral-600 hover:bg-neutral-50'}`}
                                    >
                                        {cat.name}
                                    </button>
                                ))
                            ) : (
                                <p className="px-4 py-2 text-sm text-neutral-400">
                                    Tidak ada kategori tersedia
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="border-t border-neutral-100 bg-neutral-50 p-6">
                    <div className="flex gap-3">
                        <button
                            onClick={onApply}
                            className="flex-1 rounded-sm bg-teal-600 py-3 font-medium text-white shadow-sm transition-colors hover:bg-teal-700"
                        >
                            Terapkan Filter
                        </button>
                        {hasActiveFilters && (
                            <button
                                onClick={onClear}
                                className="rounded-sm border border-neutral-200 bg-white px-4 py-3 text-neutral-600 transition-colors hover:border-neutral-300 hover:text-neutral-900"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>,
        document.body,
    );
}

// ==================== Product Grid ====================
interface ProductGridProps {
    products: ApiProduct[];
    viewMode: 'grid' | 'list';
    onQuickView: (product: ApiProduct) => void;
}

function ProductGrid({ products, viewMode, onQuickView }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="py-20 text-center">
                <ShoppingBag
                    className="mx-auto mb-4 text-neutral-300"
                    size={64}
                />
                <h3 className="mb-2 text-xl font-medium text-neutral-900">
                    Tidak ada produk ditemukan
                </h3>
                <p className="text-neutral-500">
                    Coba ubah filter atau kata kunci pencarian Anda
                </p>
            </div>
        );
    }

    return (
        <div
            className={
                viewMode === 'grid'
                    ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
                    : 'space-y-6'
            }
        >
            {products.map((product, index) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                    index={index}
                    onQuickView={onQuickView}
                />
            ))}
        </div>
    );
}

// ==================== Product Card ====================
interface ProductCardProps {
    product: ApiProduct;
    viewMode: 'grid' | 'list';
    index: number;
    onQuickView: (product: ApiProduct) => void;
}

function ProductCard({
    product,
    viewMode,
    index,
    onQuickView,
}: ProductCardProps) {
    const { auth } = usePage<SharedData>().props;
    const [isWishlisted, setIsWishlisted] = useState(product.is_wishlisted);
    const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    // Sync prop changes
    useEffect(() => {
        setIsWishlisted(product.is_wishlisted);
    }, [product.is_wishlisted]);

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!auth?.user) {
            router.visit('/login');
            return;
        }

        setIsTogglingWishlist(true);

        router.post(
            `/shop/wishlist/${product.id}`,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => {
                    setIsTogglingWishlist(false);
                },
            },
        );
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!auth?.user) {
            router.visit('/login');
            return;
        }

        setIsAddingToCart(true);

        router.post(
            '/shop/cart',
            { product_id: product.id, quantity: 1 },
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => {
                    setIsAddingToCart(false);
                },
            },
        );
    };

    const imageUrl =
        product.primary_image?.image_url ||
        product.images?.[0]?.image_url ||
        '/images/placeholder-product.svg';

    if (viewMode === 'list') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
            >
                <Link
                    href={`/shop/products/${product.slug}`}
                    className="group flex gap-6 rounded-sm border border-neutral-100 bg-white p-4 transition-shadow hover:shadow-lg"
                >
                    <div className="relative h-48 w-48 flex-shrink-0 overflow-hidden rounded-sm bg-neutral-100">
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onQuickView(product);
                            }}
                            className="absolute right-2 bottom-2 rounded-sm bg-white/90 p-2 text-neutral-900 opacity-0 transition-colors group-hover:opacity-100 hover:bg-white"
                            title="Quick View"
                        >
                            <Eye size={16} />
                        </button>
                    </div>
                    <div className="flex flex-1 flex-col justify-between py-2">
                        <div>
                            <p className="mb-1 text-sm text-neutral-500">
                                {product.category?.name}
                            </p>
                            <h3 className="mb-2 font-serif text-xl text-neutral-900">
                                {product.name}
                            </h3>
                            <p className="line-clamp-2 text-sm text-neutral-600">
                                {product.short_description}
                            </p>
                        </div>
                        <div className="flex items-center justify-end">
                            <div className="flex gap-2">
                                <button
                                    onClick={handleWishlistToggle}
                                    disabled={isTogglingWishlist}
                                    className={`rounded-sm border p-3 transition-colors disabled:cursor-not-allowed ${isWishlisted
                                            ? 'border-red-200 bg-red-50 text-red-500'
                                            : 'border-neutral-200 hover:border-neutral-900'
                                        }`}
                                >
                                    {isTogglingWishlist ? (
                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <Heart
                                            size={18}
                                            className={
                                                isWishlisted
                                                    ? 'fill-current'
                                                    : ''
                                            }
                                        />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </Link>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group"
        >
            <Link href={`/shop/products/${product.slug}`} className="block transition-all duration-400 ease-out hover:scale-105 hover:-translate-y-2 hover:z-10">
                <div className="relative mb-4 aspect-square overflow-hidden rounded-sm bg-neutral-100 shadow-sm transition-all duration-500 group-hover:shadow-2xl">
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                    <div className="absolute right-4 bottom-4 flex gap-2 opacity-0 transition-all duration-300 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onQuickView(product);
                            }}
                            className="rounded-sm bg-white/95 p-3 text-neutral-900 shadow-md backdrop-blur-sm transition-colors hover:bg-white"
                            title="Quick View"
                        >
                            <Eye size={18} />
                        </button>
                        <button
                            onClick={handleWishlistToggle}
                            disabled={isTogglingWishlist}
                            className={`rounded-sm p-3 shadow-md backdrop-blur-sm transition-colors disabled:cursor-not-allowed ${isWishlisted
                                    ? 'bg-red-50 text-red-500'
                                    : 'bg-white/95 text-neutral-900 hover:bg-white'
                                }`}
                        >
                            {isTogglingWishlist ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <Heart
                                    size={18}
                                    className={
                                        isWishlisted ? 'fill-current' : ''
                                    }
                                />
                            )}
                        </button>
                    </div>
                </div>
                <div>
                    <p className="mb-1 text-sm text-neutral-500">
                        {product.category?.name}
                    </p>
                    <h3 className="mb-2 font-serif text-lg text-neutral-900 transition-colors group-hover:text-teal-600">
                        {product.name}
                    </h3>
                </div>
            </Link>
        </motion.div>
    );
}

// ==================== Pagination ====================
interface PaginationProps {
    meta: {
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
}

function Pagination({ meta }: PaginationProps) {
    if (meta.last_page <= 1) return null;

    const pages: (number | string)[] = [];
    const current = meta.current_page;
    const last = meta.last_page;

    // Build page numbers array
    if (last <= 7) {
        for (let i = 1; i <= last; i++) pages.push(i);
    } else {
        if (current <= 3) {
            pages.push(1, 2, 3, 4, '...', last);
        } else if (current >= last - 2) {
            pages.push(1, '...', last - 3, last - 2, last - 1, last);
        } else {
            pages.push(
                1,
                '...',
                current - 1,
                current,
                current + 1,
                '...',
                last,
            );
        }
    }

    const goToPage = (page: number) => {
        router.get(
            window.location.pathname,
            {
                ...Object.fromEntries(
                    new URLSearchParams(window.location.search),
                ),
                page,
            },
            { preserveState: true },
        );
    };

    return (
        <div className="mt-12 flex items-center justify-between border-t border-neutral-100 pt-8">
            <p className="text-sm text-neutral-500">
                Menampilkan {meta.from}-{meta.to} dari {meta.total} produk
            </p>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => goToPage(current - 1)}
                    disabled={current === 1}
                    className="rounded-sm border border-neutral-200 p-2 transition-colors hover:border-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <ChevronLeft size={18} />
                </button>
                {pages.map((page, i) =>
                    typeof page === 'number' ? (
                        <button
                            key={i}
                            onClick={() => goToPage(page)}
                            className={`h-10 w-10 rounded-sm font-medium transition-colors ${page === current
                                    ? 'bg-teal-500 text-white'
                                    : 'border border-neutral-200 hover:border-neutral-900'
                                }`}
                        >
                            {page}
                        </button>
                    ) : (
                        <span key={i} className="px-2 text-neutral-400">
                            ...
                        </span>
                    ),
                )}
                <button
                    onClick={() => goToPage(current + 1)}
                    disabled={current === last}
                    className="rounded-sm border border-neutral-200 p-2 transition-colors hover:border-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
}
