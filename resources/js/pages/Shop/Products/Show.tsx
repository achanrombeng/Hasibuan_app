import {
    BreadcrumbStructuredData,
    ProductStructuredData,
    SEOHead,
} from '@/components/seo';
import {
    ProductCard,
    RecentlyViewedSection,
    saveToRecentlyViewed,
    ShareModal,
} from '@/components/shop';
import { ShopLayout } from '@/layouts/ShopLayout';
import { SharedData, SiteSettings } from '@/types';
import { ApiProduct, ProductImage } from '@/types/shop';
import { Link, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Check,
    ChevronLeft,
    ChevronRight,
    Heart,
    Loader2,
    MessageCircle,
    Minus,
    Plus,
    RotateCcw,
    Share2,
    Shield,
    ShoppingBag,
    Star,
    Truck,
    X,
    ZoomIn,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
    product: ApiProduct;
    relatedProducts: ApiProduct[];
    userReview?: ProductReview;
}

export default function ProductShow({
    product,
    relatedProducts,
    userReview,
}: Props) {
    const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
    const siteName = siteSettings?.site_name || 'Ronica';
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(
        product.is_wishlisted || false,
    );
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [cartMessage, setCartMessage] = useState<{
        type: 'success' | 'error';
        text: string;
    } | null>(null);

    // Update wishlist state when product changes
    useEffect(() => {
        setIsWishlisted(product.is_wishlisted || false);
    }, [product.id, product.is_wishlisted]);

    // Save to recently viewed on mount
    useEffect(() => {
        saveToRecentlyViewed(product);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product.id]);

    // Auto hide cart message after 3 seconds
    useEffect(() => {
        if (cartMessage) {
            const timer = setTimeout(() => setCartMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [cartMessage]);

    const images = product.images?.length
        ? product.images
        : [
            {
                id: 0,
                image_url: '/images/placeholder-product.svg',
                alt_text: product.name,
            } as ProductImage,
        ];

    const handleAddToCart = async () => {
        setIsAddingToCart(true);
        setCartMessage(null);

        router.post(
            '/shop/cart',
            { product_id: product.id, quantity },
            {
                preserveScroll: true,
                only: ['cart'],
                onSuccess: () => {
                    setCartMessage({
                        type: 'success',
                        text: 'Produk berhasil ditambahkan ke keranjang!',
                    });
                },
                onError: (errors) => {
                    console.error('Error adding to cart:', errors);
                    setCartMessage({
                        type: 'error',
                        text: 'Gagal menambahkan produk ke keranjang',
                    });
                },
                onFinish: () => {
                    setIsAddingToCart(false);
                },
            },
        );
    };

    const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

    const handleWishlistToggle = () => {
        const { auth } = usePage<SharedData>().props;
        if (!auth.user) {
            router.visit('/login');
            return;
        }

        setIsTogglingWishlist(true);
        // Clear previous message
        setCartMessage(null);

        router.post(
            `/shop/wishlist/${product.id}`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Update state manually or rely on props;
                    // props update via redirect back() will trigger useEffect
                    // But we set message here.
                    const newStatus = !isWishlisted;
                    setCartMessage({
                        type: 'success',
                        text: newStatus
                            ? 'Produk berhasil ditambahkan ke wishlist!'
                            : 'Produk berhasil dihapus dari wishlist',
                    });
                },
                onError: () => {
                    setCartMessage({
                        type: 'error',
                        text: 'Gagal mengupdate wishlist',
                    });
                },
                onFinish: () => {
                    setIsTogglingWishlist(false);
                },
            },
        );
    };

    // SEO Data
    const productUrl =
        typeof window !== 'undefined'
            ? `${window.location.origin}/shop/products/${product.slug}`
            : `/shop/products/${product.slug}`;
    const productImages = images.map((img) => img.image_url);
    const breadcrumbItems = [
        {
            name: 'Beranda',
            url:
                typeof window !== 'undefined'
                    ? `${window.location.origin}/shop`
                    : '/shop',
        },
        {
            name: 'Produk',
            url:
                typeof window !== 'undefined'
                    ? `${window.location.origin}/shop/products`
                    : '/shop/products',
        },
        ...(product.category
            ? [
                {
                    name: product.category.name,
                    url:
                        typeof window !== 'undefined'
                            ? `${window.location.origin}/shop/products?filter[category]=${product.category.slug}`
                            : `/shop/products?filter[category]=${product.category.slug}`,
                },
            ]
            : []),
        { name: product.name, url: productUrl },
    ];

    return (
        <>
            {/* SEO */}
            <SEOHead
                title={product.name}
                description={
                    product.short_description ||
                    product.description
                        ?.replace(/<[^>]*>/g, '')
                        .substring(0, 160) ||
                    `Beli ${product.name} dengan harga terbaik di ${siteName}`
                }
                keywords={
                    [
                        ...(product.meta_keywords
                            ? product.meta_keywords
                                .split(',')
                                .map((k: string) => k.trim())
                            : []),
                        product.name,
                        product.category?.name || 'furnitur',
                        product.sku,
                    ].filter(Boolean) as string[]
                }
                image={images[0]?.image_url}
                url={productUrl}
                type="product"
                product={{
                    price: product.final_price,
                    currency: 'IDR',
                    availability: product.is_in_stock
                        ? 'in stock'
                        : 'out of stock',
                    brand: siteName,
                    category: product.category?.name,
                    sku: product.sku,
                }}
            />
            <ProductStructuredData
                data={{
                    name: product.name,
                    description:
                        product.short_description ||
                        product.description?.replace(/<[^>]*>/g, '') ||
                        '',
                    image: productImages,
                    sku: product.sku,
                    brand: siteName,
                    category: product.category?.name,
                    price: product.final_price,
                    priceCurrency: 'IDR',
                    availability: product.is_in_stock
                        ? 'InStock'
                        : 'OutOfStock',
                    url: productUrl,
                    rating:
                        product.review_count > 0
                            ? {
                                value: product.average_rating,
                                count: product.review_count,
                            }
                            : undefined,
                }}
            />
            <BreadcrumbStructuredData items={breadcrumbItems} />
            <div className="bg-noise" />
            <ShopLayout showFooter={true} showWhatsApp={false}>
                <main className="min-h-screen bg-white pt-8">
                    <div className="mx-auto max-w-[1400px] px-6 md:px-12">
                        <Breadcrumb product={product} />
                        <div className="mb-20 grid grid-cols-1 gap-12 lg:grid-cols-2">
                            <ImageGallery
                                images={images}
                                selectedIndex={selectedImageIndex}
                                setSelectedIndex={setSelectedImageIndex}
                                onZoom={() => setIsZoomed(true)}
                                product={product}
                            />
                            <ProductInfo
                                product={product}
                                quantity={quantity}
                                setQuantity={setQuantity}
                                isWishlisted={isWishlisted}
                                setIsWishlisted={setIsWishlisted}
                                onAddToCart={handleAddToCart}
                                onShare={() => setIsShareOpen(true)}
                                isAddingToCart={isAddingToCart}
                                cartMessage={cartMessage}
                                onWishlist={handleWishlistToggle}
                                isTogglingWishlist={isTogglingWishlist}
                            />
                        </div>
                        {relatedProducts.length > 0 && (
                            <RelatedProducts products={relatedProducts} />
                        )}
                    </div>

                    {/* Recently Viewed Section */}
                    <RecentlyViewedSection
                        excludeProductId={product.id}
                        className="bg-sand-50"
                    />
                </main>

                <ZoomModal
                    isOpen={isZoomed}
                    onClose={() => setIsZoomed(false)}
                    images={images}
                    currentIndex={selectedImageIndex}
                    setCurrentIndex={setSelectedImageIndex}
                />

                {/* Share Modal */}
                <ShareModal
                    isOpen={isShareOpen}
                    onClose={() => setIsShareOpen(false)}
                    url={`/shop/products/${product.slug}`}
                    title={product.name}
                    description={product.short_description || undefined}
                    imageUrl={images[0]?.image_url}
                />
            </ShopLayout>
        </>
    );
}

// ==================== Breadcrumb ====================
function Breadcrumb({ product }: { product: ApiProduct }) {
    return (
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wider text-neutral-400">
            <Link href="/shop" className="transition-colors hover:text-teal-600">
                Beranda
            </Link>
            <span className="text-neutral-300">/</span>
            <Link href="/shop/products" className="transition-colors hover:text-teal-600">
                Produk
            </Link>
            {product.category && (
                <>
                    <span className="text-neutral-300">/</span>
                    <Link
                        href={`/shop/products?filter[category]=${product.category.slug}`}
                        className="transition-colors hover:text-teal-600"
                    >
                        {product.category.name}
                    </Link>
                </>
            )}
            <span className="text-neutral-300">/</span>
            <span className="max-w-[250px] truncate font-semibold text-neutral-800">
                {product.name}
            </span>
        </nav>
    );
}

// ==================== Image Gallery ====================
interface ImageGalleryProps {
    images: ProductImage[];
    selectedIndex: number;
    setSelectedIndex: (i: number) => void;
    onZoom: () => void;
    product: ApiProduct;
}

function ImageGallery({
    images,
    selectedIndex,
    setSelectedIndex,
    onZoom,
    product,
}: ImageGalleryProps) {
    return (
        <div className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <div
                className="group relative aspect-[4/3] cursor-zoom-in overflow-hidden rounded-2xl border border-neutral-200/60 bg-white shadow-2xs sm:aspect-square"
                onClick={onZoom}
            >
                <AnimatePresence mode="wait">
                    <motion.img
                        key={selectedIndex}
                        src={images[selectedIndex]?.image_url}
                        alt={images[selectedIndex]?.alt_text || product.name}
                        className="h-full w-full bg-white object-cover transition-transform duration-500 group-hover:scale-105"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    />
                </AnimatePresence>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onZoom();
                    }}
                    className="absolute right-4 bottom-4 rounded-xl bg-white/80 p-3 text-neutral-800 shadow-md backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-white active:scale-95"
                    title="Perbesar Gambar"
                >
                    <ZoomIn size={18} />
                </button>

                {images.length > 1 && (
                    <>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedIndex(
                                    selectedIndex > 0
                                        ? selectedIndex - 1
                                        : images.length - 1,
                                );
                            }}
                            className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/80 p-2.5 text-neutral-800 shadow-md backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-white active:scale-95"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedIndex(
                                    selectedIndex < images.length - 1
                                        ? selectedIndex + 1
                                        : 0,
                                );
                            }}
                            className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white/80 p-2.5 text-neutral-800 shadow-md backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-white active:scale-95"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </>
                )}
            </div>

            {images.length > 1 && (
                <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
                    {images.map((img, idx) => (
                        <button
                            key={img.id || idx}
                            onClick={() => setSelectedIndex(idx)}
                            className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                                idx === selectedIndex
                                    ? 'scale-105 border-teal-600 shadow-sm ring-2 ring-teal-600/20'
                                    : 'border-neutral-200/80 opacity-70 hover:border-neutral-400 hover:opacity-100'
                            }`}
                        >
                            <img
                                src={img.image_url}
                                alt=""
                                className="h-full w-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ==================== Product Info ====================
interface ProductInfoProps {
    product: ApiProduct;
    quantity: number;
    setQuantity: (q: number) => void;
    isWishlisted: boolean;
    setIsWishlisted: (w: boolean) => void;
    onAddToCart: () => void;
    onShare: () => void;
    isAddingToCart: boolean;
    cartMessage: { type: 'success' | 'error'; text: string } | null;
    onWishlist: () => void;
    isTogglingWishlist: boolean;
}

function ProductInfo({
    product,
    quantity,
    setQuantity,
    isWishlisted,
    setIsWishlisted,
    onAddToCart,
    onShare,
    isAddingToCart,
    cartMessage,
    onWishlist,
    isTogglingWishlist,
}: ProductInfoProps) {
    const { siteSettings } = usePage<SharedData>().props;

    return (
        <div className="space-y-6">
            {/* Header badges: Category & SKU */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-4">
                {product.category ? (
                    <Link
                        href={`/shop/products?filter[category]=${product.category.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-teal-200/60 bg-teal-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-teal-800 transition-colors hover:bg-teal-100"
                    >
                        {product.category.name}
                    </Link>
                ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3.5 py-1 text-xs font-medium text-neutral-600">
                        Outdoor Furniture
                    </span>
                )}
                {product.sku && (
                    <span className="rounded-md bg-neutral-100/80 px-2.5 py-1 font-mono text-xs font-medium tracking-wider text-neutral-500">
                        SKU: {product.sku}
                    </span>
                )}
            </div>

            {/* Product Title */}
            <div>
                <h1 className="font-display text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl lg:text-5xl">
                    {product.name}
                </h1>
                {product.sold_count > 0 && (
                    <p className="mt-2 text-xs font-medium text-neutral-500">
                        {product.sold_count} Terjual
                    </p>
                )}
            </div>

            {/* Short Description */}
            {product.short_description && (
                <p className="text-base font-normal leading-relaxed text-neutral-600">
                    {product.short_description}
                </p>
            )}

            {/* Quick Material & Color Attributes */}
            {(product.material || product.color) && (
                <div className="flex flex-wrap gap-2 pt-1">
                    {product.material && (
                        <div className="shadow-2xs inline-flex items-center gap-2 rounded-xl border border-neutral-200/60 bg-neutral-50 px-3.5 py-2 text-xs font-medium text-neutral-700">
                            <span className="text-[10px] uppercase tracking-wider text-neutral-400">
                                Material
                            </span>
                            <span className="font-semibold text-neutral-900">
                                {product.material}
                            </span>
                        </div>
                    )}
                    {product.color && (
                        <div className="shadow-2xs inline-flex items-center gap-2 rounded-xl border border-neutral-200/60 bg-neutral-50 px-3.5 py-2 text-xs font-medium text-neutral-700">
                            <span className="text-[10px] uppercase tracking-wider text-neutral-400">
                                Warna
                            </span>
                            <span className="font-semibold text-neutral-900">
                                {product.color}
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* WhatsApp Inquiry CTA Button */}
            <div className="pt-2">
                <a
                    href={`https://wa.me/${siteSettings?.contact_whatsapp || '6281234567890'}?text=${encodeURIComponent(`Halo Ronica Outdoor Furniture, saya berminat dengan produk ${product.name} (SKU: ${product.sku || '-'}). Mohon informasi pemesanan & katalog lebih lanjut.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex w-full items-center justify-center gap-3 rounded-xl bg-teal-600 px-6 py-4 text-base font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-md active:translate-y-0"
                >
                    <MessageCircle className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    <span>Konsultasi &amp; Pemesanan via WhatsApp</span>
                </a>
            </div>

            {/* Description & Specifications Card */}
            {((product.specifications && Object.keys(product.specifications).length > 0) || product.description) && (
                <div className="shadow-2xs rounded-2xl border border-neutral-200/70 bg-white p-6 transition-all md:p-8">
                    <div className="mb-6 flex items-center justify-between border-b border-neutral-100 pb-4">
                        <h2 className="font-display text-xl font-bold tracking-tight text-neutral-900">
                            Deskripsi &amp; Spesifikasi Produk
                        </h2>
                        <span className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-700">
                            Spesifikasi &amp; Detail
                        </span>
                    </div>

                    {/* Specifications Table (from Admin Product Form Key-Value builder) */}
                    {product.specifications && Object.keys(product.specifications).length > 0 && (
                        <div className="mb-6 overflow-hidden rounded-xl border border-neutral-200/80 shadow-2xs">
                            <table className="w-full text-left text-sm border-collapse">
                                <thead>
                                    <tr className="bg-neutral-50 border-b border-neutral-200/80">
                                        <th className="px-4 py-3 font-semibold text-neutral-800 w-1/3 border-r border-neutral-200/80">
                                            Spesifikasi
                                        </th>
                                        <th className="px-4 py-3 font-semibold text-neutral-800">
                                            Detail / Material
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200/60">
                                    {Object.entries(product.specifications).map(([key, value]) => (
                                        <tr key={key} className="hover:bg-neutral-50/50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-neutral-700 border-r border-neutral-200/80 bg-neutral-50/30">
                                                {key}
                                            </td>
                                            <td className="px-4 py-3 text-neutral-900 whitespace-pre-line">
                                                {value}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Rich Text Description (from Admin Product Form Description field) */}
                    {product.description && (
                        <div
                            className="prose prose-neutral max-w-none leading-relaxed text-neutral-700"
                            dangerouslySetInnerHTML={{
                                __html: product.description,
                            }}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

// ==================== Related Products ====================
function RelatedProducts({ products }: { products: ApiProduct[] }) {
    return (
        <section className="mb-20">
            <h2 className="mb-8 font-serif text-2xl text-neutral-900">
                Produk Terkait
            </h2>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}

// ==================== Customer Reviews ====================
import { ProductReview } from '@/types/shop';
import { useMemo } from 'react';

interface CustomerReviewsProps {
    reviews: ProductReview[];
    averageRating: number;
    reviewCount: number;
    ratingCountData?: { star: number; count: number }[];
    productId: number;
    userReview?: ProductReview;
}

function CustomerReviews({
    reviews,
    averageRating,
    reviewCount,
    ratingCountData,
    productId,
    userReview,
}: CustomerReviewsProps) {
    const totalReviews = reviewCount || reviews.length || 1;

    // Convert array of objects to map for easier lookup
    const ratingMap = useMemo(() => {
        if (!ratingCountData || !Array.isArray(ratingCountData)) return {};
        return ratingCountData.reduce(
            (acc, item) => {
                acc[item.star] = item.count;
                return acc;
            },
            {} as Record<number, number>,
        );
    }, [ratingCountData]);

    const ratingCounts = [5, 4, 3, 2, 1].map((rating) => {
        const count = ratingMap[rating] || 0;
        // Fallback checks internal reviews if map is empty (though backend should handle it)
        // const count = ratingMap[rating] !== undefined
        //     ? ratingMap[rating]
        //     : reviews.filter((r) => Math.round(r.rating) === rating).length;
        return {
            rating,
            count,
            percentage: (count / totalReviews) * 100,
        };
    });

    return (
        <section className="mb-20 border-t border-neutral-100 pt-12">
            <h2 className="mb-8 font-serif text-2xl text-neutral-900">
                Ulasan Pelanggan
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
                {/* Rating Summary */}
                <div className="rounded-sm bg-sand-50 p-6">
                    <div className="mb-6 text-center">
                        <div className="mb-2 text-5xl font-bold text-neutral-900">
                            {Number(averageRating || 0).toFixed(1)}
                        </div>
                        <div className="mb-2 flex justify-center">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                    key={s}
                                    size={20}
                                    className={
                                        s <= Math.round(averageRating)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-neutral-200'
                                    }
                                />
                            ))}
                        </div>
                        <p className="text-neutral-500">{reviewCount} ulasan</p>
                    </div>
                    <div className="space-y-2">
                        {ratingCounts.map(({ rating, count, percentage }) => (
                            <div
                                key={rating}
                                className="flex items-center gap-2 text-sm"
                            >
                                <span className="w-3">{rating}</span>
                                <Star
                                    size={14}
                                    className="fill-yellow-400 text-yellow-400"
                                />
                                <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
                                    <div
                                        className="h-full rounded-full bg-yellow-400"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="w-8 text-neutral-500">
                                    {count}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Review Form - Show if logged in */}
                    <ReviewForm
                        productId={productId}
                        existingReview={userReview}
                    />
                </div>

                {/* Reviews List */}
                <div className="space-y-6 md:col-span-2">
                    {reviews.slice(0, 5).map((review) => (
                        <div
                            key={review.id}
                            className="border-b border-neutral-100 pb-6 last:border-0"
                        >
                            <div className="mb-3 flex items-start justify-between">
                                <div>
                                    <div className="mb-1 flex items-center gap-2">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100">
                                            <span className="font-medium text-neutral-600">
                                                {review.user?.name?.charAt(0) ||
                                                    'U'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-neutral-900">
                                                {review.user?.name ||
                                                    'Pengguna'}
                                            </p>
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star
                                                        key={s}
                                                        size={14}
                                                        className={
                                                            s <= review.rating
                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                : 'text-neutral-200'
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-sm text-neutral-400">
                                        {new Date(
                                            review.created_at,
                                        ).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </span>
                                    {!review.is_approved && (
                                        <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                                            Menunggu Persetujuan
                                        </span>
                                    )}
                                </div>
                            </div>
                            {review.title && (
                                <p className="mb-1 font-medium text-neutral-900">
                                    {review.title}
                                </p>
                            )}
                            {review.comment && (
                                <p className="text-neutral-600">
                                    {review.comment}
                                </p>
                            )}
                        </div>
                    ))}
                    {reviews.length > 5 && (
                        <button className="font-medium text-teal-600 hover:underline">
                            Lihat semua {reviewCount} ulasan
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}

// ==================== Zoom Modal ====================
interface ZoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    images: ProductImage[];
    currentIndex: number;
    setCurrentIndex: (i: number) => void;
}

function ZoomModal({
    isOpen,
    onClose,
    images,
    currentIndex,
    setCurrentIndex,
}: ZoomModalProps) {
    if (!isOpen) return null;
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
                onClick={onClose}
            >
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
                >
                    <X size={24} />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIndex(
                            currentIndex > 0
                                ? currentIndex - 1
                                : images.length - 1,
                        );
                    }}
                    className="absolute left-6 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
                >
                    <ChevronLeft size={32} />
                </button>
                <img
                    src={images[currentIndex]?.image_url}
                    alt=""
                    className="max-h-[85vh] max-w-[85vw] rounded-2xl bg-white p-4 object-contain shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                />
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIndex(
                            currentIndex < images.length - 1
                                ? currentIndex + 1
                                : 0,
                        );
                    }}
                    className="absolute right-6 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
                >
                    <ChevronRight size={32} />
                </button>
                <div className="absolute bottom-6 flex gap-2">
                    {images.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={(e) => {
                                e.stopPropagation();
                                setCurrentIndex(idx);
                            }}
                            className={`h-3 w-3 rounded-full transition-colors ${idx === currentIndex ? 'bg-white' : 'bg-white/40'}`}
                        />
                    ))}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

// ==================== Review Form ====================
function ReviewForm({
    productId,
    existingReview,
}: {
    productId: number;
    existingReview?: ProductReview;
}) {
    const { auth } = usePage<SharedData>().props;
    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState(existingReview?.comment || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{
        type: 'success' | 'error';
        text: string;
    } | null>(null);

    // Update state if existingReview changes (e.g. after fresh load or prop update)
    useEffect(() => {
        if (existingReview) {
            setRating(existingReview.rating);
            setComment(existingReview.comment || '');
        }
    }, [existingReview]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setMessage({
                type: 'error',
                text: 'Silakan pilih rating bintang.',
            });
            return;
        }

        setIsSubmitting(true);
        setMessage(null);

        if (existingReview) {
            router.put(
                `/shop/products/${productId}/reviews`,
                { product_id: productId, rating, comment },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setMessage({
                            type: 'success',
                            text: 'Ulasan Anda berhasil diperbarui dan menunggu persetujuan!',
                        });
                        // Don't reset form on edit success
                    },
                    onError: (errors) => {
                        setMessage({
                            type: 'error',
                            text:
                                Object.values(errors)[0] ||
                                'Gagal memperbarui ulasan.',
                        });
                    },
                    onFinish: () => setIsSubmitting(false),
                },
            );
        } else {
            router.post(
                `/shop/products/${productId}/reviews`,
                { product_id: productId, rating, comment },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setMessage({
                            type: 'success',
                            text: 'Ulasan Anda berhasil dikirim!',
                        });
                        setRating(0);
                        setComment('');
                    },
                    onError: (errors) => {
                        setMessage({
                            type: 'error',
                            text:
                                Object.values(errors)[0] ||
                                'Gagal mengirim ulasan.',
                        });
                    },
                    onFinish: () => setIsSubmitting(false),
                },
            );
        }
    };

    if (!auth.user) {
        return (
            <div className="mt-8 rounded-sm bg-neutral-50 p-6 text-center">
                <p className="mb-4 text-neutral-600">
                    Silakan masuk untuk menulis ulasan.
                </p>
                <Link
                    href="/login"
                    className="inline-block rounded-sm bg-teal-600 px-6 py-2 font-medium text-white transition-colors hover:bg-teal-700"
                >
                    Masuk Akun
                </Link>
            </div>
        );
    }

    return (
        <div className="mt-8 border-t border-neutral-100 pt-8">
            <h3 className="mb-4 font-medium text-neutral-900">
                {existingReview ? 'Edit Ulasan Anda' : 'Tulis Ulasan Anda'}
            </h3>
            {message && (
                <div
                    className={`mb-4 rounded-sm p-4 ${message.type === 'success'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                >
                    {message.text}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">
                        Rating
                    </label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => setRating(s)}
                                onMouseEnter={() => setHoverRating(s)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="transition-transform hover:scale-110"
                            >
                                <Star
                                    size={24}
                                    className={`${s <= (hoverRating || rating)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-neutral-300'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label
                        htmlFor="comment"
                        className="mb-2 block text-sm font-medium text-neutral-700"
                    >
                        Ulasan
                    </label>
                    <textarea
                        id="comment"
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full rounded-sm border-neutral-200 focus:border-teal-500 focus:ring-teal-500"
                        placeholder="Bagikan pengalaman Anda tentang produk ini..."
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-sm bg-teal-600 px-6 py-2 font-medium text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
                </button>
            </form>
        </div>
    );
}
