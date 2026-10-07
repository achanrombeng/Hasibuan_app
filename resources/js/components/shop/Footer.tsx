import { SiteSettings } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Check, ChevronRight, Mail } from 'lucide-react';
import React, { useState } from 'react';

export const Footer: React.FC = () => {
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

  return (
    <footer className="w-full bg-[#111111] text-white border-t border-neutral-800 select-none">
      {/* 1. TOP NEWSLETTER STRIP (BE THE FIRST TO KNOW) */}
      <div className="border-b border-neutral-800 py-16 md:py-20 px-6 sm:px-12">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <span className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-neutral-400 font-light block">
            STAY CONNECTED
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.08em] uppercase text-white">
            BE THE FIRST TO KNOW
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 tracking-[0.06em] font-light max-w-lg mx-auto">
            Sign up to receive exclusive previews of new collections, seasonal source books, and private gallery events.
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
              Thank you for subscribing to the World of RH.
            </p>
          )}
        </div>
      </div>

      {/* 2. FOUR ARCHITECTURAL LINK COLUMNS */}
      <div className="max-w-[1720px] mx-auto py-16 md:py-24 px-6 sm:px-12 lg:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">
          
          {/* Col 1: GALLERIES & LOCATIONS */}
          <div className="space-y-4">
            <h4 className="text-[11px] tracking-[0.3em] uppercase text-white font-medium border-b border-neutral-800 pb-2">
              GALLERIES & STUDIOS
            </h4>
            <ul className="space-y-2.5 text-[11px] tracking-[0.16em] uppercase font-light text-neutral-400">
              <li>
                <Link href="/shop/about" className="hover:text-white transition-colors">
                  JEPARA CRAFT ATELIER
                </Link>
              </li>
              <li>
                <Link href="/shop/about" className="hover:text-white transition-colors">
                  JAKARTA DESIGN SUITE
                </Link>
              </li>
              <li>
                <Link href="/shop/contact" className="hover:text-white transition-colors">
                  SCHEDULE PRIVATE VISIT
                </Link>
              </li>
              <li>
                <Link href="/shop/about" className="hover:text-white transition-colors">
                  OUR HERITAGE & PROVENANCE
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: DESIGN SERVICES & TRADE */}
          <div className="space-y-4">
            <h4 className="text-[11px] tracking-[0.3em] uppercase text-white font-medium border-b border-neutral-800 pb-2">
              DESIGN & ARCHITECTURE
            </h4>
            <ul className="space-y-2.5 text-[11px] tracking-[0.16em] uppercase font-light text-neutral-400">
              <li>
                <Link href="/shop/custom-order" className="hover:text-white transition-colors">
                  HASIBUAN INTERIOR DESIGN
                </Link>
              </li>
              <li>
                <Link href="/shop/dealer" className="hover:text-white transition-colors">
                  TRADE & B2B PROGRAM
                </Link>
              </li>
              <li>
                <Link href="/shop/custom-order" className="hover:text-white transition-colors">
                  CUSTOM CONTRACT ORDERS
                </Link>
              </li>
              <li>
                <Link href="/shop/catalogs" className="hover:text-white transition-colors">
                  DIGITAL SOURCE BOOKS
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: CLIENT SERVICES */}
          <div className="space-y-4">
            <h4 className="text-[11px] tracking-[0.3em] uppercase text-white font-medium border-b border-neutral-800 pb-2">
              CLIENT SERVICES
            </h4>
            <ul className="space-y-2.5 text-[11px] tracking-[0.16em] uppercase font-light text-neutral-400">
              <li>
                <Link href="/shop/contact" className="hover:text-white transition-colors">
                  CLIENT CONCIERGE
                </Link>
              </li>
              <li>
                <Link href="/shop/shipping-policy" className="hover:text-white transition-colors">
                  WHITE-GLOVE DELIVERY
                </Link>
              </li>
              <li>
                <Link href="/shop/return-policy" className="hover:text-white transition-colors">
                  RETURNS & SATISFACTION
                </Link>
              </li>
              <li>
                <Link href="/shop/faq" className="hover:text-white transition-colors">
                  CARE & TIMBER WARRANTY
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: THE PHILOSOPHY & BRAND */}
          <div className="space-y-4">
            <h4 className="text-[11px] tracking-[0.3em] uppercase text-white font-medium border-b border-neutral-800 pb-2">
              PHILOSOPHY & ETHOS
            </h4>
            <ul className="space-y-2.5 text-[11px] tracking-[0.16em] uppercase font-light text-neutral-400">
              <li>
                <Link href="/shop/about" className="hover:text-white transition-colors">
                  VITRUVIAN PRINCIPLES
                </Link>
              </li>
              <li>
                <Link href="/shop/about" className="hover:text-white transition-colors">
                  SUSTAINABLE TEAK FORESTRY
                </Link>
              </li>
              <li>
                <Link href="/shop/articles" className="hover:text-white transition-colors">
                  ARCHITECTURAL ESSAYS
                </Link>
              </li>
              <li>
                <Link href="/shop/privacy-policy" className="hover:text-white transition-colors">
                  ETHICAL SOURCING
                </Link>
              </li>
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
            {siteName} · THE CONTEMPORARY AND ART FINES FURNITURE
          </span>
        </div>

        {/* Social Links from Admin Settings */}
        {(siteSettings?.instagram_url ||
          siteSettings?.facebook_url ||
          siteSettings?.tiktok_url ||
          siteSettings?.linkedin_url ||
          siteSettings?.contact_whatsapp) && (
          <div className="flex items-center justify-center gap-6 text-[11px] tracking-[0.25em] uppercase font-light text-neutral-400">
            {siteSettings?.instagram_url && (
              <a
                href={siteSettings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                INSTAGRAM
              </a>
            )}
            {siteSettings?.facebook_url && (
              <a
                href={siteSettings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                FACEBOOK
              </a>
            )}
            {siteSettings?.tiktok_url && (
              <a
                href={siteSettings.tiktok_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                TIKTOK
              </a>
            )}
            {siteSettings?.linkedin_url && (
              <a
                href={siteSettings.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                LINKEDIN
              </a>
            )}
            {siteSettings?.contact_whatsapp && (
              <a
                href={`https://wa.me/${siteSettings.contact_whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                WHATSAPP
              </a>
            )}
          </div>
        )}

        {/* Legal Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] tracking-[0.2em] uppercase font-light text-neutral-500">
          <Link href="/shop/privacy-policy" className="hover:text-neutral-300 transition-colors">
            PRIVACY POLICY
          </Link>
          <span className="text-neutral-700">·</span>
          <Link href="/shop/terms" className="hover:text-neutral-300 transition-colors">
            TERMS OF USE
          </Link>
          <span className="text-neutral-700">·</span>
          <Link href="/sitemap.xml" className="hover:text-neutral-300 transition-colors">
            SITE MAP
          </Link>
          <span className="text-neutral-700">·</span>
          <span>ACCESSIBILITY</span>
        </div>

        <p className="text-[9px] tracking-[0.18em] uppercase text-neutral-600 font-light">
          &copy; {new Date().getFullYear()} {siteName}. ALL RIGHTS RESERVED. ARCHITECTURAL & INTERIOR DESIGN DESIGNS PROTECTED.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
