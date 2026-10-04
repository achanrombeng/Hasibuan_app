import { SEOHead } from '@/components/seo';
import { useTranslation } from '@/hooks/use-translation';
import { ShopLayout } from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { Armchair, CheckCircle, Loader2, Send } from 'lucide-react';
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
        title="Dealer Form"
        description={`Dealer Form - ${siteName} Outdoor Furniture partnership inquiries.`}
        keywords={[
          'dealer form',
          'furniture partnership',
          'dealer inquiry',
          'partnership',
        ]}
      />
      <div className="bg-noise" />
      <ShopLayout>
        <main className="min-h-screen bg-sand-50 pb-20">
          {/* Hero */}
          <div className="mb-16 bg-gradient-to-r from-teal-600 to-teal-700 py-16 text-white">
            <div className="mx-auto max-w-[1400px] px-6 text-center md:px-12">
              <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
                Dealer Form
              </h1>
              <p className="text-xl opacity-90">
                Evaluate business partnership opportunities quickly and
                effectively.
              </p>
            </div>
          </div>

          {/* Main Content - 2 Column Layout */}
          <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-12">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              {/* Left Column: Product Image Showcase */}
              <div className="lg:col-span-6">
                <div className="group relative aspect-square overflow-hidden rounded-2xl border border-neutral-200/60 bg-white shadow-xl transition-all duration-500">
                  <img
                    src="/images/dealer-banner.png"
                    alt="Ronica Luxury Outdoor Furniture"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                </div>
              </div>

              {/* Right Column: Dealer Form */}
              <div className="lg:col-span-6">
                <div className="space-y-6 rounded-2xl border border-neutral-200/40 bg-white p-8 shadow-sm md:p-10">
                  {/* Icon & Title Header */}
                  <div>
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sand-100 text-[#a67c52]">
                      <Armchair size={24} />
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-neutral-900 md:text-3xl">
                      Dealer Form
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                      We are here to evaluate business partnership opportunities
                      quickly and effectively.
                    </p>
                  </div>

                  {isSuccess ? (
                    <div className="py-8 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <CheckCircle size={32} />
                      </div>
                      <h3 className="mb-2 font-serif text-xl font-bold text-neutral-900">
                        {t('shop.contact.message_sent')}
                      </h3>
                      <p className="mb-6 text-sm text-neutral-600">
                        {t('shop.contact.message_sent_desc')}
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsSuccess(false)}
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#a67c52] hover:underline"
                      >
                        {t('shop.contact.send_another')}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Name Surname */}
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold tracking-wider text-neutral-700 uppercase">
                          Name Surname
                        </label>
                        <input
                          type="text"
                          required
                          value={data.name}
                          onChange={(e) => setData('name', e.target.value)}
                          placeholder="Write Your Name and Surname"
                          className="w-full rounded-lg border border-neutral-200/80 bg-neutral-100/70 px-4 py-3 text-sm text-neutral-800 placeholder-neutral-400 transition-all outline-none focus:border-[#a67c52] focus:bg-white focus:ring-2 focus:ring-[#a67c52]/20"
                        />
                        {errors.name && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Email/Phone */}
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold tracking-wider text-neutral-700 uppercase">
                          Email/Phone
                        </label>
                        <input
                          type="text"
                          required
                          value={data.contact}
                          onChange={(e) => setData('contact', e.target.value)}
                          placeholder="Type Your E-mail Address or Phone Number"
                          className="w-full rounded-lg border border-neutral-200/80 bg-neutral-100/70 px-4 py-3 text-sm text-neutral-800 placeholder-neutral-400 transition-all outline-none focus:border-[#a67c52] focus:bg-white focus:ring-2 focus:ring-[#a67c52]/20"
                        />
                        {errors.contact && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.contact}
                          </p>
                        )}
                      </div>

                      {/* Message */}
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold tracking-wider text-neutral-700 uppercase">
                          Message
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={data.message}
                          onChange={(e) => setData('message', e.target.value)}
                          placeholder="Write Your Message"
                          className="w-full resize-none rounded-lg border border-neutral-200/80 bg-neutral-100/70 px-4 py-3 text-sm text-neutral-800 placeholder-neutral-400 transition-all outline-none focus:border-[#a67c52] focus:bg-white focus:ring-2 focus:ring-[#a67c52]/20"
                        />
                        {errors.message && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.message}
                          </p>
                        )}
                      </div>

                      {/* Submit Button */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={processing}
                          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#272a2e] px-8 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#1a1c1e] active:scale-[0.98] disabled:opacity-50"
                        >
                          {processing ? (
                            <>
                              <Loader2 size={16} className="animate-spin" />
                              <span>Sending...</span>
                            </>
                          ) : (
                            <>
                              <Send size={16} />
                              <span>Send</span>
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
