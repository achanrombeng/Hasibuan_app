import { Badge } from '@/components/ui/badge';
import ShopLayout from '@/layouts/ShopLayout';
import { Head, Link } from '@inertiajs/react';
import { Calendar, Home, User } from 'lucide-react';
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
    article: Article | { data: Article };
}

export default function ArticleShow({ article }: ArticleShowProps) {
    const articleData = (article as any)?.data || article;

    return (
        <ShopLayout showFooter={true} showWhatsApp={true}>
            <Head title={articleData?.meta_title || articleData?.title || 'Article'}>
                <meta
                    name="description"
                    content={articleData?.meta_description || articleData?.excerpt || ''}
                />
                {articleData?.meta_title && (
                    <meta property="og:title" content={articleData.meta_title} />
                )}
                {articleData?.excerpt && (
                    <meta property="og:description" content={articleData.excerpt} />
                )}
                {articleData?.featured_image_url && (
                    <meta
                        property="og:image"
                        content={articleData.featured_image_url}
                    />
                )}
            </Head>

            <main className="min-h-screen bg-neutral-50/50 pb-20 pt-6">
                <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-12">
                        {/* Modern Breadcrumb matching Product Page */}
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                            <nav className="flex flex-wrap items-center gap-2 text-xs font-medium text-neutral-500">
                                <Link
                                    href="/shop"
                                    className="flex items-center gap-1 transition-colors hover:text-teal-700"
                                >
                                    <Home size={13} className="text-neutral-400" />
                                    <span>Home</span>
                                </Link>
                                <span className="text-neutral-300">/</span>
                                <Link
                                    href="/shop/articles"
                                    className="transition-colors hover:text-teal-700"
                                >
                                    Articles
                                </Link>
                                <span className="text-neutral-300">/</span>
                                <span className="max-w-[280px] sm:max-w-md truncate font-semibold text-neutral-900">
                                    {articleData?.title}
                                </span>
                            </nav>
                        </div>

                        {/* Article Content Container */}
                        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-6 sm:p-10 border border-neutral-100 shadow-sm">
                            {/* Featured Image */}
                            {articleData?.featured_image_url && (
                                <div className="mb-8 overflow-hidden rounded-xl bg-neutral-100">
                                    <img
                                        src={articleData.featured_image_url}
                                        alt={articleData.title}
                                        className="h-auto w-full max-h-[500px] object-cover"
                                    />
                                </div>
                            )}

                            {/* Title */}
                            <h1 className="mb-4 font-display text-3xl font-bold text-neutral-900 md:text-4xl lg:text-5xl leading-tight">
                                {articleData?.title}
                            </h1>

                            {/* Metadata */}
                            <div className="mb-6 flex flex-wrap items-center gap-4 border-b border-neutral-100 pb-6 text-sm text-neutral-600">
                                <div className="flex items-center">
                                    <User className="mr-2 h-4 w-4 text-neutral-400" />
                                    <span className="font-medium text-neutral-900">
                                        {articleData?.author_name}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <Calendar className="mr-2 h-4 w-4 text-neutral-400" />
                                    <span>{articleData?.formatted_published_at}</span>
                                </div>
                            </div>

                            {/* Tags */}
                            {articleData?.tags && articleData.tags.length > 0 && (
                                <div className="mb-8 flex flex-wrap gap-2">
                                    {articleData.tags.map((tag: string, idx: number) => (
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
                                        code: ({ node, className, children, ...props }: any) => {
                                            const match = /language-(\w+)/.exec(className || '');
                                            return match ? (
                                                <code
                                                    className="block rounded-lg bg-gray-900 p-4 text-sm text-gray-100"
                                                    {...props}
                                                >
                                                    {children}
                                                </code>
                                            ) : (
                                                <code
                                                    className="rounded bg-gray-100 px-1.5 py-0.5 text-sm text-terra-600"
                                                    {...props}
                                                >
                                                    {children}
                                                </code>
                                            );
                                        },
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
                                    {articleData?.content || ''}
                                </ReactMarkdown>
                            </div>

                            {/* Back Link */}
                            <div className="mt-12 border-t border-neutral-100 pt-8">
                                <Link
                                    href="/shop/articles"
                                    className="inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-700 hover:underline"
                                >
                                    ← Back to Articles
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
            </ShopLayout>
    );
}
