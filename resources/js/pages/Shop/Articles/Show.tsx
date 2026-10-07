import ShopLayout from '@/layouts/ShopLayout';
import { Head, Link } from '@inertiajs/react';
import { Calendar, ChevronRight, Home, User } from 'lucide-react';
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
          <meta property="og:image" content={articleData.featured_image_url} />
        )}
      </Head>

      <main className="min-h-screen bg-[#fafaf9] pt-8 pb-24">
        <div className="mx-auto max-w-[1720px] px-6 sm:px-12">
          {/* Breadcrumb matching luxury navigation */}
          <div className="mb-8 flex items-center">
            <nav className="flex flex-wrap items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-light text-neutral-500">
              <Link
                href="/shop"
                className="flex items-center gap-1 transition-colors hover:text-neutral-900"
              >
                <Home size={12} className="text-neutral-400" />
                <span>Home</span>
              </Link>
              <ChevronRight size={10} className="text-neutral-300" />
              <Link
                href="/shop/articles"
                className="transition-colors hover:text-neutral-900"
              >
                Journal
              </Link>
              <ChevronRight size={10} className="text-neutral-300" />
              <span className="max-w-[280px] truncate text-neutral-900 font-medium sm:max-w-md">
                {articleData?.title}
              </span>
            </nav>
          </div>

          {/* Article Content Container */}
          <article className="mx-auto max-w-4xl border border-neutral-200/80 bg-white p-8 sm:p-14">
            {/* Category / Eyebrow */}
            <span className="text-[10px] md:text-xs tracking-[0.35em] uppercase font-light text-neutral-400 block mb-3">
              ARCHITECTURAL ESSAY
            </span>

            {/* Title */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-[0.04em] text-neutral-900 uppercase leading-tight mb-6">
              {articleData?.title}
            </h1>

            {/* Metadata Bar */}
            <div className="mb-8 flex flex-wrap items-center gap-6 border-y border-neutral-100 py-4 text-[11px] tracking-wider uppercase text-neutral-500">
              <div className="flex items-center">
                <User className="mr-2 h-3.5 w-3.5 text-neutral-400" />
                <span className="font-medium text-neutral-900">
                  {articleData?.author_name}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-3.5 w-3.5 text-neutral-400" />
                <span>{articleData?.formatted_published_at}</span>
              </div>
              {articleData?.read_time && (
                <span>{articleData.read_time} Min Read</span>
              )}
            </div>

            {/* Featured Image */}
            {articleData?.featured_image_url && (
              <div className="mb-10 overflow-hidden border border-neutral-200/60 bg-neutral-100">
                <img
                  src={articleData.featured_image_url}
                  alt={articleData.title}
                  className="h-auto max-h-[550px] w-full object-cover"
                />
              </div>
            )}

            {/* Tags */}
            {articleData?.tags && articleData.tags.length > 0 && (
              <div className="mb-10 flex flex-wrap gap-2">
                {articleData.tags.map((tag: string, idx: number) => (
                  <Link
                    key={idx}
                    href={`/shop/articles?tag=${encodeURIComponent(tag)}`}
                    className="border border-neutral-200 bg-neutral-50 px-3 py-1 text-[10px] tracking-wider uppercase text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-neutral max-w-none text-neutral-700 leading-relaxed">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ node, ...props }) => (
                    <h1
                      className="mt-10 mb-4 font-serif text-3xl font-light tracking-wide text-neutral-900 uppercase"
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      className="mt-8 mb-3 font-serif text-2xl font-light tracking-wide text-neutral-900 uppercase"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      className="mt-6 mb-2 font-serif text-xl font-light text-neutral-900 uppercase"
                      {...props}
                    />
                  ),
                  p: ({ node, ...props }) => (
                    <p
                      className="mb-6 font-light leading-relaxed text-neutral-600 text-sm md:text-base"
                      {...props}
                    />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul
                      className="mb-6 ml-6 list-disc space-y-2 font-light text-neutral-600 text-sm md:text-base"
                      {...props}
                    />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      className="mb-6 ml-6 list-decimal space-y-2 font-light text-neutral-600 text-sm md:text-base"
                      {...props}
                    />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="my-6 border-l-2 border-neutral-900 bg-neutral-50 p-5 font-serif italic text-neutral-800 text-base md:text-lg"
                      {...props}
                    />
                  ),
                  code: ({ node, className, children, ...props }: any) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return match ? (
                      <code
                        className="block bg-neutral-900 p-4 text-xs font-mono text-neutral-100 overflow-x-auto"
                        {...props}
                      >
                        {children}
                      </code>
                    ) : (
                      <code
                        className="bg-neutral-100 px-1.5 py-0.5 text-xs font-mono text-neutral-800"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  img: ({ node, ...props }) => (
                    <img className="my-8 border border-neutral-200" {...props} />
                  ),
                  a: ({ node, ...props }) => (
                    <a
                      className="text-neutral-900 underline underline-offset-4 hover:text-neutral-600 transition-colors"
                      {...props}
                    />
                  ),
                }}
              >
                {articleData?.content || ''}
              </ReactMarkdown>
            </div>

            {/* Back to Journal Link */}
            <div className="mt-14 border-t border-neutral-200 pt-8">
              <Link
                href="/shop/articles"
                className="inline-flex items-center text-[11px] font-medium tracking-[0.25em] uppercase text-neutral-900 border-b border-neutral-900 pb-0.5 hover:border-neutral-500 hover:text-neutral-500 transition-colors"
              >
                ← RETURN TO JOURNAL
              </Link>
            </div>
          </article>
        </div>
      </main>
    </ShopLayout>
  );
}
