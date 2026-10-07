import { SEOHead } from '@/components/seo';
import { useTranslation } from '@/hooks/use-translation';
import { ShopLayout } from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { CheckCircle, Globe2, Loader2, Send, ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function Dealer() {
  const { t } = useTranslation();
  const { siteSettings } = usePage<{ siteSettings: SiteSettings }>().props;
  const siteName = siteSettings?.site_name || 'hasibuan_app';
  const [isSuccess, setIsSuccess] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    contact: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/shop/dealer', {
      preserveScroll: true,
      onSuccess: () => {
        setIsSuccess(true);
        reset();
      },
    });
  };

  return (
    <>
      <SEOHead
        title="Trade & Dealer Inquiries"
        description={`Architectural Trade & Dealer Partnerships - ${siteName} luxury outdoor furniture.`}
        keywords={[
          'trade program',
          'dealer form',
          'furniture partnership',
          'architectural contract',
          'outdoor furniture hospitality',
        ]}
      />
      <div className="bg-noise" />
      <ShopLayout>
        <main className="min-h-screen bg-white pb-24">
          {/* Monumental Editorial Header - Black Luxury Banner */}
          <div className="border-b border-neutral-900 bg-neutral-950 py-16 md:py-24 px-6 text-white">
            <div className="mx-auto max-w-[1720px] text-center space-y-3">
              <span className="text-[10px] md:text-xs tracking-[0.35em] uppercase font-light text-neutral-400">
                TRADE & CONTRACT ATELIER
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-[0.06em] text-white uppercase">
                ARCHITECTURAL PARTNERSHIPS
              </h1>
              <div className="w-12 h-[1px] bg-neutral-700 mx-auto mt-4" />
              <p className="mx-auto max-w-2xl text-xs md:text-sm font-light text-neutral-300 tracking-wide pt-2">
                Private trade representation and bespoke contract manufacturing for international architects, interior designers, and luxury hospitality developments.
              </p>
            </div>
          </div>

          {/* Main Content - 2 Column Layout */}
          <div className="mx-auto max-w-[1720px] px-6 sm:px-12 py-16 md:py-24">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-16">
              {/* Left Column: Editorial Showcase & Trade Pillars */}
              <div className="space-y-8 lg:col-span-6">
                <div className="group relative aspect-[16/11] overflow-hidden border border-neutral-200/80 bg-neutral-100">
                  <img
                    src="/images/dealer-banner.png"
                    alt="Ronica Luxury Contract & Trade Furniture"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-neutral-950/20" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="text-[10px] tracking-[0.3em] uppercase font-light block mb-1">
                      GLOBAL SPECIFICATION
                    </span>
                    <h3 className="font-serif text-xl tracking-[0.05em] uppercase font-light">
                      CRAFTED FOR ENDURING ARCHITECTURAL PRESENCE
                    </h3>
                  </div>
                </div>

                {/* Trade Benefits / Heritage Pillars */}
                <div className="grid gap-6 sm:grid-cols-3 pt-4">
                  <div className="border-t border-neutral-200/80 pt-4 space-y-2">
                    <div className="flex items-center gap-2 text-neutral-900">
                      <Sparkles size={16} />
                      <span className="text-[10px] tracking-[0.2em] uppercase font-medium">
                        CUSTOM SPECS
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 font-light leading-relaxed">
                      Tailored grade-A teak, synthetic weaves, and weather-proof outdoor foam.
                    </p>
                  </div>

                  <div className="border-t border-neutral-200/80 pt-4 space-y-2">
                    <div className="flex items-center gap-2 text-neutral-900">
                      <ShieldCheck size={16} />
                      <span className="text-[10px] tracking-[0.2em] uppercase font-medium">
                        CONTRACT TIER
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 font-light leading-relaxed">
                      Direct trade discounts and priority manufacturing schedules.
                    </p>
                  </div>

                  <div className="border-t border-neutral-200/80 pt-4 space-y-2">
                    <div className="flex items-center gap-2 text-neutral-900">
                      <Globe2 size={16} />
                      <span className="text-[10px] tracking-[0.2em] uppercase font-medium">
                        GLOBAL FREIGHT
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 font-light leading-relaxed">
                      Coordinated sea cargo & air courier to 15+ international markets.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Refined Dealer Form */}
              <div className="lg:col-span-6">
                <div className="border border-neutral-200/80 bg-[#fafaf9] p-8 md:p-12 space-y-8">
                  {/* Form Header */}
                  <div className="space-y-2">
                    <span className="text-[10px] tracking-[0.3em] uppercase font-light text-neutral-500 block">
                      INQUIRY DOSSIER
                    </span>
                    <h2 className="font-serif text-2xl md:text-3xl font-light tracking-[0.05em] text-neutral-900 uppercase">
                      REQUEST TRADE PRIVILEGES
                    </h2>
                    <p className="text-xs text-neutral-500 font-light leading-relaxed pt-1">
                      Submit your firm's details and project specifications. Our contract directors evaluate each request within 24 business hours.
                    </p>
                  </div>

                  {isSuccess ? (
                    <div className="py-12 text-center space-y-4">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 text-white">
                        <CheckCircle size={28} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-serif text-2xl font-light text-neutral-900 uppercase tracking-wide">
                          {t('shop.contact.message_sent')}
                        </h3>
                        <p className="text-xs text-neutral-500 font-light max-w-md mx-auto leading-relaxed">
                          {t('shop.contact.message_sent_desc')}
                        </p>
                      </div>
                      <div className="pt-4">
                        <button
                          type="button"
                          onClick={() => setIsSuccess(false)}
                          className="border border-neutral-900 px-8 py-3 text-[11px] font-medium tracking-[0.25em] uppercase text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors"
                        >
                          {t('shop.contact.send_another')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Name / Firm */}
                      <div className="space-y-2">
                        <label className="block text-[10px] font-medium tracking-[0.25em] text-neutral-600 uppercase">
                          Contact Name & Firm
                        </label>
                        <input
                          type="text"
                          required
                          value={data.name}
                          onChange={(e) => setData('name', e.target.value)}
                          placeholder="e.g. Jean Nouvel Architects / Adrian Vance"
                          className="w-full border border-neutral-300 bg-white px-4 py-3 text-xs tracking-wider text-neutral-900 placeholder-neutral-400 transition-colors focus:border-neutral-900 focus:outline-none"
                        />
                        {errors.name && (
                          <p className="text-xs text-red-600 font-light">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Contact / Email / Phone */}
                      <div className="space-y-2">
                        <label className="block text-[10px] font-medium tracking-[0.25em] text-neutral-600 uppercase">
                          Corporate Email or Telephone
                        </label>
                        <input
                          type="text"
                          required
                          value={data.contact}
                          onChange={(e) => setData('contact', e.target.value)}
                          placeholder="trade@architecturefirm.com or +1 (555) 000-0000"
                          className="w-full border border-neutral-300 bg-white px-4 py-3 text-xs tracking-wider text-neutral-900 placeholder-neutral-400 transition-colors focus:border-neutral-900 focus:outline-none"
                        />
                        {errors.contact && (
                          <p className="text-xs text-red-600 font-light">
                            {errors.contact}
                          </p>
                        )}
                      </div>

                      {/* Project Scope / Message */}
                      <div className="space-y-2">
                        <label className="block text-[10px] font-medium tracking-[0.25em] text-neutral-600 uppercase">
                          Project Scope & Requirements
                        </label>
                        <textarea
                          required
                          rows={5}
                          value={data.message}
                          onChange={(e) => setData('message', e.target.value)}
                          placeholder="Describe your hospitality development, residential project, or dealership showroom requirements..."
                          className="w-full resize-none border border-neutral-300 bg-white px-4 py-3 text-xs tracking-wider text-neutral-900 placeholder-neutral-400 transition-colors focus:border-neutral-900 focus:outline-none leading-relaxed"
                        />
                        {errors.message && (
                          <p className="text-xs text-red-600 font-light">
                            {errors.message}
                          </p>
                        )}
                      </div>

                      {/* Submit Button */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={processing}
                          className="inline-flex w-full items-center justify-center gap-2 bg-neutral-900 py-4 text-[11px] font-medium tracking-[0.25em] text-white uppercase transition-colors hover:bg-neutral-800 disabled:opacity-50"
                        >
                          {processing ? (
                            <>
                              <Loader2 size={15} className="animate-spin" />
                              <span>TRANSMITTING DOSSIER...</span>
                            </>
                          ) : (
                            <>
                              <Send size={14} />
                              <span>SUBMIT TRADE APPLICATION</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </ShopLayout>
    </>
  );
}
