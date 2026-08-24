import {
    about,
    contact,
    faq,
    home,
    privacy,
    terms,
} from '@/routes/shop';
import { hotSale, index as productsIndex } from '@/routes/shop/products';
import { useTranslation } from '@/hooks/use-translation';
import { SiteSettings } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Building2,
    Facebook,
    Instagram,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Store,
    Youtube,
} from 'lucide-react';

function TikTokIcon({ className = 'h-4 w-4' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
        </svg>
    );
}

interface CustomLinkItem {
    label: string;
    url: string;
}

export const Footer = () => {
    const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
    const { t } = useTranslation();
    const siteName = siteSettings?.site_name || 'Ronica';
    const siteLogo = siteSettings?.site_logo || '/ronica.png';
    const description =
        siteSettings?.footer_description ||
        siteSettings?.site_description ||
        t('shop.footer.description');
    const currentYear = new Date().getFullYear();

    const whatsappNumber = siteSettings?.contact_whatsapp
        ? siteSettings.contact_whatsapp.replace(/[^0-9]/g, '')
        : '';

    // Parse dynamic column links if configured
    const col1Links: CustomLinkItem[] = (() => {
        if (!siteSettings?.footer_col1_links) return [];
        try {
            const parsed = JSON.parse(siteSettings.footer_col1_links);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    })();

    const col2Links: CustomLinkItem[] = (() => {
        if (!siteSettings?.footer_col2_links) return [];
        try {
            const parsed = JSON.parse(siteSettings.footer_col2_links);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    })();

    const col1Title = siteSettings?.footer_col1_title || t('shop.footer.shop');
    const col2Title = siteSettings?.footer_col2_title || t('shop.footer.company');
    const contactTitle = siteSettings?.footer_contact_title || 'Informasi Kontak';

    const showSocials = siteSettings?.footer_show_socials !== false;
    const showFactory = siteSettings?.footer_show_factory !== false;
    const showShowroom = siteSettings?.footer_show_showroom !== false;
    const showPhone = siteSettings?.footer_show_phone !== false;
    const showWhatsapp = siteSettings?.footer_show_whatsapp !== false;
    const showEmail = siteSettings?.footer_show_email !== false;

    const privacyUrl = siteSettings?.footer_privacy_url || privacy.url();
    const termsUrl = siteSettings?.footer_terms_url || terms.url();

    const copyrightText = siteSettings?.footer_copyright || (
        <>
            &copy; {currentYear} {siteName}.{' '}
            {t('shop.footer.all_rights_reserved')}
        </>
    );

    return (
        <footer className="relative overflow-hidden bg-[#EBEBEB] py-16 text-neutral-800">
            <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12">
                <div className="grid grid-cols-1 gap-10 border-b border-neutral-300 pb-12 md:grid-cols-12">
                    {/* 1. Informasi Toko & Media Sosial */}
                    <div className="space-y-5 md:col-span-4">
                        <Link href={home.url()} className="inline-block">
                            <img
                                src={siteLogo}
                                alt={siteName}
                                className="h-10 w-auto object-contain"
                            />
                        </Link>
                        <p className="max-w-sm text-sm leading-relaxed text-neutral-600">
                            {description}
                        </p>

                        {/* Media Sosial */}
                        {showSocials && (siteSettings?.facebook_url ||
                            siteSettings?.instagram_url ||
                            siteSettings?.tiktok_url ||
                            siteSettings?.youtube_url) && (
                            <div className="pt-2">
                                <h5 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                    Media Sosial
                                </h5>
                                <div className="flex items-center gap-3">
                                    {siteSettings?.facebook_url && (
                                        <a
                                            href={siteSettings.facebook_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-200/80 text-neutral-700 transition-all hover:bg-teal-600 hover:text-white"
                                            title="Facebook"
                                        >
                                            <Facebook className="h-4 w-4" />
                                        </a>
                                    )}
                                    {siteSettings?.instagram_url && (
                                        <a
                                            href={siteSettings.instagram_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-200/80 text-neutral-700 transition-all hover:bg-teal-600 hover:text-white"
                                            title="Instagram"
                                        >
                                            <Instagram className="h-4 w-4" />
                                        </a>
                                    )}
                                    {siteSettings?.tiktok_url && (
                                        <a
                                            href={siteSettings.tiktok_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-200/80 text-neutral-700 transition-all hover:bg-teal-600 hover:text-white"
                                            title="TikTok"
                                        >
                                            <TikTokIcon className="h-4 w-4" />
                                        </a>
                                    )}
                                    {siteSettings?.youtube_url && (
                                        <a
                                            href={siteSettings.youtube_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-200/80 text-neutral-700 transition-all hover:bg-red-600 hover:text-white"
                                            title="YouTube"
                                        >
                                            <Youtube className="h-4 w-4" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 2. Navigasi Kolom 1 (Shop) */}
                    <div className="md:col-span-2">
                        <h4 className="mb-5 font-semibold tracking-wide text-neutral-900">
                            {col1Title}
                        </h4>
                        <ul className="space-y-3 text-sm text-neutral-600">
                            {col1Links.length > 0 ? (
                                col1Links.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={item.url}
                                            className="transition-colors hover:text-teal-600"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <>
                                    <li>
                                        <Link
                                            href={productsIndex.url()}
                                            className="transition-colors hover:text-teal-600"
                                        >
                                            {t('shop.footer.all_products')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={hotSale.url()}
                                            className="transition-colors hover:text-teal-600"
                                        >
                                            {t('shop.footer.hot_sale')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={productsIndex.url({
                                                query: { sort: 'newest' },
                                            })}
                                            className="transition-colors hover:text-teal-600"
                                        >
                                            {t('shop.footer.new_arrivals')}
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* 3. Navigasi Kolom 2 (Company) */}
                    <div className="md:col-span-2">
                        <h4 className="mb-5 font-semibold tracking-wide text-neutral-900">
                            {col2Title}
                        </h4>
                        <ul className="space-y-3 text-sm text-neutral-600">
                            {col2Links.length > 0 ? (
                                col2Links.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={item.url}
                                            className="transition-colors hover:text-teal-600"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <>
                                    <li>
                                        <Link
                                            href={about.url()}
                                            className="transition-colors hover:text-teal-600"
                                        >
                                            {t('shop.footer.about_us')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={contact.url()}
                                            className="transition-colors hover:text-teal-600"
                                        >
                                            {t('shop.footer.contact')}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={faq.url()}
                                            className="transition-colors hover:text-teal-600"
                                        >
                                            {t('shop.footer.faq')}
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* 4. Informasi Kontak */}
                    <div className="md:col-span-4">
                        <h4 className="mb-5 font-semibold tracking-wide text-neutral-900">
                            {contactTitle}
                        </h4>
                        <ul className="space-y-3.5 text-sm text-neutral-600">
                            {showFactory && siteSettings?.factory_address && (
                                <li className="flex items-start gap-3">
                                    <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                                    <span><strong className="font-medium text-neutral-800">Pabrik:</strong> {siteSettings.factory_address}</span>
                                </li>
                            )}
                            {showShowroom && siteSettings?.showroom_address && (
                                <li className="flex items-start gap-3">
                                    <Store className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                                    <span><strong className="font-medium text-neutral-800">Showroom:</strong> {siteSettings.showroom_address}</span>
                                </li>
                            )}
                            {!siteSettings?.factory_address && !siteSettings?.showroom_address && siteSettings?.address && (
                                <li className="flex items-start gap-3">
                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                                    <span>{siteSettings.address}</span>
                                </li>
                            )}
                            {showPhone && siteSettings?.contact_phone && (
                                <li className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 shrink-0 text-teal-600" />
                                    <a
                                        href={`tel:${siteSettings.contact_phone}`}
                                        className="transition-colors hover:text-teal-600"
                                    >
                                        {siteSettings.contact_phone}
                                    </a>
                                </li>
                            )}
                            {showWhatsapp && siteSettings?.contact_whatsapp && (
                                <li className="flex items-center gap-3">
                                    <MessageCircle className="h-4 w-4 shrink-0 text-teal-600" />
                                    <a
                                        href={`https://wa.me/${whatsappNumber}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="transition-colors hover:text-teal-600"
                                    >
                                        +{whatsappNumber} (WhatsApp)
                                    </a>
                                </li>
                            )}
                            {showEmail && siteSettings?.contact_email && (
                                <li className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 shrink-0 text-teal-600" />
                                    <a
                                        href={`mailto:${siteSettings.contact_email}`}
                                        className="transition-colors hover:text-teal-600"
                                    >
                                        {siteSettings.contact_email}
                                    </a>
                                </li>
                            )}
                            {showEmail && siteSettings?.contact_email_2 && (
                                <li className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 shrink-0 text-teal-600" />
                                    <a
                                        href={`mailto:${siteSettings.contact_email_2}`}
                                        className="transition-colors hover:text-teal-600"
                                    >
                                        {siteSettings.contact_email_2}
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="flex flex-col items-center justify-between pt-8 text-xs text-neutral-500 md:flex-row">
                    <p>{copyrightText}</p>
                    <div className="mt-4 flex gap-6 md:mt-0">
                        <Link
                            href={privacyUrl}
                            className="transition-colors hover:text-teal-600"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href={termsUrl}
                            className="transition-colors hover:text-teal-600"
                        >
                            Terms &amp; Conditions
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
