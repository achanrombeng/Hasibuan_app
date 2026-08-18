import { HomeTestimonial } from '@/types/shop';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

interface TestimonialsSectionProps {
    testimonials: HomeTestimonial[];
}

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

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
    testimonials,
}) => {
    if (testimonials.length === 0) {
        return null;
    }

    return (
        <section className="relative overflow-hidden bg-neutral-50 py-24">
            {/* Decorative Quote */}
            <div className="pointer-events-none absolute top-10 left-10 font-display text-[300px] leading-none text-teal-500 opacity-[0.03]">
                "
            </div>

            <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12">
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
                        Testimonials
                    </motion.span>
                    <motion.h2
                        variants={itemVariants}
                        className="mt-3 font-display text-4xl font-semibold tracking-tight text-neutral-800 md:text-5xl"
                    >
                        What Our Customers Say
                    </motion.h2>
                </motion.div>

                {/* Testimonials Grid */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={containerVariants}
                    className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8"
                >
                    {testimonials.map((t) => (
                        <motion.div
                            key={t.id}
                            variants={itemVariants}
                            className="rounded-sm border border-neutral-100 bg-white p-8 transition-all duration-300 hover:border-teal-100 hover:shadow-lg md:p-10"
                        >
                            {/* Rating */}
                            <div className="mb-6 flex items-center gap-2">
                                <Quote size={20} className="text-teal-500" />
                                <div className="ml-auto flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            className={
                                                i < t.rating
                                                    ? 'fill-accent-500 text-accent-500'
                                                    : 'text-neutral-200'
                                            }
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Quote Text */}
                            <p className="mb-8 text-lg leading-relaxed text-neutral-600">
                                "{t.text}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-teal-500 font-display text-lg font-semibold text-white">
                                    {t.author[0]}
                                </div>
                                <div>
                                    <p className="font-medium text-neutral-800">
                                        {t.author}
                                    </p>
                                    <p className="text-sm text-neutral-400">
                                        {t.location}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
