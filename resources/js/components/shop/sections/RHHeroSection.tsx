import { CarouselBannerSlide, HeroSettings, SectionBgConfig } from '@/types/shop';
import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface HeroSlide {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  image: string;
  mediaType?: 'image' | 'video';
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref?: string;
  onSecondaryClick?: () => void;
}

interface RHHeroSectionProps {
  banners?: CarouselBannerSlide[];
  heroSettings?: HeroSettings;
  onOpenCatalog?: () => void;
  bgConfig?: SectionBgConfig;
}

export const RHHeroSection: React.FC<RHHeroSectionProps> = ({
  banners,
  heroSettings,
  onOpenCatalog,
  bgConfig,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Default curated RH Lookbook slides
  const defaultSlides: HeroSlide[] = [
    {
      id: 'outdoor-architectural',
      tag: 'RH OUTDOOR 2026',
      title: 'THE ARCHITECTURAL TEAK & ROPE COLLECTION',
      subtitle:
        'Vitruvian Balance, Enduring Proportion & Master Craftsmanship from Jepara',
      image:
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2400&auto=format&fit=crop',
      primaryCtaText: 'EXPLORE THE COLLECTION',
      primaryCtaHref: '/shop/products?filter[category]=collections',
      secondaryCtaText: 'VIEW SOURCE BOOK',
      onSecondaryClick: onOpenCatalog,
    },
    {
      id: 'contemporary-living',
      tag: 'RH CONTEMPORARY',
      title: 'CONTEMPORARY LIVING & SCULPTURAL LOUNGE',
      subtitle:
        'Monumental Scale, Pure Forms and Natural Sustained Teak Hardwoods',
      image:
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2400&auto=format&fit=crop',
      primaryCtaText: 'EXPLORE LIVING',
      primaryCtaHref: '/shop/products?filter[category]=chairs',
      secondaryCtaText: 'DESIGN SERVICES',
      secondaryCtaHref: '/shop/custom-order',
    },
    {
      id: 'sculptural-dining',
      tag: 'RH INTERIORS',
      title: 'SCULPTURAL DINING & ARTISAN PROPORTIONS',
      subtitle:
        'Precision Crafted Solid Teak, Hand-Woven Fibers and Architectural Symmetry',
      image:
        'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=2400&auto=format&fit=crop',
      primaryCtaText: 'EXPLORE DINING',
      primaryCtaHref: '/shop/products?filter[category]=dining-sets',
      secondaryCtaText: 'TRADE & ARCHITECTURE',
      secondaryCtaHref: '/shop/dealer',
    },
    {
      id: 'resort-poolside',
      tag: 'RH RESORT & SUN',
      title: 'THE RESORT & POOLSIDE SOURCE BOOK',
      subtitle:
        'Sculptural Sunbeds, Daybeds and Architectural Furnishings Built for the Elements',
      image:
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2400&auto=format&fit=crop',
      primaryCtaText: 'VIEW SUN LOUNGERS',
      primaryCtaHref: '/shop/products?filter[category]=sun-loungers',
      secondaryCtaText: 'EXPLORE SOURCE BOOK',
      onSecondaryClick: onOpenCatalog,
    },
  ];

  // If banners are uploaded from Admin Settings, construct slides from them
  let resolvedSlides: HeroSlide[] = [];

  if (banners && banners.length > 0) {
    resolvedSlides = banners.map((b, idx) => ({
      id: b.id || `banner-${idx}`,
      tag: 'RH COLLECTION',
      title:
        (b as any).title ||
        (idx === 0 && heroSettings?.title
          ? `${heroSettings.title} ${heroSettings.title_highlight || ''}`.trim()
          : 'ARCHITECTURAL FURNITURE & LIVING'),
      subtitle:
        (b as any).subtitle ||
        (idx === 0 && heroSettings?.description
          ? heroSettings.description
          : 'Vitruvian Proportion & Master Craftsmanship'),
      image: b.image_url,
      mediaType: b.media_type || 'image',
      primaryCtaText: (b as any).cta_text || 'EXPLORE COLLECTION',
      primaryCtaHref: b.link || '/shop/products',
      secondaryCtaText: 'VIEW SOURCE BOOK',
      onSecondaryClick: onOpenCatalog,
    }));
  } else if (
    heroSettings &&
    heroSettings.image_main &&
    heroSettings.image_main !== '/images/placeholder-hero.svg'
  ) {
    // If admin set hero image and custom text
    resolvedSlides = [
      {
        id: 'admin-hero',
        tag: heroSettings.badge || 'RH CURATION',
        title: `${heroSettings.title} ${heroSettings.title_highlight || ''}`.trim(),
        subtitle: heroSettings.description || 'Pure Forms and Natural Materials',
        image: heroSettings.image_main,
        mediaType: heroSettings.media_type,
        primaryCtaText: 'EXPLORE COLLECTION',
        primaryCtaHref: '/shop/products',
        secondaryCtaText: 'VIEW SOURCE BOOK',
        onSecondaryClick: onOpenCatalog,
      },
      ...defaultSlides.slice(1),
    ];
  } else {
    resolvedSlides = defaultSlides;
  }

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % resolvedSlides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPaused, resolvedSlides.length]);

  const slide = resolvedSlides[currentSlide] || resolvedSlides[0];

  return (
    <section
      className="relative w-full h-[88vh] min-h-[620px] max-h-[960px] bg-black overflow-hidden select-none"
      style={bgConfig?.type === 'color' && bgConfig.color ? { backgroundColor: bgConfig.color } : undefined}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Custom Background Image if specified */}
      {bgConfig?.type === 'image' && bgConfig.image && (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${bgConfig.image}")` }}
        >
          <div
            className="absolute inset-0 bg-black pointer-events-none"
            style={{ opacity: (bgConfig.overlay ?? 40) / 100 }}
          />
        </div>
      )}

      {/* Background Images / Media with Crossfade */}
      {!(bgConfig?.type === 'image' && bgConfig.image) && (
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-0"
          >
          {slide.mediaType === 'video' ? (
            <video
              src={slide.image}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover object-center filter brightness-[0.78]"
            />
          ) : (
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center filter brightness-[0.78]"
            />
          )}
          {/* Subtle gradient vignette for architectural depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/45 pointer-events-none" />
        </motion.div>
      </AnimatePresence>
      )}

      {/* Symmetrical Monumental Overlay Content */}
      <div className="relative z-10 w-full h-full flex flex-col justify-end items-center pb-16 md:pb-24 px-6 text-center text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id + '-content'}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto flex flex-col items-center"
          >
            {/* Architectural Category Tag */}
            <span className="text-[11px] md:text-xs tracking-[0.35em] uppercase font-light text-neutral-300 mb-3 md:mb-4">
              {slide.tag}
            </span>

            {/* Monumental Headline in Serif */}
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-[0.08em] leading-[1.08] text-white uppercase max-w-4xl drop-shadow-sm mb-4 md:mb-6">
              {slide.title}
            </h1>

            {/* Subtle Subtitle */}
            <p className="font-sans text-xs sm:text-sm md:text-base font-light tracking-[0.14em] text-neutral-200/90 max-w-2xl mb-8 md:mb-10 uppercase">
              {slide.subtitle}
            </p>

            {/* Sharp Architectural CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <Link
                href={slide.primaryCtaHref}
                className="w-64 sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-white text-white text-[11px] md:text-xs tracking-[0.28em] uppercase font-medium bg-black/30 backdrop-blur-xs hover:bg-white hover:text-black transition-all duration-300"
              >
                {slide.primaryCtaText}
              </Link>

              {slide.onSecondaryClick ? (
                <button
                  type="button"
                  onClick={slide.onSecondaryClick}
                  className="w-64 sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-white/60 text-white/90 text-[11px] md:text-xs tracking-[0.28em] uppercase font-light hover:border-white hover:text-white hover:bg-white/10 transition-all duration-300 cursor-pointer"
                >
                  {slide.secondaryCtaText}
                </button>
              ) : slide.secondaryCtaHref ? (
                <Link
                  href={slide.secondaryCtaHref}
                  className="w-64 sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-white/60 text-white/90 text-[11px] md:text-xs tracking-[0.28em] uppercase font-light hover:border-white hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  {slide.secondaryCtaText}
                </Link>
              ) : null}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Minimalist Lookbook Slide Navigation / Indicators */}
        <div className="absolute bottom-6 md:bottom-8 left-0 right-0 px-8 flex items-center justify-between pointer-events-none">
          {/* Slide Numbers */}
          <div className="pointer-events-auto text-[11px] tracking-[0.3em] font-mono font-light text-neutral-400">
            0{currentSlide + 1} &nbsp;/&nbsp; 0{resolvedSlides.length}
          </div>

          {/* Minimalist Progress Indicators */}
          <div className="pointer-events-auto flex items-center gap-2">
            {resolvedSlides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className="group py-2 px-1 focus:outline-none cursor-pointer"
              >
                <div
                  className={`h-[1.5px] transition-all duration-500 ${
                    idx === currentSlide
                      ? 'w-10 bg-white'
                      : 'w-4 bg-white/30 group-hover:bg-white/60'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Subtle Arrows */}
          <div className="pointer-events-auto flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setCurrentSlide(
                  (prev) =>
                    (prev - 1 + resolvedSlides.length) % resolvedSlides.length,
                )
              }
              aria-label="Previous slide"
              className="p-1.5 text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() =>
                setCurrentSlide((prev) => (prev + 1) % resolvedSlides.length)
              }
              aria-label="Next slide"
              className="p-1.5 text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
