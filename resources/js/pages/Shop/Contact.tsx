import { SEOHead } from '@/components/seo';
import { useTranslation } from '@/hooks/use-translation';
import { ShopLayout } from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import { usePage } from '@inertiajs/react';
import { Building2, Mail, Phone, Store, User, UserCheck } from 'lucide-react';

export default function Contact() {
  const { t } = useTranslation();
  const { siteSettings } = usePage<{ siteSettings: SiteSettings }>().props;
  const siteName = siteSettings?.site_name || 'Ronica';

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
      role: 'Marketing 1',
      name: marketing1Name || 'Marketing 1',
      phone: marketing1Phone,
      email: marketing1Email,
      icon: User,
      badge: 'Primary',
    },
    {
      role: 'Marketing 2',
      name: marketing2Name || 'Marketing 2',
      phone: marketing2Phone,
      email: marketing2Email,
      icon: UserCheck,
      badge: 'Alternative',
    },
  ];

  return (
    <>
      <SEOHead
        title={t('shop.contact.title')}
        description={t('shop.contact.seo_description', { siteName })}
        keywords={['contact', 'furniture showroom', 'phone', 'email']}
      />
      <div className="bg-noise" />
      <ShopLayout>
        <main className="min-h-screen bg-sand-50 pb-16">
          {/* Hero */}
          <div className="mb-10 bg-gradient-to-r from-teal-600 to-teal-700 py-12 text-white">
            <div className="mx-auto max-w-[1400px] px-6 text-center md:px-12">
              <h1 className="mb-3 font-serif text-4xl font-bold md:text-5xl">
                {t('shop.contact.hero_title')}
              </h1>
              <p className="text-lg opacity-90">
                {t('shop.contact.hero_subtitle')}
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-[1400px] px-6 md:px-12">
            {/* Admin 1 & Admin 2 Contact Cards */}
            <div className="mb-12">
              <h2 className="mb-6 font-serif text-2xl font-bold text-terra-900">
                {t('shop.contact.contact_info')}
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {adminCards.map((admin, i) => (
                  <div
                    key={i}
                    className="flex flex-col justify-between rounded-2xl border border-terra-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                  >
                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3.5">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                            <admin.icon size={24} />
                          </div>
                          <div>
                            <span className="text-xs font-semibold tracking-wider text-teal-700 uppercase">
                              {admin.role}
                            </span>
                            <h3 className="font-serif text-xl font-bold text-terra-900">
                              {admin.name}
                            </h3>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 border-t border-terra-100/70 pt-3">
                        {admin.phone ? (
                          <div className="flex items-center gap-3 text-sm text-terra-600">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-sand-100 text-teal-700">
                              <Phone size={15} />
                            </div>
                            <div>
                              <span className="block text-[11px] font-medium tracking-wider text-terra-500 uppercase">
                                {t('shop.contact.info_phone')}
                              </span>
                              <a
                                href={`tel:${admin.phone}`}
                                className="font-medium text-terra-800 transition-colors hover:text-teal-700 hover:underline"
                              >
                                {admin.phone}
                              </a>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 text-sm text-terra-400">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-sand-100 text-terra-400">
                              <Phone size={15} />
                            </div>
                            <div>
                              <span className="block text-[11px] font-medium tracking-wider text-terra-400 uppercase">
                                {t('shop.contact.info_phone')}
                              </span>
                              <span className="italic">
                                {t('shop.contact.phone_not_set')}
                              </span>
                            </div>
                          </div>
                        )}

                        {admin.email ? (
                          <div className="flex items-center gap-3 text-sm text-terra-600">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-sand-100 text-teal-700">
                              <Mail size={15} />
                            </div>
                            <div className="min-w-0 flex-1 truncate">
                              <span className="block text-[11px] font-medium tracking-wider text-terra-500 uppercase">
                                {t('shop.contact.info_email')}
                              </span>
                              <a
                                href={`mailto:${admin.email}`}
                                className="block truncate font-medium text-terra-800 transition-colors hover:text-teal-700 hover:underline"
                              >
                                {admin.email}
                              </a>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 text-sm text-terra-400">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-sand-100 text-terra-400">
                              <Mail size={15} />
                            </div>
                            <div>
                              <span className="block text-[11px] font-medium tracking-wider text-terra-400 uppercase">
                                {t('shop.contact.info_email')}
                              </span>
                              <span className="italic">
                                {t('shop.contact.email_not_set')}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Section - Split into 2 columns (Left: Showroom, Right: Factory) */}
            <div>
              <div className="mb-6">
                <h2 className="font-serif text-2xl font-bold text-terra-900">
                  {t('shop.contact.our_location')}
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Left: Showroom Map */}
                <div className="flex flex-col overflow-hidden rounded-2xl border border-terra-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                  <div className="mb-4 flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                      <Store size={24} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-xl font-bold text-terra-900">
                          {siteSettings?.showroom_name || 'Showroom'}
                        </h3>
                        <span className="rounded-full bg-sand-100 px-2.5 py-0.5 text-xs font-medium text-terra-700">
                          {t('shop.contact.showroom_address')}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-terra-600">
                        {siteSettings?.showroom_address || 'Jepara, Indonesia'}
                      </p>
                    </div>
                  </div>

                  <div className="relative aspect-[16/10] min-h-[280px] w-full overflow-hidden rounded-xl border border-terra-100 bg-sand-100 shadow-inner">
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
                    ></iframe>
                  </div>
                </div>

                {/* Right: Factory Map */}
                <div className="flex flex-col overflow-hidden rounded-2xl border border-terra-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                  <div className="mb-4 flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                      <Building2 size={24} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-xl font-bold text-terra-900">
                          {siteSettings?.factory_name || 'Factory'}
                        </h3>
                        <span className="rounded-full bg-sand-100 px-2.5 py-0.5 text-xs font-medium text-terra-700">
                          {t('shop.contact.factory_address')}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-terra-600">
                        {siteSettings?.factory_address || 'Cirebon, Indonesia'}
                      </p>
                    </div>
                  </div>

                  <div className="relative aspect-[16/10] min-h-[280px] w-full overflow-hidden rounded-xl border border-terra-100 bg-sand-100 shadow-inner">
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
                    ></iframe>
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
