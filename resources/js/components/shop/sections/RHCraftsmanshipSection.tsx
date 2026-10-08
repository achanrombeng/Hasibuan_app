import { cn } from '@/lib/utils';
import { CraftsmanshipSettings, SectionBgConfig } from '@/types/shop';
import React from 'react';
import { getSectionBgStyles, isDarkTheme, SectionBgOverlay } from './sectionBgHelper';

interface RHCraftsmanshipSectionProps {
  settings?: CraftsmanshipSettings;
  bgConfig?: SectionBgConfig;
}

export const RHCraftsmanshipSection: React.FC<RHCraftsmanshipSectionProps> = ({
  settings,
  bgConfig,
}) => {
  const title1 = settings?.title_1 || 'HANDCRAFTED ALL-WEATHER WEAVING';
  const desc1 =
    settings?.desc_1 ||
    'Traditional hand-weaving techniques passed through generations of master artisans form the soul of our furniture. Woven over rust-proof aluminum frameworks, each strand is engineered to withstand tropical rain, UV exposure, and coastal breezes while offering enduring tactile warmth.';

  const title2 = settings?.title_2 || 'GRADE-A CERTIFIED SUSTAINABLE TEAK';
  const desc2 =
    settings?.desc_2 ||
    'Sourced exclusively from responsibly managed Indonesian plantations, our premium teak wood is rich in natural protective oils. It offers supreme structural density and resilience against weather elements, gracefully aging into an iconic silvery-grey patina over decades.';

  const craftImage =
    Array.isArray(settings?.images_1) && settings.images_1.length > 0
      ? settings.images_1[0]
      : 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1600&auto=format&fit=crop';

  const woodImage =
    Array.isArray(settings?.images_2) && settings.images_2.length > 0
      ? settings.images_2[0]
      : 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1600&auto=format&fit=crop';

  const row1Visible = settings?.row_1_visible ?? true;
  const row2Visible = settings?.row_2_visible ?? true;

  if (!row1Visible && !row2Visible) {
    return null;
  }

  const isCustom = bgConfig && bgConfig.type !== 'default';
  const isDark = isDarkTheme(bgConfig);

  return (
    <section
      className={cn(
        'w-full py-20 md:py-32 px-6 sm:px-12 lg:px-20 border-b transition-colors relative overflow-hidden',
        !isCustom && 'bg-[#fcfcfb] border-neutral-200/60',
        isCustom && isDark && 'text-white border-white/10',
        isCustom && !isDark && 'text-neutral-900 border-neutral-200/60',
      )}
      style={getSectionBgStyles(bgConfig)}
    >
      <SectionBgOverlay config={bgConfig} />
      <div className="relative z-10 max-w-[1720px] mx-auto space-y-20 md:space-y-32">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span
            className={cn(
              'text-[10px] md:text-xs tracking-[0.35em] uppercase font-light',
              isDark ? 'text-neutral-300' : 'text-neutral-500',
            )}
          >
            MATERIAL PROVENANCE
          </span>
          <h2
            className={cn(
              'font-serif text-2xl sm:text-4xl md:text-5xl font-light tracking-[0.06em] uppercase',
              isDark ? 'text-white' : 'text-neutral-900',
            )}
          >
            THE ART OF MASTER CRAFTSMANSHIP
          </h2>
          <div
            className={cn(
              'w-12 h-[1px] mx-auto mt-4',
              isDark ? 'bg-neutral-500' : 'bg-neutral-400',
            )}
          />
        </div>

        {/* Feature 1: Teak Wood (Row 2 in Admin Settings) */}
        {row2Visible && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-7 overflow-hidden bg-neutral-100">
              <div className="aspect-[16/10] w-full overflow-hidden">
                <img
                  src={woodImage}
                  alt="Teak Hardwoods"
                  className="w-full h-full object-cover object-center rh-image-zoom"
                />
              </div>
            </div>
            <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
              <span
                className={cn(
                  'text-[10px] tracking-[0.3em] uppercase font-light block',
                  isDark ? 'text-neutral-400' : 'text-neutral-500',
                )}
              >
                INDONESIAN TIMBER
              </span>
              <h3
                className={cn(
                  'font-serif text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.06em] uppercase',
                  isDark ? 'text-white' : 'text-neutral-900',
                )}
              >
                {title2}
              </h3>
              <div
                className={cn(
                  'w-10 h-[1px] mx-auto lg:mx-0',
                  isDark ? 'bg-neutral-500' : 'bg-neutral-400',
                )}
              />
              <p
                className={cn(
                  'text-xs sm:text-sm font-light leading-relaxed tracking-wide',
                  isDark ? 'text-neutral-200' : 'text-neutral-600',
                )}
              >
                {desc2}
              </p>
            </div>
          </div>
        )}

        {/* Feature 2: Hand Weaving (Row 1 in Admin Settings) */}
        {row1Visible && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1 space-y-6 text-center lg:text-left">
              <span
                className={cn(
                  'text-[10px] tracking-[0.3em] uppercase font-light block',
                  isDark ? 'text-neutral-400' : 'text-neutral-500',
                )}
              >
                ARTISAN WEAVING
              </span>
              <h3
                className={cn(
                  'font-serif text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.06em] uppercase',
                  isDark ? 'text-white' : 'text-neutral-900',
                )}
              >
                {title1}
              </h3>
              <div
                className={cn(
                  'w-10 h-[1px] mx-auto lg:mx-0',
                  isDark ? 'bg-neutral-500' : 'bg-neutral-400',
                )}
              />
              <p
                className={cn(
                  'text-xs sm:text-sm font-light leading-relaxed tracking-wide',
                  isDark ? 'text-neutral-200' : 'text-neutral-600',
                )}
              >
                {desc1}
              </p>
            </div>
            <div className="lg:col-span-7 order-1 lg:order-2 overflow-hidden bg-neutral-100">
              <div className="aspect-[16/10] w-full overflow-hidden">
                <img
                  src={craftImage}
                  alt="Handcrafted Weaving"
                  className="w-full h-full object-cover object-center rh-image-zoom"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
