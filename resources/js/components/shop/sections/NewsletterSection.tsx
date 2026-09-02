import { useTranslation } from '@/hooks/use-translation';
import { SiteSettings } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Loader2, Mail } from 'lucide-react';
import { useState } from 'react';

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' as const },
    },
};

export const NewsletterSection = () => {
    const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
    const { t } = useTranslation();
    const siteName = siteSettings?.site_name || 'Ronica';
    const [isSuccess, setIsSuccess] = useState(false);
    const [message, setMessage] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/shop/newsletter/subscribe', {
            preserveScroll: true,
            onSuccess: () => {
                setIsSuccess(true);
                setMessage(t('shop.newsletter.success'));
                reset();
                setTimeout(() => {
                    setIsSuccess(false);
                    setMessage('');
                }, 6000);
            },
            onError: (errs) => {
                if (errs.email) {
                    setMessage(errs.email);
                }
            },
        });
    };

    return (
        <section className="bg-white px-6 py-24 md:px-12">
            <div className="mx-auto max-w-[1400px]">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={containerVariants}
                    className="flex flex-col items-center justify-between gap-12 rounded-sm bg-teal-600 p-12 md:p-20 lg:flex-row"
                >
                    <motion.div
                        variants={itemVariants}
                        className="max-w-xl text-center lg:text-left"
                    >
                        <h2 className="font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
                            {t('shop.newsletter.title', { name: siteName })}
                        </h2>
                        <p className="mt-4 text-lg leading-relaxed text-teal-100">
                            {t('shop.newsletter.description')}
                        </p>
                    </motion.div>
                    <motion.div
                        variants={itemVariants}
                        className="w-full lg:w-auto"
                    >
                        {isSuccess ? (
                            <div className="flex items-center gap-3 rounded-sm bg-white px-6 py-4 text-teal-600 shadow-md">
                                <CheckCircle size={24} className="flex-shrink-0" />
                                <span className="font-medium">{message}</span>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <div className="relative">
                                        <Mail
                                            className="absolute top-1/2 left-4 -translate-y-1/2 text-neutral-400"
                                            size={20}
                                        />
                                        <input
                                            type="email"
                                            required
                                            value={data.email}
                                            onChange={(e) =>
                                                setData('email', e.target.value)
                                            }
                                            placeholder={t('shop.newsletter.placeholder')}
                                            className={`w-full rounded-sm border-none bg-white py-4 pr-4 pl-12 sm:w-80 ${
                                                errors.email
                                                    ? 'ring-2 ring-red-500'
                                                    : ''
                                            } transition-all focus:ring-2 focus:ring-teal-300 focus:outline-none`}
                                            disabled={processing}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex items-center justify-center gap-2 rounded-sm bg-amber-400 px-8 py-4 font-semibold text-neutral-800 transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2
                                                    size={18}
                                                    className="animate-spin"
                                                />
                                                {t('shop.newsletter.processing')}
                                            </>
                                        ) : (
                                            <>
                                                {t('shop.newsletter.subscribe')}
                                                <ArrowRight size={18} />
                                            </>
                                        )}
                                    </button>
                                </div>
                                {errors.email && (
                                    <p className="mt-2 ml-1 text-sm text-white/90">
                                        {errors.email}
                                    </p>
                                )}
                                {message && !isSuccess && (
                                    <p className="mt-2 ml-1 text-sm text-white/90">
                                        {message}
                                    </p>
                                )}
                                <p className="mt-4 text-center text-xs text-teal-200 sm:text-left">
                                    {t('shop.newsletter.privacy_note')}
                                </p>
                            </form>
                        )}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default NewsletterSection;
