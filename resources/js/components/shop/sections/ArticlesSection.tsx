import { Link } from '@inertiajs/react';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import React from 'react';

export interface ArticleItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  excerpt_truncated?: string;
  featured_image_url: string | null;
  author_name: string;
  formatted_published_at?: string;
  published_at?: string;
  read_time: number;
  tags: string[];
}

interface ArticlesSectionProps {
  articles: ArticleItem[];
}

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({ articles }) => {
  if (!articles || articles.length === 0) return null;

  const displayArticles = articles.slice(0, 3);

  return (
    <section className=" py-16 md:py-24 border-t border-terra-100/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-14 text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-teal-500">
            Blog & Journal
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Latest Articles & News
          </h2>
          <p className="mt-3 text-base text-gray-600 leading-relaxed">
            Discover inspiration, lifestyle trends, and the stories behind Ronica luxury furniture collections.
          </p>
        </div>

        {/* Articles Grid (3 columns) */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {displayArticles.map((article) => {
            const formattedDate =
              article.formatted_published_at ||
              (article.published_at
                ? new Date(article.published_at).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
                : '');

            return (
              <article
                key={article.id}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-terra-100/80 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Image */}
                <Link
                  href={`/shop/articles/${article.slug}`}
                  className="relative aspect-[16/10] overflow-hidden bg-sand-100 block"
                >
                  {article.featured_image_url ? (
                    <img
                      src={article.featured_image_url}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-sand-200 text-terra-400">
                      <span className="text-3xl font-serif">R</span>
                    </div>
                  )}

                  {/* Primary Tag Badge */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="absolute top-3 left-3">
                      <span className="inline-block rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-medium text-terra-900 shadow-sm">
                        {article.tags[0]}
                      </span>
                    </div>
                  )}
                </Link>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    {/* Meta info */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      {formattedDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-terra-600" />
                          <span>{formattedDate}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-terra-600" />
                        <span>{article.read_time || 3} min read</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-terra-900 transition-colors">
                      <Link href={`/shop/articles/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h3>

                    {/* Excerpt */}
                    <p className="mt-2.5 text-sm text-gray-600 line-clamp-3 leading-relaxed">
                      {article.excerpt_truncated || article.excerpt}
                    </p>
                  </div>

                  {/* Footer link */}
                  <div className="mt-6 pt-4 border-t border-sand-100">
                    <Link
                      href={`/shop/articles/${article.slug}`}
                      className="inline-flex items-center text-xs font-semibold text-terra-900 group-hover:text-wood transition-colors"
                    >
                      Read Article
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* View All Articles Button */}
        <div className="mt-14 flex justify-center">
          <Link
            href="/shop/articles"
            className="group inline-flex items-center gap-2 rounded-full border border-terra-200 bg-white px-8 py-3 text-sm font-medium text-terra-900 shadow-xs transition-all duration-300 hover:border-terra-900 hover:bg-terra-900 hover:text-white"
          >
            View All Articles
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};
