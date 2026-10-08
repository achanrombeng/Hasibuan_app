import { SiteSettings } from '@/types';
import { ApiCategory } from '@/types/shop';
import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { CatalogModal } from '../CatalogModal';

interface CategoriesSectionProps {
  categories?: ApiCategory[];
}

interface ShowcaseSlide {
  id: string;
  categoryName: string;
  collectionTitle: string;
  productTag: string;
  image: string;
  slug: string;
  sort_order?: number;
  hotspot: { x: number; y: number };
}

// 11 Categories sorted strictly alphabetically (A-Z)
const DEFAULT_SHOWCASE_ITEMS: ShowcaseSlide[] = [
  {
    id: 'accessories',
    categoryName: 'Accessories',
    collectionTitle: 'LIFESTYLE',
    productTag: 'Luxury Woven Tray & Décor',
    image:
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1600&auto=format&fit=crop',
    slug: 'accessories',
    hotspot: { x: 50, y: 50 },
  },
  {
    id: 'bar-sets',
    categoryName: 'Bar Sets',
    collectionTitle: 'VENICE',
    productTag: 'Venice Outdoor Bar Stool',
    image:
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600&auto=format&fit=crop',
    slug: 'bar-sets',
    hotspot: { x: 55, y: 48 },
  },
  {
    id: 'chairs',
    categoryName: 'Chairs',
    collectionTitle: 'MILANO',
    productTag: 'Milano Woven Chair',
    image:
      'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?q=80&w=1600&auto=format&fit=crop',
    slug: 'chairs',
    hotspot: { x: 38, y: 58 },
  },
  {
    id: 'collections',
    categoryName: 'Collections',
    collectionTitle: 'TUSCANY',
    productTag: 'Tuscany Lounge Chair',
    image:
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1600&auto=format&fit=crop',
    slug: 'collections',
    hotspot: { x: 44, y: 56 },
  },
  {
    id: 'comfort-products',
    categoryName: 'Comfort Products',
    collectionTitle: 'AMALFI',
    productTag: 'Amalfi Resort Lounge Daybed',
    image:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop',
    slug: 'comfort-products',
    hotspot: { x: 45, y: 54 },
  },
  {
    id: 'corner-sets',
    categoryName: 'Corner Sets',
    collectionTitle: 'ROMA',
    productTag: 'Roma Modular Corner Sofa',
    image:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1600&auto=format&fit=crop',
    slug: 'corner-sets',
    hotspot: { x: 42, y: 60 },
  },
  {
    id: 'dining-sets',
    categoryName: 'Dining Sets',
    collectionTitle: 'CAPRI',
    productTag: 'Capri Outdoor Dining Table',
    image:
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=1600&auto=format&fit=crop',
    slug: 'dining-sets',
    hotspot: { x: 48, y: 52 },
  },
  {
    id: 'flooring',
    categoryName: 'Flooring',
    collectionTitle: 'DECKING',
    productTag: 'Premium Teak Decking Tiles',
    image:
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1600&auto=format&fit=crop',
    slug: 'flooring',
    hotspot: { x: 50, y: 70 },
  },
  {
    id: 'natural-rattan',
    categoryName: 'Natural Rattan',
    collectionTitle: 'BALI',
    productTag: 'Handcrafted Rattan Armchair',
    image:
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1600&auto=format&fit=crop',
    slug: 'natural-rattan',
    hotspot: { x: 40, y: 55 },
  },
  {
    id: 'sun-loungers',
    categoryName: 'Sun Loungers',
    collectionTitle: 'FLORENCE',
    productTag: 'Florence Poolside Sunbed',
    image:
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1600&auto=format&fit=crop',
    slug: 'sun-loungers',
    hotspot: { x: 60, y: 65 },
  },
  {
    id: 'tables',
    categoryName: 'Tables',
    collectionTitle: 'SIENA',
    productTag: 'Siena Teak Garden Table',
    image:
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1600&auto=format&fit=crop',
    slug: 'tables',
    hotspot: { x: 50, y: 55 },
  },
];

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories = [],
}) => {
  const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
  const [catalogModalOpen, setCatalogModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Dynamic items based on database categories if available, otherwise default showcase items
  const items: ShowcaseSlide[] = React.useMemo(() => {
    const categoryList = Array.isArray(categories)
      ? categories
      : (categories as any)?.data;
    if (categoryList && categoryList.length > 0) {
      const sorted = [...categoryList].sort((a: any, b: any) => {
        const orderA = typeof a.sort_order === 'number' ? a.sort_order : 0;
        const orderB = typeof b.sort_order === 'number' ? b.sort_order : 0;
        if (orderA !== orderB) return orderA - orderB;
        return (a.name || '').localeCompare(b.name || '', undefined, {
          sensitivity: 'base',
        });
      });

      return sorted.map((c: ApiCategory) => {
        const match = DEFAULT_SHOWCASE_ITEMS.find(
          (item) =>
            item.slug === c.slug ||
            item.categoryName.toLowerCase() === c.name.toLowerCase(),
        );
        return {
          id: c.slug || `cat-${c.id}`,
          categoryName: c.name,
          collectionTitle: match?.collectionTitle || c.name.toUpperCase(),
          productTag: match?.productTag || c.name,
          image:
            c.image_url ||
            match?.image ||
            'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1600&auto=format&fit=crop',
          slug: c.slug,
          sort_order: typeof c.sort_order === 'number' ? c.sort_order : 0,
          hotspot: match?.hotspot || { x: 50, y: 50 },
        };
      });
    }
    return DEFAULT_SHOWCASE_ITEMS;
  }, [categories]);

  const currentSlide = items[activeIndex] || items[0];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, items.length]);

  return (
    <section className="relative overflow-hidden bg-white px-4 py-12 md:px-8 md:py-20 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        {/* Main Grid: Left Sidebar Categories + Right Showcase Banner */}
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          {/* Left Column: Category Menu List ("Products") */}
          <div className="flex flex-col justify-start lg:col-span-3">
            <div className="mb-6 flex items-center justify-between border-b border-neutral-200/80 pb-2">
              <h2 className="font-serif text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
                Products
              </h2>
              <button
                type="button"
                onClick={() => setCatalogModalOpen(true)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-black hover:shadow-md active:scale-95"
                title="Open & Preview E-Catalog (PDF / 3D Flipbook)"
              >
                <BookOpen size={14} />
                <span>E-CATALOG</span>
              </button>
            </div>

            {/* Category Navigation List */}
            <div
              className="no-scrollbar flex flex-row divide-x divide-neutral-100 overflow-x-auto border-b border-neutral-100 pb-2 lg:flex-col lg:divide-x-0 lg:divide-y lg:overflow-x-visible lg:border-b-0 lg:pb-0"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              {items.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <Link
                    key={item.id}
                    href={`/shop/category/${item.slug}`}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`group relative flex cursor-pointer items-center justify-between px-4 py-3 text-left whitespace-nowrap transition-all duration-300 lg:px-0 lg:whitespace-normal ${
                      isActive
                        ? 'pl-4 font-semibold text-neutral-900 lg:pl-3'
                        : 'font-normal text-neutral-500 hover:pl-2 hover:text-neutral-800'
                    }`}
                  >
                    {/* Active Bar Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeCategoryBar"
                        className="absolute top-1/2 left-0 hidden h-6 w-1.5 -translate-y-1/2 rounded-r-sm bg-neutral-900 lg:block"
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}

                    <span className="text-base tracking-wide transition-colors">
                      {item.categoryName}
                    </span>

                    <ArrowRight
                      size={15}
                      className={`hidden transition-all duration-300 lg:block ${
                        isActive
                          ? 'translate-x-0 text-[#7c926a] opacity-100'
                          : '-translate-x-2 opacity-0 group-hover:opacity-60'
                      }`}
                    />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Column: Featured Product Banner Card & Hotspot */}
          <div className="relative lg:col-span-9">
            <div
              className="group relative h-[420px] w-full overflow-hidden rounded-lg bg-neutral-900 shadow-lg sm:h-[500px] lg:h-[580px]"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              {/* Clickable Banner Link */}
              <Link
                href={`/shop/category/${currentSlide.slug}`}
                className="absolute inset-0 z-10 block cursor-pointer"
                aria-label={`View all products in ${currentSlide.categoryName}`}
              >
                {/* Background Image Carousel with Fade Animation */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide.id}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="absolute inset-0 h-full w-full"
                  >
                    <img
                      src={currentSlide.image}
                      alt={currentSlide.categoryName}
                      className="h-full w-full object-cover object-center brightness-[0.96] transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Subtle Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
                  </motion.div>
                </AnimatePresence>

                {/* Floating "Explore Collection" Badge */}
                <div className="absolute right-6 bottom-6 z-20 hidden items-center gap-2 rounded-xl bg-white/90 px-4 py-2.5 text-sm font-semibold text-neutral-900 shadow-lg backdrop-blur-md transition-all group-hover:bg-white group-hover:shadow-xl sm:inline-flex">
                  <span>Explore {currentSlide.categoryName}</span>
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>
              </Link>

              {/* Slider Navigation Arrow Buttons */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute top-1/2 left-4 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-neutral-800 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white active:scale-95"
                aria-label="Previous category"
              >
                <ChevronLeft size={22} />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute top-1/2 right-4 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-neutral-800 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white active:scale-95"
                aria-label="Next category"
              >
                <ChevronRight size={22} />
              </button>

              {/* Bottom Carousel Indicator Dots */}
              <div className="absolute bottom-4 left-6 z-30 flex items-center gap-2">
                {items.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveIndex(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === activeIndex
                        ? 'w-8 bg-white'
                        : 'w-2 bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive E-Catalog Modal */}
      <CatalogModal
        isOpen={catalogModalOpen}
        onClose={() => setCatalogModalOpen(false)}
        pdfUrl={siteSettings?.catalog_pdf_url}
        docxUrl={siteSettings?.catalog_docx_url}
      />
    </section>
  );
};

export default CategoriesSection;
