import { cn } from '@/lib/utils';
import { SectionBgConfig } from '@/types/shop';
import React from 'react';
import { getSectionBgStyles, isDarkTheme, SectionBgOverlay } from './sectionBgHelper';

interface TrustLogo {
  name: string;
  logo_url?: string;
}

interface RHTrustSectionProps {
  logos: (string | TrustLogo)[];
  bgConfig?: SectionBgConfig;
}

export const RHTrustSection: React.FC<RHTrustSectionProps> = ({
  logos = [],
  bgConfig,
}) => {
  if (!logos || logos.length === 0) return null;

  const normalizedLogos: TrustLogo[] = logos.map((logo) =>
    typeof logo === 'string' ? { name: logo, logo_url: '' } : logo,
  );

  const isCustom = bgConfig && bgConfig.type !== 'default';
  const isDark = isDarkTheme(bgConfig);

  return (
    <section
      className={cn(
        'w-full py-12 md:py-16 px-6 border-b transition-colors select-none relative overflow-hidden',
        !isCustom && 'bg-[#fcfcfb] border-neutral-200/60',
        isCustom && isDark && 'text-white border-white/10',
        isCustom && !isDark && 'text-neutral-900 border-neutral-200/60',
      )}
      style={getSectionBgStyles(bgConfig)}
    >
      <SectionBgOverlay config={bgConfig} />
      <div className="relative z-10 max-w-[1400px] mx-auto text-center space-y-6">
        <span
          className={cn(
            'text-[10px] tracking-[0.35em] uppercase font-light block',
            isDark ? 'text-neutral-300' : 'text-neutral-400',
          )}
        >
          FEATURED IN & ARCHITECTURAL ACCREDITATIONS
        </span>

        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 lg:gap-20">
          {normalizedLogos.map((logo, idx) => (
            <div
              key={`${logo.name}-${idx}`}
              className={cn(
                'flex items-center justify-center transition-opacity duration-300',
                isDark
                  ? 'opacity-80 hover:opacity-100'
                  : 'opacity-65 hover:opacity-100',
              )}
            >
              {logo.logo_url ? (
                <img
                  src={logo.logo_url}
                  alt={logo.name}
                  className={cn(
                    'h-6 sm:h-8 w-auto object-contain filter',
                    isDark ? 'brightness-200 contrast-125' : 'grayscale',
                  )}
                />
              ) : (
                <span
                  className={cn(
                    'font-serif text-lg sm:text-2xl font-light tracking-[0.12em] uppercase',
                    isDark ? 'text-neutral-100' : 'text-neutral-700',
                  )}
                >
                  {logo.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
