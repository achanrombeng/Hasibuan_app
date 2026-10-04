import { useTranslation } from '@/hooks/use-translation';
import { SiteSettings } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
  Building2,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
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

function WhatsAppIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

function XTwitterIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function PinterestIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
    </svg>
  );
}

function ThreadsIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.186 24C5.452 24 0 18.548 0 11.814S5.452-.372 12.186-.372c3.487 0 6.643 1.396 8.948 3.654l-2.697 2.697C16.822 4.39 14.619 3.4 12.186 3.4 7.545 3.4 3.772 7.173 3.772 11.814c0 4.642 3.773 8.414 8.414 8.414 4.093 0 7.498-2.927 8.262-6.845H12.186v-3.772h12.06c.116.634.186 1.28.186 1.942 0 6.793-5.395 12.447-12.246 12.447z" />
    </svg>
  );
}

function getSocialConfig(platform: string) {
  switch (platform) {
    case 'instagram':
      return {
        name: 'Instagram',
        hoverClass: 'hover:bg-pink-600',
        icon: <Instagram className="h-4 w-4" />,
      };
    case 'facebook':
      return {
        name: 'Facebook',
        hoverClass: 'hover:bg-blue-600',
        icon: <Facebook className="h-4 w-4" />,
      };
    case 'tiktok':
      return {
        name: 'TikTok',
        hoverClass: 'hover:bg-neutral-900',
        icon: <TikTokIcon className="h-4 w-4" />,
      };
    case 'youtube':
      return {
        name: 'YouTube',
        hoverClass: 'hover:bg-red-600',
        icon: <Youtube className="h-4 w-4" />,
      };
    case 'whatsapp':
      return {
        name: 'WhatsApp',
        hoverClass: 'hover:bg-emerald-600',
        icon: <WhatsAppIcon className="h-4 w-4" />,
      };
    case 'twitter':
      return {
        name: 'X (Twitter)',
        hoverClass: 'hover:bg-neutral-900',
        icon: <XTwitterIcon className="h-4 w-4" />,
      };
    case 'pinterest':
      return {
        name: 'Pinterest',
        hoverClass: 'hover:bg-red-700',
        icon: <PinterestIcon className="h-4 w-4" />,
      };
    case 'linkedin':
      return {
        name: 'LinkedIn',
        hoverClass: 'hover:bg-blue-700',
        icon: <Linkedin className="h-4 w-4" />,
      };
    case 'threads':
      return {
        name: 'Threads',
        hoverClass: 'hover:bg-neutral-900',
        icon: <ThreadsIcon className="h-4 w-4" />,
      };
    case 'telegram':
      return {
        name: 'Telegram',
        hoverClass: 'hover:bg-sky-500',
        icon: <Send className="h-4 w-4" />,
      };
    default:
      return {
        name: 'Website',
        hoverClass: 'hover:bg-teal-600',
        icon: <Globe className="h-4 w-4" />,
      };
  }
}

interface CustomLinkItem {
  label: string;
  url: string;
}

export const Footer = () => {
  const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
  const { t } = useTranslation();
  const siteName = siteSettings?.site_name || 'hasibuan_app';
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

  const isSettingVisible = (val: unknown, defaultValue = true): boolean => {
    if (val === undefined || val === null || val === '') return defaultValue;
    if (val === false || val === '0' || val === 0 || val === 'false')
      return false;
    if (val === true || val === '1' || val === 1 || val === 'true') return true;
    return Boolean(val);
  };

  const showSocials = isSettingVisible(siteSettings?.footer_show_socials);
  const showFactory = isSettingVisible(siteSettings?.footer_show_factory);
  const showShowroom = isSettingVisible(siteSettings?.footer_show_showroom);
  const showPhone = isSettingVisible(siteSettings?.footer_show_phone);
  const showWhatsapp = isSettingVisible(siteSettings?.footer_show_whatsapp);
  const showEmail = isSettingVisible(siteSettings?.footer_show_email);
  const showPrivacy = isSettingVisible(siteSettings?.footer_show_privacy);
  const showTerms = isSettingVisible(siteSettings?.footer_show_terms);

  const privacyUrl = siteSettings?.footer_privacy_url || '/shop/privacy-policy';
  const termsUrl = siteSettings?.footer_terms_url || '/shop/terms';

  const copyrightText = siteSettings?.footer_copyright || (
    <>
      &copy; {currentYear} {siteName}. {t('shop.footer.all_rights_reserved')}
    </>
  );

  return (
    <footer className="relative overflow-hidden bg-[#EBEBEB] py-16 text-neutral-800">
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="grid grid-cols-1 gap-10 border-b border-neutral-300 pb-12 md:grid-cols-12">
          {/* 1. Informasi Toko & Media Sosial */}
          <div className="space-y-5 md:col-span-4">
            <Link href="/shop" className="inline-block">
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
            {showSocials &&
              (() => {
                // Parse dynamic social links
                const links: {
                  platform: string;
                  url: string;
                  label?: string;
                }[] = (() => {
                  const list: {
                    platform: string;
                    url: string;
                    label?: string;
                  }[] = [];
                  const seenPlatforms = new Set<string>();

                  if (siteSettings?.social_links) {
                    try {
                      const parsed = JSON.parse(siteSettings.social_links);
                      if (Array.isArray(parsed) && parsed.length > 0) {
                        parsed.forEach((item) => {
                          if (item && item.url && item.url.trim().length > 0) {
                            list.push(item);
                            if (item.platform) {
                              seenPlatforms.add(item.platform.toLowerCase());
                            }
                          }
                        });
                      }
                    } catch {
                      // ignore
                    }
                  }

                  // Merge standalone URLs if they exist and are not already in list
                  const standalone: { platform: string; url?: string }[] = [
                    { platform: 'facebook', url: siteSettings?.facebook_url },
                    { platform: 'instagram', url: siteSettings?.instagram_url },
                    { platform: 'tiktok', url: siteSettings?.tiktok_url },
                    { platform: 'youtube', url: siteSettings?.youtube_url },
                    { platform: 'linkedin', url: siteSettings?.linkedin_url },
                  ];

                  standalone.forEach(({ platform, url }) => {
                    if (
                      url &&
                      url.trim().length > 0 &&
                      !seenPlatforms.has(platform)
                    ) {
                      list.push({ platform, url });
                      seenPlatforms.add(platform);
                    }
                  });

                  return list;
                })();

                if (links.length === 0) return null;

                return (
                  <div className="pt-2">
                    <h5 className="mb-3 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                      {t('shop.footer.social_media')}
                    </h5>
                    <div className="flex flex-wrap items-center gap-2.5">
                      {links.map((item, idx) => {
                        const config = getSocialConfig(item.platform);
                        const displayName = item.label || config.name;
                        return (
                          <a
                            key={`${item.platform}-${idx}`}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex h-9 w-9 items-center justify-center rounded-full bg-neutral-200/80 text-neutral-700 shadow-sm transition-all hover:scale-110 hover:text-white active:scale-95 ${config.hoverClass}`}
                            title={displayName}
                            aria-label={displayName}
                          >
                            {config.icon}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
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
                      href="/shop/products"
                      className="transition-colors hover:text-teal-600"
                    >
                      {t('shop.footer.all_products')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop/hot-sale"
                      className="transition-colors hover:text-teal-600"
                    >
                      {t('shop.footer.hot_sale')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop/products?sort=newest"
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
                      href="/shop/about"
                      className="transition-colors hover:text-teal-600"
                    >
                      {t('shop.footer.about_us')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop/contact"
                      className="transition-colors hover:text-teal-600"
                    >
                      {t('shop.footer.contact')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shop/faq"
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
                  <span>
                    <strong className="font-medium text-neutral-800">
                      {siteSettings?.factory_name || 'Factory'}:
                    </strong>{' '}
                    {siteSettings.factory_address}
                  </span>
                </li>
              )}
              {showShowroom && siteSettings?.showroom_address && (
                <li className="flex items-start gap-3">
                  <Store className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                  <span>
                    <strong className="font-medium text-neutral-800">
                      {siteSettings?.showroom_name || 'Showroom'}:
                    </strong>{' '}
                    {siteSettings.showroom_address}
                  </span>
                </li>
              )}
              {!siteSettings?.factory_address &&
                !siteSettings?.showroom_address &&
                siteSettings?.address && (
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
          {(showPrivacy || showTerms) && (
            <div className="mt-4 flex gap-6 md:mt-0">
              {showPrivacy && (
                <Link
                  href={privacyUrl}
                  className="transition-colors hover:text-teal-600"
                >
                  Privacy Policy
                </Link>
              )}
              {showTerms && (
                <Link
                  href={termsUrl}
                  className="transition-colors hover:text-teal-600"
                >
                  Terms &amp; Conditions
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
