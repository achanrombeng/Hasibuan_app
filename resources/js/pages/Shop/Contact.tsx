import { SEOHead } from '@/components/seo';
import { useTranslation } from '@/hooks/use-translation';
import { ShopLayout } from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import {
    CheckCircle,
    Clock,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Send,
} from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
    const { t } = useTranslation();
    const { siteSettings } = usePage<{ siteSettings: SiteSettings }>().props;
    const siteName = siteSettings?.site_name || 'Ronica';
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    // Build contact info from settings
    const contactInfo = [
        {
            icon: MapPin,
            title: t('shop.contact.info_address'),
            lines: siteSettings?.address
                ? [siteSettings.address]
                : [t('shop.contact.address_not_set')],
        },
        {
            icon: Phone,
            title: t('shop.contact.info_phone'),
            lines: siteSettings?.contact_phone
                ? [siteSettings.contact_phone]
                : [t('shop.contact.phone_not_set')],
        },
        {
            icon: Mail,
            title: t('shop.contact.info_email'),
            lines: siteSettings?.contact_email
                ? [siteSettings.contact_email]
                : [t('shop.contact.email_not_set')],
        },
        {
            icon: Clock,
            title: t('shop.contact.info_hours'),
            lines: [
                t('shop.contact.hours_weekday'),
                t('shop.contact.hours_sunday'),
            ],
        },
    ];

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
                        <div className="grid gap-12 lg:grid-cols-3">
                            {/* Contact Info */}
                            <div className="lg:col-span-1">
                                <h2 className="mb-6 font-serif text-2xl text-terra-900">
                                    {t('shop.contact.contact_info')}
                                </h2>
                                <div className="space-y-6">
                                    {contactInfo.map((info, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-sm bg-teal-100">
                                                <info.icon
                                                    size={24}
                                                    className="text-teal-600"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="mb-1 font-medium text-terra-900">
                                                    {info.title}
                                                </h3>
                                                {info.lines.map((line, j) => (
                                                    <p
                                                        key={j}
                                                        className="text-sm text-terra-500"
                                                    >
                                                        {line}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Quick Contact */}
                                {siteSettings?.contact_whatsapp && (
                                    <div className="mt-8 rounded-sm bg-teal-700 p-6 text-white">
                                        <h3 className="mb-3 font-medium">
                                            {t('shop.contact.quick_response_title')}
                                        </h3>
                                        <p className="mb-4 text-sm opacity-80">
                                            {t('shop.contact.quick_response_desc')}
                                        </p>
                                        <a
                                            href={`https://wa.me/${siteSettings.contact_whatsapp}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex w-full items-center justify-center gap-2 rounded-sm bg-white py-3 font-medium text-teal-700 transition-colors hover:bg-teal-50"
                                        >
                                            <MessageCircle size={20} />
                                            <span>{t('shop.contact.chat_whatsapp')}</span>
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Contact Form */}
                            <div className="lg:col-span-2">
                                <div className="rounded-sm border border-terra-100 bg-white p-8">
                                    <h2 className="mb-6 font-serif text-2xl text-terra-900">
                                        {t('shop.contact.send_message')}
                                    </h2>

                                    {isSuccess ? (
                                        <div className="py-12 text-center">
                                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-teal-100">
                                                <CheckCircle
                                                    size={40}
                                                    className="text-teal-600"
                                                />
                                            </div>
                                            <h3 className="mb-2 text-xl font-medium text-terra-900">
                                                {t('shop.contact.message_sent')}
                                            </h3>
                                            <p className="mb-6 text-terra-500">
                                                {t('shop.contact.message_sent_desc')}
                                            </p>
                                            <button
                                                onClick={() =>
                                                    setIsSuccess(false)
                                                }
                                                className="text-wood hover:text-wood-dark"
                                            >
                                                {t('shop.contact.send_another')}
                                            </button>
                                        </div>
                                    ) : (
                                        <form
                                            onSubmit={handleSubmit}
                                            className="space-y-6"
                                        >
                                            <div className="grid gap-6 md:grid-cols-2">
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-terra-700">
                                                        {t('shop.contact.form_name_label')}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={data.name}
                                                        onChange={(e) =>
                                                            setData(
                                                                'name',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded-sm border border-terra-200 px-4 py-3 outline-none focus:border-wood focus:ring-1 focus:ring-wood"
                                                        placeholder={t('shop.contact.form_name_placeholder')}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-terra-700">
                                                        {t('shop.contact.form_email_label')}
                                                    </label>
                                                    <input
                                                        type="email"
                                                        required
                                                        value={data.email}
                                                        onChange={(e) =>
                                                            setData(
                                                                'email',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded-sm border border-neutral-200 px-4 py-3 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                                                        placeholder={t('shop.contact.form_email_placeholder')}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid gap-6 md:grid-cols-2">
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-terra-700">
                                                        {t('shop.contact.form_phone_label')}
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        value={data.phone}
                                                        onChange={(e) =>
                                                            setData(
                                                                'phone',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded-sm border border-terra-200 px-4 py-3 outline-none focus:border-wood focus:ring-1 focus:ring-wood"
                                                        placeholder={t('shop.contact.form_phone_placeholder')}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-terra-700">
                                                        {t('shop.contact.form_subject_label')}
                                                    </label>
                                                    <select
                                                        required
                                                        value={data.subject}
                                                        onChange={(e) =>
                                                            setData(
                                                                'subject',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded-sm border border-terra-200 bg-white px-4 py-3 outline-none focus:border-wood focus:ring-1 focus:ring-wood"
                                                    >
                                                        <option value="">
                                                            {t('shop.contact.form_subject_placeholder')}
                                                        </option>
                                                        <option value="inquiry">
                                                            {t('shop.contact.subject_inquiry')}
                                                        </option>
                                                        <option value="order">
                                                            {t('shop.contact.subject_order')}
                                                        </option>
                                                        <option value="custom">
                                                            {t('shop.contact.subject_custom')}
                                                        </option>
                                                        <option value="complaint">
                                                            {t('shop.contact.subject_complaint')}
                                                        </option>
                                                        <option value="partnership">
                                                            {t('shop.contact.subject_partnership')}
                                                        </option>
                                                        <option value="other">
                                                            {t('shop.contact.subject_other')}
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-terra-700">
                                                    {t('shop.contact.form_message_label')}
                                                </label>
                                                <textarea
                                                    required
                                                    rows={5}
                                                    value={data.message}
                                                    onChange={(e) =>
                                                        setData(
                                                            'message',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full resize-none rounded-sm border border-neutral-200 px-4 py-3 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                                                    placeholder={t('shop.contact.form_message_placeholder')}
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="flex w-full items-center justify-center gap-2 rounded-sm bg-teal-600 py-4 font-medium text-white transition-colors hover:bg-teal-700 disabled:opacity-50"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <span className="animate-spin">
                                                            ⏳
                                                        </span>{' '}
                                                        {t('shop.contact.form_sending')}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send size={20} />
                                                        {t('shop.contact.form_submit')}
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Map */}
                        <div className="mt-16">
                            <h2 className="mb-6 font-serif text-2xl text-terra-900">
                                {t('shop.contact.our_location')}
                            </h2>
                            <div className="aspect-[21/9] overflow-hidden rounded-sm bg-terra-200">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126646.19650689476!2d110.5944!3d-6.5877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e711ef138b2f51d%3A0x40dfe5e29e55df0!2sJepara%2C%20Jepara%20Regency%2C%20Central%20Java!5e0!3m2!1sen!2sid!4v1699999999999!5m2!1sen!2sid"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title={`Lokasi ${siteName}`}
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </main>
            </ShopLayout>
        </>
    );
}
