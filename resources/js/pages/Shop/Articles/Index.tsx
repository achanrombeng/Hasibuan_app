import Pagination from '@/components/pagination';
import { SEOHead } from '@/components/seo';
import ShopLayout from '@/layouts/ShopLayout';
import { Link, router } from '@inertiajs/react';
import {
  Calendar,
  ChevronDown,
  Clock,
  RotateCcw,
  Search,
  SlidersHorizontal,
  User,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt_truncated: string;
  featured_image_url: string | null;
  author_name: string;
  formatted_published_at: string;
  read_time: number;
  views: number;
  tags: string[];
}

interface ArticlesIndexProps {
  articles: {
    data: Article[];
    links: {
      first?: string;
      last?: string;
      prev?: string;
      next?: string;
    };
    meta: {
      current_page: number;
      last_page: number;
      from: number;
      to: number;
      total: number;
      links: Array<{
        url: string | null;
        label: string;
        active: boolean;
      }>;
    };
  };
  filters?: {
    search?: string;
    tag?: string;
    sort?: string;
  };
  availableTags?: string[];
}

export default function ArticlesIndex({
  articles,
  filters,
  availableTags = [],
}: ArticlesIndexProps) {
  const safeFilters = (Array.isArray(filters) ? {} : filters) || {};

  const [search, setSearch] = useState(safeFilters.search || '');
  const [tag, setTag] = useState(safeFilters.tag || '');
  const [sort, setSort] = useState(safeFilters.sort || 'latest');
  const [showFilters, setShowFilters] = useState(
    Boolean(
      safeFilters.tag || (safeFilters.sort && safeFilters.sort !== 'latest'),
    ),
  );

  const activeFilterCount =
    (tag ? 1 : 0) + (sort !== 'latest' ? 1 : 0) + (search ? 1 : 0);

  const applyFilters = (newParams?: {
    search?: string;
    tag?: string;
    sort?: string;
  }) => {
    const nextSearch =
      newParams?.search !== undefined ? newParams.search : search;
    const nextTag = newParams?.tag !== undefined ? newParams.tag : tag;
    const nextSort = newParams?.sort !== undefined ? newParams.sort : sort;

    router.get(
      '/shop/articles',
      {
        search: nextSearch || undefined,
        tag: nextTag || undefined,
        sort: nextSort !== 'latest' ? nextSort : undefined,
      },
      {
        preserveState: true,
        preserveScroll: true,
      },
    );
  };

  const handleSearch = () => {
    applyFilters({ search });
  };

  const handleTagSelect = (selectedTag: string) => {
    const newTag = tag === selectedTag ? '' : selectedTag;
    setTag(newTag);
    applyFilters({ tag: newTag });
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    applyFilters({ sort: newSort });
  };

  const handleReset = () => {
    setSearch('');
    setTag('');
    setSort('latest');
    router.get(
      '/shop/articles',
      {},
      {
        preserveState: true,
        preserveScroll: true,
      },
    );
  };

  const hasArticles = articles && articles.data && articles.data.length > 0;
  const hasMultiplePages =
    articles?.meta?.last_page && articles.meta.last_page > 1;

  return (
    <>
      <SEOHead
        title="Journal & News"
        description="Discover inspiration, design essays, and material craftsmanship insights."
        keywords={[
          'journal',
          'articles',
          'news',
          'furniture design',
          'craftsmanship',
          'architectural living',
        ]}
      />
      <div className="bg-noise" />
      <ShopLayout>
        <main className="min-h-screen bg-white pb-24">
          {/* Monumental Editorial Header - Black Luxury Banner */}
          <div className="border-b border-neutral-900 bg-neutral-950 py-16 md:py-24 px-6 text-white">
            <div className="mx-auto max-w-[1720px] text-center space-y-3">
              <span className="text-[10px] md:text-xs tracking-[0.35em] uppercase font-light text-neutral-400">
                THE ARCHITECTURAL JOURNAL
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-[0.06em] text-white uppercase">
                DESIGN ESSAYS & DISPATCHES
              </h1>
              <div className="w-12 h-[1px] bg-neutral-700 mx-auto mt-4" />
              <p className="mx-auto max-w-2xl text-xs md:text-sm font-light text-neutral-300 tracking-wide pt-2">
                Explorations in material integrity, artisanal craftsmanship, and enduring architectural living.
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-[1720px] px-6 sm:px-12 pt-12 md:pt-16">
            {/* Search & Filter Section */}
            <div className="mx-auto mb-14 max-w-3xl space-y-4">
              {/* Main Input & Action Buttons Bar */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search articles & essays..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearch();
                    }}
                    className="w-full border border-neutral-300 bg-white py-3 pr-10 pl-11 text-xs tracking-wider text-neutral-900 placeholder-neutral-400 transition-colors focus:border-neutral-900 focus:outline-none"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch('');
                        applyFilters({ search: '' });
                      }}
                      className="absolute top-1/2 right-3 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-900"
                      title="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Buttons: Search & Filter */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="inline-flex flex-1 items-center justify-center gap-2 bg-neutral-900 px-6 py-3 text-[11px] font-medium tracking-[0.2em] text-white uppercase transition-colors hover:bg-neutral-800 sm:flex-none"
                  >
                    <Search className="h-3.5 w-3.5" />
                    <span>Search</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`inline-flex flex-1 items-center justify-center gap-2 border px-5 py-3 text-[11px] font-medium tracking-[0.2em] uppercase transition-colors sm:flex-none ${
                      showFilters || activeFilterCount > 0
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-neutral-300 bg-white text-neutral-800 hover:border-neutral-900'
                    }`}
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    <span>Filter</span>
                    {activeFilterCount > 0 && (
                      <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                        showFilters ? 'bg-white text-neutral-900' : 'bg-neutral-900 text-white'
                      }`}>
                        {activeFilterCount}
                      </span>
                    )}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${
                        showFilters ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Expandable Filter Panel */}
              {showFilters && (
                <div className="space-y-5 border border-neutral-200/80 bg-[#fafaf9] p-6 transition-all">
                  {/* Sort By */}
                  <div>
                    <label className="mb-2.5 block text-[10px] font-medium tracking-[0.25em] text-neutral-500 uppercase">
                      Sort By
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'latest', label: 'Latest Dispatches' },
                        { id: 'oldest', label: 'Archive Order' },
                        { id: 'popular', label: 'Most Read' },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSortChange(opt.id)}
                          className={`px-4 py-2 text-[10px] tracking-[0.2em] uppercase font-medium transition-colors ${
                            sort === opt.id
                              ? 'bg-neutral-900 text-white'
                              : 'border border-neutral-300 bg-white text-neutral-700 hover:border-neutral-900'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tag Filter */}
                  {availableTags.length > 0 && (
                    <div>
                      <label className="mb-2.5 block text-[10px] font-medium tracking-[0.25em] text-neutral-500 uppercase">
                        Filter by Topic
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleTagSelect('')}
                          className={`px-3.5 py-1.5 text-[10px] tracking-[0.2em] uppercase font-medium transition-colors ${
                            !tag
                              ? 'bg-neutral-900 text-white'
                              : 'border border-neutral-300 bg-white text-neutral-700 hover:border-neutral-900'
                          }`}
                        >
                          All Topics
                        </button>
                        {availableTags.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => handleTagSelect(t)}
                            className={`px-3.5 py-1.5 text-[10px] tracking-[0.2em] uppercase font-medium transition-colors ${
                              tag === t
                                ? 'bg-neutral-900 text-white'
                                : 'border border-neutral-300 bg-white text-neutral-700 hover:border-neutral-900'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reset Button */}
                  {activeFilterCount > 0 && (
                    <div className="flex items-center justify-between border-t border-neutral-200 pt-4 text-xs text-neutral-500">
                      <span className="text-[11px] font-light">
                        Active filters:{' '}
                        {tag && (
                          <strong className="mr-2 font-medium text-neutral-900 uppercase">
                            Topic: {tag}
                          </strong>
                        )}
                        {search && (
                          <strong className="mr-2 font-medium text-neutral-900">
                            "{search}"
                          </strong>
                        )}
                        {sort !== 'latest' && (
                          <strong className="font-medium text-neutral-900 uppercase">
                            Sort: {sort}
                          </strong>
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={handleReset}
                        className="inline-flex items-center gap-1.5 text-[10px] font-medium tracking-[0.2em] uppercase text-neutral-900 hover:underline"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Reset Filters
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Active Filter Badges */}
              {!showFilters && activeFilterCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="text-[10px] tracking-wider uppercase text-neutral-400">Filters:</span>
                  {search && (
                    <span className="inline-flex items-center gap-1.5 border border-neutral-300 bg-white px-3 py-1 text-[11px] text-neutral-800">
                      "{search}"
                      <button
                        type="button"
                        onClick={() => {
                          setSearch('');
                          applyFilters({ search: '' });
                        }}
                        className="hover:text-neutral-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {tag && (
                    <span className="inline-flex items-center gap-1.5 border border-neutral-900 bg-neutral-900 px-3 py-1 text-[10px] tracking-wider uppercase text-white">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleTagSelect('')}
                        className="hover:opacity-75"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {sort !== 'latest' && (
                    <span className="inline-flex items-center gap-1.5 border border-neutral-300 bg-white px-3 py-1 text-[11px] uppercase text-neutral-800">
                      Sort: {sort}
                      <button
                        type="button"
                        onClick={() => handleSortChange('latest')}
                        className="hover:text-neutral-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleReset}
                    className="ml-2 text-[10px] tracking-wider uppercase font-medium text-neutral-500 hover:text-neutral-900 hover:underline"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Articles Grid */}
            {!hasArticles ? (
              <div className="py-24 text-center">
                <p className="font-serif text-xl font-light text-neutral-500 uppercase tracking-widest">
                  No essays found
                </p>
                <p className="mt-2 text-xs text-neutral-400 font-light">
                  Try adjusting your search query or filter criteria.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
                  {articles.data.map((article) => (
                    <Link
                      key={article.id}
                      href={`/shop/articles/${article.slug}`}
                      className="group flex flex-col border border-neutral-200/80 bg-white p-5 transition-all duration-300 hover:border-neutral-400"
                    >
                      {/* Featured Image */}
                      <div className="aspect-[16/10] w-full overflow-hidden bg-neutral-100 mb-5 relative">
                        {article.featured_image_url ? (
                          <img
                            src={article.featured_image_url}
                            alt={article.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-neutral-50">
                            <span className="font-serif text-sm tracking-widest uppercase text-neutral-300">
                              ARCHITECTURAL DISPATCH
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex flex-1 flex-col justify-between space-y-3">
                        <div>
                          <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-light block mb-2">
                            ESSAY · {article.formatted_published_at || 'ARCHIVE'}
                          </span>

                          <h3 className="font-serif text-xl font-light tracking-[0.04em] uppercase text-neutral-900 transition-colors group-hover:text-neutral-600 line-clamp-2">
                            {article.title}
                          </h3>

                          <p className="mt-2 text-xs font-light leading-relaxed text-neutral-500 line-clamp-3">
                            {article.excerpt_truncated}
                          </p>
                        </div>

                        <div>
                          {/* Tags */}
                          {article.tags && article.tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {article.tags.slice(0, 3).map((t, idx) => (
                                <span
                                  key={idx}
                                  className="border border-neutral-200 bg-neutral-50/50 px-2 py-0.5 text-[9px] tracking-[0.15em] uppercase text-neutral-600"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Metadata & CTA */}
                          <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-3">
                            <div className="flex items-center gap-3 text-[10px] tracking-wider text-neutral-400 uppercase font-light">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {article.read_time}m read
                              </span>
                            </div>

                            <span className="text-[10px] tracking-[0.25em] uppercase font-medium text-neutral-900 border-b border-neutral-900 pb-0.5 transition-colors group-hover:border-neutral-500 group-hover:text-neutral-500">
                              READ ESSAY
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {hasMultiplePages && (
                  <div className="mt-16 border-t border-neutral-200/80 pt-8">
                    <Pagination pagination={articles} showPerPage={false} />
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </ShopLayout>
    </>
  );
}
