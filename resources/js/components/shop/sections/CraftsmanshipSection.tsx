import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';

const CRAFT_IMAGES = [
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop',
];

const WOOD_IMAGES = [
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
];

export const CraftsmanshipSection: React.FC = () => {
  const [craftIndex, setCraftIndex] = useState(0);
  const [woodIndex, setWoodIndex] = useState(0);

  const nextCraft = () =>
    setCraftIndex((prev) => (prev + 1) % CRAFT_IMAGES.length);
  const prevCraft = () =>
    setCraftIndex((prev) => (prev - 1 + CRAFT_IMAGES.length) % CRAFT_IMAGES.length);

  const nextWood = () =>
    setWoodIndex((prev) => (prev + 1) % WOOD_IMAGES.length);
  const prevWood = () =>
    setWoodIndex((prev) => (prev - 1 + WOOD_IMAGES.length) % WOOD_IMAGES.length);

  return (
    <section className="bg-white py-12 md:py-20 px-4 md:px-8 lg:px-12 overflow-hidden">
      <div className="mx-auto max-w-[1440px] space-y-8 md:space-y-12">
        {/* Row 1: Handcrafted Touch (Text Left, Image Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch">
          {/* Left Text Card */}
          <div className="bg-[#f8f8f7] rounded-lg p-8 md:p-16 flex flex-col justify-center items-center text-center">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 mb-6">
              Handcrafted, Unique Touch
            </h2>
            <p className="text-neutral-600 text-sm md:text-base leading-relaxed max-w-lg font-sans">
              Hand-woven traditional rattan forms the soul of Ronica furniture,
              reflecting craftsmanship passed down through generations of
              master artisans. This finely woven natural material not only adds
              aesthetic elegance but also gives our furniture a breathing,
              durable structure and timeless character.
            </p>
          </div>

          {/* Right Image Carousel */}
          <div className="relative rounded-lg overflow-hidden min-h-[320px] md:min-h-[400px] lg:min-h-[440px] bg-neutral-100 group shadow-sm">
            <AnimatePresence mode="wait">
              <motion.img
                key={craftIndex}
                src={CRAFT_IMAGES[craftIndex]}
                alt="Handcrafted Rattan Weaving"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full object-cover absolute inset-0"
              />
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
              onClick={prevCraft}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 text-neutral-700 backdrop-blur-sm shadow flex items-center justify-center transition-all hover:bg-white hover:scale-105"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextCraft}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 text-neutral-700 backdrop-blur-sm shadow flex items-center justify-center transition-all hover:bg-white hover:scale-105"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Row 2: Strength of Nature (Image Left, Text Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch">
          {/* Left Image Carousel */}
          <div className="relative rounded-lg overflow-hidden min-h-[320px] md:min-h-[400px] lg:min-h-[440px] bg-neutral-100 group shadow-sm order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.img
                key={woodIndex}
                src={WOOD_IMAGES[woodIndex]}
                alt="Teak Timber Forest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full object-cover absolute inset-0"
              />
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
              onClick={prevWood}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 text-neutral-700 backdrop-blur-sm shadow flex items-center justify-center transition-all hover:bg-white hover:scale-105"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextWood}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 text-neutral-700 backdrop-blur-sm shadow flex items-center justify-center transition-all hover:bg-white hover:scale-105"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Right Text Card */}
          <div className="bg-[#f8f8f7] rounded-lg p-8 md:p-16 flex flex-col justify-center items-center text-center order-1 lg:order-2">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 mb-6">
              Strength of Nature, Timeless Elegance
            </h2>
            <p className="text-neutral-600 text-sm md:text-base leading-relaxed max-w-lg font-sans">
              The premium teak wood used in our furniture is one of nature's
              most durable and cherished materials. Rich in natural protective
              oils, it offers superior resistance against moisture, intense
              sunlight, and outdoor weather elements. As years pass, its texture
              and warm tone grow even more beautiful.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CraftsmanshipSection;
