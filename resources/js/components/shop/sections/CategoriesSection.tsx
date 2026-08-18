import { ApiCategory } from '@/types/shop';
import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';

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
  categories,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Dynamic items based on database categories if available, otherwise default showcase items
  const items: ShowcaseSlide[] = React.useMemo(() => {
    const categoryList = Array.isArray(categories) ? categories : (categories as any)?.data;
    if (categoryList && categoryList.length > 0) {
      return categoryList.map((c: ApiCategory) => {
        const match = DEFAULT_SHOWCASE_ITEMS.find(
          (item) => item.slug === c.slug || item.categoryName.toLowerCase() === c.name.toLowerCase()
        );
        return {
          id: c.slug || `cat-${c.id}`,
          categoryName: c.name,
          collectionTitle: match?.collectionTitle || c.name.toUpperCase(),
          productTag: match?.productTag || c.name,
          image: c.image_url || match?.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1600&auto=format&fit=crop',
          slug: c.slug,
          hotspot: match?.hotspot || { x: 50, y: 50 },
        };
      }).sort((a: ShowcaseSlide, b: ShowcaseSlide) => a.categoryName.localeCompare(b.categoryName));
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
    <section className="relative bg-white py-12 md:py-20 px-4 md:px-8 lg:px-12 overflow-hidden">
      <div className="mx-auto max-w-[1440px]">
        {/* Main Grid: Left Sidebar Categories + Right Showcase Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Category Menu List ("Products") */}
          <div className="lg:col-span-3 flex flex-col justify-start">
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 mb-6 pb-2 border-b border-neutral-200/80">
              Products
            </h2>

            {/* Category Navigation List */}
            <div
              className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar divide-x lg:divide-x-0 lg:divide-y divide-neutral-100 border-b lg:border-b-0 border-neutral-100 pb-2 lg:pb-0"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              {items.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveIndex(index)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`group relative text-left py-3 px-4 lg:px-0 transition-all duration-300 flex items-center justify-between whitespace-nowrap lg:whitespace-normal ${
                      isActive
                        ? 'text-neutral-900 font-semibold pl-4 lg:pl-3'
                        : 'text-neutral-500 font-normal hover:text-neutral-800 hover:pl-2'
                    }`}
                  >
                    {/* Active Bar Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeCategoryBar"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#7c926a] rounded-r-sm hidden lg:block"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}

                    <span className="text-base tracking-wide transition-colors">
                      {item.categoryName}
                    </span>

                    <ArrowRight
                      size={15}
                      className={`hidden lg:block transition-all duration-300 ${
                        isActive
                          ? 'opacity-100 translate-x-0 text-[#7c926a]'
                          : 'opacity-0 -translate-x-2 group-hover:opacity-60'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Featured Product Banner Card & Hotspot */}
          <div className="lg:col-span-9 relative">
            <div
              className="relative w-full h-[420px] sm:h-[500px] lg:h-[580px] rounded-lg overflow-hidden shadow-lg bg-neutral-900 group"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              {/* Background Image Carousel with Fade Animation */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide.id}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className="absolute inset-0 w-full h-full"
                >
                  <img
                    src={currentSlide.image}
                    alt={currentSlide.categoryName}
                    className="w-full h-full object-cover object-center brightness-[0.96]"
                  />
                  {/* Subtle Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
                </motion.div>
              </AnimatePresence>

              {/* Product Hotspot / Badge Pin */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`hotspot-${currentSlide.id}`}
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  style={{
                    top: `${currentSlide.hotspot.y}%`,
                    left: `${currentSlide.hotspot.x}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  <Link
                    href={`/shop/products?filter[category]=${currentSlide.slug}`}
                    className="group/pin flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-sm shadow-xl border border-white/60 hover:bg-white transition-all duration-300 hover:scale-105"
                  >
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7c926a] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#667a55]"></span>
                    </span>
                    <span className="text-xs font-medium text-neutral-800 tracking-wide group-hover/pin:text-neutral-950">
                      {currentSlide.productTag}
                    </span>
                  </Link>
                </motion.div>
              </AnimatePresence>

              {/* Right Decorative Collection Title Overlay */}
              <div className="absolute top-0 right-0 bottom-0 z-10 flex items-stretch pointer-events-none">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`badge-${currentSlide.id}`}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="relative flex items-center pr-6 md:pr-10"
                  >
                    {/* Collection Title Container */}
                    <div className="relative bg-white/90 backdrop-blur-sm px-6 py-10 md:px-10 md:py-14 shadow-2xl rounded-l-sm border-l-4 border-[#7c926a] flex flex-col justify-center items-end text-right min-w-[200px] md:min-w-[280px]">
                      
                      {/* Decorative Background Stripes */}
                      <div
                        className="absolute inset-0 opacity-15 pointer-events-none"
                        style={{
                          backgroundImage:
                            'repeating-linear-gradient(45deg, #7c926a 0, #7c926a 2px, transparent 0, transparent 12px)',
                        }}
                      />

                      <span className="text-[10px] md:text-xs font-semibold tracking-[0.25em] text-[#7c926a] uppercase mb-1 z-10">
                        {currentSlide.categoryName}
                      </span>
                      <h3 className="font-serif text-3xl md:text-5xl font-extrabold tracking-widest text-neutral-900 uppercase z-10">
                        {currentSlide.collectionTitle}
                      </h3>
                      
                      {/* Decorative diagonal line accent block */}
                      <div className="mt-4 w-12 h-1 bg-[#7c926a] rounded-full z-10" />
                    </div>

                    {/* Green Patterned Bar Side Accent */}
                    <div
                      className="w-12 md:w-16 h-full bg-[#7c926a] flex items-center justify-center opacity-90"
                      style={{
                        backgroundImage:
                          'repeating-linear-gradient(-45deg, rgba(255,255,255,0.2) 0, rgba(255,255,255,0.2) 2px, transparent 0, transparent 8px)',
                      }}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Slider Navigation Arrow Buttons */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/85 text-neutral-800 backdrop-blur-md shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-white hover:scale-110 active:scale-95"
                aria-label="Previous category"
              >
                <ChevronLeft size={22} />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/85 text-neutral-800 backdrop-blur-md shadow-lg flex items-center justify-center transition-all duration-300 hover:bg-white hover:scale-110 active:scale-95"
                aria-label="Next category"
              >
                <ChevronRight size={22} />
              </button>

              {/* Bottom Carousel Indicator Dots */}
              <div className="absolute bottom-4 left-6 z-20 flex items-center gap-2">
                {items.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
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
    </section>
  );
};

export default CategoriesSection;
