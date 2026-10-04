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
        <main className="min-h-screen bg-sand-50 pb-20">
          {/* Fixed Nature/Wood Banner Header */}
          <div className="mb-12 bg-[#96724d] py-16 text-white md:mb-16">
            <div className="mx-auto max-w-[1400px] px-6 text-center md:px-12">
              <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
                About Us
              </h1>
              <p className="mx-auto max-w-2xl text-xl opacity-90">
                Discover the story of Ronica’s handcrafted outdoor furniture
              </p>
            </div>
          </div>

          {/* Main Content Section */}
          <div className="mx-auto max-w-[1400px] px-6 md:px-12">
            <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm md:p-10 lg:p-12">
              <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-12 xl:gap-16">
                {/* Left Column: Image Carousel */}
                <div
                  className="relative min-h-[380px] w-full overflow-hidden rounded-xl bg-neutral-100 shadow-inner sm:min-h-[460px] lg:col-span-5 xl:col-span-5"
                  onMouseEnter={() => setIsAutoPlaying(false)}
                  onMouseLeave={() => setIsAutoPlaying(true)}
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImageIndex}
                      src={carouselImages[currentImageIndex]}
                      alt={`Ronica Craftsmanship ${currentImageIndex + 1}`}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="h-full w-full object-cover object-center"
                    />
                  </AnimatePresence>

                  {/* Navigation Arrows */}
                  {carouselImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="absolute top-1/2 left-3 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/85 text-neutral-800 shadow-md backdrop-blur-xs transition-all hover:scale-105 hover:bg-white active:scale-95"
                        aria-label="Previous image"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="absolute top-1/2 right-3 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/85 text-neutral-800 shadow-md backdrop-blur-xs transition-all hover:scale-105 hover:bg-white active:scale-95"
                        aria-label="Next image"
                      >
                        <ChevronRight size={20} />
                      </button>

                      {/* Carousel Pagination Dots */}
                      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/30 px-3 py-1.5 backdrop-blur-xs">
                        {carouselImages.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`h-2 cursor-pointer rounded-full transition-all ${
                              idx === currentImageIndex
                                ? 'w-6 bg-white'
                                : 'w-2 bg-white/50 hover:bg-white/80'
                            }`}
                            aria-label={`Slide ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Right Column: Story Text Content */}
                <div className="flex flex-col justify-center lg:col-span-7 xl:col-span-7">
                  <h2 className="mb-6 font-serif text-2xl leading-tight font-bold tracking-tight text-neutral-900 md:text-3xl lg:text-[2rem]">
                    {storyTitle}
                    {storySubtitle && (
                      <span className="mt-1 block font-sans text-xl font-semibold text-neutral-800 md:text-2xl">
                        {storySubtitle}
                      </span>
                    )}
                  </h2>

                  <div className="space-y-4 text-sm leading-relaxed text-neutral-700 md:text-[15px] lg:text-base lg:leading-relaxed">
                    {paragraphs.map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </ShopLayout>
    </>
  );
}
