import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Gift, Percent, Truck, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface PromoBannerProps {
    type?: 'banner' | 'popup';
    storageKey?: string;
    delayPopup?: number; // delay in ms before showing popup
    onVisibilityChange?: (visible: boolean) => void; // callback when banner visibility changes
}

interface PromoData {
    id: number;
    title: string;
    description: string | null;
    cta_text: string;
    cta_link: string;
    icon: 'gift' | 'percent' | 'truck';
    bg_gradient: string;
    display_type: 'banner' | 'popup' | 'both';
}

const IconMap = {
    gift: Gift,
    percent: Percent,
    truck: Truck,
};

function shouldShowPromo(storageKey: string): boolean {
    if (typeof window === 'undefined') return true;

    const dismissed = localStorage.getItem(storageKey);
    if (dismissed) {
        const dismissedTime = parseInt(dismissed, 10);
        // Show again after 24 hours
        if (Date.now() - dismissedTime < 24 * 60 * 60 * 1000) {
            return false;
        }
    }
    return true;
}

export function PromoBanner({
    type = 'banner',
    storageKey = 'promo_dismissed',
    delayPopup = 3000,
    onVisibilityChange,
}: PromoBannerProps) {
    // Get active promo banners from shared Inertia data
    const { activePromoBanners } = usePage<{
        activePromoBanners: PromoData[];
    }>().props;

    // Filter promos by display type
    const currentPromo = useMemo(() => {
        const promos = activePromoBanners || [];
        const filtered = promos.filter((promo) => {
            if (type === 'banner') {
                return (
                    promo.display_type === 'banner' ||
                    promo.display_type === 'both'
                );
            }
            if (type === 'popup') {
                return (
                    promo.display_type === 'popup' ||
                    promo.display_type === 'both'
                );
            }
            return true;
        });
        return filtered[0] || null;
    }, [activePromoBanners, type]);

    const [isVisible, setIsVisible] = useState(false);

    // Initialize visibility on client side only
    useEffect(() => {
        if (!currentPromo) {
            setIsVisible(false);
            return;
        }

        if (!shouldShowPromo(storageKey)) {
            setIsVisible(false);
            return;
        }

        if (type === 'banner') {
            setIsVisible(true);
        } else if (type === 'popup') {
            const timer = setTimeout(() => setIsVisible(true), delayPopup);
            return () => clearTimeout(timer);
        }
    }, [type, storageKey, delayPopup, currentPromo]);

    // Notify parent about visibility changes (for banner type only)
    useEffect(() => {
        if (type === 'banner' && onVisibilityChange) {
            onVisibilityChange(isVisible && !!currentPromo);
        }
    }, [isVisible, type, onVisibilityChange, currentPromo]);

    const handleDismiss = () => {
        setIsVisible(false);
        if (typeof window !== 'undefined') {
            localStorage.setItem(storageKey, Date.now().toString());
        }
    };

    // Don't render if no promo available
    if (!currentPromo) {
        return null;
    }

    const Icon = IconMap[currentPromo.icon] || Percent;

    if (type === 'banner') {
        return (
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className={`bg-gradient-to-r ${currentPromo.bg_gradient} overflow-hidden text-white`}
                    >
                        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-2">
                            <div className="flex flex-1 items-center justify-center gap-3">
                                <Icon size={18} />
                                <span className="font-medium">
                                    {currentPromo.title}
                                </span>
                                {currentPromo.description && (
                                    <span className="hidden opacity-90 sm:inline">
                                        - {currentPromo.description}
                                    </span>
                                )}
                                <Link
                                    href={currentPromo.cta_link}
                                    className="hidden items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-sm transition-colors hover:bg-white/30 md:flex"
                                >
                                    {currentPromo.cta_text}{' '}
                                    <ArrowRight size={14} />
                                </Link>
                            </div>
                            <button
                                onClick={handleDismiss}
                                className="rounded-full p-1 transition-colors hover:bg-white/20"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    }

    // Popup variant
    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/50"
                        onClick={handleDismiss}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2"
                    >
                        <div
                            className={`bg-gradient-to-br ${currentPromo.bg_gradient} rounded-sm p-8 text-center text-white shadow-2xl`}
                        >
                            <button
                                onClick={handleDismiss}
                                className="absolute top-4 right-4 rounded-full p-2 transition-colors hover:bg-white/20"
                            >
                                <X size={20} />
                            </button>
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                                <Icon size={32} />
                            </div>
                            <h2 className="mb-2 text-2xl font-bold">
                                {currentPromo.title}
                            </h2>
                            {currentPromo.description && (
                                <p className="mb-6 opacity-90">
                                    {currentPromo.description}
                                </p>
                            )}
                            <Link
                                href={currentPromo.cta_link}
                                onClick={handleDismiss}
                                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-neutral-900 transition-colors hover:bg-neutral-100"
                            >
                                {currentPromo.cta_text} <ArrowRight size={18} />
                            </Link>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
