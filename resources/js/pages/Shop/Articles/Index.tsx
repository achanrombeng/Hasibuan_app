import Pagination from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ShopLayout from '@/layouts/ShopLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Clock, Eye, Search, User } from 'lucide-react';
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
    };
}

export default function ArticlesIndex({
    articles,
    filters = {},
}: ArticlesIndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = () => {
        router.get(
            '/shop/articles',
            {
                search: search || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <ShopLayout>
            <Head title="Artikel & Berita" />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                        Artikel & Berita
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Temukan inspirasi dan tips terbaru tentang furniture
                    </p>
                </div>

                {/* Search */}
                <div className="mx-auto mb-8 max-w-2xl">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Cari artikel..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSearch();
                            }}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Articles Grid */}
                {articles.data.length === 0 ? (
                    <div className="py-16 text-center">
                        <p className="text-gray-500">Tidak ada artikel ditemukan</p>
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
                                                {article.read_time} menit
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        {article.tags && article.tags.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {article.tags.slice(0, 3).map((tag, idx) => (
                                                    <Badge
                                                        key={idx}
                                                        variant="secondary"
                                                        className="text-xs"
                                                    >
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {articles.meta.last_page > 1 && (
                            <div className="mt-8">
                                <Pagination pagination={articles} />
                            </div>
                        )}
                    </>
                )}
            </div>
        </ShopLayout>
    );
}
