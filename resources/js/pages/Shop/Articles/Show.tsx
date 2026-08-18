import { Badge } from '@/components/ui/badge';
import ShopLayout from '@/layouts/ShopLayout';
import { Head, Link } from '@inertiajs/react';
import { Calendar, Clock, Eye, Home, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Article {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured_image_url: string | null;
    author_name: string;
    formatted_published_at: string;
    read_time: number;
    views: number;
    tags: string[];
    meta_title: string | null;
    meta_description: string | null;
}

interface ArticleShowProps {
    article: Article;
}

export default function ArticleShow({ article }: ArticleShowProps) {
    return (
        <ShopLayout>
            <Head title={article.meta_title || article.title}>
                <meta
                    name="description"
                    content={article.meta_description || article.excerpt}
                />
                {article.meta_title && (
                    <meta property="og:title" content={article.meta_title} />
                )}
                {article.excerpt && (
                    <meta property="og:description" content={article.excerpt} />
                )}
                {article.featured_image_url && (
                    <meta
                        property="og:image"
                        content={article.featured_image_url}
                    />
                )}
            </Head>

            <div className="bg-white">
                {/* Breadcrumb */}
                <div className="container mx-auto px-4 py-4">
                    <nav className="flex items-center space-x-2 text-sm text-gray-600">
                        <Link
                            href="/"
                            className="flex items-center hover:text-terra-600"
                        >
                            <Home className="h-4 w-4" />
                        </Link>
                        <span>/</span>
                        <Link
                            href="/shop/articles"
                            className="hover:text-terra-600"
                        >
                            Artikel
                        </Link>
                        <span>/</span>
                        <span className="text-gray-900">{article.title}</span>
                    </nav>
                </div>

                {/* Article Header */}
                <div className="container mx-auto max-w-4xl px-4 py-8">
                    {/* Featured Image */}
                    {article.featured_image_url && (
                        <div className="mb-8 overflow-hidden rounded-xl">
                            <img
                                src={article.featured_image_url}
                                alt={article.title}
                                className="h-auto w-full max-h-[500px] object-cover"
                            />
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
                        {article.title}
                    </h1>

                    {/* Metadata */}
                    <div className="mb-6 flex flex-wrap items-center gap-4 border-b border-gray-200 pb-6 text-sm text-gray-600">
                        <div className="flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            <span className="font-medium">
                                {article.author_name}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4" />
                            {article.formatted_published_at}
                        </div>
                        <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4" />
                            {article.read_time} menit baca
                        </div>
                        <div className="flex items-center">
                            <Eye className="mr-2 h-4 w-4" />
                            {article.views} kali dilihat
                        </div>
                    </div>

                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                        <div className="mb-8 flex flex-wrap gap-2">
                            {article.tags.map((tag, idx) => (
                                <Link
                                    key={idx}
                                    href={`/shop/articles?tag=${encodeURIComponent(tag)}`}
                                >
                                    <Badge
                                        variant="secondary"
                                        className="cursor-pointer hover:bg-terra-100"
                                    >
                                        {tag}
                                    </Badge>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Article Content */}
                    <div className="prose prose-terra max-w-none">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                h1: ({ node, ...props }) => (
                                    <h1
                                        className="mb-4 mt-8 text-3xl font-bold text-gray-900"
                                        {...props}
                                    />
                                ),
                                h2: ({ node, ...props }) => (
                                    <h2
                                        className="mb-3 mt-6 text-2xl font-bold text-gray-900"
                                        {...props}
                                    />
                                ),
                                h3: ({ node, ...props }) => (
                                    <h3
                                        className="mb-2 mt-4 text-xl font-semibold text-gray-900"
                                        {...props}
                                    />
                                ),
                                p: ({ node, ...props }) => (
                                    <p
                                        className="mb-4 leading-relaxed text-gray-700"
                                        {...props}
                                    />
                                ),
                                ul: ({ node, ...props }) => (
                                    <ul
                                        className="mb-4 ml-6 list-disc space-y-2 text-gray-700"
                                        {...props}
                                    />
                                ),
                                ol: ({ node, ...props }) => (
                                    <ol
                                        className="mb-4 ml-6 list-decimal space-y-2 text-gray-700"
                                        {...props}
                                    />
                                ),
                                blockquote: ({ node, ...props }) => (
                                    <blockquote
                                        className="my-4 border-l-4 border-terra-500 bg-terra-50 p-4 italic text-gray-700"
                                        {...props}
                                    />
                                ),
                                code: ({ node, inline, ...props }) =>
                                    inline ? (
                                        <code
                                            className="rounded bg-gray-100 px-1.5 py-0.5 text-sm text-terra-600"
                                            {...props}
                                        />
                                    ) : (
                                        <code
                                            className="block rounded-lg bg-gray-900 p-4 text-sm text-gray-100"
                                            {...props}
                                        />
                                    ),
                                img: ({ node, ...props }) => (
                                    <img
                                        className="my-6 rounded-lg"
                                        {...props}
                                    />
                                ),
                                a: ({ node, ...props }) => (
                                    <a
                                        className="text-terra-600 hover:text-terra-700 hover:underline"
                                        {...props}
                                    />
                                ),
                            }}
                        >
                            {article.content}
                        </ReactMarkdown>
                    </div>

                    {/* Back Link */}
                    <div className="mt-12 border-t border-gray-200 pt-8">
                        <Link
                            href="/shop/articles"
                            className="inline-flex items-center text-terra-600 hover:text-terra-700"
                        >
                            ← Kembali ke Artikel
                        </Link>
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
}
