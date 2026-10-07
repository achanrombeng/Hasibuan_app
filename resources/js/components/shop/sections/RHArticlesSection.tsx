import { cn } from '@/lib/utils';
import { SectionBgConfig } from '@/types/shop';
import { Link } from '@inertiajs/react';
import React from 'react';
import { ArticleItem } from './ArticlesSection';
import { getSectionBgStyles, isDarkTheme, SectionBgOverlay } from './sectionBgHelper';

interface RHArticlesSectionProps {
  articles?: ArticleItem[];
  bgConfig?: SectionBgConfig;
}

export const RHArticlesSection: React.FC<RHArticlesSectionProps> = ({
  articles = [],
  bgConfig,
}) => {
  if (!articles || articles.length === 0) return null;

  const isCustom = bgConfig && bgConfig.type !== 'default';
  const isDark = isDarkTheme(bgConfig);

  return (
    <section
      className={cn(
        'w-full py-20 md:py-32 px-6 sm:px-12 border-b transition-colors relative overflow-hidden',
        !isCustom && 'bg-[#fcfcfb] border-neutral-200/60',
        isCustom && isDark && 'text-white border-white/10',
        isCustom && !isDark && 'text-neutral-900 border-neutral-200/60',
      )}
      style={getSectionBgStyles(bgConfig)}
    >
      <SectionBgOverlay config={bgConfig} />
      <div className="relative z-10 max-w-[1720px] mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span
            className={cn(
              'text-[10px] md:text-xs tracking-[0.35em] uppercase font-light',
              isDark ? 'text-neutral-300' : 'text-neutral-500',
            )}
          >
            THE ARCHITECTURAL JOURNAL
          </span>
          <h2
            className={cn(
              'font-serif text-2xl sm:text-4xl font-light tracking-[0.06em] uppercase',
              isDark ? 'text-white' : 'text-neutral-900',
            )}
          >
            DESIGN ESSAYS & DISPATCHES
          </h2>
          <div
            className={cn(
              'w-12 h-[1px] mx-auto mt-4',
              isDark ? 'bg-neutral-500' : 'bg-neutral-400',
            )}
          />
        </div>

        {/* 3-Column Articles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {articles.slice(0, 3).map((article) => (
            <Link
              key={article.id}
              href={`/shop/articles/${article.slug}`}
              className={cn(
                'group flex flex-col border p-5 transition-all duration-300',
                isDark
                  ? 'bg-neutral-900/85 border-neutral-700/80 text-white backdrop-blur-sm'
                  : 'bg-white border-neutral-200/70 text-neutral-900',
              )}
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
                <span
                  className={cn(
                    'text-[10px] tracking-[0.25em] uppercase font-light block',
                    isDark ? 'text-neutral-400' : 'text-neutral-400',
                  )}
                >
                  ESSAY · {article.published_at || 'ARCHITECTURAL SERIES'}
                </span>
                <h4
                  className={cn(
                    'font-serif text-xl font-light tracking-[0.04em] uppercase transition-colors line-clamp-2',
                    isDark
                      ? 'text-white group-hover:text-neutral-300'
                      : 'text-neutral-900 group-hover:text-neutral-600',
                  )}
                >
                  {article.title}
                </h4>
                {article.excerpt && (
                  <p
                    className={cn(
                      'text-xs line-clamp-2 font-light leading-relaxed',
                      isDark ? 'text-neutral-300' : 'text-neutral-500',
                    )}
                  >
                    {article.excerpt}
                  </p>
                )}
                <div className="pt-2">
                  <span
                    className={cn(
                      'text-[10px] tracking-[0.25em] uppercase font-medium border-b pb-0.5 transition-colors',
                      isDark
                        ? 'text-white border-white group-hover:border-neutral-400 group-hover:text-neutral-400'
                        : 'text-neutral-900 border-neutral-900 group-hover:border-neutral-500 group-hover:text-neutral-500',
                    )}
                  >
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
