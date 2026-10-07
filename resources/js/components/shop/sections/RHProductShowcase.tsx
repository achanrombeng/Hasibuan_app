import { cn } from '@/lib/utils';
import { ApiProduct, SectionBgConfig } from '@/types/shop';
import { Link } from '@inertiajs/react';
import React from 'react';
import { ProductCard } from '../ProductCard';
import { getSectionBgStyles, isDarkTheme, SectionBgOverlay } from './sectionBgHelper';

interface RHProductShowcaseProps {
  products: ApiProduct[];
  bgConfig?: SectionBgConfig;
}

export const RHProductShowcase: React.FC<RHProductShowcaseProps> = ({
  products = [],
  bgConfig,
}) => {
  const isCustom = bgConfig && bgConfig.type !== 'default';
  const isDark = isDarkTheme(bgConfig);

  return (
    <section
      className={cn(
        'w-full py-20 md:py-28 px-4 sm:px-6 lg:px-12 border-b transition-colors relative overflow-hidden',
        !isCustom && 'bg-white border-neutral-200/60',
        isCustom && isDark && 'text-white border-white/10',
        isCustom && !isDark && 'text-neutral-900 border-neutral-200/60',
      )}
      style={getSectionBgStyles(bgConfig)}
    >
      <SectionBgOverlay config={bgConfig} />
      <div className="relative z-10 max-w-[1720px] mx-auto space-y-14">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span
            className={cn(
              'text-[10px] md:text-xs tracking-[0.35em] uppercase font-light',
              isDark ? 'text-neutral-300' : 'text-neutral-500',
            )}
          >
            MUSEUM COLLECTION
          </span>
          <h2
            className={cn(
              'font-serif text-2xl sm:text-4xl md:text-5xl font-light tracking-[0.06em] uppercase',
              isDark ? 'text-white' : 'text-neutral-900',
            )}
          >
            CURATED ARCHITECTURAL PIECES
          </h2>
          <div
            className={cn(
              'w-12 h-[1px] mx-auto mt-4',
              isDark ? 'bg-neutral-500' : 'bg-neutral-400',
            )}
          />
          <p
            className={cn(
              'text-xs sm:text-sm tracking-[0.08em] font-light uppercase max-w-xl mx-auto pt-2',
              isDark ? 'text-neutral-300' : 'text-neutral-500',
            )}
          >
            Masterworks of enduring proportion, hand-finished in our central Java workshops.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {products.length > 0 ? (
            products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            // Fallback luxury showcase items if DB has no images yet
            [
              {
                id: 1,
                name: 'Verona Teak Dining Chair',
                slug: 'verona-teak-dining-chair',
                category: { name: 'Chairs' },
                image:
                  'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?q=80&w=1200&auto=format&fit=crop',
              },
              {
                id: 2,
                name: 'Riviera Rope Armchair',
                slug: 'riviera-rope-armchair',
                category: { name: 'Chairs' },
                image:
                  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop',
              },
              {
                id: 3,
                name: 'Nordic Teak Slat Dining Table',
                slug: 'nordic-teak-slat-dining-table',
                category: { name: 'Dining Sets' },
                image:
                  'https://images.unsplash.com/photo-1617806118233-18e1de247200?q=80&w=1200&auto=format&fit=crop',
              },
              {
                id: 4,
                name: 'Santorini Modular L-Shape Lounge Set',
                slug: 'santorini-modular-l-shape-lounge-set',
                category: { name: 'Corner Sets' },
                image:
                  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop',
              },
            ].map((p) => (
              <div
                key={p.id}
                className="group flex flex-col bg-[#fafaf9] border border-neutral-200/80 p-4 transition-all duration-300"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 mb-4">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover object-center rh-image-zoom"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity px-5 py-2.5 bg-white text-neutral-900 text-[10px] tracking-[0.25em] uppercase font-medium shadow-md">
                      VIEW PIECE
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5 mt-auto">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-light block">
                    {p.category.name}
                  </span>
                  <h4 className="font-serif text-base tracking-[0.04em] uppercase text-neutral-900 group-hover:text-neutral-600 transition-colors">
                    {p.name}
                  </h4>
                  <p className="text-[11px] text-neutral-500 tracking-wide font-light">
                    Certified Indonesian Teak & Hand-Woven
                  </p>
                  <div className="pt-1 flex items-center justify-between text-[11px] tracking-wider text-neutral-800">
                    <span className="font-medium">TRADE PRICING</span>
                    <span className="text-neutral-400 text-[10px]">INQUIRE</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* View All Button */}
        <div className="text-center pt-6">
          <Link
            href="/shop/products"
            className="inline-block px-10 py-3.5 border border-neutral-900 text-neutral-900 text-[11px] tracking-[0.28em] uppercase font-medium hover:bg-neutral-900 hover:text-white transition-all duration-300"
          >
            EXPLORE COMPLETE CATALOG
          </Link>
        </div>
      </div>
    </section>
  );
};
