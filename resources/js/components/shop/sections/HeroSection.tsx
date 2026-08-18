import { useTranslation } from '@/hooks/use-translation';
import { HeroSettings } from '@/types/shop';
import { Link } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Default placeholder
const HERO_PLACEHOLDER = '/images/placeholders/hero-main.png';

interface HeroSectionProps {
    settings: HeroSettings;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ settings }) => {
    const { t } = useTranslation();
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 400], [1, 0]);
    // Parallax effect: Image moves slower than content
    // We start with a taller image and move it effectively "down" (relative to container) to counteract the scroll
    const y = useTransform(scrollY, [0, 1000], [0, 200]);

    const heroImage = settings.image_main || HERO_PLACEHOLDER;

    return (
        <section className="relative flex h-screen min-h-[700px] justify-center overflow-hidden">
            {/* Background Image with Parallax */}
            <motion.div
                style={{ y }}
                className="absolute -top-[12.5%] left-0 z-0 h-[125%] w-full"
            >
                {settings.media_type === 'video' ? (
                    <video
                        src={heroImage}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <img
                        src={heroImage}
                        className="h-full w-full object-cover"
                        alt="Hero Furniture"
                    />
                )}
                {/* Subtle overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
            </motion.div>

            {/* Content */}
            <motion.div
                style={{ opacity }}
                className="relative z-10 mx-auto max-w-4xl px-6 pt-36 text-center"
            >
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* Badge */}
                    <span className="mb-8 inline-block rounded-sm border border-white/40 px-4 py-1.5 text-xs font-medium tracking-[0.2em] text-white/90 uppercase backdrop-blur-sm">
                        {settings.badge}
                    </span>

                    {/* Main Heading - Minimal & Elegant (per design.md) */}
                    <h1 className="mb-6 font-display text-4xl leading-[1.1] font-semibold tracking-tight text-white md:text-6xl lg:text-7xl">
                        {settings.title}
                        {settings.title_highlight && (
                            <>
                                <br />
                                <span className="font-medium text-accent-500">
                                    {settings.title_highlight}
                                </span>
                            </>
                        )}
                    </h1>

                    {/* Subheading - Short & Elegant */}
                    <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed font-light text-white/80 md:text-xl">
                        {settings.description}
                    </p>

                    {/* Single CTA (per design.md: 1 CTA utama) */}
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/shop/products"
                            className="group inline-flex items-center gap-3 rounded-sm bg-white px-8 py-4 font-medium text-teal-500 shadow-lg transition-all duration-300 hover:bg-accent-500 hover:text-neutral-800"
                        >
                            {t('shop.home.explore_collection')}
                            <ArrowRight
                                size={18}
                                className="transition-transform group-hover:translate-x-1"
                            />
                        </Link>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default HeroSection;
