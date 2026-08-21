import { SEOHead } from '@/components/seo';
import { useTranslation } from '@/hooks/use-translation';
import { ShopLayout } from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';
import { CheckCircle, Armchair, Send } from 'lucide-react';
import { useState } from 'react';

export default function Dealer() {
    const { t } = useTranslation();
    const { siteSettings } = usePage<{ siteSettings: SiteSettings }>().props;
    const siteName = siteSettings?.site_name || 'Ronica';
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            reset();
        }, 1500);
    };

    return (
        <>
            <SEOHead
                title="Dealer Form"
                description={`Dealer Form - ${siteName} Outdoor Furniture partnership inquiries.`}
                keywords={[
                    'dealer form',
                    'kemitraan furnitur',
                    'form dealer',
                    'inquiry',
                    'partnership',
                ]}
            />
            <div className="bg-noise" />
            <ShopLayout>
                <main className="min-h-screen bg-sand-50 pb-20">
                    {/* Hero Banner with Dark Pattern */}
                    <div className="relative overflow-hidden bg-[#383a3c] py-14 text-white">
                        <div
                            className="absolute inset-0 opacity-10"
                            style={{
                                backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
                                backgroundSize: '16px 16px',
                            }}
                        />
                        <div className="relative mx-auto max-w-[1400px] px-6 text-center md:px-12">
                            <h1 className="mb-3 font-serif text-3xl font-bold tracking-wide md:text-4xl">
                                Dealer Form
                            </h1>
                            <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-neutral-400">
                                <Link href="/shop" className="transition-colors hover:text-white">
                                    HOMEPAGE
                                </Link>
                                <span>/</span>
                                <span className="text-[#a67c52]">Dealer Form</span>
                            </div>
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
                                <div className="space-y-6 rounded-2xl bg-white p-8 border border-neutral-200/40 shadow-sm md:p-10">
                                    {/* Icon & Title Header */}
                                    <div>
                                        <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sand-100 text-[#a67c52]">
                                            <Armchair size={24} />
                                        </div>
                                        <h2 className="font-serif text-2xl font-bold text-neutral-900 md:text-3xl">
                                            Dealer Form
                                        </h2>
                                        <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                                            We are here to evaluate business partnership opportunities quickly and effectively.
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
                                                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-700">
                                                    Name Surname
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    placeholder="Write Your Name and Surname"
                                                    className="w-full rounded-lg border border-neutral-200/80 bg-neutral-100/70 px-4 py-3 text-sm text-neutral-800 placeholder-neutral-400 outline-none transition-all focus:border-[#a67c52] focus:bg-white focus:ring-2 focus:ring-[#a67c52]/20"
                                                />
                                            </div>

                                            {/* E-mail */}
                                            <div>
                                                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-700">
                                                    E-mail
                                                </label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    placeholder="Type Your E-mail Address"
                                                    className="w-full rounded-lg border border-neutral-200/80 bg-neutral-100/70 px-4 py-3 text-sm text-neutral-800 placeholder-neutral-400 outline-none transition-all focus:border-[#a67c52] focus:bg-white focus:ring-2 focus:ring-[#a67c52]/20"
                                                />
                                            </div>

                                            {/* Phone */}
                                            <div>
                                                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-700">
                                                    Phone
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={data.phone}
                                                    onChange={(e) => setData('phone', e.target.value)}
                                                    placeholder="Type Your Phone Number"
                                                    className="w-full rounded-lg border border-neutral-200/80 bg-neutral-100/70 px-4 py-3 text-sm text-neutral-800 placeholder-neutral-400 outline-none transition-all focus:border-[#a67c52] focus:bg-white focus:ring-2 focus:ring-[#a67c52]/20"
                                                />
                                            </div>

                                            {/* Message */}
                                            <div>
                                                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-700">
                                                    Message
                                                </label>
                                                <textarea
                                                    required
                                                    rows={4}
                                                    value={data.message}
                                                    onChange={(e) => setData('message', e.target.value)}
                                                    placeholder="Write Your Message"
                                                    className="w-full resize-none rounded-lg border border-neutral-200/80 bg-neutral-100/70 px-4 py-3 text-sm text-neutral-800 placeholder-neutral-400 outline-none transition-all focus:border-[#a67c52] focus:bg-white focus:ring-2 focus:ring-[#a67c52]/20"
                                                />
                                            </div>

                                            {/* Submit Button */}
                                            <div className="pt-2">
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#272a2e] px-8 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#1a1c1e] active:scale-[0.98] disabled:opacity-50"
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <span className="animate-spin">⏳</span>
                                                            Sending...
                                                        </>
                                                    ) : (
                                                        <>
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
