import Pagination from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import { FileText, Filter, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  status: 'draft' | 'published' | 'archived';
  published_at: string | null;
  author: {
    id: number;
    name: string;
  };
  created_at: string;
}

interface ArticlesIndexProps {
  articles: {
    data: Article[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
  };
  filters?: {
    search?: string;
    status?: string;
  };
  statuses: Array<{ value: string; label: string }>;
}

export default function ArticlesIndex({
  articles,
  filters = {},
  statuses,
}: ArticlesIndexProps) {
  const [search, setSearch] = useState(filters.search || '');
  const [status, setStatus] = useState(filters.status || 'all');
  const [showFilters, setShowFilters] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleFilter = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    router.get(
      '/admin/articles',
      {
        search: search || undefined,
        status: status !== 'all' ? status : undefined,
      },
      {
        preserveState: true,
        preserveScroll: true,
      },
    );
  };

  const handleReset = () => {
    setSearch('');
    setStatus('all');
    router.get('/admin/articles', {}, { preserveState: true });
  };

  const handleDelete = () => {
    if (!articleToDelete) return;

    setIsDeleting(true);
    router.delete(`/admin/articles/${articleToDelete.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        setArticleToDelete(null);
        setIsDeleting(false);
      },
      onError: () => {
        setIsDeleting(false);
      },
    });
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      draft: 'bg-yellow-100 text-yellow-800',
      published: 'bg-green-100 text-green-800',
      archived: 'bg-gray-100 text-gray-800',
    };
    return (
      <Badge className={colors[status as keyof typeof colors] || colors.draft}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <AdminLayout breadcrumbs={[{ title: 'Articles', href: '/admin/articles' }]}>
      <Head title="Articles" />

      <div className="flex h-[calc(100dvh-5.5rem)] flex-col gap-4 sm:h-[calc(100dvh-7rem)] sm:gap-6">
        {/* Fixed Top Section (Header & Filters) */}
        <div className="shrink-0 space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-terra-900">Articles</h1>
              <p className="mt-1 text-sm text-terra-500">
                Manage blog articles and news
              </p>
            </div>
            <Link href="/admin/articles/create">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Article
              </Button>
            </Link>
          </div>

          {/* Search & Filter Bar */}
          <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm md:p-6">
            <form
              onSubmit={handleFilter}
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <div className="relative flex-1">
                <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search article..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 py-2.5 pr-4 pl-10 text-sm text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-wood focus:bg-white focus:ring-2 focus:ring-wood/20 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium shadow-sm transition-colors ${
                    showFilters
                      ? 'border-neutral-300 bg-neutral-100 text-neutral-900'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <Filter className="h-4 w-4 text-neutral-600" /> Filter
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-black active:scale-[0.98]"
                >
                  Search
                </button>
              </div>
            </form>

            {showFilters && (
              <div className="mt-4 grid grid-cols-1 gap-4 border-t border-neutral-100 pt-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full cursor-pointer rounded-xl border border-neutral-200 bg-neutral-50/50 p-2.5 text-sm text-neutral-900 focus:border-wood focus:bg-white focus:ring-2 focus:ring-wood/20 focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    {statuses.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleFilter()}
                    className="flex-1 rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-black sm:flex-none"
                  >
                    Apply
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 sm:flex-none"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Table Container */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm">
          <div className="flex-1 overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 z-10 border-b border-neutral-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Publish Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {articles.data.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <FileText className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">
                        No articles found
                      </p>
                    </td>
                  </tr>
                ) : (
                  articles.data.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/articles/${article.id}/edit`}
                          className="font-medium text-terra-600 hover:text-terra-700"
                        >
                          {article.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {typeof article.author === 'object'
                          ? article.author?.name
                          : article.author || '-'}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(article.status)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {article.published_at
                          ? new Date(article.published_at).toLocaleDateString(
                              'en-US',
                              {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              },
                            )
                          : '-'}
                      </td>
                      <td className="px-6 py-4 text-right text-sm">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/articles/${article.id}/edit`}>
                            <Button variant="outline" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setArticleToDelete(article)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {articles.data.length > 0 && (
            <div className="shrink-0 border-t border-neutral-100 bg-white px-4 py-3 sm:px-6">
              <Pagination pagination={articles} />
            </div>
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      <Dialog
        open={!!articleToDelete}
        onOpenChange={() => setArticleToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Article</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete article "{articleToDelete?.title}
              "? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isDeleting}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
