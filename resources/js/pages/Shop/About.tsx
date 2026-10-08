import { SEOHead } from '@/components/seo';
import { useTranslation } from '@/hooks/use-translation';
import { ShopLayout } from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import { usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Award,
  ChevronLeft,
  ChevronRight,
  Globe,
  Hammer,
  ShieldCheck,
  Trees,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
  const { t } = useTranslation();
  const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
  const siteName = siteSettings?.site_name || 'Hasibuan Designs';

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const carouselImages = (
    aboutSettings?.story_images && aboutSettings.story_images.length > 0
      ? aboutSettings.story_images
      : [
          aboutSettings?.story_image_1 ||
            '/images/about/hasibuan-profile-1.webp',
          aboutSettings?.story_image_2 ||
            '/images/about/hasibuan-profile-2.webp',
          aboutSettings?.story_image_3 || '/images/about/hasibuan-workshop.jpg',
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

  const storyTitle = aboutSettings?.story_title || 'Company Profile';
  const storySubtitle =
    aboutSettings?.story_subtitle ||
    'Hasibuan Designs Furniture & Craftsmanship - Jepara, Central Java, Indonesia';

  const defaultContent = `Hasibuan Designs is a Jepara based company specialising in the wooden furniture and manufacturer of premium wood furniture such as Teak Solid Wood.

Established in 2000, we focused our business in manufacturing and exporting handmade indoor furnitures and accessories home decoration. Since 2000 Hasibuan Designs Furniture has supply wooden furniture to customers from Norway, Miami, Brazil, UK, Germany, Taiwan, Mongolia, India, Malaysia, Singapore and Australia.

With staff and Employers around 150 peoples we commited to make sure that you are 100% happy with your experience with us. From sales through to delivery, we aim to provide a first class service that you will be delighted with.

If you would like advice on any aspect of choosing or caring for your Hasibuan Designs Furniture please get in touch. We love talking to customers, and providing advice and support on choosing the best pieces to suit your style of home.

The Hasibuan Designs Furniture range is built to last, and is always of excellent quality. Our furniture comes fully assembled after 8-12 weeks of careful construction and attention is made to the finest details. We use traditional construction methods, pin and dowel techniques, and dovetail joints for extra strength. Our products are made from solid timbers and we never use veneers.

We set competitive prices, and actively check and match these against similar quality products. All exclusive Hasibuan Designs products are hand made in Indonesia by local craftsmen. The workshop is located in Jepara, Central Java and with its exotic tropical surroundings; it is a great environment to work in. All work is carried out using perfected traditional methods.

The increase in popularity of Indonesian furniture has meant an improvement for to worked hard to create a sense of art in every pieces of our furniture. The wood used for much of our furniture is premium wood which coming from government controlled plantation, and therefore by definition eco friendly.`;

  const rawContent = aboutSettings?.story_content || defaultContent;

  const pillars = [
    {
      num: '01',
      title: 'HERITAGE SINCE 2000',
      subtitle: 'JEPARA, CENTRAL JAVA',
      desc: 'Over 20 years established as a premier solid wood manufacturer, employing over 150 dedicated artisans and staff.',
      icon: Award,
    },
    {
      num: '02',
      title: '100% SOLID TIMBERS',
      subtitle: 'ZERO VENEERS USED',
      desc: 'Handcrafted exclusively from certified solid teak timber harvested from government-controlled plantations.',
      icon: Trees,
    },
    {
      num: '03',
      title: 'MASTER JOINERY',
      subtitle: 'PIN, DOWEL & DOVETAIL',
      desc: 'Built to last through 8–12 weeks of meticulous construction and traditional joinery techniques for supreme strength.',
      icon: Hammer,
    },
    {
      num: '04',
      title: 'GLOBAL EXPORTS',
      subtitle: 'WORLDWIDE REACH',
      desc: 'Supplying clients across Norway, USA (Miami), Brazil, UK, Germany, Taiwan, Australia, and Southeast Asia.',
      icon: Globe,
    },
  ];

  return (
    <>
      <SEOHead
        title="About Us"
        description={t('shop.about.seo_description', { siteName })}
        keywords={[
          'about us',
          'hasibuan designs',
          'company profile',
          'teak wood furniture',
          'solid teak jepara',
          'indonesian furniture export',
          'svlk certified timber',
        ]}
      />
      <div className="bg-noise" />
      <ShopLayout>
        <main className="min-h-screen bg-white pb-24 select-none">
          {/* Monumental Editorial Header - Black Luxury Banner (Above Image) */}
          <div className="border-b border-neutral-900 bg-neutral-950 px-6 py-16 text-white md:py-24">
            <div className="mx-auto max-w-[1720px] space-y-3 text-center">
              <span className="block text-[10px] font-light tracking-[0.35em] text-neutral-400 uppercase md:text-xs">
                COMPANY PROFILE &amp; ATELIER
              </span>
              <h1 className="font-serif text-3xl font-light tracking-[0.06em] text-white uppercase sm:text-4xl md:text-5xl">
                {storyTitle}
              </h1>
              <div className="mx-auto mt-4 h-[1px] w-12 bg-neutral-700" />
              <p className="mx-auto max-w-2xl pt-2 text-xs font-light tracking-wide text-neutral-300 md:text-sm">
                {storySubtitle}
              </p>
            </div>
          </div>

          {/* SECTION 1: LANDSCAPE IMAGE CAROUSEL */}
          <section className="border-b border-neutral-200/80 bg-neutral-50/50 py-6 sm:py-8">
            <div className="mx-auto max-w-[1720px] px-4 sm:px-8 md:px-12">
              {/* Landscape Main Showcase Frame */}
              <div
                className="relative aspect-[16/9] max-h-[580px] w-full overflow-hidden border border-neutral-200/90 bg-neutral-900 shadow-sm sm:aspect-[2/1] md:aspect-[2.4/1]"
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={carouselImages[currentImageIndex]}
                    alt={`Hasibuan Designs Workshop ${currentImageIndex + 1}`}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="h-full w-full object-cover object-center"
                  />
                </AnimatePresence>

                {/* Subtle Image Counter Badge */}
                <div className="absolute top-4 left-4 z-10 border border-neutral-200 bg-white/90 px-3 py-1 text-[10px] font-light tracking-[0.2em] text-neutral-800 uppercase backdrop-blur-xs">
                  {currentImageIndex + 1} / {carouselImages.length}
                </div>

                {/* Navigation Arrows */}
                {carouselImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="absolute top-1/2 left-4 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center border border-neutral-200 bg-white/90 text-neutral-900 shadow-sm transition-all hover:bg-neutral-900 hover:text-white sm:h-12 sm:w-12"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={20} strokeWidth={1.5} />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="absolute top-1/2 right-4 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center border border-neutral-200 bg-white/90 text-neutral-900 shadow-sm transition-all hover:bg-neutral-900 hover:text-white sm:h-12 sm:w-12"
                      aria-label="Next image"
                    >
                      <ChevronRight size={20} strokeWidth={1.5} />
                    </button>

                    {/* Pagination Dots */}
                    <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 bg-black/40 px-3.5 py-1.5 backdrop-blur-xs">
                      {carouselImages.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`h-1.5 cursor-pointer transition-all ${
                            idx === currentImageIndex
                              ? 'w-7 bg-white'
                              : 'w-2 bg-white/50 hover:bg-white/80'
                          }`}
                          aria-label={`Slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* SECTION 2: EDITORIAL NARRATIVE (BELOW THE IMAGE) */}
          <section className="mx-auto max-w-5xl px-6 py-12 sm:px-8 md:py-16">
            {/* Architectural Subtitle Accent */}
            <div className="space-y-3 text-center">
              <span className="block text-[10px] font-light tracking-[0.3em] text-neutral-400 uppercase">
                JEPARA SOLID TEAK CRAFTSMANSHIP
              </span>
              <h2 className="font-serif text-2xl font-light tracking-[0.04em] text-neutral-900 uppercase sm:text-3xl md:text-4xl">
                PREMIUM SOLID TIMBERS, MASTER JOINERY &amp; WORLDWIDE EXPORT
              </h2>
              <div className="mx-auto mt-4 h-[1px] w-16 bg-neutral-300" />
            </div>

            {/* Narrative Content Rendered from Admin Markdown Input */}
            <div className="prose prose-neutral mt-10 max-w-none text-neutral-700">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ node, ...props }) => (
                    <p
                      className="mb-6 text-sm leading-relaxed font-light tracking-wide text-neutral-700 sm:text-base"
                      {...props}
                    />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong
                      className="font-semibold text-neutral-900"
                      {...props}
                    />
                  ),
                  em: ({ node, ...props }) => (
                    <em className="text-neutral-800 italic" {...props} />
                  ),
                  h1: ({ node, ...props }) => (
                    <h1
                      className="mt-8 mb-4 font-serif text-2xl font-light text-neutral-900 uppercase sm:text-3xl"
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      className="mt-6 mb-3 font-serif text-xl font-light text-neutral-900 uppercase sm:text-2xl"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      className="mt-4 mb-2 font-serif text-lg font-medium text-neutral-900 uppercase"
                      {...props}
                    />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul
                      className="my-4 list-inside list-disc space-y-2 pl-2 text-neutral-700"
                      {...props}
                    />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      className="my-4 list-inside list-decimal space-y-2 pl-2 text-neutral-700"
                      {...props}
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li
                      className="leading-relaxed text-neutral-700"
                      {...props}
                    />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="my-4 border-l-2 border-neutral-300 pl-4 text-neutral-600 italic"
                      {...props}
                    />
                  ),
                }}
              >
                {rawContent}
              </ReactMarkdown>
            </div>

            {/* Company Highlights & Pillars */}
            <div className="mt-16 grid grid-cols-1 gap-6 border-t border-neutral-200/80 pt-12 sm:grid-cols-2">
              {pillars.map((pillar) => {
                const IconComponent = pillar.icon;
                return (
                  <div
                    key={pillar.num}
                    className="space-y-2 border border-neutral-100 bg-[#fafaf9] p-6 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-light tracking-[0.25em] text-neutral-400 uppercase">
                        {pillar.num} / {pillar.title}
                      </span>
                      <IconComponent size={18} className="text-neutral-500" />
                    </div>
                    <h4 className="font-serif text-base font-medium text-neutral-900 uppercase">
                      {pillar.subtitle}
                    </h4>
                    <p className="text-xs leading-relaxed font-light text-neutral-500">
                      {pillar.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* SVLK Certificate Assurance Card */}
            <div className="mt-10 flex flex-col items-center gap-6 border border-neutral-200/90 bg-[#fafaf9] p-6 sm:flex-row sm:p-8">
              <div className="h-20 w-20 shrink-0 overflow-hidden border border-neutral-200 bg-white p-1.5 sm:h-24 sm:w-24">
                <img
                  src="/images/about/svlk-certificate.jpg"
                  alt="SVLK Timber Legality Assurance"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <div className="flex items-center justify-center gap-2 sm:justify-start">
                  <ShieldCheck size={18} className="text-emerald-700" />
                  <span className="text-xs font-semibold tracking-[0.2em] text-neutral-900 uppercase">
                    SVLK CERTIFIED TIMBER LEGALITY
                  </span>
                </div>
                <p className="text-xs leading-relaxed font-light text-neutral-600 sm:text-sm">
                  Sistem Verifikasi Legalitas Kayu. 100% of our timbers are
                  legally sourced from Indonesian government-controlled
                  plantations (Perhutani), ensuring full traceability,
                  sustainable forestry, and eco-friendly manufacturing.
                </p>
              </div>
            </div>

            {/* Action CTA Buttons */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4 pt-4">
              <a
                href="/shop/products"
                className="bg-neutral-900 px-8 py-3.5 text-[11px] font-medium tracking-[0.25em] text-white uppercase transition-colors hover:bg-neutral-800"
              >
                EXPLORE COLLECTIONS
              </a>
              <a
                href="/shop/contact"
                className="border border-neutral-900 px-8 py-3.5 text-[11px] font-medium tracking-[0.25em] text-neutral-900 uppercase transition-colors hover:bg-neutral-900 hover:text-white"
              >
                CONTACT US
              </a>
            </div>
          </section>
        </main>
      </ShopLayout>
    </>
  );
}
