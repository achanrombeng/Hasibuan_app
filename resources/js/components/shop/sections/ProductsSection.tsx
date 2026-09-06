import { ApiProduct } from '@/types/shop';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '../ProductCard';


interface ProductsSectionProps {
    products: ApiProduct[];
    badge?: string;
    title?: string;
}

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
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

export const ProductsSection: React.FC<ProductsSectionProps> = ({
    products,
    badge = 'Best Sellers',
    title = 'Featured Products',
}) => {
    if (products.length === 0) {
        return null;
    }

    return (
        <section className="bg-white px-6 py-24 md:px-12">
            <div className="mx-auto max-w-[1400px]">
                {/* Section Header */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={containerVariants}
                    className="mb-16 flex flex-col items-center text-center"
                >
                    <motion.div variants={itemVariants}>
                        <span className="text-xs font-medium tracking-[0.15em] text-teal-500 uppercase">
                            {badge}
                        </span>
                        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-neutral-800 md:text-5xl">
                            {title}
                        </h2>
                    </motion.div>
                </motion.div>

                {/* Product Grid - 4 columns */}
                <div className="grid grid-cols-2 gap-6 md:gap-8 lg:grid-cols-4">
                    {products.slice(0, 4).map((apiProduct) => (
                        <ProductCard key={apiProduct.id} product={apiProduct} />
                    ))}
                </div>

                {/* View All Button */}
                <div className="mt-14 flex justify-center">
                    <Link
                        href="/shop/products"
                        className="group inline-flex items-center gap-2 rounded-full border border-neutral-300 px-8 py-3 text-sm font-medium text-neutral-800 transition-all duration-300 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
                    >
                        View All Products
                        <ArrowRight
                            size={16}
                            className="transition-transform group-hover:translate-x-1"
                        />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ProductsSection;
