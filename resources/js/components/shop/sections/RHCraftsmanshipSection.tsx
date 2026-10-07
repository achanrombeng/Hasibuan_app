import { CraftsmanshipSettings } from '@/types/shop';
import React from 'react';

interface RHCraftsmanshipSectionProps {
  settings?: CraftsmanshipSettings;
}

export const RHCraftsmanshipSection: React.FC<RHCraftsmanshipSectionProps> = ({
  settings,
}) => {
  const title1 = settings?.title_1 || 'HANDCRAFTED ALL-WEATHER WEAVING';
  const desc1 =
    settings?.desc_1 ||
    'Traditional hand-weaving techniques passed through generations of master artisans form the soul of our furniture. Woven over rust-proof aluminum frameworks, each strand is engineered to withstand tropical rain, UV exposure, and coastal breezes while offering enduring tactile warmth.';

  const title2 = settings?.title_2 || 'GRADE-A CERTIFIED SUSTAINABLE TEAK';
  const desc2 =
    settings?.desc_2 ||
    "Sourced exclusively from responsibly managed Indonesian plantations, our premium teak wood is rich in natural protective oils. It offers supreme structural density and resilience against weather elements, gracefully aging into an iconic silvery-grey patina over decades.";

  const craftImage =
    Array.isArray(settings?.images_1) && settings.images_1.length > 0
      ? settings.images_1[0]
      : 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1600&auto=format&fit=crop';

  const woodImage =
    Array.isArray(settings?.images_2) && settings.images_2.length > 0
      ? settings.images_2[0]
      : 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1600&auto=format&fit=crop';

  return (
    <section className="w-full bg-[#fcfcfb] py-20 md:py-32 px-6 sm:px-12 lg:px-20 border-b border-neutral-200/60">
      <div className="max-w-[1720px] mx-auto space-y-20 md:space-y-32">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[10px] md:text-xs tracking-[0.35em] uppercase font-light text-neutral-500">
            MATERIAL PROVENANCE
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-light tracking-[0.06em] text-neutral-900 uppercase">
            THE ART OF MASTER CRAFTSMANSHIP
          </h2>
          <div className="w-12 h-[1px] bg-neutral-400 mx-auto mt-4" />
        </div>

        {/* Feature 1: Teak Wood (Image Left, Text Right) */}
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
            <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-light block">
              INDONESIAN TIMBER
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.06em] uppercase text-neutral-900">
              {title2}
            </h3>
            <div className="w-10 h-[1px] bg-neutral-400 mx-auto lg:mx-0" />
            <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed tracking-wide">
              {desc2}
            </p>
          </div>
        </div>

        {/* Feature 2: Hand Weaving (Text Left, Image Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1 space-y-6 text-center lg:text-left">
            <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-light block">
              ARTISAN WEAVING
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.06em] uppercase text-neutral-900">
              {title1}
            </h3>
            <div className="w-10 h-[1px] bg-neutral-400 mx-auto lg:mx-0" />
            <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed tracking-wide">
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

      </div>
    </section>
  );
};
