import Pagination from '@/components/pagination';
import { SEOHead } from '@/components/seo';
import { Badge } from '@/components/ui/badge';
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
        Boolean(safeFilters.tag || (safeFilters.sort && safeFilters.sort !== 'latest')),
    );

    const activeFilterCount =
        (tag ? 1 : 0) + (sort !== 'latest' ? 1 : 0) + (search ? 1 : 0);

    const applyFilters = (newParams?: { search?: string; tag?: string; sort?: string }) => {
        const nextSearch = newParams?.search !== undefined ? newParams.search : search;
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
    const hasMultiplePages = articles?.meta?.last_page && articles.meta.last_page > 1;

    return (
        <>
            <SEOHead
                title="Articles & News"
                description="Discover the latest inspiration and tips on furniture and home decor."
                keywords={[
                    'articles',
                    'news',
                    'furniture tips',
                    'outdoor furniture',
                    'decor inspiration',
                ]}
            />
            <div className="bg-noise" />
            <ShopLayout>
                <main className="min-h-screen bg-sand-50 pb-20">
                    {/* Hero */}
                    <div className="mb-12 bg-gradient-to-r from-teal-600 to-teal-700 py-16 text-white">
                        <div className="mx-auto max-w-[1400px] px-6 text-center md:px-12">
                            <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
                                Articles & News
                            </h1>
                            <p className="text-xl opacity-90">
                                Discover the latest inspiration and tips on furniture
                            </p>
                        </div>
                    </div>

                    <div className="mx-auto max-w-[1400px] px-6 md:px-12">
                        {/* Search & Filter Section */}
                        <div className="mx-auto mb-10 max-w-3xl space-y-4">
                            {/* Main Input & Buttons Bar */}
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                {/* Search Input */}
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                                    <input
                                        type="text"
                                        placeholder="Search articles & news..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSearch();
                                        }}
                                        className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-11 pr-10 text-sm text-neutral-900 shadow-xs transition-all focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                                    />
                                    {search && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSearch('');
                                                applyFilters({ search: '' });
                                            }}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
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
                                        className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-teal-700 active:scale-95"
                                    >
                                        <Search className="h-4 w-4" />
                                        <span>Search</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setShowFilters(!showFilters)}
                                        className={`inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium shadow-sm transition-all active:scale-95 ${
                                            showFilters || activeFilterCount > 0
                                                ? 'border-teal-600 bg-teal-50 text-teal-800 ring-2 ring-teal-600/20'
                                                : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50'
                                        }`}
                                    >
                                        <SlidersHorizontal className="h-4 w-4 text-teal-600" />
                                        <span>Filter</span>
                                        {activeFilterCount > 0 && (
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-[11px] font-bold text-white">
                                                {activeFilterCount}
                                            </span>
                                        )}
                                        <ChevronDown
                                            className={`h-4 w-4 text-neutral-500 transition-transform duration-200 ${
                                                showFilters ? 'rotate-180' : ''
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Expandable Filter Panel */}
                            {showFilters && (
                                <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all">
                                    {/* Sort By */}
                                    <div>
                                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                            Sort By
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                { id: 'latest', label: 'Latest (Terbaru)' },
                                                { id: 'oldest', label: 'Oldest (Terlama)' },
                                                { id: 'popular', label: 'Most Viewed (Populer)' },
                                            ].map((opt) => (
                                                <button
                                                    key={opt.id}
                                                    type="button"
                                                    onClick={() => handleSortChange(opt.id)}
                                                    className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                                                        sort === opt.id
                                                            ? 'bg-teal-600 text-white shadow-xs'
                                                            : 'border border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
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
                                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                                Filter by Topic / Tag
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleTagSelect('')}
                                                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                                                        !tag
                                                            ? 'bg-neutral-900 text-white shadow-xs'
                                                            : 'border border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                                                    }`}
                                                >
                                                    All Topics
                                                </button>
                                                {availableTags.map((t) => (
                                                    <button
                                                        key={t}
                                                        type="button"
                                                        onClick={() => handleTagSelect(t)}
                                                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                                                            tag === t
                                                                ? 'bg-teal-600 text-white shadow-xs'
                                                                : 'border border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-teal-300 hover:bg-teal-50/50 hover:text-teal-700'
                                                        }`}
                                                    >
                                                        #{t}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Reset Button */}
                                    {activeFilterCount > 0 && (
                                        <div className="flex items-center justify-between border-t border-neutral-100 pt-3 text-xs text-neutral-500">
                                            <span>
                                                Active filters:{' '}
                                                {tag && <strong className="mr-2 text-neutral-900">Tag: #{tag}</strong>}
                                                {search && <strong className="mr-2 text-neutral-900">"{search}"</strong>}
                                                {sort !== 'latest' && <strong className="text-neutral-900">Sort: {sort}</strong>}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={handleReset}
                                                className="inline-flex items-center gap-1 font-medium text-red-600 hover:text-red-700 hover:underline"
                                            >
                                                <RotateCcw className="h-3.5 w-3.5" />
                                                Reset All Filters
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Active Filter Badges (shown when filter panel is collapsed) */}
                            {!showFilters && activeFilterCount > 0 && (
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                    <span className="text-neutral-500">Filters:</span>
                                    {search && (
                                        <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-3 py-1 text-neutral-700 shadow-2xs">
                                            "{search}"
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSearch('');
                                                    applyFilters({ search: '' });
                                                }}
                                                className="hover:text-red-600"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    )}
                                    {tag && (
                                        <span className="inline-flex items-center gap-1 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 font-medium text-teal-800 shadow-2xs">
                                            #{tag}
                                            <button
                                                type="button"
                                                onClick={() => handleTagSelect('')}
                                                className="hover:text-red-600"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    )}
                                    {sort !== 'latest' && (
                                        <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-3 py-1 text-neutral-700 shadow-2xs">
                                            Sort: {sort}
                                            <button
                                                type="button"
                                                onClick={() => handleSortChange('latest')}
                                                className="hover:text-red-600"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="ml-1 text-xs font-semibold text-red-600 hover:underline"
                                    >
                                        Clear all
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Articles Grid */}
                        {!hasArticles ? (
                            <div className="py-16 text-center">
                                <p className="text-gray-500">No articles found</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {articles.data.map((article) => (
                                        <Link
                                            key={article.id}
                                            href={`/shop/articles/${article.slug}`}
                                            className="group overflow-hidden rounded-xl border border-terra-100 bg-white shadow-sm transition-all hover:shadow-md"
                                        >
                                            {/* Featured Image */}
                                            <div className="aspect-video overflow-hidden bg-gray-100">
                                                {article.featured_image_url ? (
                                                    <img
                                                        src={article.featured_image_url}
                                                        alt={article.title}
                                                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center">
                                                        <span className="text-4xl text-gray-300">
                                                            📄
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="p-5">
                                                <h3 className="line-clamp-2 text-xl font-semibold text-gray-900 transition-colors group-hover:text-terra-600">
                                                    {article.title}
                                                </h3>

                                                <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                                                    {article.excerpt_truncated}
                                                </p>

                                                {/* Metadata */}
                                                <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500">
                                                    <div className="flex items-center">
                                                        <User className="mr-1 h-3.5 w-3.5" />
                                                        {article.author_name}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Calendar className="mr-1 h-3.5 w-3.5" />
                                                        {article.formatted_published_at}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Clock className="mr-1 h-3.5 w-3.5" />
                                                        {article.read_time} min read
                                                    </div>
                                                </div>

                                                {/* Tags */}
                                                {article.tags && article.tags.length > 0 && (
                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {article.tags.slice(0, 3).map((t, idx) => (
                                                            <Badge
                                                                key={idx}
                                                                variant="secondary"
                                                                className="text-xs"
                                                            >
                                                                {t}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {hasMultiplePages && (
                                    <div className="mt-12 rounded-xl border border-terra-100 bg-white shadow-xs">
                                        <Pagination
                                            pagination={articles}
                                            showPerPage={false}
                                        />
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
