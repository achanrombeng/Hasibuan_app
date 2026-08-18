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

  const SlideImage = ({ banner }: { banner: CarouselBannerSlide }) => (
    <img
      src={banner.image_url}
      alt=""
      className="h-full w-full object-cover"
      draggable={false}
    />
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative w-full bg-neutral-100"
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {banners.map((banner) => (
            <div key={banner.id} className="min-w-0 flex-[0_0_100%]">
              {/* Responsive aspect ratio: 4:3 mobile, 21:9 desktop */}
              <div className="relative aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9]">
                {banner.link ? (
                  <a
                    href={banner.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full w-full"
                  >
                    <SlideImage banner={banner} />
                  </a>
                ) : (
                  <SlideImage banner={banner} />
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
            className="absolute top-1/2 left-3 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-neutral-700 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:shadow-lg md:left-5 md:h-12 md:w-12"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            className="absolute top-1/2 right-3 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-neutral-700 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:shadow-lg md:right-5 md:h-12 md:w-12"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {showNav && (
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2 md:bottom-5">
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
    </motion.section>
  );
};

export default CarouselBannerSection;
