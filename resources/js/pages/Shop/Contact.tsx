import { SEOHead } from '@/components/seo';
import { useTranslation } from '@/hooks/use-translation';
import { ShopLayout } from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import { usePage } from '@inertiajs/react';
import {
    Building2,
    Mail,
    MessageCircle,
    Phone,
    Store,
} from 'lucide-react';

export default function Contact() {
    const { t } = useTranslation();
    const { siteSettings } = usePage<{ siteSettings: SiteSettings }>().props;
    const siteName = siteSettings?.site_name || 'Ronica';

    // Build contact info from settings
    const contactInfo = [
        {
            icon: Building2,
            title: t('shop.contact.factory_address'),
            lines: siteSettings?.factory_address
                ? [siteSettings.factory_address]
                : ['Cirebon, Indonesia'],
            type: 'text',
        },
        {
            icon: Store,
            title: t('shop.contact.showroom_address'),
            lines: siteSettings?.showroom_address
                ? [siteSettings.showroom_address]
                : ['Jepara, Indonesia'],
            type: 'text',
        },
        {
            icon: Phone,
            title: t('shop.contact.info_phone'),
            lines: siteSettings?.contact_phone
                ? [siteSettings.contact_phone]
                : [t('shop.contact.phone_not_set')],
            type: 'phone',
        },
        {
            icon: Mail,
            title: t('shop.contact.info_email'),
            lines: siteSettings?.contact_email
                ? [
                    siteSettings.contact_email,
                    ...(siteSettings.contact_email_2 ? [siteSettings.contact_email_2] : []),
                ]
                : [t('shop.contact.email_not_set')],
            type: 'email',
        },
    ];

    return (
        <>
            <SEOHead
                title={t('shop.contact.title')}
                description={t('shop.contact.seo_description', { siteName })}
                keywords={[
                    'kontak',
                    'alamat toko furnitur',
                    'telepon',
                    'email',
                ]}
            />
            <div className="bg-noise" />
            <ShopLayout>
                <main className="min-h-screen bg-sand-50 pb-20">
                    {/* Hero */}
                    <div className="mb-16 bg-gradient-to-r from-teal-600 to-teal-700 py-16 text-white">
                        <div className="mx-auto max-w-[1400px] px-6 text-center md:px-12">
                            <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
                                {t('shop.contact.hero_title')}
                            </h1>
                            <p className="text-xl opacity-90">
                                {t('shop.contact.hero_subtitle')}
                            </p>
                        </div>
                    </div>

                    <div className="mx-auto max-w-[1400px] px-6 md:px-12">
                        {/* Contact Info Cards */}
                        <div className="mb-16">
                            <h2 className="mb-8 font-serif text-2xl text-terra-900">
                                {t('shop.contact.contact_info')}
                            </h2>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {contactInfo.map((info, i) => (
                                    <div
                                        key={i}
                                        className="flex flex-col justify-between rounded-xl border border-terra-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                                    >
                                        <div>
                                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                                                <info.icon size={24} />
                                            </div>
                                            <h3 className="mb-2 font-serif text-lg font-bold text-terra-900">
                                                {info.title}
                                            </h3>
                                            <div className="space-y-1 text-sm text-terra-600">
                                                {info.lines.map((line, j) => {
                                                    if (info.type === 'phone' && siteSettings?.contact_phone) {
                                                        return (
                                                            <a
                                                                key={j}
                                                                href={`tel:${line}`}
                                                                className="block text-terra-600 transition-colors hover:text-teal-700 hover:underline font-medium"
                                                            >
                                                                {line}
                                                            </a>
                                                        );
                                                    }
                                                    if (info.type === 'email' && line !== t('shop.contact.email_not_set')) {
                                                        return (
                                                            <a
                                                                key={j}
                                                                href={`mailto:${line}`}
                                                                className="block text-terra-600 transition-colors hover:text-teal-700 hover:underline font-medium"
                                                            >
                                                                {line}
                                                            </a>
                                                        );
                                                    }
                                                    return (
                                                        <p key={j} className="leading-relaxed">
                                                            {line}
                                                        </p>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick WhatsApp Banner */}
                        {siteSettings?.contact_whatsapp && (
                            <div className="mb-16 flex flex-col items-center justify-between gap-6 rounded-2xl bg-gradient-to-r from-teal-800 to-teal-700 p-8 text-white md:flex-row">
                                <div>
                                    <h3 className="mb-1 font-serif text-2xl font-bold">
                                        {t('shop.contact.quick_response_title')}
                                    </h3>
                                    <p className="text-sm opacity-90">
                                        {t('shop.contact.quick_response_desc')}
                                    </p>
                                </div>
                                <a
                                    href={`https://wa.me/${siteSettings.contact_whatsapp}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex flex-shrink-0 items-center gap-3.5 rounded-xl bg-white px-8 py-3.5 font-medium text-teal-800 shadow-sm transition-transform hover:scale-105 active:scale-95"
                                >
                                    <MessageCircle size={22} className="text-emerald-600" />
                                    <span>{t('shop.contact.chat_whatsapp')}</span>
                                </a>
                            </div>
                        )}

                        {/* Map Section - Split into 2 columns (Left: Showroom, Right: Factory) */}
                        <div>
                            <div className="mb-8">
                                <h2 className="font-serif text-2xl text-terra-900">
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
                                            <p className="mt-1 text-sm text-terra-600 leading-relaxed">
                                                {siteSettings?.showroom_address || 'Jepara, Indonesia'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="relative aspect-[16/10] min-h-[280px] w-full overflow-hidden rounded-xl border border-terra-100 bg-sand-100 shadow-inner">
                                        <iframe
                                            src={(() => {
                                                const rawUrl = siteSettings?.maps_showroom_url;
                                                const address = siteSettings?.showroom_address || 'Jepara, Indonesia';
                                                if (rawUrl && (rawUrl.includes('embed') || rawUrl.includes('output=embed'))) {
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
                                            title={`Lokasi Showroom ${siteName}`}
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
                                            <p className="mt-1 text-sm text-terra-600 leading-relaxed">
                                                {siteSettings?.factory_address || 'Cirebon, Indonesia'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="relative aspect-[16/10] min-h-[280px] w-full overflow-hidden rounded-xl border border-terra-100 bg-sand-100 shadow-inner">
                                        <iframe
                                            src={(() => {
                                                const rawUrl = siteSettings?.maps_factory_url;
                                                const address = siteSettings?.factory_address || 'Cirebon, Indonesia';
                                                if (rawUrl && (rawUrl.includes('embed') || rawUrl.includes('output=embed'))) {
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
                                            title={`Lokasi Pabrik / Factory ${siteName}`}
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
