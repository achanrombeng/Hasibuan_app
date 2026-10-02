import {
  CustomCursor,
  Footer,
  Header,
  WhatsAppButton,
} from '@/components/shop';
import { SiteSettings } from '@/types';
import { ApiCategory } from '@/types/shop';
import { router, usePage } from '@inertiajs/react';
import { ReactNode, useEffect } from 'react';
import { toast, Toaster } from 'sonner';

interface ShopLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
  showWhatsApp?: boolean;
  whatsAppMessage?: string;
  bannerVisible?: boolean;
  featuredCategories?: ApiCategory[];
}

export function ShopLayout({
  children,
  showFooter = true,
  showWhatsApp = true,
  whatsAppMessage = "Hello, I'd like to inquire about a product",
  bannerVisible = false,
  featuredCategories = [],
}: ShopLayoutProps) {
  const {
    siteSettings,
    featuredCategories: sharedCategories,
    flash,
  } = usePage<{
    siteSettings: SiteSettings;
    featuredCategories: ApiCategory[];
    flash?: any;
  }>().props;

  const whatsAppPhone = siteSettings?.contact_whatsapp || '';

  // Handle flash messages
  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
    if (flash?.info) {
      toast.info(flash.info);
    }
    if (flash?.warning) {
      toast.warning(flash.warning);
    }
  }, [flash]);

  return (
    <>
      <Toaster position="top-right" richColors />
      {/* Custom Cursor - smooth following effect like realteakfurniture.com */}
      <CustomCursor />

      <Header
        onLogoClick={() => router.visit('/shop')}
        bannerVisible={bannerVisible}
        featuredCategories={
          featuredCategories.length > 0 ? featuredCategories : sharedCategories
        }
      />

      {children}

      {showFooter && <Footer />}

      {showWhatsApp && (
        <WhatsAppButton phoneNumber={whatsAppPhone} message={whatsAppMessage} />
      )}
    </>
  );
}

export default ShopLayout;
