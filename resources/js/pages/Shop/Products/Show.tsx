import {
  BreadcrumbStructuredData,
  ProductStructuredData,
  SEOHead,
} from '@/components/seo';
import {
  ProductCard,
  ProductImagePlaceholder,
  saveToRecentlyViewed,
} from '@/components/shop';
import { ShopLayout } from '@/layouts/ShopLayout';
import { cn } from '@/lib/utils';
import { SharedData, SiteSettings } from '@/types';
import { ApiProduct, ProductImage, ProductReview } from '@/types/shop';
import { Link, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  MessageCircle,
  Minus,
  Plus,
  Sparkles,
  Star,
  Truck,
  X,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

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
  const siteName = siteSettings?.site_name || 'Ronica Furniture';

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    saveToRecentlyViewed(product);
  }, [product.id]);

  const images = product.images?.length ? product.images : [];

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
      <SEOHead
        title={product.name}
        description={
          product.short_description ||
          product.description?.replace(/<[^>]*>/g, '').substring(0, 160) ||
          `Discover ${product.name} by ${siteName}. Handcrafted solid teak furniture.`
        }
        keywords={
          [
            ...(product.meta_keywords
              ? product.meta_keywords.split(',').map((k: string) => k.trim())
              : []),
            product.name,
            product.category?.name || 'furniture',
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

      <ShopLayout showFooter={true} showWhatsApp={false}>
        <div className="min-h-screen bg-[#fcfcfb] text-neutral-900 selection:bg-neutral-900 selection:text-white">
          {/* Subtle Top Border Line */}
          <div className="h-[1px] w-full bg-neutral-200/60" />

          {/* Main Container */}
          <div className="mx-auto max-w-[1780px] px-4 pt-6 pb-24 sm:px-8 md:px-12 lg:px-16">
            {/* RH Architectural Breadcrumb & Back */}
            <RHBreadcrumb product={product} />

            {/* RH Main Hero Section: Left Gallery & Right Configurator Rail */}
            <div className="mt-6 mb-20 grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16 xl:gap-20">
              {/* Left Column: RH Multi-View Gallery (7 cols on LG, 8 cols on XL) */}
              <div className="lg:col-span-7 xl:col-span-8">
                <RHGallery
                  images={images}
                  selectedIndex={selectedImageIndex}
                  setSelectedIndex={setSelectedImageIndex}
                  onZoom={() => setIsZoomed(true)}
                  product={product}
                />
              </div>

              {/* Right Column: RH Stately Sticky Rail (5 cols on LG, 4 cols on XL) */}
              <div className="lg:sticky lg:top-24 lg:col-span-5 xl:col-span-4">
                <RHProductSummary product={product} />
              </div>
            </div>

            {/* Collection Bundle / Linked Products Section */}
            {product.linked_products && product.linked_products.length > 0 && (
              <RHCollectionBundleSection
                linkedProducts={product.linked_products}
                collectionName={product.name}
              />
            )}

            {/* RH Stately Accordions: Details, Dimensions, Care, Delivery */}
            <div className="mb-24 border-t border-neutral-200/80 pt-16">
              <RHEditorialAccordions product={product} />
            </div>

            {/* Customer Reviews Section */}
            {product.reviews && product.reviews.length > 0 && (
              <RHCustomerReviews
                reviews={product.reviews}
                averageRating={product.average_rating}
                reviewCount={product.review_count}
                ratingCountData={product.rating_counts}
                productId={product.id}
                userReview={userReview}
              />
            )}

            {/* Related Products / Complementary Pieces */}
            {relatedProducts.length > 0 && (
              <RHRelatedProducts products={relatedProducts} />
            )}
          </div>
        </div>

        {/* RH Fullscreen Editorial Lightbox */}
        <RHZoomModal
          isOpen={isZoomed}
          onClose={() => setIsZoomed(false)}
          images={images}
          currentIndex={selectedImageIndex}
          setCurrentIndex={setSelectedImageIndex}
          productTitle={product.name}
        />
      </ShopLayout>
    </>
  );
}

// ============================================================================
// 1. RH BREADCRUMB
// ============================================================================
function RHBreadcrumb({ product }: { product: ApiProduct }) {
  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      router.visit('/shop/products');
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200/60 pb-5">
      <nav className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] font-light tracking-[0.25em] uppercase text-neutral-400">
        <Link
          href="/shop"
          className="transition-colors hover:text-neutral-900"
        >
          Home
        </Link>
        <span className="text-neutral-300">/</span>
        <Link
          href="/shop/products"
          className="transition-colors hover:text-neutral-900"
        >
          Catalog
        </Link>
        {product.category && (
          <>
            <span className="text-neutral-300">/</span>
            <Link
              href={`/shop/products?filter[category]=${product.category.slug}`}
              className="transition-colors hover:text-neutral-900"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <span className="text-neutral-300">/</span>
        <span className="max-w-[320px] truncate font-normal text-neutral-800">
          {product.name}
        </span>
      </nav>

      <button
        type="button"
        onClick={handleBack}
        className="group inline-flex cursor-pointer items-center gap-2 text-[11px] font-light tracking-[0.2em] uppercase text-neutral-500 transition-colors hover:text-neutral-950"
      >
        <ArrowLeft
          size={13}
          className="transition-transform duration-200 group-hover:-translate-x-1"
        />
        <span>Return to Collection</span>
      </button>
    </div>
  );
}

// ============================================================================
// 2. RH GALLERY (High-Res Showcase & Multi-Angle Thumbnails)
// ============================================================================
interface RHGalleryProps {
  images: ProductImage[];
  selectedIndex: number;
  setSelectedIndex: (i: number) => void;
  onZoom: () => void;
  product: ApiProduct;
}

function RHGallery({
  images,
  selectedIndex,
  setSelectedIndex,
  onZoom,
  product,
}: RHGalleryProps) {
  const hasImages = images && images.length > 0;

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row md:items-start md:gap-6">
      {/* Left Vertical Thumbnail Strip (Desktop) */}
      {images.length > 1 && (
        <div className="no-scrollbar flex flex-row gap-3 overflow-x-auto md:w-24 md:flex-col md:overflow-visible">
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                'group relative aspect-square w-20 flex-shrink-0 cursor-pointer overflow-hidden border bg-white p-2 transition-all duration-200 md:w-full',
                idx === selectedIndex
                  ? 'border-neutral-950 shadow-xs ring-1 ring-neutral-950'
                  : 'border-neutral-200/80 opacity-70 hover:border-neutral-400 hover:opacity-100',
              )}
            >
              <img
                src={img.image_url}
                alt=""
                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute right-1 bottom-1 font-mono text-[9px] tracking-wider text-neutral-400">
                0{idx + 1}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Main Large Exhibition Frame */}
      <div className="relative flex-1">
        <div
          className={cn(
            'group relative flex aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] xl:aspect-[16/12] w-full items-center justify-center overflow-hidden border border-neutral-200/90 bg-white p-6 sm:p-10 shadow-xs transition-all duration-300',
            hasImages ? 'cursor-zoom-in' : '',
          )}
          onClick={hasImages ? onZoom : undefined}
        >
          {hasImages ? (
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedIndex}
                src={images[selectedIndex]?.image_url}
                alt={images[selectedIndex]?.alt_text || product.name}
                className="h-full w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
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

          {/* Top Indicators: Image Counter & Provenance Badge */}
          <div className="pointer-events-none absolute top-4 right-4 left-4 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 border border-neutral-200 bg-white/95 px-3 py-1 font-mono text-[10px] tracking-[0.2em] uppercase text-neutral-700 backdrop-blur-sm">
              <Sparkles size={11} className="text-neutral-500" />
              <span>
                {product.is_featured
                  ? 'Featured Product'
                  : product.material || product.category?.name || 'Handcrafted Design'}
              </span>
            </span>

            {hasImages && (
              <span className="border border-neutral-200 bg-white/95 px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-neutral-600 backdrop-blur-sm">
                0{selectedIndex + 1} / 0{images.length}
              </span>
            )}
          </div>

          {/* Bottom Zoom Trigger */}
          {hasImages && (
            <div className="pointer-events-none absolute right-4 bottom-4 flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onZoom();
                }}
                className="pointer-events-auto inline-flex items-center gap-2 border border-neutral-200 bg-white/95 px-3.5 py-1.5 text-[10px] font-light tracking-[0.25em] uppercase text-neutral-800 shadow-xs backdrop-blur-sm transition-all duration-200 hover:border-neutral-900 hover:bg-neutral-950 hover:text-white"
              >
                <Maximize2 size={12} />
                <span>Expand View</span>
              </button>
            </div>
          )}

          {/* Slide Navigation Chevrons */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex(
                    selectedIndex > 0 ? selectedIndex - 1 : images.length - 1,
                  );
                }}
                className="absolute top-1/2 left-3 -translate-y-1/2 border border-neutral-200 bg-white/90 p-2.5 text-neutral-700 opacity-0 shadow-sm backdrop-blur-sm transition-all duration-200 group-hover:opacity-100 hover:border-neutral-900 hover:bg-neutral-950 hover:text-white"
                aria-label="Previous photograph"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex(
                    selectedIndex < images.length - 1 ? selectedIndex + 1 : 0,
                  );
                }}
                className="absolute top-1/2 right-3 -translate-y-1/2 border border-neutral-200 bg-white/90 p-2.5 text-neutral-700 opacity-0 shadow-sm backdrop-blur-sm transition-all duration-200 group-hover:opacity-100 hover:border-neutral-900 hover:bg-neutral-950 hover:text-white"
                aria-label="Next photograph"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
        </div>

        {/* Photographic Caption / Angle Indicator */}
        {hasImages && images[selectedIndex]?.alt_text && (
          <p className="mt-3 text-center font-mono text-[11px] tracking-wider text-neutral-400 uppercase">
            {images[selectedIndex]?.alt_text}
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 3. RH PRODUCT SUMMARY (Right Rail: Stately Serif Title & Concierge Hub)
// ============================================================================
interface RHProductSummaryProps {
  product: ApiProduct;
}

function RHProductSummary({ product }: RHProductSummaryProps) {
  const { siteSettings } = usePage<SharedData>().props;
  const whatsappNumber = siteSettings?.contact_whatsapp || '6281234567890';
  const waText = `Hello Ronica / Hasibuan Design, I am inquiring about the piece *${product.name}* (Item #${product.sku || '-'}). Please share specification sheets, trade pricing, and production lead times.`;
  const waUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waText)}`;

  const length = product.dimensions?.length ?? product.length;
  const width = product.dimensions?.width ?? product.width;
  const height = product.dimensions?.height ?? product.height;

  // Dynamic Swatch Texture based on color/material
  const getSwatchGradient = (color?: string | null, material?: string | null) => {
    const text = `${color || ''} ${material || ''}`.toLowerCase();
    if (text.includes('black') || text.includes('hitam') || text.includes('charcoal')) {
      return 'radial-gradient(circle, #333333 20%, #111111 80%)';
    }
    if (text.includes('white') || text.includes('putih')) {
      return 'radial-gradient(circle, #ffffff 20%, #e0e0e0 80%)';
    }
    if (text.includes('rattan') || text.includes('rotan')) {
      return 'radial-gradient(circle, #ebd6be 20%, #cca984 80%)';
    }
    if (text.includes('walnut') || text.includes('dark brown') || text.includes('coklat')) {
      return 'radial-gradient(circle, #6a4b35 20%, #3a2517 80%)';
    }
    return 'radial-gradient(circle, #e3ba8f 20%, #c49666 80%)';
  };

  return (
    <div className="flex flex-col space-y-6 border border-neutral-200/90 bg-white p-7 sm:p-9 shadow-xs">
      {/* 1. Collection Header & Model Identity */}
      <div className="space-y-2 border-b border-neutral-200/70 pb-5">
        <div className="flex items-center justify-between text-[10px] font-light tracking-[0.3em] uppercase text-neutral-400">
          <span>
            {product.category?.name || 'Exclusive Living Collection'}
          </span>
          {product.sku && <span>ITEM # {product.sku}</span>}
        </div>

        {/* Stately Serif Title */}
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-[38px] font-light tracking-[0.04em] uppercase text-neutral-900 leading-[1.14]">
          {product.name}
        </h1>

        <p className="text-[11px] font-light tracking-[0.2em] uppercase text-neutral-500">
          {product.material
            ? `Handcrafted • ${product.material}`
            : product.category?.name
              ? `Handcrafted • ${product.category.name}`
              : 'Handcrafted Quality & Provenance'}
        </p>

        {/* In Stock & Ready to Ship Banner */}
        <div className="mt-3 flex items-center gap-2 pt-1">
          <span className="relative flex h-2 w-2">
            <span
              className={cn(
                'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
                product.is_in_stock === false ? 'bg-amber-400' : 'bg-emerald-400',
              )}
            />
            <span
              className={cn(
                'relative inline-flex h-2 w-2 rounded-full',
                product.is_in_stock === false ? 'bg-amber-600' : 'bg-emerald-600',
              )}
            />
          </span>
          <span className="text-[11px] font-medium tracking-[0.18em] uppercase text-neutral-800">
            {product.is_in_stock === false
              ? 'Out of Stock • Made to Order Inquiries Welcome'
              : 'In Stock & Ready for Immediate Delivery'}
          </span>
        </div>
      </div>

      {/* 2. Short Narrative Description */}
      {product.short_description && (
        <p className="text-xs sm:text-sm leading-relaxed font-light text-neutral-600">
          {product.short_description}
        </p>
      )}

      {/* 3. Finish / Material Selector Card */}
      <div className="space-y-2 border-t border-neutral-200/60 pt-4">
        <div className="flex items-center justify-between text-[11px] tracking-[0.15em] uppercase">
          <span className="font-light text-neutral-500">Finish / Texture:</span>
          <span className="font-medium text-neutral-900">
            {product.color || 'Natural Finish'}
          </span>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <div className="group relative flex w-full items-center gap-3 border border-neutral-950 bg-neutral-50/70 p-3 transition-all">
            {/* Dynamic Swatch Preview */}
            <div
              className="h-8 w-8 shrink-0 border border-neutral-300 bg-cover bg-center shadow-2xs"
              style={{
                backgroundImage: getSwatchGradient(product.color, product.material),
              }}
            />
            <div className="flex-1 text-left">
              <span className="block text-[11px] font-medium tracking-wider text-neutral-900 uppercase">
                {product.color || 'Natural Finish'}
              </span>
              <span className="block text-[10px] font-light text-neutral-500">
                {product.material || 'Solid Architectural Timber'}
              </span>
            </div>
            <Check size={14} className="text-neutral-950 shrink-0" />
          </div>
        </div>
      </div>

      {/* 4. Dimensions Selector Card */}
      <div className="space-y-2 border-t border-neutral-200/60 pt-4">
        <div className="flex items-center justify-between text-[11px] tracking-[0.15em] uppercase">
          <span className="font-light text-neutral-500">Scale &amp; Proportions:</span>
          <span className="font-medium text-neutral-900 font-mono text-[11px]">
            {length && width && height
              ? `${length}L × ${width}W × ${height}H cm`
              : 'Standard Scale'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono text-[11px]">
          <div className="border border-neutral-200 bg-neutral-50/50 p-2.5">
            <span className="block text-[9px] tracking-wider text-neutral-400 uppercase">
              Length (P)
            </span>
            <span className="font-semibold text-neutral-900">
              {length ? `${length} cm` : '-'}
            </span>
          </div>
          <div className="border border-neutral-200 bg-neutral-50/50 p-2.5">
            <span className="block text-[9px] tracking-wider text-neutral-400 uppercase">
              Width (L)
            </span>
            <span className="font-semibold text-neutral-900">
              {width ? `${width} cm` : '-'}
            </span>
          </div>
          <div className="border border-neutral-200 bg-neutral-50/50 p-2.5">
            <span className="block text-[9px] tracking-wider text-neutral-400 uppercase">
              Height (T)
            </span>
            <span className="font-semibold text-neutral-900">
              {height ? `${height} cm` : '-'}
            </span>
          </div>
        </div>
      </div>

      {/* 5. Signature Action Button & Concierge */}
      <div className="space-y-3 border-t border-neutral-200/60 pt-5">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex w-full items-center justify-center gap-3 border border-neutral-950 bg-neutral-950 py-4 px-6 text-center text-xs font-light tracking-[0.25em] uppercase text-white transition-all duration-300 hover:bg-neutral-800 active:scale-[0.99]"
        >
          <MessageCircle size={15} />
          <span>Inquire with Design Concierge</span>
        </a>

        <p className="text-center text-[10px] leading-relaxed text-neutral-400">
          Our interior consultants are available for custom dimensions,
          commercial hospitality quotes, and worldwide freight schedules.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// 4. RH EDITORIAL ACCORDIONS (Details, Dimensions, Care, Delivery)
// ============================================================================
function RHEditorialAccordions({ product }: { product: ApiProduct }) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    details: true,
    dimensions: true,
    care: false,
    delivery: false,
  });

  const toggle = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const length = product.dimensions?.length ?? product.length;
  const width = product.dimensions?.width ?? product.width;
  const height = product.dimensions?.height ?? product.height;

  const specList: { label: string; value: string }[] = [];
  if (product.sku) {
    specList.push({ label: 'Item Number (SKU)', value: product.sku });
  }

  // Additional Specifications from Form
  if (product.specifications) {
    if (Array.isArray(product.specifications)) {
      product.specifications.forEach((item: any) => {
        if (item && typeof item === 'object' && item.key && item.value) {
          specList.push({
            label: String(item.key),
            value: String(item.value),
          });
        }
      });
    } else if (typeof product.specifications === 'object') {
      Object.entries(product.specifications).forEach(([k, v]) => {
        if (v) {
          specList.push({
            label: k,
            value: typeof v === 'object' ? String((v as any).value || '') : String(v),
          });
        }
      });
    }
  }

  // Fallbacks if not already covered in specifications
  const hasMaterial = specList.some((s) => /material|kayu|bahan/i.test(s.label));
  if (!hasMaterial && product.material) {
    specList.push({ label: 'Primary Material', value: product.material });
  }

  const hasColor = specList.some((s) => /color|warna|finish/i.test(s.label));
  if (!hasColor && product.color) {
    specList.push({ label: 'Finish / Color', value: product.color });
  }



  return (
    <div className="space-y-0 divide-y divide-neutral-200/80 border-b border-neutral-200/80">
      {/* 01. DETAILS & CRAFTSMANSHIP */}
      <div className="py-6 sm:py-8">
        <button
          type="button"
          onClick={() => toggle('details')}
          className="flex w-full cursor-pointer items-center justify-between text-left"
        >
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs tracking-widest text-neutral-400">
              01
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-light tracking-[0.06em] uppercase text-neutral-900">
              Details &amp; Craftsmanship
            </h3>
          </div>
          <span className="border border-neutral-200 p-1 text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900">
            {openSections.details ? <Minus size={14} /> : <Plus size={14} />}
          </span>
        </button>

        <AnimatePresence>
          {openSections.details && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-6 sm:pt-8">
                <div className="max-w-4xl space-y-4 text-xs sm:text-sm leading-relaxed font-light text-neutral-700">
                  {product.description ? (
                    <div
                      className="prose prose-neutral max-w-none whitespace-pre-line text-neutral-700"
                      dangerouslySetInnerHTML={{
                        __html: product.description,
                      }}
                    />
                  ) : (
                    <p>
                      {product.short_description ||
                        `Meticulously handcrafted from premium ${product.material || 'timber'}. Designed with an enduring architectural presence, every contour is finished by master artisans using time-honored techniques.`}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 02. DIMENSIONS & SPECIFICATIONS */}
      <div className="py-6 sm:py-8">
        <button
          type="button"
          onClick={() => toggle('dimensions')}
          className="flex w-full cursor-pointer items-center justify-between text-left"
        >
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs tracking-widest text-neutral-400">
              02
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-light tracking-[0.06em] uppercase text-neutral-900">
              Dimensions &amp; Specifications
            </h3>
          </div>
          <span className="border border-neutral-200 p-1 text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900">
            {openSections.dimensions ? <Minus size={14} /> : <Plus size={14} />}
          </span>
        </button>

        <AnimatePresence>
          {openSections.dimensions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-6 pt-6 sm:pt-8">
                {/* 4-Item Dimension Header Grid */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 font-mono text-xs">
                  <div className="border border-neutral-200 bg-white p-4 text-center">
                    <span className="block text-[10px] tracking-widest text-neutral-400 uppercase">
                      Length (Panjang)
                    </span>
                    <span className="mt-1 block font-serif text-xl font-normal text-neutral-900">
                      {length ? `${length} cm` : '-'}
                    </span>
                  </div>
                  <div className="border border-neutral-200 bg-white p-4 text-center">
                    <span className="block text-[10px] tracking-widest text-neutral-400 uppercase">
                      Width (Lebar)
                    </span>
                    <span className="mt-1 block font-serif text-xl font-normal text-neutral-900">
                      {width ? `${width} cm` : '-'}
                    </span>
                  </div>
                  <div className="border border-neutral-200 bg-white p-4 text-center">
                    <span className="block text-[10px] tracking-widest text-neutral-400 uppercase">
                      Height (Tinggi)
                    </span>
                    <span className="mt-1 block font-serif text-xl font-normal text-neutral-900">
                      {height ? `${height} cm` : '-'}
                    </span>
                  </div>
                  <div className="border border-neutral-200 bg-white p-4 text-center">
                    <span className="block text-[10px] tracking-widest text-neutral-400 uppercase">
                      Net Weight (Berat)
                    </span>
                    <span className="mt-1 block font-serif text-xl font-normal text-neutral-900">
                      {product.weight ? `${product.weight} kg` : '-'}
                    </span>
                  </div>
                </div>

                {/* Complete Specifications Table */}
                {specList.length > 0 && (
                  <div className="overflow-hidden border border-neutral-200/80 bg-white">
                    <table className="w-full text-left text-xs">
                      <tbody className="divide-y divide-neutral-200/70">
                        {specList.map((spec, idx) => (
                          <tr
                            key={idx}
                            className={
                              idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/40'
                            }
                          >
                            <td className="w-1/3 border-r border-neutral-200/70 px-5 py-3 font-light tracking-wide text-neutral-500 uppercase">
                              {spec.label}
                            </td>
                            <td className="px-5 py-3 font-medium text-neutral-900">
                              {spec.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 03. CARE & ENDURING BEAUTY */}
      <div className="py-6 sm:py-8">
        <button
          type="button"
          onClick={() => toggle('care')}
          className="flex w-full cursor-pointer items-center justify-between text-left"
        >
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs tracking-widest text-neutral-400">
              03
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-light tracking-[0.06em] uppercase text-neutral-900">
              Care &amp; Enduring Maintenance
            </h3>
          </div>
          <span className="border border-neutral-200 p-1 text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900">
            {openSections.care ? <Minus size={14} /> : <Plus size={14} />}
          </span>
        </button>

        <AnimatePresence>
          {openSections.care && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 gap-6 pt-6 sm:pt-8 md:grid-cols-3 text-xs leading-relaxed font-light text-neutral-600">
                <div className="border border-neutral-200/80 bg-white p-5">
                  <h4 className="font-semibold tracking-wider text-neutral-900 uppercase">
                    Daily Dusting &amp; Wipe
                  </h4>
                  <p className="mt-2 text-neutral-500">
                    Gently wipe along the grain with a clean, lint-free microfiber
                    cloth. Avoid harsh abrasive cleaners or petroleum solvents.
                  </p>
                </div>
                <div className="border border-neutral-200/80 bg-white p-5">
                  <h4 className="font-semibold tracking-wider text-neutral-900 uppercase">
                    Material Preservation
                  </h4>
                  <p className="mt-2 text-neutral-500">
                    Crafted with {product.material || 'premium materials'}. Over time,
                    natural materials gracefully deepen in character, embodying authentic
                    organic warmth.
                  </p>
                </div>
                <div className="border border-neutral-200/80 bg-white p-5">
                  <h4 className="font-semibold tracking-wider text-neutral-900 uppercase">
                    Climate Conditioning
                  </h4>
                  <p className="mt-2 text-neutral-500">
                    Position away from direct continuous heating radiators to
                    maintain optimal equilibrium moisture content throughout the
                    year.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 04. WHITE GLOVE DELIVERY & PACKAGING */}
      <div className="py-6 sm:py-8">
        <button
          type="button"
          onClick={() => toggle('delivery')}
          className="flex w-full cursor-pointer items-center justify-between text-left"
        >
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs tracking-widest text-neutral-400">
              04
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-light tracking-[0.06em] uppercase text-neutral-900">
              Delivery &amp; Crated Packaging
            </h3>
          </div>
          <span className="border border-neutral-200 p-1 text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900">
            {openSections.delivery ? <Minus size={14} /> : <Plus size={14} />}
          </span>
        </button>

        <AnimatePresence>
          {openSections.delivery && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-6 sm:pt-8 space-y-4 text-xs leading-relaxed font-light text-neutral-600">
                <div className="flex items-start gap-3">
                  <Truck size={18} className="mt-0.5 text-neutral-900 shrink-0" />
                  <div>
                    <h4 className="font-semibold tracking-wider text-neutral-900 uppercase">
                      Fully Assembled Crated Freight Delivery
                    </h4>
                    <p className="mt-1 text-neutral-500">
                      Shipped in custom shock-absorbing export wooden crates to safeguard corners and surfaces during transit. Arrives fully assembled and ready for placement.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============================================================================
// 5. RH INTEGRATED COLLECTION BUNDLE
// ============================================================================
function RHCollectionBundleSection({
  linkedProducts,
  collectionName,
}: {
  linkedProducts: ApiProduct[];
  collectionName: string;
}) {
  if (!linkedProducts || linkedProducts.length === 0) return null;

  return (
    <section id="collection-items" className="mb-20 border-t border-neutral-200/80 pt-16">
      <div className="mb-10 text-center max-w-2xl mx-auto space-y-2">
        <span className="text-[10px] font-light tracking-[0.35em] uppercase text-neutral-400">
          The Curated Suite
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-light tracking-[0.06em] uppercase text-neutral-900">
          Pieces in the {collectionName}
        </h2>
        <p className="text-xs font-light text-neutral-500">
          Each piece shares harmonious architectural profiles, proportioned to
          create a cohesive interior dialogue.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {linkedProducts.map((item, idx) => {
          const imgUrl =
            item.primary_image?.image_url || item.images?.[0]?.image_url;

          return (
            <div
              key={item.id || idx}
              className="group flex flex-col border border-neutral-200/90 bg-white transition-all duration-300 hover:border-neutral-950"
            >
              <Link
                href={`/shop/products/${item.slug}`}
                className="relative aspect-4/3 w-full overflow-hidden bg-neutral-50 p-4"
              >
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    alt={item.name}
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <ProductImagePlaceholder
                    name={item.name}
                    sku={item.sku}
                    category={item.category?.name}
                    size="sm"
                  />
                )}
              </Link>

              <div className="p-5 flex flex-1 flex-col justify-between">
                <div>
                  <span className="font-mono text-[9px] tracking-wider text-neutral-400 uppercase">
                    ITEM #{item.sku || '-'}
                  </span>
                  <Link
                    href={`/shop/products/${item.slug}`}
                    className="mt-1 block font-serif text-base font-normal uppercase tracking-wide text-neutral-900 transition-colors hover:text-neutral-600"
                  >
                    {item.name}
                  </Link>
                  {item.material && (
                    <p className="mt-1 text-[11px] font-light text-neutral-500">
                      {item.material}
                    </p>
                  )}
                </div>

                <div className="mt-4 border-t border-neutral-100 pt-3">
                  <Link
                    href={`/shop/products/${item.slug}`}
                    className="inline-flex items-center gap-1 text-[10px] font-light tracking-[0.2em] uppercase text-neutral-900 hover:underline"
                  >
                    <span>View Specifications</span>
                    <ArrowRight size={11} />
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

// ============================================================================
// 6. RH RELATED PRODUCTS (Companion Furniture)
// ============================================================================
function RHRelatedProducts({ products }: { products: ApiProduct[] }) {
  return (
    <section className="mb-20 border-t border-neutral-200/80 pt-16">
      <div className="mb-10 text-center max-w-2xl mx-auto space-y-2">
        <span className="text-[10px] font-light tracking-[0.35em] uppercase text-neutral-400">
          Curated Harmonies
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-light tracking-[0.06em] uppercase text-neutral-900">
          Complementary Pieces
        </h2>
        <p className="text-xs font-light text-neutral-500">
          Discover architectural pairings designed to enrich your space with
          enduring teak craftsmanship.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// 7. RH CUSTOMER REVIEWS (Editorial Testimonials)
// ============================================================================
function RHCustomerReviews({
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
    <section className="mb-20 border-t border-neutral-200/80 pt-16">
      <div className="mb-10 text-center max-w-2xl mx-auto space-y-2">
        <span className="text-[10px] font-light tracking-[0.35em] uppercase text-neutral-400">
          Patron Experiences
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-light tracking-[0.06em] uppercase text-neutral-900">
          Client Reflections
        </h2>
      </div>

      <div className="grid gap-10 md:grid-cols-3">
        {/* Rating Summary Column */}
        <div className="border border-neutral-200/90 bg-white p-6 sm:p-8 text-center space-y-4">
          <span className="font-serif text-5xl font-light text-neutral-900">
            {averageRating ? averageRating.toFixed(1) : '5.0'}
          </span>
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={16}
                className={
                  s <= Math.round(averageRating || 5)
                    ? 'fill-neutral-950 text-neutral-950'
                    : 'text-neutral-200'
                }
              />
            ))}
          </div>
          <p className="text-[11px] font-light tracking-widest text-neutral-400 uppercase">
            Based on {reviewCount} reflections
          </p>

          <div className="mt-6 space-y-2 text-xs">
            {ratingCounts.map(({ rating, percentage, count }) => (
              <div key={rating} className="flex items-center gap-2">
                <span className="w-4 font-mono text-[10px] text-neutral-400">
                  {rating}
                </span>
                <div className="h-1 flex-1 bg-neutral-100 overflow-hidden">
                  <div
                    className="h-full bg-neutral-950"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-5 text-right font-mono text-[10px] text-neutral-400">
                  {count}
                </span>
              </div>
            ))}
          </div>

          <RHReviewForm productId={productId} existingReview={userReview} />
        </div>

        {/* Reviews List */}
        <div className="space-y-4 md:col-span-2">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="border border-neutral-200/80 bg-white p-6 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-base font-normal uppercase text-neutral-900">
                  {rev.user?.name || 'Verified Patron'}
                </span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={13}
                      className={
                        s <= rev.rating
                          ? 'fill-neutral-950 text-neutral-950'
                          : 'text-neutral-200'
                      }
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs sm:text-sm font-light leading-relaxed text-neutral-700">
                &ldquo;{rev.comment}&rdquo;
              </p>
              <span className="block font-mono text-[10px] text-neutral-400">
                {new Date(rev.created_at).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// 8. REVIEW FORM (Subtle Architectural)
// ============================================================================
function RHReviewForm({
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
      setMessage({ type: 'error', text: 'Please select a star rating.' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const endpoint = `/shop/products/${productId}/reviews`;
    const method = existingReview ? 'put' : 'post';

    router[method](
      endpoint,
      { product_id: productId, rating, comment },
      {
        preserveScroll: true,
        onSuccess: () => {
          setMessage({
            type: 'success',
            text: 'Your reflection has been submitted with gratitude.',
          });
          if (!existingReview) {
            setRating(0);
            setComment('');
          }
        },
        onError: (errs) => {
          setMessage({
            type: 'error',
            text: Object.values(errs)[0] || 'Unable to record review.',
          });
        },
        onFinish: () => setIsSubmitting(false),
      },
    );
  };

  if (!auth.user) {
    return (
      <div className="mt-6 border-t border-neutral-200/60 pt-4 text-center text-xs font-light text-neutral-500">
        <p className="mb-2">Sign in to share your experience with this design.</p>
        <Link
          href="/login"
          className="inline-block border border-neutral-950 px-4 py-2 text-[10px] font-medium tracking-[0.2em] uppercase text-neutral-950 transition-colors hover:bg-neutral-950 hover:text-white"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6 border-t border-neutral-200/60 pt-4 text-left space-y-3">
      <h4 className="text-[10px] font-semibold tracking-widest text-neutral-900 uppercase">
        {existingReview ? 'Update Reflection' : 'Write a Reflection'}
      </h4>
      {message && (
        <div
          className={`p-2.5 text-[11px] ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800'
              : 'bg-rose-50 text-rose-800'
          }`}
        >
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex justify-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setRating(s)}
              onMouseEnter={() => setHoverRating(s)}
              onMouseLeave={() => setHoverRating(0)}
              className="cursor-pointer transition-transform hover:scale-110"
            >
              <Star
                size={18}
                className={
                  s <= (hoverRating || rating)
                    ? 'fill-neutral-950 text-neutral-950'
                    : 'text-neutral-200'
                }
              />
            </button>
          ))}
        </div>
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border border-neutral-200 p-2.5 text-xs text-neutral-900 focus:border-neutral-950 focus:outline-hidden"
          placeholder="Reflect on the craftsmanship and utility..."
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full border border-neutral-950 bg-neutral-950 py-2.5 text-[10px] font-medium tracking-[0.2em] uppercase text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
        >
          {isSubmitting ? 'Recording...' : 'Submit Reflection'}
        </button>
      </form>
    </div>
  );
}

// ============================================================================
// 9. RH FULLSCREEN EDITORIAL LIGHTBOX
// ============================================================================
interface RHZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: ProductImage[];
  currentIndex: number;
  setCurrentIndex: (i: number) => void;
  productTitle: string;
}

function RHZoomModal({
  isOpen,
  onClose,
  images,
  currentIndex,
  setCurrentIndex,
  productTitle,
}: RHZoomModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 md:p-8 backdrop-blur-md"
        onClick={onClose}
      >
        {/* Top Header Bar */}
        <div className="absolute top-6 right-6 left-6 flex items-center justify-between text-white/70">
          <div className="font-serif text-sm tracking-[0.2em] uppercase text-white">
            {productTitle} &bull;{' '}
            <span className="font-mono text-xs text-white/50">
              0{currentIndex + 1} of 0{images.length}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center border border-white/20 text-white transition-colors hover:border-white hover:bg-white hover:text-black"
            aria-label="Close exhibition view"
          >
            <X size={18} />
          </button>
        </div>

        {/* Previous Image Chevron */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(
                currentIndex > 0 ? currentIndex - 1 : images.length - 1,
              );
            }}
            className="absolute left-6 z-10 flex h-12 w-12 items-center justify-center border border-white/20 text-white transition-colors hover:border-white hover:bg-white hover:text-black"
            aria-label="Previous image"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        {/* High-Res Center Image */}
        <div
          className="relative max-h-[85vh] max-w-[85vw] flex items-center justify-center bg-white p-4 sm:p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={images[currentIndex]?.image_url}
            alt=""
            className="max-h-[75vh] max-w-[75vw] object-contain"
          />
        </div>

        {/* Next Image Chevron */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(
                currentIndex < images.length - 1 ? currentIndex + 1 : 0,
              );
            }}
            className="absolute right-6 z-10 flex h-12 w-12 items-center justify-center border border-white/20 text-white transition-colors hover:border-white hover:bg-white hover:text-black"
            aria-label="Next image"
          >
            <ChevronRight size={22} />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
