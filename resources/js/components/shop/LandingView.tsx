import { CatalogModal } from '@/components/shop/CatalogModal';
import { SiteSettings } from '@/types';
import {
  ApiCategory,
  ApiProduct,
  CraftsmanshipSettings,
  HeroSettings,
  HomeTestimonial,
  HomeValue,
  ValuesSettings,
  SectionBackgroundsMap,
} from '@/types/shop';
import { usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { ArticleItem } from './sections/ArticlesSection';
import { RHArticlesSection } from './sections/RHArticlesSection';
import { RHCraftsmanshipSection } from './sections/RHCraftsmanshipSection';
import { RHGallerySection } from './sections/RHGallerySection';
import { RHHeroSection } from './sections/RHHeroSection';
import { RHInteriorDesignSection } from './sections/RHInteriorDesignSection';
import { RHManifestoSection } from './sections/RHManifestoSection';
import { RHPressSection } from './sections/RHPressSection';
import { RHProductShowcase } from './sections/RHProductShowcase';
import { RHTrustSection } from './sections/RHTrustSection';
import { RHValuesSection } from './sections/RHValuesSection';

interface SectionVisibility {
  hero?: boolean;
  carousel_banners?: boolean;
  trust?: boolean;
  categories?: boolean;
  craftsmanship?: boolean;
  catalog?: boolean;
  values?: boolean;
  products?: boolean;
  testimonials?: boolean;
  articles?: boolean;
  manifesto?: boolean;
  interior_design?: boolean;
  newsletter?: boolean;
}

interface LandingViewProps {
  featuredProducts?: ApiProduct[];
  featuredCategories?: ApiCategory[];
  categories?: ApiCategory[];
  articles?: ArticleItem[];
  testimonials?: HomeTestimonial[];
  heroSettings?: HeroSettings;
  craftsmanshipSettings?: CraftsmanshipSettings;
  trustLogos?: (string | { name: string; logo_url?: string })[];
  values?: HomeValue[];
  valuesSettings?: ValuesSettings;
  carouselBanners?: any[];
  sectionVisibility?: Partial<SectionVisibility>;
  sectionBackgrounds?: SectionBackgroundsMap;
}

export const LandingView: React.FC<LandingViewProps> = ({
  featuredProducts = [],
  featuredCategories = [],
  categories = [],
  articles = [],
  testimonials = [],
  heroSettings,
  craftsmanshipSettings,
  trustLogos = [],
  values = [],
  valuesSettings,
  carouselBanners = [],
  sectionVisibility,
  sectionBackgrounds,
}) => {
  const [catalogModalOpen, setCatalogModalOpen] = useState(false);
  const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;

  // Defaults synced with Admin Settings
  const visibility: SectionVisibility = {
    hero: sectionVisibility?.hero ?? true,
    carousel_banners: sectionVisibility?.carousel_banners ?? true,
    trust: sectionVisibility?.trust ?? true,
    categories: sectionVisibility?.categories ?? true,
    craftsmanship: sectionVisibility?.craftsmanship ?? true,
    catalog: sectionVisibility?.catalog ?? true,
    values: sectionVisibility?.values ?? true,
    products: sectionVisibility?.products ?? true,
    testimonials: sectionVisibility?.testimonials ?? true,
    articles: sectionVisibility?.articles ?? true,
    manifesto: sectionVisibility?.manifesto ?? true,
    interior_design: sectionVisibility?.interior_design ?? true,
    newsletter: sectionVisibility?.newsletter ?? true,
  };

  const activeCategories =
    categories && categories.length > 0 ? categories : featuredCategories;

  const showHero =
    visibility.hero ||
    (visibility.carousel_banners && carouselBanners && carouselBanners.length > 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="overflow-hidden bg-[#fcfcfb]"
    >
      {/* 1. Hasibuan Monumental Lookbook Hero (Sync with Admin Carousel Banners & Hero Settings) */}
      {showHero && (
        <RHHeroSection
          banners={visibility.carousel_banners ? carouselBanners : []}
          heroSettings={visibility.hero ? heroSettings : undefined}
          onOpenCatalog={() => setCatalogModalOpen(true)}
          bgConfig={sectionBackgrounds?.['hero']}
        />
      )}

      {/* 2. Media / Press Trust Logos (Sync with Admin Trust Logos) */}
      {visibility.trust && trustLogos && trustLogos.length > 0 && (
        <RHTrustSection
          logos={trustLogos}
          bgConfig={sectionBackgrounds?.['trust']}
        />
      )}

      {/* 3. Vitruvian Architectural Gallery (Sync with Admin Categories) */}
      {visibility.categories && (
        <RHGallerySection
          categories={activeCategories}
          bgConfig={sectionBackgrounds?.['categories']}
        />
      )}

      {/* 4. Museum Product Collection Showcase (Sync with Admin Products) */}
      {visibility.products && (
        <RHProductShowcase
          products={featuredProducts}
          bgConfig={sectionBackgrounds?.['products']}
        />
      )}

      {/* 5. Vitruvian Architectural Manifesto / Philosophy */}
      {visibility.manifesto && (
        <RHManifestoSection bgConfig={sectionBackgrounds?.['manifesto']} />
      )}

      {/* 6. Vitruvian Core Values (Sync with Admin Home Values & Philosophy) */}
      {visibility.values && (
        <RHValuesSection
          badge={valuesSettings?.badge || 'OUR PHILOSOPHY'}
          title={valuesSettings?.title || 'VITRUVIAN VALUES & COMMITMENTS'}
          values={valuesSettings?.values || values}
          bgConfig={sectionBackgrounds?.['values']}
        />
      )}

      {/* 7. Hasibuan Interior Design Studio & Atelier Consultation */}
      {visibility.interior_design && (
        <RHInteriorDesignSection bgConfig={sectionBackgrounds?.['interior_design']} />
      )}

      {/* 8. Material Provenance & Master Craftsmanship (Sync with Admin Craftsmanship Settings) */}
      {visibility.craftsmanship && (
        <RHCraftsmanshipSection
          settings={craftsmanshipSettings}
          bgConfig={sectionBackgrounds?.['craftsmanship']}
        />
      )}

      {/* 9. Press Accolades & Testimonials (Sync with Admin Testimonials) */}
      {visibility.testimonials && (
        <RHPressSection
          testimonials={testimonials}
          bgConfig={sectionBackgrounds?.['testimonials']}
        />
      )}

      {/* 10. Architectural Journal Essays (Sync with Admin Articles) */}
      {visibility.articles && articles && articles.length > 0 && (
        <RHArticlesSection
          articles={articles}
          bgConfig={sectionBackgrounds?.['articles']}
        />
      )}

      {/* Interactive 3D Flipbook Modal */}
      {visibility.catalog && (
        <CatalogModal
          isOpen={catalogModalOpen}
          onClose={() => setCatalogModalOpen(false)}
          title={siteSettings?.catalog_title || 'Ronica Product Catalogue 2026'}
          pdfUrl={siteSettings?.catalog_pdf_url || '/catalogs/ronica-catalog-2026.pdf'}
          initialMode="3d"
        />
      )}
    </motion.div>
  );
};

export default LandingView;
