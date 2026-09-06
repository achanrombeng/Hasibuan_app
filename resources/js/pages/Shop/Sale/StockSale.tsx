import { SEOHead } from '@/components/seo';
import { ProductImagePlaceholder } from '@/components/shop';
import { ShopLayout } from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import { ApiCategory, ApiProduct, PaginatedResponse } from '@/types/shop';
import { Link, router, usePage } from '@inertiajs/react';
import { ChevronDown, Filter, Package, Star, Warehouse } from 'lucide-react';
import { useState } from 'react';

interface Props {
    products: PaginatedResponse<ApiProduct>;
    categories: ApiCategory[];
    currentCategory?: ApiCategory;
    filters: { filter?: Record<string, string>; sort?: string };
}

export default function StockSale({
    products,
    categories,
    currentCategory,
    filters,
}: Props) {
    const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
    const siteName = siteSettings?.site_name || 'Ronica';
    const safeFilters = Array.isArray(filters) ? {} : filters;

    // Normalize categories
    const normalizedCategories = Array.isArray(categories)
        ? categories
        : (categories as any)?.data || [];

    const [showFilters, setShowFilters] = useState(false);

    const handleSort = (sort: string) => {
        router.get(
            '/shop/stock-sale',
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
            '/shop/stock-sale',
            { filter: newFilters, sort: safeFilters.sort },
            { preserveState: true },
        );
    };

    return (
        <>
            <SEOHead
                title="Stock Sale - Harga Pabrik"
                description={`Stock Sale ${siteName}! Beli furnitur langsung dari pabrik dengan harga grosir. Cocok untuk reseller, kontraktor, dan pembelian dalam jumlah besar.`}
                keywords={[
                    'stock sale',
                    'harga pabrik',
                    'grosir furnitur',
                    'harga grosir mebel',
                    'reseller furniture',
                ]}
            />
            <div className="bg-noise" />
            <ShopLayout>
                <main className="min-h-screen bg-sand-50 pt-28 pb-20">
                    {/* Hero Banner */}
                    <div className="mb-12 bg-gradient-to-r from-terra-900 to-terra-700 py-16 text-white">
                        <div className="mx-auto max-w-[1400px] px-6 text-center md:px-12">
                            <div className="mb-4 flex items-center justify-center gap-3">
                                <Warehouse
                                    size={40}
                                    className="text-wood-light"
                                />
                                <h1 className="font-serif text-4xl font-bold md:text-5xl">
                                    STOCK SALE
                                </h1>
                                <Package
                                    size={40}
                                    className="text-wood-light"
                                />
                            </div>
                            <p className="text-xl opacity-90">
                                Harga Pabrik Langsung! Stok Gudang Ready
                            </p>
                            <p className="mt-2 text-sm opacity-75">
                                Dapatkan furniture berkualitas dengan harga
                                grosir
                            </p>

                            {/* Benefits */}
                            <div className="mt-8 flex flex-wrap justify-center gap-6">
                                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                                    <span className="h-2 w-2 rounded-full bg-wood-light"></span>
                                    <span className="text-sm">
                                        Harga Pabrik
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                                    <span className="h-2 w-2 rounded-full bg-wood-light"></span>
                                    <span className="text-sm">Stok Ready</span>
                                </div>
                                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                                    <span className="h-2 w-2 rounded-full bg-wood-light"></span>
                                    <span className="text-sm">
                                        Pengiriman Cepat
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mx-auto max-w-[1400px] px-6 md:px-12">
                        {/* Filters Bar */}
                        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center gap-2 rounded-full border border-terra-200 bg-white px-4 py-2 hover:border-terra-400"
                                >
                                    <Filter size={18} />
                                    <span>Filter</span>
                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform ${showFilters ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                <span className="text-terra-500">
                                    {products.meta.total} produk
                                </span>
                            </div>
                            <select
                                value={safeFilters.sort || ''}
                                onChange={(e) => handleSort(e.target.value)}
                                className="rounded-full border border-terra-200 bg-white px-4 py-2 outline-none"
                            >
                                <option value="-created_at">Terbaru</option>
                                <option value="created_at">Terlama</option>
                                <option value="name">A-Z</option>
                                <option value="-name">Z-A</option>
                            </select>
                        </div>

                        {/* Category Filter */}
                        {showFilters && (
                            <div className="mb-8 rounded-sm bg-white p-6">
                                <h3 className="mb-4 font-medium text-terra-900">
                                    Kategori
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() =>
                                            handleCategoryFilter(null)
                                        }
                                        className={`rounded-full px-4 py-2 text-sm ${!safeFilters.filter?.category_id ? 'bg-terra-900 text-white' : 'bg-terra-100 text-terra-700 hover:bg-terra-200'}`}
                                    >
                                        Semua
                                    </button>
                                    {normalizedCategories.map(
                                        (cat: ApiCategory) => (
                                            <button
                                                key={cat.id}
                                                onClick={() =>
                                                    handleCategoryFilter(cat.id)
                                                }
                                                className={`rounded-full px-4 py-2 text-sm ${safeFilters.filter?.category_id === String(cat.id) ? 'bg-terra-900 text-white' : 'bg-terra-100 text-terra-700 hover:bg-terra-200'}`}
                                            >
                                                {cat.name}
                                            </button>
                                        ),
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Products Grid */}
                        {products.data.length > 0 ? (
                            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                                {products.data.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-sm bg-white py-20 text-center">
                                <Warehouse
                                    size={48}
                                    className="mx-auto mb-4 text-terra-300"
                                />
                                <h3 className="mb-2 text-xl font-medium text-terra-900">
                                    Belum Ada Produk Stock Sale
                                </h3>
                                <p className="mb-6 text-terra-500">
                                    Nantikan penawaran harga pabrik dari kami!
                                </p>
                                <Link
                                    href="/shop/products"
                                    className="inline-flex items-center gap-2 rounded-full bg-terra-900 px-6 py-3 text-white hover:bg-wood-dark"
                                >
                                    Lihat Semua Produk
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
                                        className={`rounded-lg px-4 py-2 text-sm ${link.active ? 'bg-terra-900 text-white' : link.url ? 'bg-white text-terra-700 hover:bg-terra-100' : 'cursor-not-allowed bg-terra-100 text-terra-400'}`}
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
        product.images?.[0]?.image_url;
    return (
        <Link
            href={`/shop/products/${product.slug}`}
            className="group overflow-hidden rounded-sm border border-terra-100 bg-white transition-all hover:shadow-lg"
        >
            <div className="relative aspect-square overflow-hidden flex items-center justify-center">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <ProductImagePlaceholder
                        name={product.name}
                        sku={product.sku}
                        category={product.category?.name}
                        size="md"
                    />
                )}
                <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-terra-900 px-3 py-1 text-xs font-medium text-white">
                    <Package size={14} />
                    STOCK
                </span>
            </div>
            <div className="p-4">
                <h3 className="mb-2 line-clamp-2 font-medium text-terra-900 transition-colors group-hover:text-wood">
                    {product.name}
                </h3>
                <div className="mb-2 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                            key={s}
                            size={14}
                            className={
                                s <= Math.round(product.average_rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-terra-200'
                            }
                        />
                    ))}
                    <span className="ml-1 text-xs text-terra-500">
                        ({product.review_count})
                    </span>
                </div>
                <span className="text-xs font-medium text-wood">
                    Lihat Detail &rarr;
                </span>
            </div>
        </Link>
    );
}
