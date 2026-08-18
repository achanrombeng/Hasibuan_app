import { SEOHead } from '@/components/seo';
import { useTranslation } from '@/hooks/use-translation';
import { ShopLayout } from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import { ApiCategory } from '@/types/shop';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface Props {
    categories: ApiCategory[] | { data: ApiCategory[] };
}

// Placeholder untuk kategori - gunakan gambar dari database
const PLACEHOLDER_CATEGORY = '/images/placeholder-category.svg';

export default function CategoriesIndex({ categories }: Props) {
    const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
    const siteName = siteSettings?.site_name || 'Ronica';
    const { t } = useTranslation();
    const categoriesList = Array.isArray(categories)
        ? categories
        : categories.data;

    return (
        <>
            <SEOHead
                title={t('shop.categories.title')}
                description={t('shop.categories.seo_description', { siteName })}
                keywords={[
                    'kategori furnitur',
                    'ruang tamu',
                    'ruang makan',
                    'kamar tidur',
                    'furnitur kantor',
                    'outdoor furniture',
                ]}
            />
            <div className="bg-noise" />
            <ShopLayout>
                <main className="min-h-screen bg-white pt-8 pb-20">
                    <div className="mx-auto max-w-[1400px] px-6 md:px-12">
                        {/* Header */}
                        <div className="mb-16 text-center">
                            <h1 className="mb-4 font-serif text-4xl text-terra-900 md:text-5xl">
                                {t('shop.categories.browse')}
                            </h1>
                            <p className="mx-auto max-w-xl text-terra-500">
                                {t('shop.categories.description')}
                            </p>
                        </div>

                        {/* Categories Grid - Bento Style */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {categoriesList.map((category, index) => (
                                <CategoryCard
                                    key={category.id}
                                    category={category}
                                    index={index}
                                />
                            ))}
                        </div>

                        {/* Empty State */}
                        {categoriesList.length === 0 && (
                            <div className="py-20 text-center">
                                <h3 className="mb-2 text-xl font-medium text-terra-900">
                                    {t('shop.categories.no_categories')}
                                </h3>
                                <p className="text-terra-500">
                                    {t('shop.categories.no_categories_desc')}
                                </p>
                            </div>
                        )}
                    </div>
                </main>
            </ShopLayout>
        </>
    );
}

interface CategoryCardProps {
    category: ApiCategory;
    index: number;
}

function CategoryCard({ category, index }: CategoryCardProps) {
    const { t } = useTranslation();
    const imageUrl = category.image_url || PLACEHOLDER_CATEGORY;

    // Make first 2 cards larger on desktop
    const isLarge = index < 2;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${isLarge ? 'lg:col-span-1 lg:row-span-2' : ''} h-full`}
        >
            <Link
                href={`/shop/products?filter[category]=${category.slug}`}
                className="group relative block h-full overflow-hidden rounded-sm bg-sand-100 shadow-sm"
            >
                <div
                    className={`relative w-full overflow-hidden ${isLarge ? 'h-full min-h-[400px]' : 'aspect-[4/3]'}`}
                >
                    <img
                        src={imageUrl}
                        alt={category.name}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Content */}
                    <div className="absolute right-0 bottom-0 left-0 p-6 md:p-8">
                        <h3 className="mb-2 font-serif text-2xl text-white md:text-3xl">
                            {category.name}
                        </h3>
                        {category.description && (
                            <p className="mb-4 line-clamp-2 text-sm text-white/80">
                                {category.description}
                            </p>
                        )}
                        {category.products_count !== undefined && (
                            <span className="text-sm text-white/60">
                                {t('shop.categories.products_count', { count: category.products_count })}
                            </span>
                        )}
                        <div className="mt-4 flex translate-y-2 transform items-center gap-2 text-white opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                            <span className="text-sm font-medium">
                                {t('common.view_all')}
                            </span>
                            <ArrowRight
                                size={16}
                                className="transition-transform group-hover:translate-x-1"
                            />
                        </div>
                    </div>

                    {/* Featured Badge */}
                    {category.is_featured && (
                        <span className="absolute top-4 left-4 rounded-full bg-wood px-3 py-1 text-sm font-medium text-white">
                            {t('common.featured')}
                        </span>
                    )}
                </div>
            </Link>
        </motion.div>
    );
}
