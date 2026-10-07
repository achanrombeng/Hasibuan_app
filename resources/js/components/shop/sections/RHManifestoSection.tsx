import React from 'react';

export const RHManifestoSection: React.FC = () => {
  return (
    <section className="w-full bg-[#f6f5f3] py-20 md:py-32 px-6 sm:px-12 text-center border-b border-neutral-200/80">
      <div className="max-w-3xl mx-auto space-y-6">
        <span className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-neutral-500 font-light block">
          THE VITRUVIAN PRINCIPLES
        </span>
        
        <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.04em] text-neutral-900 leading-[1.25]">
          “There are pieces that furnish a space, and pieces that define it.”
        </blockquote>

        <div className="w-12 h-[1px] bg-neutral-400 mx-auto my-4" />

        <p className="text-xs sm:text-sm text-neutral-600 tracking-[0.08em] font-light leading-relaxed uppercase max-w-xl mx-auto">
          Balance, Symmetry and Perfect Proportion. We curate collections conceived by master designers and brought to life by generational artisans in central Java.
        </p>
      </div>
    </section>
  );
};
