import {
  BreadcrumbStructuredData,
  ProductStructuredData,
  SEOHead,
} from '@/components/seo';
import {
  ProductCard,
  ProductImagePlaceholder,
  saveToRecentlyViewed,
  ShareModal,
} from '@/components/shop';
import { ShopLayout } from '@/layouts/ShopLayout';
import { SharedData, SiteSettings } from '@/types';
import { ApiProduct, ProductImage, ProductReview } from '@/types/shop';
import { Link, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Home,
  Info,
  Layers,
  MessageCircle,
  Ruler,
  Star,
  X,
  ZoomIn,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

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
  // Update wishlist state when product changes
  useEffect(() => {
    setIsWishlisted(product.is_wishlisted || false);
  }, [product.id, product.is_wishlisted]);

  // Save to recently viewed on mount
  useEffect(() => {
    saveToRecentlyViewed(product);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const images = product.images?.length ? product.images : [];

  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  const handleWishlistToggle = () => {
    const { auth } = usePage<SharedData>().props;
    if (!auth.user) {
      router.visit('/login');
      return;
    }

    setIsTogglingWishlist(true);

    router.post(
      `/shop/wishlist/${product.id}`,
      {},
      {
        preserveScroll: true,
        onSuccess: () => {
          const newStatus = !isWishlisted;
          setIsWishlisted(newStatus);
          if (newStatus) {
            toast.success('Product added to wishlist!');
          } else {
            toast.info('Product removed from wishlist');
          }
        },
        onError: () => {
          toast.error('Failed to update wishlist');
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
      name: 'Home',
      url:
        typeof window !== 'undefined'
          ? `${window.location.origin}/shop`
          : '/shop',
    },
    {
      name: 'Products',
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
          product.description?.replace(/<[^>]*>/g, '').substring(0, 160) ||
          `Discover ${product.name} by ${siteName}. Premium outdoor & teak furniture.`
        }
        keywords={
          [
            ...(product.meta_keywords
              ? product.meta_keywords.split(',').map((k: string) => k.trim())
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
          availability: product.is_in_stock ? 'in stock' : 'out of stock',
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
          availability: product.is_in_stock ? 'InStock' : 'OutOfStock',
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
        <main className="min-h-screen bg-neutral-50/50 pt-6 pb-20">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-12">
            {/* Modern Breadcrumb */}
            <Breadcrumb product={product} />

            {/* Top Hero Section: Image Gallery & Main Summary */}
            <div className="mb-14 grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
              {/* Gallery Column (7 cols on LG) */}
              <div className="lg:col-span-7">
                <ImageGallery
                  images={images}
                  selectedIndex={selectedImageIndex}
                  setSelectedIndex={setSelectedImageIndex}
                  onZoom={() => setIsZoomed(true)}
                  product={product}
                  isWishlisted={isWishlisted}
                  onWishlist={handleWishlistToggle}
                  isTogglingWishlist={isTogglingWishlist}
                />
              </div>

              {/* Summary Column (5 cols on LG) */}
              <div className="lg:col-span-5">
                <ProductInfoSummary
                  product={product}
                  onShare={() => setIsShareOpen(true)}
                  isWishlisted={isWishlisted}
                  onWishlist={handleWishlistToggle}
                  isTogglingWishlist={isTogglingWishlist}
                />
              </div>
            </div>

            {/* Collection Bundle / Linked Products Section */}
            {product.linked_products && product.linked_products.length > 0 && (
              <CollectionBundleSection
                linkedProducts={product.linked_products}
                collectionName={product.name}
              />
            )}

            {/* Full-width Product Details & Tabs Section */}
            <div className="mb-16">
              <ProductDetailTabs product={product} />
            </div>

            {/* Customer Reviews Section */}
            {product.reviews && product.reviews.length > 0 && (
              <CustomerReviews
                reviews={product.reviews}
                averageRating={product.average_rating}
                reviewCount={product.review_count}
                ratingCountData={product.rating_counts}
                productId={product.id}
                userReview={userReview}
              />
            )}

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
              <RelatedProducts products={relatedProducts} />
            )}
          </div>
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

// ==================== Breadcrumb & Header Controls ====================
function Breadcrumb({ product }: { product: ApiProduct }) {
  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      router.visit('/shop/products');
    }
  };

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <nav className="flex flex-wrap items-center gap-2 text-xs font-medium text-neutral-500">
        <Link
          href="/shop"
          className="flex items-center gap-1 transition-colors hover:text-teal-700"
        >
          <Home size={13} className="text-neutral-400" />
          <span>Home</span>
        </Link>
        <span className="text-neutral-300">/</span>
        <Link
          href="/shop/products"
          className="transition-colors hover:text-teal-700"
        >
          Products
        </Link>
        {product.category && (
          <>
            <span className="text-neutral-300">/</span>
            <Link
              href={`/shop/products?filter[category]=${product.category.slug}`}
              className="transition-colors hover:text-teal-700"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <span className="text-neutral-300">/</span>
        <span className="max-w-[280px] truncate font-semibold text-neutral-900">
          {product.name}
        </span>
      </nav>

      {/* Back Button on Top Right */}
      <button
        type="button"
        onClick={handleBack}
        className="group inline-flex cursor-pointer items-center gap-2 rounded-xl border border-neutral-200/90 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 shadow-xs transition-all duration-200 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 active:scale-95"
      >
        <ArrowLeft
          size={14}
          className="text-neutral-500 transition-transform duration-200 group-hover:-translate-x-1 group-hover:text-neutral-900"
        />
        <span>Back</span>
      </button>
    </div>
  );
}

// ==================== Image Gallery ====================
interface ImageGalleryProps {
  images: ProductImage[];
  selectedIndex: number;
  setSelectedIndex: (i: number) => void;
  onZoom: () => void;
  product: ApiProduct;
  isWishlisted: boolean;
  onWishlist: () => void;
  isTogglingWishlist: boolean;
}

function ImageGallery({
  images,
  selectedIndex,
  setSelectedIndex,
  onZoom,
  product,
  isWishlisted,
  onWishlist,
  isTogglingWishlist,
}: ImageGalleryProps) {
  const hasImages = images && images.length > 0;

  return (
    <div className="space-y-4 lg:sticky lg:top-28">
      {/* Main Image Showcase Card */}
      <div
        className={`group relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl border border-neutral-200/80 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md sm:aspect-[16/11] ${hasImages ? 'cursor-zoom-in' : ''}`}
        onClick={hasImages ? onZoom : undefined}
      >
        {hasImages ? (
          <AnimatePresence mode="wait">
            <motion.img
              key={selectedIndex}
              src={images[selectedIndex]?.image_url}
              alt={images[selectedIndex]?.alt_text || product.name}
              className="h-full w-full object-scale-down transition-transform duration-500 group-hover:scale-105"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />
          </AnimatePresence>
        ) : (
          <ProductImagePlaceholder
            name={product.name}
            sku={product.sku}
            category={product.category?.name}
            size="xl"
          />
        )}

        {/* Top Action Overlay: Wishlist & Image Badge */}
        <div className="pointer-events-none absolute top-4 right-4 left-4 flex items-center justify-between">
          {hasImages ? (
            <span className="pointer-events-auto rounded-full border border-neutral-100 bg-white/90 px-3 py-1 text-xs font-semibold text-neutral-700 shadow-xs backdrop-blur-md">
              {selectedIndex + 1} / {images.length}
            </span>
          ) : (
            <span />
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onWishlist();
            }}
            disabled={isTogglingWishlist}
            className={`pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full shadow-md backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 ${
              isWishlisted
                ? 'bg-red-500 text-white'
                : 'bg-white/90 text-neutral-600 hover:bg-white hover:text-red-500'
            }`}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart size={18} className={isWishlisted ? 'fill-white' : ''} />
          </button>
        </div>

        {/* Bottom Zoom Button Badge */}
        {hasImages && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onZoom();
            }}
            className="absolute right-4 bottom-4 flex items-center gap-1.5 rounded-xl bg-neutral-900/80 px-3.5 py-2 text-xs font-medium text-white shadow-md backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-neutral-900 active:scale-95"
          >
            <ZoomIn size={15} />
            <span>Zoom</span>
          </button>
        )}

        {/* Next / Prev Image Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(
                  selectedIndex > 0 ? selectedIndex - 1 : images.length - 1,
                );
              }}
              className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/90 p-3 text-neutral-800 opacity-0 shadow-md backdrop-blur-md transition-all duration-200 group-hover:opacity-100 hover:scale-110 hover:bg-white active:scale-95"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(
                  selectedIndex < images.length - 1 ? selectedIndex + 1 : 0,
                );
              }}
              className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white/90 p-3 text-neutral-800 opacity-0 shadow-md backdrop-blur-md transition-all duration-200 group-hover:opacity-100 hover:scale-110 hover:bg-white active:scale-95"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Carousel */}
      {images.length > 1 && (
        <div className="no-scrollbar flex gap-3 overflow-x-auto py-1">
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 bg-white p-1.5 transition-all duration-200 ${
                idx === selectedIndex
                  ? 'scale-102 border-teal-600 shadow-sm ring-2 ring-teal-600/20'
                  : 'border-neutral-200/80 opacity-70 hover:border-neutral-400 hover:opacity-100'
              }`}
            >
              <img
                src={img.image_url}
                alt=""
                className="h-full w-full object-scale-down"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ==================== Product Info Summary (Right Column) ====================
interface ProductInfoSummaryProps {
  product: ApiProduct;
  onShare: () => void;
  isWishlisted: boolean;
  onWishlist: () => void;
  isTogglingWishlist: boolean;
}

function ProductInfoSummary({
  product,
  onShare,
  isWishlisted,
  onWishlist,
  isTogglingWishlist,
}: ProductInfoSummaryProps) {
  const { siteSettings } = usePage<SharedData>().props;
  const whatsappNumber = siteSettings?.contact_whatsapp || '6281234567890';
  const waText = `Hello Ronica Outdoor Furniture, I am interested in the product *${product.name}* (SKU: ${product.sku || '-'}). Please provide ordering information and full catalog.`;
  const waUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waText)}`;

  return (
    <div className="flex flex-col space-y-6 rounded-3xl border border-neutral-200/70 bg-white p-6 shadow-xs sm:p-8">
      {/* Header badges: Category, SKU & Availability */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-neutral-100 pb-5">
        <div className="flex flex-wrap items-center gap-2">
          {product.category ? (
            <Link
              href={`/shop/products?filter[category]=${product.category.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-teal-200/80 bg-teal-50 px-3.5 py-1 text-xs font-semibold tracking-wider text-teal-800 uppercase transition-colors hover:bg-teal-100"
            >
              {product.category.name}
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3.5 py-1 text-xs font-medium text-neutral-600">
              Outdoor Furniture
            </span>
          )}
        </div>

        {product.sku && (
          <span className="rounded-md bg-neutral-100/90 px-2.5 py-1 font-mono text-xs font-medium tracking-wider text-neutral-500">
            SKU: {product.sku}
          </span>
        )}
      </div>

      {/* Product Title */}
      <div>
        <h1 className="font-display text-2xl leading-tight font-bold tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl">
          {product.name}
        </h1>
        <p className="mt-2 text-xs font-medium text-neutral-400">
          Premium Quality Outdoor &amp; Teak Furniture
        </p>
      </div>

      {/* Short Description */}
      {product.short_description && (
        <p className="text-sm leading-relaxed font-normal text-neutral-600">
          {product.short_description}
        </p>
      )}

      {/* Quick Material & Color Chips */}
      {(product.material || product.color) && (
        <div className="flex flex-wrap gap-2 pt-1">
          {product.material && (
            <div className="inline-flex items-center gap-2 rounded-xl border border-neutral-200/70 bg-neutral-50/80 px-3.5 py-2 text-xs font-medium text-neutral-700">
              <span className="text-[10px] tracking-wider text-neutral-400 uppercase">
                Material
              </span>
              <span className="font-semibold text-neutral-900">
                {product.material}
              </span>
            </div>
          )}
          {product.color && (
            <div className="inline-flex items-center gap-2 rounded-xl border border-neutral-200/70 bg-neutral-50/80 px-3.5 py-2 text-xs font-medium text-neutral-700">
              <span className="text-[10px] tracking-wider text-neutral-400 uppercase">
                Color
              </span>
              <span className="font-semibold text-neutral-900">
                {product.color}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Linked Collection Bundle Info Link */}
      {product.linked_products && product.linked_products.length > 0 && (
        <a
          href="#collection-items"
          className="flex items-center justify-between rounded-2xl border border-teal-200 bg-teal-50/80 p-3.5 text-xs font-medium text-teal-900 transition-colors hover:bg-teal-100/80"
        >
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-600 text-white">
              <Layers size={14} />
            </span>
            <span>
              This collection includes{' '}
              <strong>
                {product.linked_products.length} integrated products
              </strong>
            </span>
          </div>
          <span className="font-semibold text-teal-700 underline">
            View All ↓
          </span>
        </a>
      )}

      {/* Primary Action Button: WhatsApp Inquiry */}
      <div className="space-y-3 pt-2">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-teal-700 px-6 py-4 text-base font-semibold text-white shadow-md transition-all duration-300 hover:bg-teal-800 hover:shadow-lg active:scale-[0.99]"
        >
          <MessageCircle className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
          <span>Consultation &amp; Order via WhatsApp</span>
        </a>
      </div>
    </div>
  );
}

// ==================== Full-Width Product Details & Tabs Section ====================
function ProductDetailTabs({ product }: { product: ApiProduct }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'specs'>('overview');

  const length = product.dimensions?.length ?? product.length;
  const width = product.dimensions?.width ?? product.width;
  const height = product.dimensions?.height ?? product.height;

  const specList: { label: string; value: string }[] = [];

  if (product.weight) {
    specList.push({ label: 'Total Weight', value: `${product.weight} kg` });
  }
  if (length) {
    specList.push({ label: 'Length', value: `${length} cm` });
  }
  if (width) {
    specList.push({ label: 'Width', value: `${width} cm` });
  }
  if (height) {
    specList.push({ label: 'Height', value: `${height} cm` });
  }
  if (product.material) {
    specList.push({ label: 'Main Material', value: product.material });
  }
  if (product.color) {
    specList.push({ label: 'Color / Finish', value: product.color });
  }
  if (product.sku) {
    specList.push({ label: 'Product Code (SKU)', value: product.sku });
  }
  if (product.specifications) {
    if (Array.isArray(product.specifications)) {
      product.specifications.forEach((item: any) => {
        if (item && typeof item === 'object' && item.key && item.value) {
          const k = String(item.key);
          const v = String(item.value);
          if (
            !specList.some((s) => s.label.toLowerCase() === k.toLowerCase())
          ) {
            specList.push({ label: k, value: v });
          }
        }
      });
    } else if (typeof product.specifications === 'object') {
      Object.entries(product.specifications).forEach(([key, value]) => {
        if (value) {
          const v =
            typeof value === 'object' && value !== null
              ? String((value as any).value || '')
              : String(value);
          if (
            v &&
            !specList.some((s) => s.label.toLowerCase() === key.toLowerCase())
          ) {
            specList.push({ label: key, value: v });
          }
        }
      });
    }
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-xs">
      {/* Tab Navigation Header */}
      <div className="flex flex-wrap border-b border-neutral-200/80 bg-neutral-50/70 px-4 pt-3 sm:px-8">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 border-b-2 px-5 py-4 text-sm font-semibold transition-all ${
            activeTab === 'overview'
              ? 'rounded-t-xl border-teal-600 bg-white text-teal-800 shadow-2xs'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Info size={16} />
          <span>Description &amp; Benefits</span>
        </button>

        <button
          onClick={() => setActiveTab('specs')}
          className={`flex items-center gap-2 border-b-2 px-5 py-4 text-sm font-semibold transition-all ${
            activeTab === 'specs'
              ? 'rounded-t-xl border-teal-600 bg-white text-teal-800 shadow-2xs'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Ruler size={16} />
          <span>Specification &amp; Dimension</span>
        </button>
      </div>

      {/* Tab Body Content */}
      <div className="p-6 sm:p-10">
        {/* Tab 1: Deskripsi & Keunggulan */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            {/* Rich HTML Description */}
            {product.description ? (
              <div
                className="prose prose-neutral max-w-none text-sm leading-relaxed whitespace-pre-line text-neutral-700 sm:text-base"
                dangerouslySetInnerHTML={{
                  __html: product.description,
                }}
              />
            ) : (
              <p className="leading-relaxed text-neutral-600">
                {product.short_description ||
                  `The ${product.name} is crafted from export-grade solid teak wood with precision joinery and high weather resistance.`}
              </p>
            )}
          </motion.div>
        )}

        {/* Tab 2: Spesifikasi & Dimensi */}
        {activeTab === 'specs' && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            {/* Dimension Summary Cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-2xl border border-neutral-200/70 bg-neutral-50/70 p-4 text-center">
                <span className="block text-[10px] font-semibold text-neutral-400 uppercase">
                  Length
                </span>
                <span className="mt-1 block font-display text-xl font-bold text-neutral-900">
                  {length ? `${length} cm` : '-'}
                </span>
              </div>
              <div className="rounded-2xl border border-neutral-200/70 bg-neutral-50/70 p-4 text-center">
                <span className="block text-[10px] font-semibold text-neutral-400 uppercase">
                  Width
                </span>
                <span className="mt-1 block font-display text-xl font-bold text-neutral-900">
                  {width ? `${width} cm` : '-'}
                </span>
              </div>
              <div className="rounded-2xl border border-neutral-200/70 bg-neutral-50/70 p-4 text-center">
                <span className="block text-[10px] font-semibold text-neutral-400 uppercase">
                  Height
                </span>
                <span className="mt-1 block font-display text-xl font-bold text-neutral-900">
                  {height ? `${height} cm` : '-'}
                </span>
              </div>
              <div className="rounded-2xl border border-neutral-200/70 bg-neutral-50/70 p-4 text-center">
                <span className="block text-[10px] font-semibold text-neutral-400 uppercase">
                  Weight
                </span>
                <span className="mt-1 block font-display text-xl font-bold text-neutral-900">
                  {product.weight ? `${product.weight} kg` : '-'}
                </span>
              </div>
            </div>

            {/* Complete Specifications Grid */}
            {specList.length > 0 ? (
              <div className="overflow-hidden rounded-2xl border border-neutral-200/80 shadow-2xs">
                <table className="w-full text-left text-sm">
                  <tbody className="divide-y divide-neutral-200/70">
                    {specList.map((spec, idx) => (
                      <tr
                        key={idx}
                        className={
                          idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'
                        }
                      >
                        <td className="w-1/3 border-r border-neutral-200/70 px-5 py-3.5 font-medium text-neutral-600">
                          {spec.label}
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-neutral-900">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-neutral-500">
                Detailed specifications for this product are available upon
                consultation.
              </p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ==================== Collection / Included Products Section ====================
function CollectionBundleSection({
  linkedProducts,
  collectionName,
}: {
  linkedProducts: ApiProduct[];
  collectionName: string;
}) {
  if (!linkedProducts || linkedProducts.length === 0) return null;

  return (
    <section
      id="collection-items"
      className="mb-16 rounded-3xl border border-teal-200/80 bg-gradient-to-br from-teal-50/40 via-white to-sand-50/50 p-6 shadow-sm sm:p-10"
    >
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-teal-100 pb-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-teal-100/70 px-3.5 py-1 text-xs font-semibold tracking-wider text-teal-800 uppercase">
            <Layers size={14} />
            <span>
              Integrated Collection &bull; {linkedProducts.length} Items
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            Products in This Collection
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-neutral-600">
            The{' '}
            <span className="font-semibold text-neutral-900">
              {collectionName}
            </span>{' '}
            collection consists of the following products. Click on any product
            to view its detailed specifications and full gallery.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {linkedProducts.map((item, idx) => {
          const imgUrl =
            item.primary_image?.image_url || item.images?.[0]?.image_url;

          return (
            <div
              key={item.id || idx}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-teal-400 hover:shadow-xl"
            >
              {/* Product Thumbnail */}
              <Link
                href={`/shop/products/${item.slug}`}
                className="relative flex aspect-4/3 w-full items-center justify-center overflow-hidden bg-neutral-50 p-3"
              >
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <ProductImagePlaceholder
                    name={item.name}
                    sku={item.sku}
                    category={item.category?.name}
                    size="sm"
                  />
                )}
                {item.category && (
                  <span className="absolute top-3 left-3 rounded-full bg-neutral-900/80 px-2.5 py-1 text-[11px] font-medium text-white shadow-xs backdrop-blur-sm">
                    {item.category.name}
                  </span>
                )}
                <span className="absolute right-3 bottom-3 flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 text-white opacity-0 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:opacity-100">
                  <ArrowRight size={14} />
                </span>
              </Link>

              {/* Product Info */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <p className="font-mono text-[11px] tracking-wider text-neutral-400 uppercase">
                    SKU: {item.sku || '-'}
                  </p>
                  <Link
                    href={`/shop/products/${item.slug}`}
                    className="mt-1 line-clamp-2 block font-serif text-base font-bold text-neutral-900 transition-colors hover:text-teal-600"
                  >
                    {item.name}
                  </Link>
                  {item.material && (
                    <p className="mt-1 line-clamp-1 text-xs text-neutral-500">
                      {item.material}
                    </p>
                  )}
                </div>

                <div className="mt-4 border-t border-neutral-100 pt-3">
                  <Link
                    href={`/shop/products/${item.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 group-hover:underline hover:text-teal-900"
                  >
                    <span>View Product Details</span>
                    <ArrowRight
                      size={13}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ==================== Related Products ====================
function RelatedProducts({ products }: { products: ApiProduct[] }) {
  return (
    <section className="mb-14">
      <div className="mb-8 flex items-center justify-between border-b border-neutral-200/80 pb-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-neutral-900">
            Related Products
          </h2>
          <p className="mt-1 text-xs text-neutral-500">
            Complementary product selection that matches your home.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

// ==================== Customer Reviews ====================
function CustomerReviews({
  reviews,
  averageRating,
  reviewCount,
  ratingCountData,
  productId,
  userReview,
}: {
  reviews: ProductReview[];
  averageRating: number;
  reviewCount: number;
  ratingCountData?: { star: number; count: number }[];
  productId: number;
  userReview?: ProductReview;
}) {
  const totalReviews = reviewCount || reviews.length || 1;

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
    return {
      rating,
      count,
      percentage: (count / totalReviews) * 100,
    };
  });

  return (
    <section className="mb-16 rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs sm:p-10">
      <h2 className="mb-8 font-display text-2xl font-bold tracking-tight text-neutral-900">
        Customer Reviews
      </h2>
      <div className="grid gap-8 md:grid-cols-3">
        {/* Rating Summary Card */}
        <div className="rounded-2xl border border-neutral-200/70 bg-neutral-50/70 p-6 text-center">
          <div className="mb-4">
            <div className="font-display text-5xl font-bold text-neutral-900">
              {Number(averageRating || 0).toFixed(1)}
            </div>
            <div className="mt-2 flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={18}
                  className={
                    s <= Math.round(averageRating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-neutral-200'
                  }
                />
              ))}
            </div>
            <p className="mt-2 text-xs font-medium text-neutral-500">
              {reviewCount} verified reviews
            </p>
          </div>

          <div className="space-y-2 border-t border-neutral-200/60 pt-4">
            {ratingCounts.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-2 text-xs">
                <span className="w-3 font-medium text-neutral-600">
                  {rating}
                </span>
                <Star size={12} className="fill-amber-400 text-amber-400" />
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-200/70">
                  <div
                    className="h-full rounded-full bg-amber-400"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-6 text-right font-mono text-neutral-500">
                  {count}
                </span>
              </div>
            ))}
          </div>

          <ReviewForm productId={productId} existingReview={userReview} />
        </div>

        {/* Reviews List */}
        <div className="space-y-6 md:col-span-2">
          {reviews.slice(0, 5).map((review) => (
            <div
              key={review.id}
              className="border-b border-neutral-100 pb-6 last:border-0"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-800">
                    {review.user?.name?.charAt(0).toUpperCase() || 'P'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-900">
                      {review.user?.name || 'Customer'}
                    </p>
                    <div className="mt-0.5 flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={13}
                          className={
                            s <= review.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-neutral-200'
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-neutral-400">
                  {new Date(review.created_at).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              {review.title && (
                <p className="mb-1 text-sm font-semibold text-neutral-900">
                  {review.title}
                </p>
              )}
              {review.comment && (
                <p className="text-sm leading-relaxed text-neutral-600">
                  {review.comment}
                </p>
              )}
            </div>
          ))}
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20"
        >
          <X size={24} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrentIndex(
              currentIndex > 0 ? currentIndex - 1 : images.length - 1,
            );
          }}
          className="absolute left-6 rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20"
        >
          <ChevronLeft size={32} />
        </button>
        <img
          src={images[currentIndex]?.image_url}
          alt=""
          className="max-h-[85vh] max-w-[85vw] rounded-2xl bg-white object-contain p-4 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrentIndex(
              currentIndex < images.length - 1 ? currentIndex + 1 : 0,
            );
          }}
          className="absolute right-6 rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20"
        >
          <ChevronRight size={32} />
        </button>
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
        text: 'Please select a star rating.',
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
              text: 'Your review has been updated successfully!',
            });
          },
          onError: (errors) => {
            setMessage({
              type: 'error',
              text: Object.values(errors)[0] || 'Failed to update review.',
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
              text: 'Your review has been submitted successfully!',
            });
            setRating(0);
            setComment('');
          },
          onError: (errors) => {
            setMessage({
              type: 'error',
              text: Object.values(errors)[0] || 'Failed to submit review.',
            });
          },
          onFinish: () => setIsSubmitting(false),
        },
      );
    }
  };

  if (!auth.user) {
    return (
      <div className="mt-6 rounded-xl bg-neutral-100/80 p-4 text-center text-xs">
        <p className="mb-2 text-neutral-600">
          Log in to leave a product review.
        </p>
        <Link
          href="/login"
          className="inline-block rounded-lg bg-teal-700 px-4 py-1.5 font-semibold text-white transition-colors hover:bg-teal-800"
        >
          Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6 border-t border-neutral-200/60 pt-4 text-left">
      <h4 className="mb-2 text-xs font-bold tracking-wider text-neutral-800 uppercase">
        {existingReview ? 'Edit Your Review' : 'Write a Review'}
      </h4>
      {message && (
        <div
          className={`mb-3 rounded-lg p-2.5 text-xs font-medium ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
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
                  size={18}
                  className={`${
                    s <= (hoverRating || rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-neutral-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
        <div>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full rounded-xl border border-neutral-200/80 p-2.5 text-xs focus:border-teal-600 focus:ring-teal-600"
            placeholder="Share your experience with this product..."
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-teal-700 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-teal-800 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}
