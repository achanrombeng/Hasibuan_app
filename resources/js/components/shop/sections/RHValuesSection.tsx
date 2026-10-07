import { cn } from '@/lib/utils';
import { HomeValue, SectionBgConfig } from '@/types/shop';
import {
  Award,
  CheckCircle2,
  Feather,
  Globe,
  Leaf,
  LucideIcon,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react';
import React from 'react';
import { getSectionBgStyles, isDarkTheme, SectionBgOverlay } from './sectionBgHelper';

interface RHValuesSectionProps {
  badge?: string;
  title?: string;
  values: HomeValue[];
  bgConfig?: SectionBgConfig;
}

const iconMap: Record<string, LucideIcon> = {
  leaf: Leaf,
  truck: Truck,
  'shield-check': ShieldCheck,
  award: Award,
  sparkles: Sparkles,
  feather: Feather,
  globe: Globe,
};

export const RHValuesSection: React.FC<RHValuesSectionProps> = ({
  badge = 'OUR PHILOSOPHY',
  title = 'VITRUVIAN VALUES & COMMITMENTS',
  values = [],
  bgConfig,
}) => {
  if (!values || values.length === 0) return null;

  const isCustom = bgConfig && bgConfig.type !== 'default';
  const isDark = isDarkTheme(bgConfig);

  return (
    <section
      className={cn(
        'w-full py-20 md:py-28 px-6 sm:px-12 border-b transition-colors relative overflow-hidden',
        !isCustom && 'bg-[#f6f5f3] border-neutral-200/80',
        isCustom && isDark && 'text-white border-white/10',
        isCustom && !isDark && 'text-neutral-900 border-neutral-200/80',
      )}
      style={getSectionBgStyles(bgConfig)}
    >
      <SectionBgOverlay config={bgConfig} />
      <div className="relative z-10 max-w-[1500px] mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span
            className={cn(
              'text-[10px] md:text-xs tracking-[0.35em] uppercase font-light block',
              isDark ? 'text-neutral-300' : 'text-neutral-500',
            )}
          >
            {badge}
          </span>
          <h2
            className={cn(
              'font-serif text-2xl sm:text-4xl font-light tracking-[0.06em] uppercase',
              isDark ? 'text-white' : 'text-neutral-900',
            )}
          >
            {title}
          </h2>
          <div
            className={cn(
              'w-12 h-[1px] mx-auto mt-4',
              isDark ? 'bg-neutral-500' : 'bg-neutral-400',
            )}
          />
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {values.map((item, idx) => {
            const IconComponent = iconMap[item.icon] || CheckCircle2;

            return (
              <div
                key={idx}
                className={cn(
                  'border p-8 sm:p-10 flex flex-col items-center text-center space-y-4 transition-colors',
                  isDark
                    ? 'bg-neutral-900/85 border-neutral-700/80 text-white backdrop-blur-sm'
                    : 'bg-white border-neutral-200/80 text-neutral-900',
                )}
              >
                <div
                  className={cn(
                    'p-3 border rounded-full mb-2',
                    isDark
                      ? 'bg-neutral-800 border-neutral-700 text-neutral-200'
                      : 'bg-neutral-50 border-neutral-200/60 text-neutral-700',
                  )}
                >
                  <IconComponent size={20} strokeWidth={1.5} />
                </div>
                <h3
                  className={cn(
                    'font-serif text-lg tracking-[0.08em] uppercase font-medium',
                    isDark ? 'text-white' : 'text-neutral-900',
                  )}
                >
                  {item.title}
                </h3>
                <p
                  className={cn(
                    'text-xs sm:text-sm font-light leading-relaxed tracking-wide',
                    isDark ? 'text-neutral-300' : 'text-neutral-600',
                  )}
                >
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
