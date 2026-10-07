import { cn } from '@/lib/utils';
import { HomeTestimonial, SectionBgConfig } from '@/types/shop';
import React from 'react';
import { getSectionBgStyles, isDarkTheme, SectionBgOverlay } from './sectionBgHelper';

interface RHPressSectionProps {
  testimonials?: HomeTestimonial[];
  bgConfig?: SectionBgConfig;
}

export const RHPressSection: React.FC<RHPressSectionProps> = ({
  testimonials = [],
  bgConfig,
}) => {
  const quotes =
    testimonials && testimonials.length > 0
      ? testimonials
      : [
          {
            id: 1,
            text: 'The architectural proportion and solid teak joinery rival the finest European luxury outdoor collections.',
            author: 'Architectural Digest Indonesia',
            location: 'Design Review',
          },
          {
            id: 2,
            text: 'An exceptional curation of proportion, restraint and enduring materiality that elevates the entire living estate.',
            author: 'Private Residence Commission',
            location: 'Bali Villa Estate',
          },
          {
            id: 3,
            text: 'Masterfully crafted in Jepara with world-class precision. An essential source for luxury hospitality and residential architecture.',
            author: 'Forbes Indonesia',
            location: 'Luxury Living',
          },
        ];

  const isCustom = bgConfig && bgConfig.type !== 'default';
  const isDark = isDarkTheme(bgConfig);

  return (
    <section
      className={cn(
        'w-full py-20 md:py-32 px-6 sm:px-12 border-b transition-colors relative overflow-hidden',
        !isCustom && 'bg-white border-neutral-200/60',
        isCustom && isDark && 'text-white border-white/10',
        isCustom && !isDark && 'text-neutral-900 border-neutral-200/60',
      )}
      style={getSectionBgStyles(bgConfig)}
    >
      <SectionBgOverlay config={bgConfig} />
      <div className="relative z-10 max-w-[1400px] mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span
            className={cn(
              'text-[10px] md:text-xs tracking-[0.35em] uppercase font-light',
              isDark ? 'text-neutral-300' : 'text-neutral-500',
            )}
          >
            PRESS & ACCOLADES
          </span>
          <h2
            className={cn(
              'font-serif text-2xl sm:text-4xl font-light tracking-[0.06em] uppercase',
              isDark ? 'text-white' : 'text-neutral-900',
            )}
          >
            RECOGNITION OF EXCELLENCE
          </h2>
          <div
            className={cn(
              'w-12 h-[1px] mx-auto mt-4',
              isDark ? 'bg-neutral-500' : 'bg-neutral-400',
            )}
          />
        </div>

        {/* 3-Column Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {quotes.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className={cn(
                'text-center p-6 sm:p-8 border flex flex-col justify-between transition-colors',
                isDark
                  ? 'bg-neutral-900/85 border-neutral-700/80 text-white backdrop-blur-sm'
                  : 'bg-[#fafaf9] border-neutral-200/70 text-neutral-900',
              )}
            >
              <div
                className={cn(
                  'font-serif text-3xl font-light mb-4',
                  isDark ? 'text-neutral-500' : 'text-neutral-300',
                )}
              >
                “
              </div>
              <p
                className={cn(
                  'font-serif italic text-base sm:text-lg font-light leading-relaxed mb-6',
                  isDark ? 'text-neutral-200' : 'text-neutral-800',
                )}
              >
                {item.text}
              </p>
              <div
                className={cn(
                  'border-t pt-4 space-y-1',
                  isDark ? 'border-neutral-800' : 'border-neutral-200/80',
                )}
              >
                <span
                  className={cn(
                    'block text-[11px] tracking-[0.2em] uppercase font-medium',
                    isDark ? 'text-white' : 'text-neutral-900',
                  )}
                >
                  {item.author}
                </span>
                <span
                  className={cn(
                    'block text-[10px] tracking-[0.15em] uppercase font-light',
                    isDark ? 'text-neutral-400' : 'text-neutral-500',
                  )}
                >
                  {item.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
