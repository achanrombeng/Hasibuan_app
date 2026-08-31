import { BreadcrumbStructuredData, SEOHead } from '@/components/seo';
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
import { CatalogModal } from '@/components/shop/CatalogModal';
import {
    ArrowRight,
    BookOpen,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    Eye,
    Grid3X3,
    Heart,
    Layers,
    LayoutList,
    Loader2,
    Search,
    ShoppingBag,
    SlidersHorizontal,
    Star,
    X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
    products: PaginatedResponse<ApiProduct>;
    categories: ApiCategory[];
    currentCategory?: ApiCategory;
    filters: ProductFilters;
}

const SORT_OPTIONS = [
    { value: '-created_at', label: 'Newest' },
    { value: 'created_at', label: 'Oldest' },
    { value: 'name', label: 'A-Z' },
    { value: '-name', label: 'Z-A' },
];

const CATEGORY_IMAGE_MAP: Record<string, string> = {
    'dining-sets':
        'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=800&auto=format&fit=crop',
    'living-set':
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop',
    chairs:
        'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?q=80&w=800&auto=format&fit=crop',
    tables:
        'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=800&auto=format&fit=crop',
    collection:
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop',
    'lounge-set':
        'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=800&auto=format&fit=crop',
    daybeds:
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop',
    'comfort-product':
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop',
};

function getCategoryImageUrl(cat: ApiCategory): string {
    if (cat.image_url) return cat.image_url;
    const slugKey = (cat.slug || '').toLowerCase();
    if (CATEGORY_IMAGE_MAP[slugKey]) return CATEGORY_IMAGE_MAP[slugKey];

    const nameLower = (cat.name || '').toLowerCase();
    for (const [key, url] of Object.entries(CATEGORY_IMAGE_MAP)) {
        if (nameLower.includes(key.replace('-', ' '))) return url;
    }
    return 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop';
}

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

    // Handle CategoryResource wrapping (data property) and sort alphabetically A-Z
    const rawCategories = Array.isArray(categories)
        ? categories
        : (categories as any)?.data || [];

    const normalizedCategories = useMemo(() => {
        return [...rawCategories].sort((a, b) =>
            (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' }),
        );
    }, [rawCategories]);

    const normalizedCurrentCategory =
        currentCategory && 'data' in currentCategory
            ? (currentCategory as any).data
            : currentCategory;

    const INITIAL_CATEGORY_LIMIT = 4;
    const [visibleCategoryCount, setVisibleCategoryCount] = useState(INITIAL_CATEGORY_LIMIT);

    const visibleCategories = useMemo(() => {
        return normalizedCategories.slice(0, visibleCategoryCount);
    }, [normalizedCategories, visibleCategoryCount]);

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [catalogModalOpen, setCatalogModalOpen] = useState(false);
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

    const handleCategorySelect = (categoryId: number | null) => {
        const newCat = selectedCategory === categoryId ? null : categoryId;
        setSelectedCategory(newCat);

        const params: Record<string, string> = {};
        if (searchQuery) params['filter[name]'] = searchQuery;
        if (newCat) params['filter[category_id]'] = String(newCat);
        if (priceRange.min) params['filter[price_min]'] = String(priceRange.min);
        if (priceRange.max) params['filter[price_max]'] = String(priceRange.max);
        if (selectedSort) params['sort'] = selectedSort;

        router.get('/shop/products', params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

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
        : 'All Products';
    const pageDescription = normalizedCurrentCategory
        ? `Explore our high-quality ${normalizedCurrentCategory.name} collection at ${siteName}. Find premium outdoor & indoor furniture at the best prices.`
        : `Explore our complete collection of premium furniture at ${siteName}. Chairs, tables, dining sets, daybeds, and handcrafted outdoor items.`;
    const breadcrumbItems = [
        {
            name: 'Home',
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
                    name: 'All Products',
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
                <main className="min-h-screen bg-sand-50 pb-20">
                    {/* Hero Banner */}
                    <div className="mb-12 bg-gradient-to-r from-teal-600 to-teal-700 py-16 text-white">
                        <div className="mx-auto max-w-[1400px] px-6 text-center md:px-12">
                            <h1 className="mb-3 font-serif text-4xl font-bold md:text-5xl">
                                {normalizedCurrentCategory
                                    ? normalizedCurrentCategory.name
                                    : 'All Products'}
                            </h1>
                            <p className="text-xl opacity-90">
                                {products.meta.total} {products.meta.total === 1 ? 'quality product found' : 'quality products found'}
                            </p>
                        </div>
                    </div>

                    <div className="mx-auto max-w-[1400px] px-6 md:px-12">
                        {/* Category Cards Showcase Grid (FIRST SECTION) */}
                        <div className="mb-14">
                            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2.5 mb-2">
                                        <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-teal-700">
                                            <Layers size={14} />
                                            <span>Product Categories</span>
                                        </div>
                                    </div>
                                    <h2 className="font-serif text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl">
                                        Explore by Category
                                    </h2>
                                    <p className="mt-1 text-sm text-neutral-500">
                                        Select a furniture category to view our curated collection
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    {/* Action Button: E-Catalog PDF / Word */}
                                    <button
                                        type="button"
                                        onClick={() => setCatalogModalOpen(true)}
                                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:from-teal-700 hover:to-teal-800 hover:shadow-lg active:scale-95 cursor-pointer"
                                    >
                                        <BookOpen size={16} />
                                        <span>E-CATALOG</span>
                                    </button>

                                    {selectedCategory && (
                                        <Link
                                            href="/shop/products"
                                            className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 transition-colors hover:text-teal-700 hover:underline"
                                        >
                                            <span>View All Products</span>
                                            <ArrowRight size={16} />
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {/* Category Cards Grid */}
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:gap-6">
                                {visibleCategories.map((cat: ApiCategory) => {
                                    const isSelected =
                                        selectedCategory === Number(cat.id) ||
                                        (normalizedCurrentCategory &&
                                            Number(normalizedCurrentCategory.id) === Number(cat.id));
                                    const bgImage = getCategoryImageUrl(cat);
                                    const targetHref = isSelected
                                        ? '/shop/products'
                                        : `/shop/products?filter[category]=${cat.slug || cat.id}`;

                                    return (
                                        <Link
                                            key={cat.id}
                                            href={targetHref}
                                            className={`group relative overflow-hidden rounded-2xl bg-neutral-900 text-left transition-all duration-400 ${isSelected
                                                ? 'ring-4 ring-teal-500 shadow-2xl scale-[1.02]'
                                                : 'hover:-translate-y-1.5 hover:shadow-xl'
                                                }`}
                                        >
                                            <div className="relative aspect-[4/3] w-full overflow-hidden">
                                                <img
                                                    src={bgImage}
                                                    alt={cat.name}
                                                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
                                                />
                                                {/* Gradient Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 transition-opacity group-hover:opacity-90" />

                                                {/* Active Status Badge */}
                                                {isSelected && (
                                                    <div className="absolute top-3 right-3 rounded-full bg-teal-500 px-3 py-1 text-xs font-semibold text-white shadow-md">
                                                        Active
                                                    </div>
                                                )}

                                                {/* Category Info Overlay */}
                                                <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5">
                                                    <span className="text-xs font-medium uppercase tracking-wider text-teal-300">
                                                        {cat.products_count !== undefined
                                                            ? `${cat.products_count} ${cat.products_count === 1 ? 'Product' : 'Products'}`
                                                            : 'Furniture Collection'}
                                                    </span>
                                                    <h3 className="mt-0.5 font-serif text-lg font-bold text-white transition-colors md:text-xl group-hover:text-teal-200">
                                                        {cat.name}
                                                    </h3>
                                                    <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-white/80 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white">
                                                        <span>{isSelected ? 'Active Category' : 'Select Category'}</span>
                                                        <ChevronRight size={14} />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Load More Categories Button */}
                            {normalizedCategories.length > INITIAL_CATEGORY_LIMIT && (
                                <div className="mt-8 flex justify-center">
                                    {visibleCategoryCount < normalizedCategories.length ? (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setVisibleCategoryCount((prev) =>
                                                    Math.min(prev + 4, normalizedCategories.length),
                                                )
                                            }
                                            className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-7 py-3 text-sm font-semibold text-neutral-800 shadow-xs transition-all hover:border-teal-500 hover:bg-teal-50/60 hover:text-teal-700 active:scale-95 cursor-pointer"
                                        >
                                            <span>Load More Categories ({normalizedCategories.length - visibleCategoryCount} more)</span>
                                            <ChevronDown size={16} />
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setVisibleCategoryCount(INITIAL_CATEGORY_LIMIT)}
                                            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-7 py-3 text-sm font-semibold text-neutral-600 shadow-xs transition-all hover:bg-neutral-100 hover:text-neutral-900 active:scale-95 cursor-pointer"
                                        >
                                            <span>Show Less</span>
                                            <ChevronUp size={16} />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Search & Controls Header */}
                        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                            {/* Breadcrumb */}
                            <nav className="flex items-center gap-2 text-sm text-neutral-500">
                                <Link href="/shop" className="hover:text-teal-600 transition-colors">
                                    Home
                                </Link>
                                <span>/</span>
                                <span className="text-neutral-900 font-medium">
                                    {normalizedCurrentCategory
                                        ? normalizedCurrentCategory.name
                                        : 'All Products'}
                                </span>
                            </nav>

                            {/* Search & Filter Toggle */}
                            <div className="flex items-center gap-3">
                                <div className="relative flex-1 md:w-80">
                                    <Search
                                        className="absolute top-1/2 left-4 -translate-y-1/2 text-neutral-400"
                                        size={20}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="w-full rounded-xl border border-neutral-200 bg-white py-3 pr-4 pl-12 shadow-sm transition-colors focus:border-teal-500 focus:outline-none"
                                    />
                                </div>
                                <button
                                    onClick={() => setShowFilters(true)}
                                    className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-700 shadow-sm transition-all hover:border-teal-500 hover:text-teal-600 active:scale-[0.98]"
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
                {/* Product Catalog Modal */}
                <CatalogModal
                    isOpen={catalogModalOpen}
                    onClose={() => setCatalogModalOpen(false)}
                    pdfUrl={siteSettings?.catalog_pdf_url}
                    docxUrl={siteSettings?.catalog_docx_url}
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
                            Sort By
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
                            Categories
                        </h3>
                        <div className="space-y-2">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`w-full rounded-sm px-4 py-2 text-left transition-colors ${!selectedCategory ? 'bg-teal-50 font-medium text-teal-700' : 'text-neutral-600 hover:bg-neutral-50'}`}
                            >
                                All Categories
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
                                    No categories available
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
                            Apply Filters
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
}

function ProductGrid({ products, viewMode }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="py-20 text-center">
                <ShoppingBag
                    className="mx-auto mb-4 text-neutral-300"
                    size={64}
                />
                <h3 className="mb-2 text-xl font-medium text-neutral-900">
                    No products found
                </h3>
                <p className="text-neutral-500">
                    Try adjusting your filter or search keywords
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
}

function ProductCard({
    product,
    viewMode,
    index,
}: ProductCardProps) {
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
                    className="group flex gap-6 rounded-2xl border border-neutral-100 bg-white p-5 transition-all duration-300 hover:shadow-lg hover:border-neutral-200"
                >
                    <div className="relative h-48 w-48 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-50 flex items-center justify-center p-3">
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="h-full w-full object-scale-down transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                    <div className="flex flex-1 flex-col justify-between py-2">
                        <div>
                            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                                {product.category?.name}
                            </p>
                            <h3 className="mb-2 font-serif text-xl font-bold text-neutral-900 transition-colors group-hover:text-teal-700">
                                {product.name}
                            </h3>
                            <p className="line-clamp-2 text-sm text-neutral-600 leading-relaxed">
                                {product.short_description}
                            </p>
                        </div>
                        <div className="flex items-center justify-end pt-2">
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-teal-600 group-hover:text-teal-700">
                                View Details &rarr;
                            </span>
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
                <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-white border border-neutral-100 shadow-xs transition-all duration-500 group-hover:shadow-2xl flex items-center justify-center p-3 sm:p-4">
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10 flex items-center justify-center">
                        <span className="translate-y-3 rounded-full bg-white/95 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-800 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-white">
                            View Detail
                        </span>
                    </div>
                </div>
                <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                        {product.category?.name}
                    </p>
                    <h3 className="mb-1.5 font-serif text-lg font-bold text-neutral-900 transition-colors group-hover:text-teal-700">
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
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-200/80 pt-8">
            <p className="text-sm font-medium text-neutral-500">
                Showing <span className="font-semibold text-neutral-900">{meta.from || 0}</span> to{' '}
                <span className="font-semibold text-neutral-900">{meta.to || 0}</span> of{' '}
                <span className="font-semibold text-neutral-900">{meta.total}</span> products
            </p>
            <div className="flex items-center gap-1.5">
                <button
                    type="button"
                    onClick={() => goToPage(current - 1)}
                    disabled={current === 1}
                    aria-label="Previous Page"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-600 transition-all hover:border-teal-500 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40 shadow-2xs cursor-pointer"
                >
                    <ChevronLeft size={18} />
                </button>
                {pages.map((page, i) =>
                    typeof page === 'number' ? (
                        <button
                            key={i}
                            type="button"
                            onClick={() => goToPage(page)}
                            className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold transition-all shadow-2xs cursor-pointer ${page === current
                                ? 'bg-teal-600 text-white shadow-sm'
                                : 'border border-neutral-200 bg-white text-neutral-700 hover:border-teal-500 hover:text-teal-700'
                                }`}
                        >
                            {page}
                        </button>
                    ) : (
                        <span key={i} className="flex h-10 w-8 items-center justify-center text-neutral-400">
                            ...
                        </span>
                    ),
                )}
                <button
                    type="button"
                    onClick={() => goToPage(current + 1)}
                    disabled={current === last}
                    aria-label="Next Page"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-600 transition-all hover:border-teal-500 hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40 shadow-2xs cursor-pointer"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
}
