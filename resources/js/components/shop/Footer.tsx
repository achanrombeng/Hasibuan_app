import { SiteSettings } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';
import React, { useMemo, useState } from 'react';

interface FooterProps {
  showNewsletter?: boolean;
}

interface LinkItem {
  label: string;
  url: string;
}

const DEFAULT_COL1_LINKS: LinkItem[] = [
  { label: 'JEPARA CRAFT ATELIER', url: '/shop/about' },
  { label: 'JAKARTA DESIGN SUITE', url: '/shop/about' },
  { label: 'SCHEDULE PRIVATE VISIT', url: '/shop/contact' },
  { label: 'OUR HERITAGE & PROVENANCE', url: '/shop/about' },
];

const DEFAULT_COL2_LINKS: LinkItem[] = [
  { label: 'HASIBUAN INTERIOR DESIGN', url: '/shop/custom-order' },
  { label: 'TRADE & B2B PROGRAM', url: '/shop/dealer' },
  { label: 'CUSTOM CONTRACT ORDERS', url: '/shop/custom-order' },
  { label: 'DIGITAL SOURCE BOOKS', url: '/shop/catalogs' },
];

const DEFAULT_COL3_LINKS: LinkItem[] = [
  { label: 'CLIENT CONCIERGE', url: '/shop/contact' },
  { label: 'WHITE-GLOVE DELIVERY', url: '/shop/shipping-policy' },
  { label: 'RETURNS & SATISFACTION', url: '/shop/return-policy' },
  { label: 'CARE & TIMBER WARRANTY', url: '/shop/faq' },
];

const DEFAULT_COL4_LINKS: LinkItem[] = [
  { label: 'VITRUVIAN PRINCIPLES', url: '/shop/about' },
  { label: 'SUSTAINABLE TEAK FORESTRY', url: '/shop/about' },
  { label: 'ARCHITECTURAL ESSAYS', url: '/shop/articles' },
  { label: 'ETHICAL SOURCING', url: '/shop/privacy-policy' },
];

const parseLinks = (jsonString?: string, fallback: LinkItem[] = []): LinkItem[] => {
  if (!jsonString) return fallback;
  try {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.filter((item: any) => item && item.label && item.url);
    }
  } catch {
    // fallback
  }
  return fallback;
};

export const Footer: React.FC<FooterProps> = ({ showNewsletter = true }) => {
  const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
  const siteName = siteSettings?.site_name || 'Hasibuan Design';
  const [subscribed, setSubscribed] = useState(false);

  const { data, setData, post, processing, reset } = useForm({
    email: '',
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.email) return;

    post('/shop/newsletter/subscribe', {
      preserveScroll: true,
      onSuccess: () => {
        setSubscribed(true);
        reset();
        setTimeout(() => setSubscribed(false), 5000);
      },
    });
  };

  // Newsletter settings
  const isNewsletterVisible =
    showNewsletter && (siteSettings?.footer_show_newsletter ?? true);
  const newsletterBadge =
    siteSettings?.footer_newsletter_badge || 'STAY CONNECTED';
  const newsletterTitle =
    siteSettings?.footer_newsletter_title || 'BE THE FIRST TO KNOW';
  const newsletterSubtitle =
    siteSettings?.footer_newsletter_subtitle ||
    'Sign up to receive exclusive previews of new collections, seasonal source books, and private gallery events.';

  // 4 Navigation Columns
  const col1Title = siteSettings?.footer_col1_title || 'GALLERIES & STUDIOS';
  const col1Links = useMemo(
    () => parseLinks(siteSettings?.footer_col1_links, DEFAULT_COL1_LINKS),
    [siteSettings?.footer_col1_links],
  );

  const col2Title = siteSettings?.footer_col2_title || 'DESIGN & ARCHITECTURE';
  const col2Links = useMemo(
    () => parseLinks(siteSettings?.footer_col2_links, DEFAULT_COL2_LINKS),
    [siteSettings?.footer_col2_links],
  );

  const col3Title = siteSettings?.footer_col3_title || 'CLIENT SERVICES';
  const col3Links = useMemo(
    () => parseLinks(siteSettings?.footer_col3_links, DEFAULT_COL3_LINKS),
    [siteSettings?.footer_col3_links],
  );

  const col4Title = siteSettings?.footer_col4_title || 'PHILOSOPHY & ETHOS';
  const col4Links = useMemo(
    () => parseLinks(siteSettings?.footer_col4_links, DEFAULT_COL4_LINKS),
    [siteSettings?.footer_col4_links],
  );

  // Social links parser
  const socialLinks = useMemo(() => {
    if (siteSettings?.footer_show_socials === false) return [];

    const list: { name: string; url: string }[] = [];
    const seen = new Set<string>();

    if (siteSettings?.social_links) {
      try {
        const parsed = JSON.parse(siteSettings.social_links);
        if (Array.isArray(parsed)) {
          parsed.forEach((item: any) => {
            if (item?.url && typeof item.url === 'string' && item.url.trim().length > 0) {
              const platformName = (item.label || item.platform || 'Social').toUpperCase();
              if (!seen.has(platformName)) {
                seen.add(platformName);
                list.push({ name: platformName, url: item.url.trim() });
              }
            }
          });
        }
      } catch {
        // ignore
      }
    }

    const fallbacks: { name: string; url?: string }[] = [
      { name: 'INSTAGRAM', url: siteSettings?.instagram_url },
      { name: 'FACEBOOK', url: siteSettings?.facebook_url },
      { name: 'TIKTOK', url: siteSettings?.tiktok_url },
      { name: 'LINKEDIN', url: siteSettings?.linkedin_url },
      { name: 'YOUTUBE', url: siteSettings?.youtube_url },
    ];

    fallbacks.forEach(({ name, url }) => {
      if (url && url.trim().length > 0 && !seen.has(name)) {
        seen.add(name);
        list.push({ name, url: url.trim() });
      }
    });

    if (siteSettings?.contact_whatsapp && !seen.has('WHATSAPP')) {
      const rawWa = siteSettings.contact_whatsapp.replace(/\D/g, '');
      if (rawWa) {
        list.push({ name: 'WHATSAPP', url: `https://wa.me/${rawWa}` });
      }
    }

    return list;
  }, [
    siteSettings?.footer_show_socials,
    siteSettings?.social_links,
    siteSettings?.instagram_url,
    siteSettings?.facebook_url,
    siteSettings?.tiktok_url,
    siteSettings?.linkedin_url,
    siteSettings?.youtube_url,
    siteSettings?.contact_whatsapp,
  ]);

  // Branding & Copyright
  const tagline =
    siteSettings?.footer_tagline ||
    `${siteName.toUpperCase()} · THE CONTEMPORARY AND ART FINES FURNITURE`;

  const copyrightText =
    siteSettings?.footer_copyright ||
    `© ${new Date().getFullYear()} ${siteName.toUpperCase()}. ALL RIGHTS RESERVED. ARCHITECTURAL & INTERIOR DESIGN DESIGNS PROTECTED.`;

  // Legal links visibility
  const showPrivacy = siteSettings?.footer_show_privacy ?? true;
  const privacyUrl = siteSettings?.footer_privacy_url || '/shop/privacy-policy';
  const showTerms = siteSettings?.footer_show_terms ?? true;
  const termsUrl = siteSettings?.footer_terms_url || '/shop/terms';
  const showSitemap = siteSettings?.footer_show_sitemap ?? true;
  const sitemapUrl = siteSettings?.footer_sitemap_url || '/sitemap.xml';
  const showAccessibility = siteSettings?.footer_show_accessibility ?? true;
  const accessibilityText =
    siteSettings?.footer_accessibility_text || 'ACCESSIBILITY';

  // Contact info toggles
  const showPhone = siteSettings?.footer_show_phone ?? false;
  const showWhatsapp = siteSettings?.footer_show_whatsapp ?? false;
  const showEmail = siteSettings?.footer_show_email ?? false;
  const showFactory = siteSettings?.footer_show_factory ?? false;
  const showShowroom = siteSettings?.footer_show_showroom ?? false;

  return (
    <footer className="w-full bg-[#111111] text-white border-t border-neutral-800 select-none">
      {/* 1. TOP NEWSLETTER STRIP (BE THE FIRST TO KNOW) */}
      {isNewsletterVisible && (
        <div className="border-b border-neutral-800 py-16 md:py-20 px-6 sm:px-12">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <span className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-neutral-400 font-light block">
              {newsletterBadge}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.08em] uppercase text-white">
              {newsletterTitle}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 tracking-[0.06em] font-light max-w-lg mx-auto">
              {newsletterSubtitle}
            </p>

            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2"
            >
              <div className="relative w-full">
                <input
                  type="email"
                  required
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder="ENTER YOUR EMAIL ADDRESS"
                  className="w-full bg-neutral-900 border border-neutral-700 px-4 py-3 text-xs tracking-[0.15em] uppercase text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={processing}
                className="w-full sm:w-auto px-8 py-3 border border-white bg-white text-black text-xs tracking-[0.25em] uppercase font-medium hover:bg-neutral-200 transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
              >
                {subscribed ? 'JOINED' : 'JOIN'}
              </button>
            </form>

            {subscribed && (
              <p className="text-[11px] tracking-widest text-emerald-400 uppercase pt-2">
                Thank you for subscribing to the World of Hasibuan.
              </p>
            )}
          </div>
        </div>
      )}

      {/* 2. FOUR ARCHITECTURAL LINK COLUMNS */}
      <div className="max-w-[1720px] mx-auto py-16 md:py-24 px-6 sm:px-12 lg:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">
          {/* Col 1 */}
          <div className="space-y-4">
            <h4 className="text-[11px] tracking-[0.3em] uppercase text-white font-medium border-b border-neutral-800 pb-2">
              {col1Title}
            </h4>
            <ul className="space-y-2.5 text-[11px] tracking-[0.16em] uppercase font-light text-neutral-400">
              {col1Links.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.url} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2 */}
          <div className="space-y-4">
            <h4 className="text-[11px] tracking-[0.3em] uppercase text-white font-medium border-b border-neutral-800 pb-2">
              {col2Title}
            </h4>
            <ul className="space-y-2.5 text-[11px] tracking-[0.16em] uppercase font-light text-neutral-400">
              {col2Links.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.url} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Client Services & Concierge */}
          <div className="space-y-4">
            <h4 className="text-[11px] tracking-[0.3em] uppercase text-white font-medium border-b border-neutral-800 pb-2">
              {col3Title}
            </h4>
            <ul className="space-y-2.5 text-[11px] tracking-[0.16em] uppercase font-light text-neutral-400">
              {col3Links.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.url} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              {/* Optional Active Concierge Contact Details */}
              {showPhone && siteSettings?.contact_phone && (
                <li>
                  <a
                    href={`tel:${siteSettings.contact_phone}`}
                    className="hover:text-white transition-colors text-neutral-300"
                  >
                    TEL: {siteSettings.contact_phone}
                  </a>
                </li>
              )}
              {showWhatsapp && siteSettings?.contact_whatsapp && (
                <li>
                  <a
                    href={`https://wa.me/${siteSettings.contact_whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors text-neutral-300"
                  >
                    WHATSAPP: {siteSettings.contact_whatsapp}
                  </a>
                </li>
              )}
              {showEmail && siteSettings?.contact_email && (
                <li>
                  <a
                    href={`mailto:${siteSettings.contact_email}`}
                    className="hover:text-white transition-colors text-neutral-300"
                  >
                    EMAIL: {siteSettings.contact_email.toUpperCase()}
                  </a>
                </li>
              )}
              {showFactory && siteSettings?.factory_address && (
                <li className="pt-1 text-[10px] tracking-wider text-neutral-500 normal-case">
                  <span className="uppercase text-neutral-400 block font-medium">Factory Atelier:</span>
                  {siteSettings.factory_address}
                </li>
              )}
              {showShowroom && siteSettings?.showroom_address && (
                <li className="pt-1 text-[10px] tracking-wider text-neutral-500 normal-case">
                  <span className="uppercase text-neutral-400 block font-medium">Design Suite:</span>
                  {siteSettings.showroom_address}
                </li>
              )}
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-4">
            <h4 className="text-[11px] tracking-[0.3em] uppercase text-white font-medium border-b border-neutral-800 pb-2">
              {col4Title}
            </h4>
            <ul className="space-y-2.5 text-[11px] tracking-[0.16em] uppercase font-light text-neutral-400">
              {col4Links.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.url} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 3. BRAND MONOGRAM & LEGAL FOOTER */}
      <div className="border-t border-neutral-800/80 py-12 px-6 sm:px-12 text-center space-y-6">
        <div className="flex flex-col items-center">
          <img
            src="/images/hasibuan-footer-logo.png"
            alt={siteName}
            className="h-8 sm:h-10 w-auto object-contain brightness-0 invert opacity-90 mb-3"
          />
          <span className="text-[9px] tracking-[0.45em] uppercase text-neutral-400 font-light block">
            {tagline}
          </span>
        </div>

        {/* Social Links from Admin Settings */}
        {socialLinks.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] tracking-[0.25em] uppercase font-light text-neutral-400">
            {socialLinks.map((soc, idx) => (
              <a
                key={idx}
                href={soc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                {soc.name}
              </a>
            ))}
          </div>
        )}

        {/* Legal Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] tracking-[0.2em] uppercase font-light text-neutral-500">
          {showPrivacy && (
            <Link href={privacyUrl} className="hover:text-neutral-300 transition-colors">
              PRIVACY POLICY
            </Link>
          )}
          {showPrivacy && showTerms && <span className="text-neutral-700">·</span>}
          {showTerms && (
            <Link href={termsUrl} className="hover:text-neutral-300 transition-colors">
              TERMS OF USE
            </Link>
          )}
          {(showTerms || showPrivacy) && showSitemap && <span className="text-neutral-700">·</span>}
          {showSitemap && (
            <Link href={sitemapUrl} className="hover:text-neutral-300 transition-colors">
              SITE MAP
            </Link>
          )}
          {(showTerms || showPrivacy || showSitemap) && showAccessibility && (
            <span className="text-neutral-700">·</span>
          )}
          {showAccessibility && <span>{accessibilityText}</span>}
        </div>

        <p className="text-[9px] tracking-[0.18em] uppercase text-neutral-600 font-light">
          {copyrightText}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
