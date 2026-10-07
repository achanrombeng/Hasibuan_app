import { SiteSettings } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
  name?: string;
  title?: string;
  description?: string;
}

export default function AuthSimpleLayout({
  children,
  title,
  description,
}: PropsWithChildren<AuthLayoutProps>) {
  const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
  const siteName = siteSettings?.site_name || 'Hasibuan Design';
  const siteLogo = siteSettings?.site_logo || '/images/hasibuan-logo.png';
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex min-h-svh bg-[#fafaf9] selection:bg-neutral-900 selection:text-white">
      {/* Left Side - Architectural Editorial Branding Panel */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-1/2 xl:w-7/12 bg-[#121212]">
        {/* Background Atmosphere Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop")',
          }}
        />

        {/* Deep luxury gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#111111]/85 to-[#161616]/75 backdrop-blur-[1.5px]" />

        {/* Ambient warm radial accent */}
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-amber-900/15 rounded-full blur-3xl pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16 text-white">
          {/* Top Header Bar */}
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-block group">
              <img
                src="/images/hasibuan-footer-logo.png"
                alt={siteName}
                className="h-9 w-auto brightness-0 invert opacity-95 group-hover:opacity-100 transition-opacity"
              />
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-2 border border-white/20 bg-white/5 backdrop-blur-md px-4 py-2 text-[10px] tracking-[0.25em] uppercase font-light text-neutral-200 hover:text-white hover:border-white/40 hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Storefront</span>
            </Link>
          </div>

          {/* Hero Editorial Copy */}
          <div className="max-w-xl space-y-6 my-auto py-12">
            <div className="space-y-3">
              <span className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 font-light block">
                SOLID TEAK & BESPOKE INTERIOR ATELIER
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl xl:text-5xl font-light text-white tracking-[0.03em] leading-[1.18]">
                Vitruvian Proportion & Master Craftsmanship
              </h2>
            </div>

            <div className="w-12 h-[1px] bg-neutral-600" />

            <p className="text-sm xl:text-base font-light text-neutral-300 leading-relaxed">
              Handcrafted solid Indonesian teak collections and architectural appointments from Jepara, engineered for generational longevity and timeless living.
            </p>

            {/* Editorial Feature Credential Box */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800/80">
              <div className="space-y-1">
                <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-light block">
                  PROVENANCE
                </span>
                <p className="text-xs text-neutral-200 font-light">
                  Generational Jepara Artisans
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-light block">
                  ESTABLISHED
                </span>
                <p className="text-xs text-neutral-200 font-light">
                  Since 2000 · Global Export
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 font-light">
            &copy; {currentYear} {siteName}. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Form Container */}
      <div className="relative flex w-full flex-col items-center justify-center bg-[#fafaf9] p-6 sm:p-10 lg:w-1/2 xl:w-5/12 min-h-svh">
        {/* Top Right Navigation */}
        <div className="absolute top-6 right-6 z-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-neutral-300/80 bg-white px-4 py-2 text-[10px] tracking-[0.2em] uppercase font-light text-neutral-700 shadow-xs hover:border-black hover:text-black transition-colors"
          >
            <ArrowLeft className="h-3 w-3 text-neutral-500" />
            <span>Storefront</span>
          </Link>
        </div>

        {/* Mobile / Tablet Logo */}
        <div className="mb-8 lg:hidden flex justify-center">
          <Link href="/">
            <img
              src={siteLogo}
              alt={siteName}
              className="h-10 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Form Card Container */}
        <div className="w-full max-w-[440px]">
          <div className="border border-neutral-200/90 bg-white p-8 sm:p-10 shadow-xl shadow-neutral-900/[0.03]">
            <div className="mb-8 space-y-2 text-center">
              <span className="text-[10px] tracking-[0.35em] uppercase text-neutral-400 font-light block">
                CLIENT & ATELIER PORTAL
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-light tracking-[0.05em] text-neutral-900 uppercase">
                {title}
              </h1>
              {description && (
                <p className="text-xs sm:text-sm font-light text-neutral-500 leading-relaxed max-w-xs mx-auto">
                  {description}
                </p>
              )}
            </div>

            {children}
          </div>

          <p className="mt-8 text-center text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-light lg:hidden">
            &copy; {currentYear} {siteName}. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
