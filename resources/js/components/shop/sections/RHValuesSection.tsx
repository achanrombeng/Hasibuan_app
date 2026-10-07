import { HomeValue } from '@/types/shop';
import { Award, CheckCircle2, Feather, Globe, Leaf, LucideIcon, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import React from 'react';

interface RHValuesSectionProps {
  badge?: string;
  title?: string;
  values: HomeValue[];
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
}) => {
  if (!values || values.length === 0) return null;

  return (
    <section className="w-full bg-[#f6f5f3] py-20 md:py-28 px-6 sm:px-12 border-b border-neutral-200/80">
      <div className="max-w-[1500px] mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] md:text-xs tracking-[0.35em] uppercase font-light text-neutral-500 block">
            {badge}
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-light tracking-[0.06em] text-neutral-900 uppercase">
            {title}
          </h2>
          <div className="w-12 h-[1px] bg-neutral-400 mx-auto mt-4" />
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {values.map((item, idx) => {
            const IconComponent = iconMap[item.icon] || CheckCircle2;

            return (
              <div
                key={idx}
                className="bg-white border border-neutral-200/80 p-8 sm:p-10 flex flex-col items-center text-center space-y-4"
              >
                <div className="p-3 bg-neutral-50 border border-neutral-200/60 rounded-full mb-2 text-neutral-700">
                  <IconComponent size={20} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-lg tracking-[0.08em] uppercase text-neutral-900 font-medium">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed tracking-wide">
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
