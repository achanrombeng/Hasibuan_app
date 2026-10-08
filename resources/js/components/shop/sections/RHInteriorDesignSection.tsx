import { cn } from '@/lib/utils';
import { SectionBgConfig } from '@/types/shop';
import { Link } from '@inertiajs/react';
import React from 'react';
import { getSectionBgStyles, isDarkTheme, SectionBgOverlay } from './sectionBgHelper';

interface RHInteriorDesignSectionProps {
  bgConfig?: SectionBgConfig;
}

export const RHInteriorDesignSection: React.FC<RHInteriorDesignSectionProps> = ({
  bgConfig,
}) => {
  const isCustom = bgConfig && bgConfig.type !== 'default';
  const isDark = isDarkTheme(bgConfig, true); // defaults to dark theme

  return (
    <section
      className={cn(
        'relative w-full py-24 md:py-36 px-6 sm:px-12 lg:px-20 overflow-hidden border-b transition-colors',
        !isCustom && 'bg-[#161616] text-white border-neutral-800',
        isCustom && isDark && 'text-white border-white/10',
        isCustom && !isDark && 'text-neutral-900 border-neutral-200/60',
      )}
      style={getSectionBgStyles(bgConfig)}
    >
      {/* Default Background Architectural Atmosphere (only if type is default) */}
      {!isCustom && (
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2400&auto=format&fit=crop"
            alt="Interior Design Studio Background"
            className="w-full h-full object-cover object-center filter grayscale"
          />
          <div className="absolute inset-0 bg-neutral-950/85" />
        </div>
      )}

      {/* Custom Image Overlay */}
      <SectionBgOverlay config={bgConfig} />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <span
            className={cn(
              'text-[10px] md:text-xs tracking-[0.4em] uppercase font-light block',
              isDark ? 'text-neutral-400' : 'text-neutral-500',
            )}
          >
            ATELIER & TRADE SERVICES
          </span>
          <h2
            className={cn(
              'font-serif text-3xl sm:text-5xl md:text-6xl font-light tracking-[0.08em] uppercase leading-tight',
              isDark ? 'text-white' : 'text-neutral-900',
            )}
          >
            HASIBUAN INTERIOR DESIGN & ARCHITECTURE
          </h2>
          <div
            className={cn(
              'w-14 h-[1px] mx-auto my-6',
              isDark ? 'bg-neutral-600' : 'bg-neutral-300',
            )}
          />
          <p
            className={cn(
              'font-serif italic text-lg sm:text-2xl font-light max-w-2xl mx-auto',
              isDark ? 'text-neutral-300' : 'text-neutral-700',
            )}
          >
            "Our interior designers and artisans will collaborate to reimagine your space."
          </p>
        </div>

        <p
          className={cn(
            'text-xs sm:text-sm md:text-base font-light tracking-[0.06em] leading-relaxed max-w-2xl mx-auto',
            isDark ? 'text-neutral-400' : 'text-neutral-600',
          )}
        >
          From concept sketches to custom joinery and white-glove delivery, our dedicated design studio assists private homeowners, architects, and luxury hospitality developments across the globe.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-4">
          <Link
            href="/shop/custom-order"
            className={cn(
              'w-full sm:w-auto px-9 py-3.5 border text-[11px] tracking-[0.28em] uppercase font-medium transition-colors',
              isDark
                ? 'border-white bg-white text-black hover:bg-neutral-200'
                : 'border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800',
            )}
          >
            REQUEST A DESIGN CONSULTATION
          </Link>
          <Link
            href="/shop/dealer"
            className={cn(
              'w-full sm:w-auto px-9 py-3.5 border text-[11px] tracking-[0.28em] uppercase font-light transition-colors',
              isDark
                ? 'border-neutral-600 text-neutral-200 hover:border-white hover:text-white'
                : 'border-neutral-400 text-neutral-800 hover:border-neutral-900 hover:text-neutral-900',
            )}
          >
            APPLY FOR TRADE PROGRAM
          </Link>
        </div>
      </div>
    </section>
  );
};
