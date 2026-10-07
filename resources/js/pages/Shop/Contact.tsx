import { SEOHead } from '@/components/seo';
import { useTranslation } from '@/hooks/use-translation';
import { ShopLayout } from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import { usePage } from '@inertiajs/react';
import { Building2, Mail, Phone, Store, User, UserCheck } from 'lucide-react';

export default function Contact() {
  const { t } = useTranslation();
  const { siteSettings } = usePage<{ siteSettings: SiteSettings }>().props;
  const siteName = siteSettings?.site_name || 'hasibuan_app';

  const marketing1Name =
    siteSettings?.marketing_1_name || siteSettings?.admin_1_name;
  const marketing2Name =
    siteSettings?.marketing_2_name || siteSettings?.admin_2_name;
  const marketing1Email =
    siteSettings?.marketing_1_email ||
    siteSettings?.admin_1_email ||
    siteSettings?.contact_email;
  const marketing2Email =
    siteSettings?.marketing_2_email ||
    siteSettings?.admin_2_email ||
    siteSettings?.contact_email_2;
  const marketing1Phone =
    siteSettings?.marketing_1_phone ||
    siteSettings?.admin_1_phone ||
    siteSettings?.contact_phone ||
    siteSettings?.contact_whatsapp;
  const marketing2Phone =
    siteSettings?.marketing_2_phone || siteSettings?.admin_2_phone;

  // Build Admin 1 & Admin 2 contact cards
  const adminCards = [
    {
      role: 'Client Concierge I',
      name: marketing1Name || 'Client Advisor',
      phone: marketing1Phone,
      email: marketing1Email,
      icon: User,
      badge: 'Primary Liaison',
    },
    {
      role: 'Client Concierge II',
      name: marketing2Name || 'Trade Specialist',
      phone: marketing2Phone,
      email: marketing2Email,
      icon: UserCheck,
      badge: 'Contract Advisor',
    },
  ];

  return (
    <>
      <SEOHead
        title={t('shop.contact.title')}
        description={t('shop.contact.seo_description', { siteName })}
        keywords={['contact', 'furniture showroom', 'phone', 'email', 'private consultation']}
      />
      <div className="bg-noise" />
      <ShopLayout>
        <main className="min-h-screen bg-white pb-24">
          {/* Monumental Editorial Header - Black Luxury Banner */}
          <div className="border-b border-neutral-900 bg-neutral-950 py-16 md:py-24 px-6 text-white">
            <div className="mx-auto max-w-[1720px] text-center space-y-3">
              <span className="text-[10px] md:text-xs tracking-[0.35em] uppercase font-light text-neutral-400">
                CLIENT SERVICES & GALLERIES
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-[0.06em] text-white uppercase">
                {t('shop.contact.hero_title') || 'CONNECT WITH OUR ATELIER'}
              </h1>
              <div className="w-12 h-[1px] bg-neutral-700 mx-auto mt-4" />
              <p className="mx-auto max-w-2xl text-xs md:text-sm font-light text-neutral-300 tracking-wide pt-2">
                {t('shop.contact.hero_subtitle') || 'Private gallery appointments, custom material advisory, and international freight coordination.'}
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-[1720px] px-6 sm:px-12 py-16 md:py-24 space-y-20">
            {/* Section 1: Executive Concierge Liaisons */}
            <div>
              <div className="mb-10 text-center max-w-xl mx-auto space-y-2">
                <span className="text-[10px] tracking-[0.3em] uppercase font-light text-neutral-400">
                  DIRECT CONTACT
                </span>
                <h2 className="font-serif text-2xl md:text-3xl font-light tracking-[0.05em] text-neutral-900 uppercase">
                  {t('shop.contact.contact_info')}
                </h2>
              </div>

              <div className="grid gap-8 sm:grid-cols-2 max-w-5xl mx-auto">
                {adminCards.map((admin, i) => (
                  <div
                    key={i}
                    className="border border-neutral-200/80 bg-[#fafaf9] p-8 md:p-10 space-y-6 transition-all hover:border-neutral-400"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] tracking-[0.25em] uppercase font-light text-neutral-400 block">
                          {admin.role}
                        </span>
                        <h3 className="font-serif text-2xl font-light tracking-[0.04em] uppercase text-neutral-900">
                          {admin.name}
                        </h3>
                      </div>
                      <span className="border border-neutral-200 bg-white px-2.5 py-1 text-[9px] tracking-[0.15em] uppercase text-neutral-600 font-medium">
                        {admin.badge}
                      </span>
                    </div>

                    <div className="space-y-4 border-t border-neutral-200/80 pt-6">
                      {/* Phone */}
                      {admin.phone ? (
                        <div className="flex items-center gap-3 text-xs">
                          <Phone size={14} className="text-neutral-400" />
                          <div>
                            <span className="block text-[9px] tracking-[0.2em] uppercase font-medium text-neutral-400">
                              {t('shop.contact.info_phone')}
                            </span>
                            <a
                              href={`tel:${admin.phone}`}
                              className="font-light tracking-wider text-neutral-900 hover:underline underline-offset-4"
                            >
                              {admin.phone}
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 text-xs text-neutral-400">
                          <Phone size={14} />
                          <div>
                            <span className="block text-[9px] tracking-[0.2em] uppercase font-medium text-neutral-400">
                              {t('shop.contact.info_phone')}
                            </span>
                            <span className="italic font-light">
                              {t('shop.contact.phone_not_set')}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Email */}
                      {admin.email ? (
                        <div className="flex items-center gap-3 text-xs">
                          <Mail size={14} className="text-neutral-400" />
                          <div className="min-w-0 flex-1 truncate">
                            <span className="block text-[9px] tracking-[0.2em] uppercase font-medium text-neutral-400">
                              {t('shop.contact.info_email')}
                            </span>
                            <a
                              href={`mailto:${admin.email}`}
                              className="block truncate font-light tracking-wider text-neutral-900 hover:underline underline-offset-4"
                            >
                              {admin.email}
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 text-xs text-neutral-400">
                          <Mail size={14} />
                          <div>
                            <span className="block text-[9px] tracking-[0.2em] uppercase font-medium text-neutral-400">
                              {t('shop.contact.info_email')}
                            </span>
                            <span className="italic font-light">
                              {t('shop.contact.email_not_set')}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Showroom & Factory Gallery Locations */}
            <div>
              <div className="mb-10 text-center max-w-xl mx-auto space-y-2">
                <span className="text-[10px] tracking-[0.3em] uppercase font-light text-neutral-400">
                  GEOGRAPHIC PRESENCE
                </span>
                <h2 className="font-serif text-2xl md:text-3xl font-light tracking-[0.05em] text-neutral-900 uppercase">
                  {t('shop.contact.our_location')}
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                {/* Left: Showroom Map Card */}
                <div className="flex flex-col border border-neutral-200/80 bg-white p-8 md:p-10 space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Store size={18} className="text-neutral-700" />
                        <span className="text-[10px] tracking-[0.25em] uppercase font-light text-neutral-500">
                          {t('shop.contact.showroom_address')}
                        </span>
                      </div>
                      <h3 className="font-serif text-2xl font-light tracking-[0.04em] uppercase text-neutral-900">
                        {siteSettings?.showroom_name || 'GALLERY SHOWROOM'}
                      </h3>
                      <p className="text-xs text-neutral-500 font-light leading-relaxed pt-1">
                        {siteSettings?.showroom_address || 'Jepara, Central Java, Indonesia'}
                      </p>
                    </div>
                  </div>

                  <div className="relative aspect-[16/10] min-h-[300px] w-full overflow-hidden border border-neutral-200/80 bg-neutral-100">
                    <iframe
                      src={(() => {
                        const rawUrl = siteSettings?.maps_showroom_url;
                        const address =
                          siteSettings?.showroom_address || 'Jepara, Indonesia';
                        if (
                          rawUrl &&
                          (rawUrl.includes('embed') ||
                            rawUrl.includes('output=embed'))
                        ) {
                          return rawUrl;
                        }
                        return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
                      })()}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`${siteName} Showroom Location`}
                    />
                  </div>
                </div>

                {/* Right: Factory Map Card */}
                <div className="flex flex-col border border-neutral-200/80 bg-white p-8 md:p-10 space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Building2 size={18} className="text-neutral-700" />
                        <span className="text-[10px] tracking-[0.25em] uppercase font-light text-neutral-500">
                          {t('shop.contact.factory_address')}
                        </span>
                      </div>
                      <h3 className="font-serif text-2xl font-light tracking-[0.04em] uppercase text-neutral-900">
                        {siteSettings?.factory_name || 'MANUFACTURING ATELIER'}
                      </h3>
                      <p className="text-xs text-neutral-500 font-light leading-relaxed pt-1">
                        {siteSettings?.factory_address || 'Cirebon, West Java, Indonesia'}
                      </p>
                    </div>
                  </div>

                  <div className="relative aspect-[16/10] min-h-[300px] w-full overflow-hidden border border-neutral-200/80 bg-neutral-100">
                    <iframe
                      src={(() => {
                        const rawUrl = siteSettings?.maps_factory_url;
                        const address =
                          siteSettings?.factory_address || 'Cirebon, Indonesia';
                        if (
                          rawUrl &&
                          (rawUrl.includes('embed') ||
                            rawUrl.includes('output=embed'))
                        ) {
                          return rawUrl;
                        }
                        return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
                      })()}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`${siteName} Factory Location`}
                    />
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
