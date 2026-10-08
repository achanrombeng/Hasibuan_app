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

  const showAdmin2 = siteSettings?.show_admin_2 !== false;

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
    ...(showAdmin2
      ? [
          {
            role: 'Client Concierge II',
            name: marketing2Name || 'Trade Specialist',
            phone: marketing2Phone,
            email: marketing2Email,
            icon: UserCheck,
            badge: 'Contract Advisor',
          },
        ]
      : []),
  ];

  const locationMode = siteSettings?.location_display_mode ?? 'both';
  const showShowroom =
    siteSettings?.show_showroom !== undefined
      ? Boolean(siteSettings.show_showroom)
      : locationMode !== 'factory';
  const showFactory =
    siteSettings?.show_factory !== undefined
      ? Boolean(siteSettings.show_factory)
      : locationMode !== 'showroom';
  const hasAnyLocation = showShowroom || showFactory;
  const isSingleLocation =
    (showShowroom && !showFactory) || (!showShowroom && showFactory);

  return (
    <>
      <SEOHead
        title={t('shop.contact.title')}
        description={t('shop.contact.seo_description', { siteName })}
        keywords={[
          'contact',
          'furniture showroom',
          'phone',
          'email',
          'private consultation',
        ]}
      />
      <div className="bg-noise" />
      <ShopLayout>
        <main className="min-h-screen bg-white pb-24">
          {/* Monumental Editorial Header - Black Luxury Banner */}
          <div className="border-b border-neutral-900 bg-neutral-950 px-6 py-16 text-white md:py-24">
            <div className="mx-auto max-w-[1720px] space-y-3 text-center">
              <span className="text-[10px] font-light tracking-[0.35em] text-neutral-400 uppercase md:text-xs">
                CLIENT SERVICES & GALLERIES
              </span>
              <h1 className="font-serif text-3xl font-light tracking-[0.06em] text-white uppercase sm:text-4xl md:text-5xl">
                {t('shop.contact.hero_title') || 'CONNECT WITH OUR ATELIER'}
              </h1>
              <div className="mx-auto mt-4 h-[1px] w-12 bg-neutral-700" />
              <p className="mx-auto max-w-2xl pt-2 text-xs font-light tracking-wide text-neutral-300 md:text-sm">
                {t('shop.contact.hero_subtitle') ||
                  'Private gallery appointments, custom material advisory, and international freight coordination.'}
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-[1720px] space-y-20 px-6 py-16 sm:px-12 md:py-24">
            {/* Section 1: Executive Concierge Liaisons */}
            <div>
              <div className="mx-auto mb-10 max-w-xl space-y-2 text-center">
                <span className="text-[10px] font-light tracking-[0.3em] text-neutral-400 uppercase">
                  DIRECT CONTACT
                </span>
                <h2 className="font-serif text-2xl font-light tracking-[0.05em] text-neutral-900 uppercase md:text-3xl">
                  {t('shop.contact.contact_info')}
                </h2>
              </div>

              <div
                className={`grid gap-8 ${
                  adminCards.length > 1
                    ? 'max-w-5xl sm:grid-cols-2'
                    : 'max-w-xl'
                } mx-auto`}
              >
                {adminCards.map((admin, i) => (
                  <div
                    key={i}
                    className="space-y-6 border border-neutral-200/80 bg-[#fafaf9] p-8 transition-all hover:border-neutral-400 md:p-10"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="block text-[10px] font-light tracking-[0.25em] text-neutral-400 uppercase">
                          {admin.role}
                        </span>
                        <h3 className="font-serif text-2xl font-light tracking-[0.04em] text-neutral-900 uppercase">
                          {admin.name}
                        </h3>
                      </div>
                      <span className="border border-neutral-200 bg-white px-2.5 py-1 text-[9px] font-medium tracking-[0.15em] text-neutral-600 uppercase">
                        {admin.badge}
                      </span>
                    </div>

                    <div className="space-y-4 border-t border-neutral-200/80 pt-6">
                      {/* Phone */}
                      {admin.phone ? (
                        <div className="flex items-center gap-3 text-xs">
                          <Phone size={14} className="text-neutral-400" />
                          <div>
                            <span className="block text-[9px] font-medium tracking-[0.2em] text-neutral-400 uppercase">
                              {t('shop.contact.info_phone')}
                            </span>
                            <a
                              href={`tel:${admin.phone}`}
                              className="font-light tracking-wider text-neutral-900 underline-offset-4 hover:underline"
                            >
                              {admin.phone}
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 text-xs text-neutral-400">
                          <Phone size={14} />
                          <div>
                            <span className="block text-[9px] font-medium tracking-[0.2em] text-neutral-400 uppercase">
                              {t('shop.contact.info_phone')}
                            </span>
                            <span className="font-light italic">
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
                            <span className="block text-[9px] font-medium tracking-[0.2em] text-neutral-400 uppercase">
                              {t('shop.contact.info_email')}
                            </span>
                            <a
                              href={`mailto:${admin.email}`}
                              className="block truncate font-light tracking-wider text-neutral-900 underline-offset-4 hover:underline"
                            >
                              {admin.email}
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 text-xs text-neutral-400">
                          <Mail size={14} />
                          <div>
                            <span className="block text-[9px] font-medium tracking-[0.2em] text-neutral-400 uppercase">
                              {t('shop.contact.info_email')}
                            </span>
                            <span className="font-light italic">
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
            {hasAnyLocation && (
              <div>
                <div className="mx-auto mb-10 max-w-xl space-y-2 text-center">
                  <span className="text-[10px] font-light tracking-[0.3em] text-neutral-400 uppercase">
                    GEOGRAPHIC PRESENCE
                  </span>
                  <h2 className="font-serif text-2xl font-light tracking-[0.05em] text-neutral-900 uppercase md:text-3xl">
                    {t('shop.contact.our_location')}
                  </h2>
                </div>

                <div
                  className={
                    isSingleLocation
                      ? 'mx-auto max-w-3xl'
                      : 'grid grid-cols-1 gap-10 lg:grid-cols-2'
                  }
                >
                  {/* Left: Showroom Map Card */}
                  {showShowroom && (
                    <div className="flex flex-col space-y-6 border border-neutral-200/80 bg-white p-8 md:p-10">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Store size={18} className="text-neutral-700" />
                            <span className="text-[10px] font-light tracking-[0.25em] text-neutral-500 uppercase">
                              {t('shop.contact.showroom_address')}
                            </span>
                          </div>
                          <h3 className="font-serif text-2xl font-light tracking-[0.04em] text-neutral-900 uppercase">
                            {siteSettings?.showroom_name || 'GALLERY SHOWROOM'}
                          </h3>
                          <p className="pt-1 text-xs leading-relaxed font-light text-neutral-500">
                            {siteSettings?.showroom_address ||
                              'Jepara, Central Java, Indonesia'}
                          </p>
                        </div>
                      </div>

                      <div className="relative aspect-[16/10] min-h-[300px] w-full overflow-hidden border border-neutral-200/80 bg-neutral-100">
                        <iframe
                          src={(() => {
                            const rawUrl = siteSettings?.maps_showroom_url;
                            const address =
                              siteSettings?.showroom_address ||
                              'Jepara, Indonesia';
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
                  )}

                  {/* Right: Factory Map Card */}
                  {showFactory && (
                    <div className="flex flex-col space-y-6 border border-neutral-200/80 bg-white p-8 md:p-10">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Building2 size={18} className="text-neutral-700" />
                            <span className="text-[10px] font-light tracking-[0.25em] text-neutral-500 uppercase">
                              {t('shop.contact.factory_address')}
                            </span>
                          </div>
                          <h3 className="font-serif text-2xl font-light tracking-[0.04em] text-neutral-900 uppercase">
                            {siteSettings?.factory_name ||
                              'MANUFACTURING ATELIER'}
                          </h3>
                          <p className="pt-1 text-xs leading-relaxed font-light text-neutral-500">
                            {siteSettings?.factory_address ||
                              'Cirebon, West Java, Indonesia'}
                          </p>
                        </div>
                      </div>

                      <div className="relative aspect-[16/10] min-h-[300px] w-full overflow-hidden border border-neutral-200/80 bg-neutral-100">
                        <iframe
                          src={(() => {
                            const rawUrl = siteSettings?.maps_factory_url;
                            const address =
                              siteSettings?.factory_address ||
                              'Cirebon, Indonesia';
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
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </ShopLayout>
    </>
  );
}
