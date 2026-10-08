import {
  CustomCursor,
  Footer,
  Header,
  WhatsAppButton,
} from '@/components/shop';
import { SiteSettings } from '@/types';
import { ApiCategory } from '@/types/shop';
import { router, usePage } from '@inertiajs/react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ReactNode, useEffect } from 'react';
import { toast, Toaster } from 'sonner';

interface ShopLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
  showNewsletter?: boolean;
  showWhatsApp?: boolean;
  whatsAppMessage?: string;
  bannerVisible?: boolean;
  featuredCategories?: ApiCategory[];
}

export function ShopLayout({
  children,
  showFooter = true,
  showNewsletter = true,
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

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

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

      {/* Top Architectural Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-neutral-900 dark:bg-white z-[100] origin-left pointer-events-none"
        style={{ scaleX }}
      />

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

      {showFooter && <Footer showNewsletter={showNewsletter} />}

      {showWhatsApp && (
        <WhatsAppButton phoneNumber={whatsAppPhone} message={whatsAppMessage} />
      )}
    </>
  );
}

export default ShopLayout;
