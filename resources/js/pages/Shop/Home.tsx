import {
  OrganizationStructuredData,
  SEOHead,
  WebsiteStructuredData,
} from '@/components/seo';
import { LandingView, PromoBanner } from '@/components/shop';
import { ShopLayout } from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import { HomePageProps } from '@/types/shop';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';

// --- Main App Component ---

export default function Home({
  featuredProducts,
  landingCategories,
  categories,
  articles,
  testimonials,
  heroSettings,
  trustLogos,
  values,
  pageSiteSettings,
  carouselBanners,
  sectionVisibility,
}: HomePageProps & { landingCategories: any; categories?: any; articles?: any; sectionVisibility?: any }) {
  const [bannerVisible, setBannerVisible] = useState(false);
  // Get shared siteSettings with contact info
  const { siteSettings } = usePage<{ siteSettings: SiteSettings }>().props;
  const siteName =
    siteSettings?.site_name || pageSiteSettings?.name || 'Ronica';

  return (
    <>
      {/* SEO Head */}
      <SEOHead
        title="Premium Quality Outdoor Furniture"
        description={
          pageSiteSettings.description ||
          `${siteName} - Premium furniture store. Discover high quality chairs, tables, loungers, and custom outdoor furniture.`
        }
        keywords={[
          'furniture',
          'outdoor furniture',
          'premium furniture',
          'lounge chair',
          'teak table',
          'sunbed',
          'patio furniture',
          'luxury furniture',
        ]}
        type="website"
      />

      {/* Structured Data */}
      <WebsiteStructuredData
        data={{
          name: pageSiteSettings.name,
          url: typeof window !== 'undefined' ? window.location.origin : '',
          searchUrl:
            typeof window !== 'undefined'
              ? `${window.location.origin}/shop/products`
              : '',
        }}
      />
      <OrganizationStructuredData
        data={{
          name: pageSiteSettings.name,
          url: typeof window !== 'undefined' ? window.location.origin : '',
          logo:
            typeof window !== 'undefined'
              ? `${window.location.origin}/images/logo.png`
              : '',
          description: pageSiteSettings.description,
          email: siteSettings?.contact_email || pageSiteSettings.email || '',
          phone: siteSettings?.contact_phone || pageSiteSettings.phone || '',
          address: {
            street: siteSettings?.address || pageSiteSettings.address || '',
            city: 'Jepara',
            region: 'Jawa Tengah',
            postalCode: '59411',
            country: 'ID',
          },
          socialMedia: [
            siteSettings?.facebook_url,
            siteSettings?.instagram_url,
            siteSettings?.tiktok_url,
          ].filter(Boolean) as string[],
        }}
      />

      {/* Promo Banner */}
      <PromoBanner
        type="banner"
        storageKey="home_promo_banner"
        onVisibilityChange={setBannerVisible}
      />

      {/* Noise Overlay */}
      <div className="bg-noise" />

      <ShopLayout
        showFooter={true}
        showWhatsApp={true}
        whatsAppMessage={`Halo, saya tertarik dengan produk di ${siteSettings?.site_name || pageSiteSettings.name}`}
        bannerVisible={bannerVisible}
      >
        <main className="min-h-screen bg-white">
          <LandingView
            featuredProducts={featuredProducts.data}
            featuredCategories={landingCategories.data}
            categories={categories?.data || categories || landingCategories?.data}
            articles={articles?.data || articles}
            testimonials={testimonials}
            heroSettings={heroSettings}
            trustLogos={trustLogos}
            values={values}
            carouselBanners={carouselBanners}
            sectionVisibility={sectionVisibility}
          />{' '}
        </main>
      </ShopLayout>

      {/* Promo Popup - shows after 5 seconds */}
      <PromoBanner
        type="popup"
        storageKey="home_promo_popup"
        delayPopup={5000}
      />
    </>
  );
}
