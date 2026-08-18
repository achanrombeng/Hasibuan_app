import { ApiProduct } from '@/types/shop';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '../ProductCard';

// Placeholder images for products without images
const PLACEHOLDER_PRODUCTS = [
    '/images/placeholders/product-sofa.png',
    '/images/placeholders/product-dining-table.png',
    '/images/placeholders/product-chair.png',
];

interface ProductsSectionProps {
    products: ApiProduct[];
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
                    className="mb-16 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end"
                >
                    <motion.div variants={itemVariants}>
                        <span className="text-xs font-medium tracking-[0.15em] text-teal-500 uppercase">
                            Best Sellers
                        </span>
                        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-neutral-800 md:text-5xl">
                            Featured Products
                        </h2>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Link
                            href="/shop/products"
                            className="group flex items-center gap-2 font-medium text-neutral-800 transition-colors hover:text-teal-500"
                        >
                            View All
                            <ArrowRight
                                size={18}
                                className="transition-transform group-hover:translate-x-1"
                            />
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Product Grid - 3-4 columns per design.md */}
                <div className="grid grid-cols-2 gap-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map((apiProduct) => (
                        <ProductCard key={apiProduct.id} product={apiProduct} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductsSection;
