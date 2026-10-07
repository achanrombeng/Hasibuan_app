import { BreadcrumbStructuredData, SEOHead } from '@/components/seo';
import { CatalogModal } from '@/components/shop/CatalogModal';
import { ProductCard } from '@/components/shop/ProductCard';
import { ProductImagePlaceholder } from '@/components/shop/ProductImagePlaceholder';
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
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Grid3X3,
  Layers,
  LayoutList,
  Search,
  ShoppingBag,
  SlidersHorizontal,
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
  const siteName = siteSettings?.site_name || 'hasibuan_app';
  const safeFilters = Array.isArray(filters) ? {} : filters;

  // Handle CategoryResource wrapping (data property) and sort alphabetically A-Z
  const rawCategories = Array.isArray(categories)
    ? categories
    : (categories as any)?.data || [];

  const normalizedCategories = useMemo(() => {
    return [...rawCategories].sort((a, b) => {
      const orderA = typeof a.sort_order === 'number' ? a.sort_order : 0;
      const orderB = typeof b.sort_order === 'number' ? b.sort_order : 0;
      if (orderA !== orderB) return orderA - orderB;
      return (a.name || '').localeCompare(b.name || '', undefined, {
        sensitivity: 'base',
      });
    });
  }, [rawCategories]);

  const normalizedCurrentCategory =
    currentCategory && 'data' in currentCategory
      ? (currentCategory as any).data
      : currentCategory;

  const INITIAL_CATEGORY_LIMIT = 4;
  const [visibleCategoryCount, setVisibleCategoryCount] = useState(
    INITIAL_CATEGORY_LIMIT,
  );

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

  const applyFilters = useCallback(() => {
    const params: Record<string, string> = {};

    if (searchQuery) params['filter[name]'] = searchQuery;
    if (selectedCategory)
      params['filter[category_id]'] = String(selectedCategory);
    if (selectedSort) params['sort'] = selectedSort;

    router.get('/shop/products', params, {
      preserveState: true,
      preserveScroll: true,
    });
  }, [searchQuery, selectedCategory, selectedSort]);

  const handleCategorySelect = (categoryId: number | null) => {
    const newCat = selectedCategory === categoryId ? null : categoryId;
    setSelectedCategory(newCat);

    const params: Record<string, string> = {};
    if (searchQuery) params['filter[name]'] = searchQuery;
    if (newCat) params['filter[category_id]'] = String(newCat);
    if (selectedSort) params['sort'] = selectedSort;

    router.get('/shop/products', params, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
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
      if (selectedSort) params['sort'] = selectedSort;

      router.get('/shop/products', params, {
        preserveState: true,
        preserveScroll: true,
      });
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const hasActiveFilters = searchQuery || selectedCategory;

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
            : ['furnitur', 'furniture', 'mebel', 'kursi', 'meja', 'lemari']
        }
      />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <div className="bg-noise" />
      <ShopLayout>
        <main className="min-h-screen bg-white pb-24 select-none">
          {/* Monumental Editorial Header - Black Luxury Banner */}
          <div className="border-b border-neutral-900 bg-neutral-950 py-16 md:py-24 px-6 text-white">
            <div className="mx-auto max-w-[1720px] text-center space-y-3">
              <span className="text-[10px] md:text-xs tracking-[0.35em] uppercase font-light text-neutral-400">
                ARCHITECTURAL CATALOGUE
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-[0.06em] text-white uppercase">
                {normalizedCurrentCategory
                  ? normalizedCurrentCategory.name
                  : 'CURATED COLLECTIONS'}
              </h1>
              <div className="w-12 h-[1px] bg-neutral-700 mx-auto mt-4" />
              <p className="mx-auto max-w-2xl text-xs md:text-sm font-light text-neutral-300 tracking-wide pt-2">
                {products.meta.total}{' '}
                {products.meta.total === 1
                  ? 'ARCHITECTURAL PIECE DOCUMENTED'
                  : 'ARCHITECTURAL PIECES DOCUMENTED'}
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-[1720px] px-6 sm:px-12 py-12 md:py-16">
            {/* Category Cards Showcase Grid */}
            <div className="mb-16">
              <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end border-b border-neutral-200/80 pb-6">
                <div>
                  <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-light block mb-1">
                    GALLERY ARCHIVES
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-light uppercase tracking-wide text-neutral-900">
                    EXPLORE BY CATEGORY
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Action Button: Source Book Modal */}
                  <button
                    type="button"
                    onClick={() => setCatalogModalOpen(true)}
                    className="inline-flex cursor-pointer items-center gap-2 border border-neutral-900 bg-neutral-900 px-5 py-2.5 text-[11px] font-medium tracking-[0.2em] text-white uppercase hover:bg-neutral-800 transition-colors"
                  >
                    <BookOpen size={14} />
                    <span>SOURCE BOOKS</span>
                  </button>

                  {selectedCategory && (
                    <Link
                      href="/shop/products"
                      className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wider text-neutral-700 hover:text-black uppercase transition-colors"
                    >
                      <span>VIEW ALL</span>
                      <ArrowRight size={14} />
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
                      className={`group relative overflow-hidden bg-neutral-900 text-left transition-all duration-300 border ${
                        isSelected
                          ? 'border-neutral-900 ring-2 ring-neutral-900'
                          : 'border-neutral-200/80 hover:border-neutral-400'
                      }`}
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <img
                          src={bgImage}
                          alt={cat.name}
                          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 transition-opacity group-hover:opacity-95" />

                        {/* Active Status Badge */}
                        {isSelected && (
                          <div className="absolute top-3 right-3 bg-white px-2.5 py-1 text-[10px] tracking-[0.2em] uppercase font-medium text-neutral-900 shadow-sm">
                            SELECTED
                          </div>
                        )}

                        {/* Category Info Overlay */}
                        <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5">
                          <span className="text-[10px] font-light tracking-[0.25em] text-neutral-300 uppercase">
                            COLLECTION
                          </span>
                          <h3 className="mt-0.5 font-serif text-base md:text-lg font-light uppercase tracking-wide text-white group-hover:text-neutral-200 transition-colors">
                            {cat.name}
                          </h3>
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
                      className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-neutral-300 bg-white px-7 py-3 text-sm font-semibold text-neutral-800 shadow-xs transition-all hover:border-teal-500 hover:bg-teal-50/60 hover:text-teal-700 active:scale-95"
                    >
                      <span>
                        Load More Categories (
                        {normalizedCategories.length - visibleCategoryCount}{' '}
                        more)
                      </span>
                      <ChevronDown size={16} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        setVisibleCategoryCount(INITIAL_CATEGORY_LIMIT)
                      }
                      className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-neutral-200 bg-white px-7 py-3 text-sm font-semibold text-neutral-600 shadow-xs transition-all hover:bg-neutral-100 hover:text-neutral-900 active:scale-95"
                    >
                      <span>Show Less</span>
                      <ChevronUp size={16} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Search & Controls Header */}
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center border-b border-neutral-200/80 pb-6">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-xs tracking-wider uppercase font-light text-neutral-500">
                <Link
                  href="/shop"
                  className="transition-colors hover:text-black"
                >
                  HOME
                </Link>
                <span>/</span>
                <span className="font-medium text-neutral-900">
                  {normalizedCurrentCategory
                    ? normalizedCurrentCategory.name.toUpperCase()
                    : 'ALL PRODUCTS'}
                </span>
              </nav>

              {/* Search & Filter Toggle */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1 md:w-80">
                  <Search
                    className="absolute top-1/2 left-3.5 -translate-y-1/2 text-neutral-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="SEARCH COLLECTION..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-neutral-200 bg-white py-2.5 pr-4 pl-10 text-xs tracking-wider uppercase text-neutral-900 transition-colors focus:border-neutral-900 focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(true)}
                  className="flex items-center gap-2 border border-neutral-200 bg-white px-4 py-2.5 text-[11px] tracking-[0.2em] uppercase font-light text-neutral-800 transition-colors hover:border-neutral-900 cursor-pointer"
                >
                  <SlidersHorizontal size={15} />
                  <span>FILTER</span>
                </button>
                <div className="hidden items-center gap-1 border border-neutral-200 p-1 md:flex">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-100'}`}
                  >
                    <Grid3X3 size={15} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-100'}`}
                  >
                    <LayoutList size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="mb-6 flex flex-wrap items-center gap-2 text-xs">
                <span className="tracking-wider uppercase text-neutral-400 font-light">
                  ACTIVE:
                </span>

                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="flex items-center gap-1.5 border border-neutral-300 bg-neutral-50 px-3 py-1 text-xs tracking-wider uppercase font-light text-neutral-800 hover:border-neutral-900 transition-colors"
                  >
                    <span>
                      {normalizedCategories.find(
                        (c: ApiCategory) =>
                          Number(c.id) === Number(selectedCategory),
                      )?.name || 'Category'}
                    </span>
                    <X size={12} />
                  </button>
                )}

                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="flex items-center gap-1.5 border border-neutral-300 bg-neutral-50 px-3 py-1 text-xs tracking-wider uppercase font-light text-neutral-800 hover:border-neutral-900 transition-colors"
                  >
                    <span>{searchQuery}</span>
                    <X size={12} />
                  </button>
                )}

                <button
                  onClick={clearFilters}
                  className="text-xs tracking-wider uppercase text-neutral-500 underline hover:text-black ml-2"
                >
                  CLEAR ALL
                </button>
              </div>
            )}

            {/* Product Content */}
            <div className="flex-1">
              <ProductGrid products={products.data} viewMode={viewMode} />
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
  selectedSort: string;
  setSelectedSort: (sort: string) => void;
  onApply: () => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

function FilterDrawer({
  isOpen,
  onClose,
  categories,
  featuredCategories,
  selectedCategory,
  setSelectedCategory,
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

  if (!mounted || typeof document === 'undefined' || !shouldRender) return null;

  // Safety check for categories
  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeFeaturedCategories = Array.isArray(featuredCategories)
    ? featuredCategories
    : [];

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-[60] flex h-full w-full max-w-sm transform flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
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
            <h3 className="mb-4 font-medium text-neutral-900">Sort By</h3>
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
            <h3 className="mb-4 font-medium text-neutral-900">Categories</h3>
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
                    onClick={() => setSelectedCategory(cat.id)}
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
              className="flex-1 bg-neutral-900 py-3.5 text-[11px] tracking-[0.25em] uppercase font-medium text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              APPLY FILTERS
            </button>
            {hasActiveFilters && (
              <button
                onClick={onClear}
                className="border border-neutral-300 bg-white px-5 py-3.5 text-[11px] tracking-[0.2em] uppercase font-light text-neutral-800 hover:border-neutral-900 transition-colors cursor-pointer"
              >
                RESET
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
      <div className="py-24 text-center border border-neutral-200/80 bg-[#fafaf9] p-12">
        <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-light block mb-2">
          NO PIECES DOCUMENTED
        </span>
        <h3 className="font-serif text-2xl font-light uppercase text-neutral-900 mb-2">
          No Products Match Your Criteria
        </h3>
        <p className="text-xs text-neutral-500 font-light max-w-md mx-auto">
          Try clearing filters or choosing another category from our archives.
        </p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {products.map((product) => {
          const imageUrl =
            product.primary_image?.image_url || product.images?.[0]?.image_url;

          return (
            <Link
              key={product.id}
              href={`/shop/products/${product.slug}`}
              className="group flex flex-col sm:flex-row gap-6 border border-neutral-200/80 bg-[#fafaf9] p-5 hover:border-neutral-400 transition-all duration-300"
            >
              <div className="relative aspect-square w-full sm:w-48 shrink-0 overflow-hidden bg-white">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-contain p-2 transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <ProductImagePlaceholder name={product.name} sku={product.sku} size="sm" />
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between py-1">
                <div className="space-y-1.5">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-light block">
                    {product.category?.name || 'COLLECTION'}
                  </span>
                  <h4 className="font-serif text-lg tracking-[0.04em] uppercase text-neutral-900 group-hover:text-neutral-600 transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-xs text-neutral-500 font-light line-clamp-2 leading-relaxed">
                    {product.short_description || 'Handcrafted from premium teak and all-weather materials.'}
                  </p>
                </div>
                <div className="pt-4 flex items-center justify-between border-t border-neutral-200/60 mt-4 text-[11px] tracking-wider text-neutral-800">
                  <span className="font-medium">TRADE & RESIDENCE</span>
                  <span className="text-[10px] tracking-[0.2em] uppercase font-medium text-neutral-900 group-hover:translate-x-1 transition-transform">
                    VIEW PIECE &rarr;
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
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
      pages.push(1, '...', current - 1, current, current + 1, '...', last);
    }
  }

  const goToPage = (page: number) => {
    router.get(
      window.location.pathname,
      {
        ...Object.fromEntries(new URLSearchParams(window.location.search)),
        page,
      },
      { preserveState: true },
    );
  };

  return (
    <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-neutral-200/80 pt-8 sm:flex-row">
      <p className="text-sm font-medium text-neutral-500">
        Showing{' '}
        <span className="font-semibold text-neutral-900">{meta.from || 0}</span>{' '}
        to{' '}
        <span className="font-semibold text-neutral-900">{meta.to || 0}</span>{' '}
        of <span className="font-semibold text-neutral-900">{meta.total}</span>{' '}
        products
      </p>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => goToPage(current - 1)}
          disabled={current === 1}
          aria-label="Previous Page"
          className="flex h-10 w-10 cursor-pointer items-center justify-center border border-neutral-200 bg-white text-neutral-600 transition-colors hover:border-neutral-900 hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronLeft size={16} />
        </button>
        {pages.map((page, i) =>
          typeof page === 'number' ? (
            <button
              key={i}
              type="button"
              onClick={() => goToPage(page)}
              className={`flex h-10 w-10 cursor-pointer items-center justify-center text-xs tracking-wider transition-colors ${
                page === current
                  ? 'bg-neutral-900 text-white font-medium'
                  : 'border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-900 hover:text-black'
              }`}
            >
              {page}
            </button>
          ) : (
            <span
              key={i}
              className="flex h-10 w-8 items-center justify-center text-neutral-400"
            >
              ...
            </span>
          ),
        )}
        <button
          type="button"
          onClick={() => goToPage(current + 1)}
          disabled={current === last}
          aria-label="Next Page"
          className="flex h-10 w-10 cursor-pointer items-center justify-center border border-neutral-200 bg-white text-neutral-600 transition-colors hover:border-neutral-900 hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
