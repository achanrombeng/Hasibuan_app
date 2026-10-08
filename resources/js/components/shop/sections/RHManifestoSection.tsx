import { cn } from '@/lib/utils';
import { SectionBgConfig } from '@/types/shop';
import { motion } from 'framer-motion';
import React from 'react';
import { getSectionBgStyles, isDarkTheme, SectionBgOverlay } from './sectionBgHelper';

interface RHManifestoSectionProps {
  bgConfig?: SectionBgConfig;
}

export const RHManifestoSection: React.FC<RHManifestoSectionProps> = ({
  bgConfig,
}) => {
  const isCustom = bgConfig && bgConfig.type !== 'default';
  const isDark = isDarkTheme(bgConfig);

  return (
    <section
      className={cn(
        'w-full py-20 md:py-32 px-6 sm:px-12 text-center border-b transition-colors relative overflow-hidden',
        !isCustom && 'bg-[#f6f5f3] border-neutral-200/80',
        isCustom && isDark && 'text-white border-white/10',
        isCustom && !isDark && 'text-neutral-900 border-neutral-200/80',
      )}
      style={getSectionBgStyles(bgConfig)}
    >
      <SectionBgOverlay config={bgConfig} />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-3xl mx-auto space-y-6"
      >
        <motion.span
          initial={{ opacity: 0, letterSpacing: '0.2em' }}
          whileInView={{ opacity: 1, letterSpacing: '0.4em' }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            'text-[10px] md:text-xs uppercase font-light block',
            isDark ? 'text-neutral-300' : 'text-neutral-500',
          )}
        >
          THE VITRUVIAN PRINCIPLES
        </motion.span>

        <blockquote
          className={cn(
            'font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.04em] leading-[1.25]',
            isDark ? 'text-white' : 'text-neutral-900',
          )}
        >
          “There are pieces that furnish a space, and pieces that define it.”
        </blockquote>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            'w-12 h-[1px] mx-auto my-4 origin-center',
            isDark ? 'bg-neutral-500' : 'bg-neutral-400',
          )}
        />

        <p
          className={cn(
            'text-xs sm:text-sm tracking-[0.08em] font-light leading-relaxed uppercase max-w-xl mx-auto',
            isDark ? 'text-neutral-200' : 'text-neutral-600',
          )}
        >
          Balance, Symmetry and Perfect Proportion. We curate collections conceived by master designers and brought to life by generational artisans in central Java.
        </p>
      </motion.div>
    </section>
  );
};
