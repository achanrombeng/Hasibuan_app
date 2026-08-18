import { useTranslation } from '@/hooks/use-translation';
import { HomeValue } from '@/types/shop';
import { motion } from 'framer-motion';
import { Leaf, LucideIcon, ShieldCheck, Truck } from 'lucide-react';

interface ValuesSectionProps {
    values: HomeValue[];
}

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
    leaf: Leaf,
    truck: Truck,
    'shield-check': ShieldCheck,
};

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

export const ValuesSection: React.FC<ValuesSectionProps> = ({ values }) => {
    const { t } = useTranslation();

    return (
        <section className="bg-white py-24">
            <div className="mx-auto max-w-[1400px] px-6 md:px-12">
                {/* Section Header */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={containerVariants}
                    className="mb-16 text-center"
                >
                    <motion.span
                        variants={itemVariants}
                        className="text-xs font-medium tracking-[0.15em] text-teal-500 uppercase"
                    >
                        {t('shop.home.values_badge')}
                    </motion.span>
                    <motion.h2
                        variants={itemVariants}
                        className="mt-3 font-display text-4xl font-semibold tracking-tight text-neutral-800 md:text-5xl"
                    >
                        {t('shop.home.values_title')}
                    </motion.h2>
                </motion.div>

            {/* Values Grid */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={containerVariants}
                className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8"
            >
                {values.map((item, i) => {
                    const IconComponent = iconMap[item.icon] || Leaf;
                    return (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            className="group rounded-sm bg-neutral-50 p-10 text-center transition-all duration-300 hover:bg-teal-500 hover:shadow-xl"
                        >
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-sm bg-teal-500/10 text-teal-500 transition-colors group-hover:bg-white group-hover:text-teal-500">
                                <IconComponent size={28} />
                            </div>
                            <h3 className="mt-6 mb-3 font-display text-xl font-semibold text-neutral-800 transition-colors group-hover:text-white">
                                {item.title}
                            </h3>
                            <p className="leading-relaxed text-neutral-500 transition-colors group-hover:text-teal-100">
                                {item.desc}
                            </p>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    </section>
    );
};

export default ValuesSection;
