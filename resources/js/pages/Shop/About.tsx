import { SEOHead } from '@/components/seo';
import { useTranslation } from '@/hooks/use-translation';
import { ShopLayout } from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import { usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AboutProps {
  aboutSettings?: {
    story_title?: string | null;
    story_subtitle?: string | null;
    story_content?: string | null;
    story_images?: string[] | null;
    story_image_1?: string | null;
    story_image_2?: string | null;
    story_image_3?: string | null;
  };
}

export default function About({ aboutSettings }: AboutProps) {
  const { t, locale } = useTranslation();
  const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
  const siteName = siteSettings?.site_name || 'hasibuan_app';

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const carouselImages = (
    aboutSettings?.story_images && aboutSettings.story_images.length > 0
      ? aboutSettings.story_images
      : [
          aboutSettings?.story_image_1 || '/images/about/about-banner-01.webp',
          aboutSettings?.story_image_2 || '/images/about/about-banner-02.webp',
          aboutSettings?.story_image_3 || '/images/about/about-banner-03.webp',
        ]
  ).filter(Boolean) as string[];

  const handlePrev = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? carouselImages.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      prev === carouselImages.length - 1 ? 0 : prev + 1,
    );
  };

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying || carouselImages.length <= 1) return;
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, currentImageIndex, carouselImages.length]);

  const storyTitle =
    aboutSettings?.story_title || 'Extending From Indonesia To The World';
  const storySubtitle =
    aboutSettings?.story_subtitle || 'Handicraft Story';

  const defaultContent = `Founded in 2016, in Cirebon, Indonesia, Ronica is the representative of elegance produced by hand in outdoor furniture. The brand, which has specialized in the production of high-quality rattan, rope and aluminum furniture since the day it was founded, moved to its new state-of-the-art factory in 2021 and expanded its production range to include A-class teak wood. Teak is sourced from the most exclusive teak region of Indonesia, Perhutani Blora, and achieves a unique quality by processing and baking in Ronica's own facilities.

Bringing together the tradition of Cirebon's hand knitting and Jepara's deep-rooted woodwork, Ronica brings two great craft cultures together under one roof. This combination reveals durable and aesthetic products that carry the trace of craftsmanship in each furniture. Each detail is the result of a design understanding that is shaped in the hands of the masters.

Only high-end materials suitable for outdoor conditions are used in Ronica. Perhutani-sourced teak wood, Rehau and Viro synthetic rattan, Sunproof, Ateja, Sunbrella and Agora fabrics; as well as QuickDry technology sponges are carefully selected for longevity and comfort. All materials are UV treated, proven with laboratory tests and supported by a three-year warranty from suppliers.

Today, Ronica exports to more than 15 countries, including the USA, Europe, the Middle East and Australia. While offering fast delivery to its customers thanks to its Mersin warehouse in Turkey, it has become a reliable solution partner in the international arena with private hotel and housing projects in Maldives, Qatar, Australia and the USA.

As a family business, Ronica is always passionate about quality, sustainability and customer satisfaction. Each collection is prepared with nature-respecting materials and innovative designs. Ronica brings not only comfort but also a lasting elegance to the outdoor life.`;

  const rawContent = aboutSettings?.story_content || defaultContent;
  const paragraphs = rawContent
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      <SEOHead
        title="About Us"
        description={t('shop.about.seo_description', { siteName })}
        keywords={[
          'about us',
          'about ronica',
          'outdoor furniture',
          'rattan furniture',
          'teak wood indonesia',
          'handicraft story',
        ]}
      />
      <div className="bg-noise" />
      <ShopLayout>
        <main className="min-h-screen bg-white pb-24 select-none">
          {/* Monumental Editorial Header - Black Luxury Banner */}
          <div className="border-b border-neutral-900 bg-neutral-950 py-16 md:py-24 px-6 text-white">
            <div className="mx-auto max-w-[1720px] text-center space-y-3">
              <span className="text-[10px] md:text-xs tracking-[0.35em] uppercase font-light text-neutral-400">
                ATELIER & CRAFTSMANSHIP
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-[0.06em] text-white uppercase">
                {storyTitle}
              </h1>
              <div className="w-12 h-[1px] bg-neutral-700 mx-auto mt-4" />
              <p className="mx-auto max-w-2xl text-xs md:text-sm font-light text-neutral-300 tracking-wide pt-2">
                {storySubtitle || 'Rooted in Indonesian heritage, refined for luxury architectural residences worldwide.'}
              </p>
            </div>
          </div>

          {/* Main Content Section */}
          <div className="mx-auto max-w-[1720px] px-6 sm:px-12 py-16 md:py-24">
            <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
              {/* Left Column: Editorial Image Carousel */}
              <div
                className="relative aspect-[4/5] w-full overflow-hidden border border-neutral-200/80 bg-neutral-100 lg:col-span-5"
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={carouselImages[currentImageIndex]}
                    alt={`Atelier Craftsmanship ${currentImageIndex + 1}`}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="h-full w-full object-cover object-center"
                  />
                </AnimatePresence>

                {/* Subtle Image Counter Badge */}
                <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-xs px-3 py-1 text-[10px] tracking-[0.2em] uppercase font-light text-neutral-800 border border-neutral-200">
                  {currentImageIndex + 1} / {carouselImages.length}
                </div>

                {/* Navigation Arrows */}
                {carouselImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="absolute top-1/2 left-4 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center bg-white/90 text-neutral-900 border border-neutral-200 shadow-sm transition-all hover:bg-neutral-900 hover:text-white"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={18} strokeWidth={1.5} />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="absolute top-1/2 right-4 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center bg-white/90 text-neutral-900 border border-neutral-200 shadow-sm transition-all hover:bg-neutral-900 hover:text-white"
                      aria-label="Next image"
                    >
                      <ChevronRight size={18} strokeWidth={1.5} />
                    </button>

                    {/* Pagination Dots */}
                    <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 bg-black/40 px-3 py-1.5 backdrop-blur-xs">
                      {carouselImages.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`h-1.5 cursor-pointer transition-all ${
                            idx === currentImageIndex
                              ? 'w-6 bg-white'
                              : 'w-1.5 bg-white/50 hover:bg-white/80'
                          }`}
                          aria-label={`Slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Right Column: Editorial Narrative */}
              <div className="flex flex-col justify-start lg:col-span-7 space-y-8">
                <div className="space-y-3">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-light block">
                    THE ARCHITECTURAL MANIFESTO
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light tracking-[0.04em] uppercase text-neutral-900">
                    HARMONY OF WOOD, WEAVE & TIMELESS PROPORTIONS
                  </h2>
                </div>

                <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-neutral-600 font-light tracking-wide">
                  {paragraphs.map((paragraph, idx) => (
                    <p key={idx} className="first-letter:text-3xl first-letter:font-serif first-letter:float-left first-letter:mr-2.5 first-letter:text-neutral-900">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Atelier Pillars */}
                <div className="pt-8 border-t border-neutral-200/80 grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-light block">
                      01 / HERITAGE
                    </span>
                    <h4 className="font-serif text-sm uppercase text-neutral-900 font-medium">
                      JEPARA & CIREBON
                    </h4>
                    <p className="text-[11px] text-neutral-500 font-light leading-relaxed">
                      Generations of master woodwork joined with intricate hand-knitted weaves.
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-light block">
                      02 / MATERIALS
                    </span>
                    <h4 className="font-serif text-sm uppercase text-neutral-900 font-medium">
                      GRADE-A PERHUTANI
                    </h4>
                    <p className="text-[11px] text-neutral-500 font-light leading-relaxed">
                      Sustainably harvested teak, Rehau fiber, and all-weather Sunbrella textiles.
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-light block">
                      03 / GLOBAL REACH
                    </span>
                    <h4 className="font-serif text-sm uppercase text-neutral-900 font-medium">
                      15+ COUNTRIES
                    </h4>
                    <p className="text-[11px] text-neutral-500 font-light leading-relaxed">
                      Fulfilling private estates, five-star resorts, and architectural projects worldwide.
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 flex flex-wrap items-center gap-4">
                  <a
                    href="/shop/products"
                    className="px-8 py-3.5 bg-neutral-900 text-white text-[11px] tracking-[0.25em] uppercase font-medium hover:bg-neutral-800 transition-colors"
                  >
                    EXPLORE COLLECTIONS
                  </a>
                  <a
                    href="/shop/contact"
                    className="px-8 py-3.5 border border-neutral-900 text-neutral-900 text-[11px] tracking-[0.25em] uppercase font-medium hover:bg-neutral-900 hover:text-white transition-colors"
                  >
                    CONTACT ATELIER
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </ShopLayout>
    </>
  );
}
