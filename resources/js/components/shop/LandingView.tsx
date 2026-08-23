import {
  ApiCategory,
  ApiProduct,
  CarouselBannerSlide,
  CraftsmanshipSettings,
  HeroSettings,
  HomeTestimonial,
  HomeValue,
  ValuesSettings,
} from '@/types/shop';
import { motion } from 'framer-motion';
import { ArticleItem, ArticlesSection } from './sections/ArticlesSection';
import { CarouselBannerSection } from './sections/CarouselBannerSection';
import { CatalogSection } from './sections/CatalogSection';
import { CategoriesSection } from './sections/CategoriesSection';
import { CraftsmanshipSection } from './sections/CraftsmanshipSection';
import { NewsletterSection } from './sections/NewsletterSection';
import { ProductsSection } from './sections/ProductsSection';
import { TestimonialsSection } from './sections/TestimonialsSection';
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
  articles?: boolean;
  newsletter: boolean;
}

interface LandingViewProps {
  featuredProducts: ApiProduct[];
  featuredCategories: ApiCategory[];
  categories?: ApiCategory[];
  articles?: ArticleItem[];
  testimonials: HomeTestimonial[];
  heroSettings: HeroSettings;
  craftsmanshipSettings?: CraftsmanshipSettings;
  trustLogos: string[] | { name: string; logo_url?: string }[];
  values: HomeValue[];
  valuesSettings?: ValuesSettings;
  carouselBanners?: CarouselBannerSlide[];
  sectionVisibility?: Partial<SectionVisibility>;
}

export const LandingView: React.FC<LandingViewProps> = ({
  featuredProducts,
  featuredCategories,
  categories,
  articles,
  testimonials,
  heroSettings,
  craftsmanshipSettings,
  trustLogos,
  values,
  valuesSettings,
  carouselBanners,
  sectionVisibility,
}) => {
  // Default sections visibility
  const visibility = sectionVisibility ?? {
    hero: false,
    carousel_banners: true,
    trust: false,
    categories: true,
    craftsmanship: true,
    catalog: true,
    values: true,
    products: false,
    testimonials: true,
    articles: true,
    newsletter: true,
  };

  const activeCategories =
    categories && categories.length > 0 ? categories : featuredCategories;

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
      {visibility.craftsmanship && (
        <CraftsmanshipSection settings={craftsmanshipSettings} />
      )}
      {visibility.catalog && <CatalogSection categories={activeCategories} />}
      {visibility.values && (
        <ValuesSection
          badge={valuesSettings?.badge}
          title={valuesSettings?.title}
          values={valuesSettings?.values || values}
        />
      )}
      {visibility.products && <ProductsSection products={featuredProducts} />}
      {visibility.testimonials && (
        <TestimonialsSection testimonials={testimonials} />
      )}
      {(visibility.articles ?? true) && articles && articles.length > 0 && (
        <ArticlesSection articles={articles} />
      )}
      {visibility.newsletter && <NewsletterSection />}
    </motion.div>
  );
};

export default LandingView;
