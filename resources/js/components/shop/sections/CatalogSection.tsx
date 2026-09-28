import { ApiCategory } from '@/types/shop';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import React from 'react';

interface CategoryItem {
  id: string;
  title: string;
  slug: string;
  image: string;
  badgePosition: 'bottom-left' | 'bottom-right';
}

const CATEGORY_ITEMS: CategoryItem[] = [
  {
    id: 'corner-sets',
    title: 'Seating Sets',
    slug: 'corner-sets',
    image:
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1400&auto=format&fit=crop',
    badgePosition: 'bottom-left',
  },
  {
    id: 'dining-sets',
    title: 'Dining Sets',
    slug: 'dining-sets',
    image:
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1400&auto=format&fit=crop',
    badgePosition: 'bottom-right',
  },
  {
    id: 'chairs',
    title: 'Chairs',
    slug: 'chairs',
    image:
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1400&auto=format&fit=crop',
    badgePosition: 'bottom-left',
  },
  {
    id: 'tables',
    title: 'Tables',
    slug: 'tables',
    image:
      'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?q=80&w=1400&auto=format&fit=crop',
    badgePosition: 'bottom-right',
  },
  {
    id: 'sun-loungers',
    title: 'Sun Loungers',
    slug: 'sun-loungers',
    image:
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1400&auto=format&fit=crop',
    badgePosition: 'bottom-left',
  },
  {
    id: 'natural-rattan',
    title: 'Natural Rattan',
    slug: 'natural-rattan',
    image:
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=1400&auto=format&fit=crop',
    badgePosition: 'bottom-right',
  },
];

interface CatalogSectionProps {
  className?: string;
  categories?: ApiCategory[] | { data: ApiCategory[] };
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  className = 'py-16 md:py-24',
  categories,
}) => {
  const categoriesList = React.useMemo(() => {
    if (!categories) return [];
    return Array.isArray(categories)
      ? categories
      : (categories as any).data || [];
  }, [categories]);

  const items: CategoryItem[] = React.useMemo(() => {
    if (categoriesList && categoriesList.length > 0) {
      const sorted = [...categoriesList].sort((a: any, b: any) => {
        const orderA = typeof a.sort_order === 'number' ? a.sort_order : 0;
        const orderB = typeof b.sort_order === 'number' ? b.sort_order : 0;
        if (orderA !== orderB) return orderA - orderB;
        return (a.name || '').localeCompare(b.name || '', undefined, {
          sensitivity: 'base',
        });
      });
      return sorted.map((c: ApiCategory, index: number) => {
        const defaultMatch = CATEGORY_ITEMS.find(
          (item) =>
            item.slug === c.slug ||
            item.title.toLowerCase() === c.name.toLowerCase(),
        );
        return {
          id: c.slug || `cat-${c.id}`,
          title: c.name,
          slug: c.slug,
          image:
            c.image_url ||
            defaultMatch?.image ||
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1400&auto=format&fit=crop',
          badgePosition: index % 2 === 0 ? 'bottom-left' : 'bottom-right',
        };
      });
    }
    return CATEGORY_ITEMS;
  }, [categoriesList]);
  return (
    <section className={`bg-white ${className}`}>
      <div className="mx-auto max-w-[1440px] px-4 md:px-8 lg:px-12">
        {/* Top Armchair Icon */}
        <div className="mb-3 flex justify-center">
          <svg
            width="44"
            height="44"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#b49a78]"
          >
            <path
              d="M16 24V16C16 11.5817 19.5817 8 24 8H40C44.4183 8 48 11.5817 48 16V24"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M12 28C12 25.7909 13.7909 24 16 24H48C50.2091 24 52 25.7909 52 28V36C52 38.2091 50.2091 40 48 40H16C13.7909 40 12 38.2091 12 36V28Z"
              stroke="currentColor"
              strokeWidth="2.5"
            />
            <path
              d="M8 28C8 25.7909 9.79086 24 12 24V44C9.79086 44 8 42.2091 8 40V28Z"
              stroke="currentColor"
              strokeWidth="2.5"
            />
            <path
              d="M52 24C54.2091 24 56 25.7909 52 28V40C56 42.2091 54.2091 44 52 44V24Z"
              stroke="currentColor"
              strokeWidth="2.5"
            />
            <path
              d="M16 40V52M48 40V52"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="mb-4 font-serif text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
            Product Categories
          </h2>
          <p className="font-sans text-sm leading-relaxed text-neutral-600 md:text-base">
            The Ronica collection combines the durability of hand-woven rattan
            and Grade-A teak wood with modern design. Adding tropical elegance
            to your living space with natural grace and superior craftsmanship.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={`/shop/products?filter[category]=${item.slug}`}
                className="group relative block aspect-[4/3] overflow-hidden rounded-sm bg-neutral-100 shadow-md transition-all duration-500 hover:shadow-2xl"
              >
                {/* Background Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover brightness-[0.96] transition-transform duration-700 group-hover:scale-105"
                />

                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />

                {/* Frosted Glass Badge Overlay */}
                <div
                  className={`absolute ${
                    item.badgePosition === 'bottom-left'
                      ? 'bottom-6 left-6'
                      : 'right-6 bottom-6'
                  }`}
                >
                  <div className="rounded-sm border border-white/60 bg-white/85 px-6 py-3 shadow-lg backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:bg-white">
                    <span className="font-serif text-base font-bold tracking-wide text-neutral-900 md:text-lg">
                      {item.title}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CatalogSection;
