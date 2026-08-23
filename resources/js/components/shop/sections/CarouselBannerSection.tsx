import { CarouselBannerSlide } from '@/types/shop';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface CarouselBannerSectionProps {
  banners: CarouselBannerSlide[];
}

export const CarouselBannerSection: React.FC<CarouselBannerSectionProps> = ({
  banners,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  if (!banners || banners.length === 0) return null;

  const showNav = banners.length > 1;

  const isVideoUrl = (url: string) => {
    if (!url) return false;
    const lower = url.toLowerCase();
    return (
      lower.endsWith('.mp4') ||
      lower.endsWith('.webm') ||
      lower.endsWith('.ogg') ||
      lower.includes('video')
    );
  };

  const SlideMedia = ({ banner }: { banner: CarouselBannerSlide }) => {
    const isVideo =
      banner.media_type === 'video' || isVideoUrl(banner.image_url);

    return (
      <div className="relative h-full w-full overflow-hidden bg-neutral-950">
        {isVideo ? (
          <video
            src={banner.image_url}
            autoPlay
            loop
            muted
            playsInline
            className="relative z-10 h-full w-full object-cover object-center"
          />
        ) : (
          <>
            {/* Soft blurred background to fill edges smoothly */}
            <img
              src={banner.image_url}
              alt=""
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-35 blur-2xl"
              draggable={false}
            />
            {/* Main banner image - fitted properly without aggressive cropping */}
            <img
              src={banner.image_url}
              alt=""
              className="relative z-10 h-full w-full object-contain object-center transition-all duration-300"
              draggable={false}
            />
          </>
        )}
      </div>
    );
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative w-full py-4 sm:py-6"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-900 shadow-md md:rounded-3xl">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {banners.map((banner) => (
                <div key={banner.id} className="min-w-0 flex-[0_0_100%]">
                  <div className="relative h-[220px] sm:h-[340px] md:h-[420px] lg:h-[480px]">
                    {banner.link ? (
                      <a
                        href={banner.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block h-full w-full"
                      >
                        <SlideMedia banner={banner} />
                      </a>
                    ) : (
                      <SlideMedia banner={banner} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {showNav && (
            <>
              <button
                type="button"
                onClick={scrollPrev}
                className="absolute top-1/2 left-3 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-neutral-800 shadow-md backdrop-blur-md transition-all hover:scale-105 hover:bg-white md:left-5 md:h-12 md:w-12"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                className="absolute top-1/2 right-3 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-neutral-800 shadow-md backdrop-blur-md transition-all hover:scale-105 hover:bg-white md:right-5 md:h-12 md:w-12"
                aria-label="Next slide"
              >
                <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
              </button>
            </>
          )}

          {/* Dot Indicators */}
          {showNav && (
            <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2 md:bottom-5">
              {banners.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => scrollTo(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === selectedIndex
                      ? 'w-7 bg-white shadow-md'
                      : 'w-2.5 bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default CarouselBannerSection;
