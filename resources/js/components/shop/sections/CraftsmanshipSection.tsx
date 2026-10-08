import { CraftsmanshipSettings } from '@/types/shop';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const DEFAULT_CRAFT_IMAGES = [
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop',
];

const DEFAULT_WOOD_IMAGES = [
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
];

interface CraftsmanshipSectionProps {
  settings?: CraftsmanshipSettings;
}

export const CraftsmanshipSection: React.FC<CraftsmanshipSectionProps> = ({
  settings,
}) => {
  const [craftIndex, setCraftIndex] = useState(0);
  const [woodIndex, setWoodIndex] = useState(0);

  const craftImages =
    settings?.images_1 && settings.images_1.length > 0
      ? settings.images_1
      : DEFAULT_CRAFT_IMAGES;
  const woodImages =
    settings?.images_2 && settings.images_2.length > 0
      ? settings.images_2
      : DEFAULT_WOOD_IMAGES;

  const title1 = settings?.title_1 || 'Handcrafted, Unique Touch';
  const desc1 =
    settings?.desc_1 ||
    'Hand-woven traditional rattan forms the soul of Ronica furniture, reflecting craftsmanship passed down through generations of master artisans. This finely woven natural material not only adds aesthetic elegance but also gives our furniture a breathing, durable structure and timeless character.';

  const title2 = settings?.title_2 || 'Strength of Nature, Timeless Elegance';
  const desc2 =
    settings?.desc_2 ||
    "The premium teak wood used in our furniture is one of nature's most durable and cherished materials. Rich in natural protective oils, it offers superior resistance against moisture, intense sunlight, and outdoor weather elements. As years pass, its texture and warm tone grow even more beautiful.";

  const nextCraft = () =>
    setCraftIndex((prev) => (prev + 1) % craftImages.length);
  const prevCraft = () =>
    setCraftIndex(
      (prev) => (prev - 1 + craftImages.length) % craftImages.length,
    );

  const nextWood = () => setWoodIndex((prev) => (prev + 1) % woodImages.length);
  const prevWood = () =>
    setWoodIndex((prev) => (prev - 1 + woodImages.length) % woodImages.length);

  const row1Visible = settings?.row_1_visible ?? true;
  const row2Visible = settings?.row_2_visible ?? true;

  if (!row1Visible && !row2Visible) {
    return null;
  }

  return (
    <section className="group/section relative overflow-hidden bg-white px-4 py-12 md:px-8 md:py-20 lg:px-12">
      <div className="mx-auto max-w-[1440px] space-y-8 md:space-y-12">
        {/* Row 1: Handcrafted Touch (Text Left, Image Right) */}
        {row1Visible && (
          <div className="grid grid-cols-1 items-stretch gap-6 md:gap-8 lg:grid-cols-2">
            {/* Left Text Card */}
            <div className="flex flex-col items-center justify-center rounded-lg bg-[#f8f8f7] p-8 text-center md:p-16">
              <h2 className="mb-6 font-serif text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl lg:text-5xl">
                {title1}
              </h2>
              <div className="prose prose-sm max-w-lg font-sans text-sm leading-relaxed text-neutral-600 md:text-base">
                <ReactMarkdown>{desc1}</ReactMarkdown>
              </div>
            </div>

            {/* Right Image Carousel */}
            <div className="group relative min-h-[320px] overflow-hidden rounded-lg bg-neutral-100 shadow-sm md:min-h-[400px] lg:min-h-[440px]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={craftIndex}
                  src={craftImages[craftIndex % craftImages.length]}
                  alt={title1}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>

              {/* Navigation Buttons */}
              {craftImages.length > 1 && (
                <>
                  <button
                    onClick={prevCraft}
                    className="absolute top-1/2 left-4 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-neutral-700 shadow backdrop-blur-sm transition-all hover:scale-105 hover:bg-white"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextCraft}
                    className="absolute top-1/2 right-4 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-neutral-700 shadow backdrop-blur-sm transition-all hover:scale-105 hover:bg-white"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Row 2: Strength of Nature (Image Left, Text Right) */}
        {row2Visible && (
          <div className="grid grid-cols-1 items-stretch gap-6 md:gap-8 lg:grid-cols-2">
            {/* Left Image Carousel */}
            <div className="group relative order-2 min-h-[320px] overflow-hidden rounded-lg bg-neutral-100 shadow-sm md:min-h-[400px] lg:order-1 lg:min-h-[440px]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={woodIndex}
                  src={woodImages[woodIndex % woodImages.length]}
                  alt={title2}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>

              {/* Navigation Buttons */}
              {woodImages.length > 1 && (
                <>
                  <button
                    onClick={prevWood}
                    className="absolute top-1/2 left-4 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-neutral-700 shadow backdrop-blur-sm transition-all hover:scale-105 hover:bg-white"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextWood}
                    className="absolute top-1/2 right-4 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-neutral-700 shadow backdrop-blur-sm transition-all hover:scale-105 hover:bg-white"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Right Text Card */}
            <div className="order-1 flex flex-col items-center justify-center rounded-lg bg-[#f8f8f7] p-8 text-center md:p-16 lg:order-2">
              <h2 className="mb-6 font-serif text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl lg:text-5xl">
                {title2}
              </h2>
              <div className="prose prose-sm max-w-lg font-sans text-sm leading-relaxed text-neutral-600 md:text-base">
                <ReactMarkdown>{desc2}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CraftsmanshipSection;
