import {
  ApiCategory,
  ApiProduct,
  CarouselBannerSlide,
  HeroSettings,
  HomeTestimonial,
  HomeValue,
} from '@/types/shop';
import { motion } from 'framer-motion';
import { CarouselBannerSection } from './sections/CarouselBannerSection';
import { CatalogSection } from './sections/CatalogSection';
import { CategoriesSection } from './sections/CategoriesSection';
import { CraftsmanshipSection } from './sections/CraftsmanshipSection';
import { HeroSection } from './sections/HeroSection';
import { NewsletterSection } from './sections/NewsletterSection';
import { ProductsSection } from './sections/ProductsSection';
import { TestimonialsSection } from './sections/TestimonialsSection';
import { TrustSection } from './sections/TrustSection';
import { ValuesSection } from './sections/ValuesSection';

interface SectionVisibility {
  hero: boolean;
  carousel_banners: boolean;
  trust: boolean;
  categories: boolean;
  craftsmanship: boolean;
  catalog: boolean;
  values: boolean;
  products: boolean;
  testimonials: boolean;
  newsletter: boolean;
}

interface LandingViewProps {
  featuredProducts: ApiProduct[];
  featuredCategories: ApiCategory[];
  categories?: ApiCategory[];
  testimonials: HomeTestimonial[];
  heroSettings: HeroSettings;
  trustLogos: string[] | { name: string; logo_url?: string }[];
  values: HomeValue[];
  carouselBanners?: CarouselBannerSlide[];
  sectionVisibility?: SectionVisibility;
}

export const LandingView: React.FC<LandingViewProps> = ({
  featuredProducts,
  featuredCategories,
  categories,
  testimonials,
  heroSettings,
  trustLogos,
  values,
  carouselBanners,
  sectionVisibility,
}) => {
  // Default sections visibility
  const visibility = sectionVisibility ?? {
    hero: false,
    carousel_banners: true,
    trust: false,
    categories: true,
    catalog: true,
    values: true,
    products: false,
    testimonials: true,
    newsletter: true,
  };

  const activeCategories = categories && categories.length > 0 ? categories : featuredCategories;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="overflow-hidden"
    >
      {visibility.carousel_banners &&
        carouselBanners &&
        carouselBanners.length > 0 && (
          <CarouselBannerSection banners={carouselBanners} />
        )}
      {visibility.categories && (
        <CategoriesSection categories={activeCategories} />
      )}
      <CraftsmanshipSection />
      {visibility.catalog && <CatalogSection categories={activeCategories} />}
      {visibility.values && <ValuesSection values={values} />}
      {visibility.products && <ProductsSection products={featuredProducts} />}
      {visibility.testimonials && (
        <TestimonialsSection testimonials={testimonials} />
      )}
      {visibility.newsletter && <NewsletterSection />}
    </motion.div>
  );
};

export default LandingView;
