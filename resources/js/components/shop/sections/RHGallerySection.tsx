import { cn } from '@/lib/utils';
import { ApiCategory, SectionBgConfig } from '@/types/shop';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import React from 'react';
import { getSectionBgStyles, isDarkTheme, SectionBgOverlay } from './sectionBgHelper';

interface RHGallerySectionProps {
  categories?: ApiCategory[];
  bgConfig?: SectionBgConfig;
}

export const RHGallerySection: React.FC<RHGallerySectionProps> = ({
  categories = [],
  bgConfig,
}) => {
  const isCustom = bgConfig && bgConfig.type !== 'default';
  const isDark = isDarkTheme(bgConfig);

  return (
    <section
      className={cn(
        'w-full py-16 md:py-28 px-4 sm:px-6 lg:px-12 border-b transition-colors relative overflow-hidden',
        !isCustom && 'bg-[#fcfcfb] border-neutral-200/60',
        isCustom && isDark && 'text-white border-white/10',
        isCustom && !isDark && 'text-neutral-900 border-neutral-200/60',
      )}
      style={getSectionBgStyles(bgConfig)}
    >
      <SectionBgOverlay config={bgConfig} />
      <div className="relative z-10 max-w-[1720px] mx-auto space-y-16 md:space-y-24">
        {/* Section Header - Architectural Vitruvian Quote / Title */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto space-y-3"
        >
          <span
            className={cn(
              'text-[10px] md:text-xs tracking-[0.35em] uppercase font-light',
              isDark ? 'text-neutral-300' : 'text-neutral-500',
            )}
          >
            HASIBUAN DESIGN
          </span>
          <h2
            className={cn(
              'font-serif text-2xl sm:text-4xl md:text-5xl font-light tracking-[0.06em] uppercase',
              isDark ? 'text-white' : 'text-neutral-900',
            )}
          >
            ARCHITECTURAL PROPORTION & LIVING
          </h2>
          <div
            className={cn(
              'w-12 h-[1px] mx-auto mt-4',
              isDark ? 'bg-neutral-500' : 'bg-neutral-400',
            )}
          />
        </motion.div>

        {/* 1. Grand Full-Width Architectural Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.99 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative group overflow-hidden bg-neutral-950"
        >
          <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2400&auto=format&fit=crop"
              alt="The Monaco Outdoor Collection"
              className="w-full h-full object-cover object-center filter brightness-[0.88] rh-image-zoom"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
          </div>

          <div className="absolute bottom-6 md:bottom-14 left-6 md:left-14 right-6 md:right-14 text-white flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-2xl space-y-2">
              <span className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-neutral-300 font-light">
                SIGNATURE COLLECTION
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl md:text-5xl font-light tracking-[0.08em] uppercase">
                THE MONACO OUTDOOR SUITE
              </h3>
              <p className="text-xs sm:text-sm tracking-[0.1em] text-neutral-200/90 font-light max-w-xl hidden sm:block">
                Sculptural teak framework paired with weather-resistant quick-dry foam and Italian all-weather textiles.
              </p>
            </div>
            <Link
              href="/shop/products?filter[category]=collections"
              className="self-start md:self-end px-7 py-3 border border-white text-white text-[11px] tracking-[0.25em] uppercase font-medium hover:bg-white hover:text-black transition-all duration-300 shrink-0"
            >
              EXPLORE COLLECTION
            </Link>
          </div>
        </motion.div>

        {/* 2. Symmetrical Vitruvian Dual Showcase (2-Column) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          {/* Card Left: Architectural Dining */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex flex-col bg-white border border-neutral-200/70 p-6 md:p-8"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 mb-6">
              <img
                src="https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=1600&auto=format&fit=crop"
                alt="Architectural Dining"
                className="w-full h-full object-cover object-center rh-image-zoom"
              />
            </div>
            <div className="text-center space-y-2.5 mt-auto">
              <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-light">
                PRECISION SOLID WOOD
              </span>
              <h4 className="font-serif text-2xl md:text-3xl font-light tracking-[0.08em] uppercase text-neutral-900">
                SCULPTURAL DINING
              </h4>
              <p className="text-xs text-neutral-600 tracking-wide font-light max-w-md mx-auto">
                Clean rectilinear proportions crafted from certified Indonesian teak with mortise and tenon joinery.
              </p>
              <div className="pt-3">
                <Link
                  href="/shop/products?filter[category]=dining-sets"
                  className="inline-block text-[11px] tracking-[0.28em] uppercase font-medium text-neutral-900 border-b border-neutral-900 pb-1 hover:text-neutral-500 hover:border-neutral-500 transition-colors"
                >
                  DISCOVER DINING
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Card Right: Architectural Lounge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex flex-col bg-white border border-neutral-200/70 p-6 md:p-8"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 mb-6">
              <img
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1600&auto=format&fit=crop"
                alt="Architectural Lounge"
                className="w-full h-full object-cover object-center rh-image-zoom"
              />
            </div>
            <div className="text-center space-y-2.5 mt-auto">
              <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-light">
                DEEP SEATING & MODULAR
              </span>
              <h4 className="font-serif text-2xl md:text-3xl font-light tracking-[0.08em] uppercase text-neutral-900">
                CONTEMPORARY SEATING
              </h4>
              <p className="text-xs text-neutral-600 tracking-wide font-light max-w-md mx-auto">
                Low-profile silhouettes and expansive architectural proportions engineered for effortless outdoor repose.
              </p>
              <div className="pt-3">
                <Link
                  href="/shop/products?filter[category]=corner-sets"
                  className="inline-block text-[11px] tracking-[0.28em] uppercase font-medium text-neutral-900 border-b border-neutral-900 pb-1 hover:text-neutral-500 hover:border-neutral-500 transition-colors"
                >
                  DISCOVER SEATING
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 3. Three-Column Curated Architectural Triptych */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.12,
              },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {/* Triptych 1: Sun Loungers */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 25 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            className="group bg-white border border-neutral-200/70 p-5 flex flex-col"
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-100 mb-4">
              <img
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop"
                alt="Sun Loungers"
                className="w-full h-full object-cover rh-image-zoom"
              />
            </div>
            <div className="text-center space-y-2 mt-auto">
              <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-light">
                RESORT & POOLSIDE
              </span>
              <h5 className="font-serif text-xl tracking-[0.08em] uppercase text-neutral-900">
                SUNBEDS & DAYBEDS
              </h5>
              <Link
                href="/shop/products?filter[category]=sun-loungers"
                className="inline-block text-[10px] tracking-[0.25em] uppercase text-neutral-900 border-b border-neutral-900 pb-0.5 hover:opacity-60 transition-opacity"
              >
                VIEW SUNBEDS
              </Link>
            </div>
          </motion.div>

          {/* Triptych 2: Natural Rattan */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 25 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            className="group bg-white border border-neutral-200/70 p-5 flex flex-col"
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-100 mb-4">
              <img
                src="https://images.unsplash.com/photo-1580481072645-022f9a6d8310?q=80&w=1200&auto=format&fit=crop"
                alt="Artisan Natural Rattan"
                className="w-full h-full object-cover rh-image-zoom"
              />
            </div>
            <div className="text-center space-y-2 mt-auto">
              <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-light">
                HAND-WOVEN TEXTURE
              </span>
              <h5 className="font-serif text-xl tracking-[0.08em] uppercase text-neutral-900">
                NATURAL RATTAN
              </h5>
              <Link
                href="/shop/products?filter[category]=natural-rattan"
                className="inline-block text-[10px] tracking-[0.25em] uppercase text-neutral-900 border-b border-neutral-900 pb-0.5 hover:opacity-60 transition-opacity"
              >
                VIEW RATTAN
              </Link>
            </div>
          </motion.div>

          {/* Triptych 3: Tables & Flooring */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 25 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            className="group bg-white border border-neutral-200/70 p-5 flex flex-col sm:col-span-2 lg:col-span-1"
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-100 mb-4">
              <img
                src="https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop"
                alt="Teak Tables & Bar Sets"
                className="w-full h-full object-cover rh-image-zoom"
              />
            </div>
            <div className="text-center space-y-2 mt-auto">
              <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-light">
                ENTERTAINING & BAR
              </span>
              <h5 className="font-serif text-xl tracking-[0.08em] uppercase text-neutral-900">
                BAR SETS & OCCASIONAL
              </h5>
              <Link
                href="/shop/products?filter[category]=bar-sets"
                className="inline-block text-[10px] tracking-[0.25em] uppercase text-neutral-900 border-b border-neutral-900 pb-0.5 hover:opacity-60 transition-opacity"
              >
                VIEW BAR SETS
              </Link>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};
