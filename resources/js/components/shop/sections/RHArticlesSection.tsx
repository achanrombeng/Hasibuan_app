import { ArticleItem } from './ArticlesSection';
import { Link } from '@inertiajs/react';
import React from 'react';

interface RHArticlesSectionProps {
  articles?: ArticleItem[];
}

export const RHArticlesSection: React.FC<RHArticlesSectionProps> = ({
  articles = [],
}) => {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="w-full bg-[#fcfcfb] py-20 md:py-32 px-6 sm:px-12 border-b border-neutral-200/60">
      <div className="max-w-[1720px] mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[10px] md:text-xs tracking-[0.35em] uppercase font-light text-neutral-500">
            THE ARCHITECTURAL JOURNAL
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-light tracking-[0.06em] text-neutral-900 uppercase">
            DESIGN ESSAYS & DISPATCHES
          </h2>
          <div className="w-12 h-[1px] bg-neutral-400 mx-auto mt-4" />
        </div>

        {/* 3-Column Articles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {articles.slice(0, 3).map((article) => (
            <Link
              key={article.id}
              href={`/shop/articles/${article.slug}`}
              className="group flex flex-col bg-white border border-neutral-200/70 p-5 transition-all duration-300"
            >
              <div className="aspect-[16/10] w-full overflow-hidden bg-neutral-100 mb-5">
                <img
                  src={
                    article.featured_image_url ||
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop'
                  }
                  alt={article.title}
                  className="w-full h-full object-cover rh-image-zoom"
                />
              </div>
              <div className="space-y-2 mt-auto">
                <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-light block">
                  ESSAY · {article.published_at || 'ARCHITECTURAL SERIES'}
                </span>
                <h4 className="font-serif text-xl font-light tracking-[0.04em] uppercase text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-2">
                  {article.title}
                </h4>
                {article.excerpt && (
                  <p className="text-xs text-neutral-500 line-clamp-2 font-light leading-relaxed">
                    {article.excerpt}
                  </p>
                )}
                <div className="pt-2">
                  <span className="text-[10px] tracking-[0.25em] uppercase font-medium text-neutral-900 border-b border-neutral-900 pb-0.5 group-hover:border-neutral-500 group-hover:text-neutral-500 transition-colors">
                    READ ESSAY
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
