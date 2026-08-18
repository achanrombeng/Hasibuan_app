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
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, FileText, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Article {
    id: number;
    title: string;
    slug: string;
    author: string;
    status: string;
    published_at: string | null;
    views: number;
    created_at: string;
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
    const [articleToDelete, setArticleToDelete] = useState<Article | null>(
        null,
    );
    const [isDeleting, setIsDeleting] = useState(false);

    const handleFilter = () => {
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
            draft: 'bg-gray-100 text-gray-800',
            published: 'bg-green-100 text-green-800',
            archived: 'bg-yellow-100 text-yellow-800',
        };

        const labels = {
            draft: 'Draft',
            published: 'Dipublikasi',
            archived: 'Diarsipkan',
        };

        return (
            <Badge
                className={
                    colors[status as keyof typeof colors] ||
                    'bg-gray-100 text-gray-800'
                }
            >
                {labels[status as keyof typeof labels] || status}
            </Badge>
        );
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { label: 'Dashboard', href: '/admin' },
                { label: 'Artikel' },
            ]}
        >
            <Head title="Artikel" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Artikel
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Kelola artikel dan konten blog
                        </p>
                    </div>
                    <Link href="/admin/articles/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Artikel
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="rounded-lg border bg-white p-4 shadow-sm">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Cari artikel..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleFilter();
                                }}
                                className="pl-10"
                            />
                        </div>

                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                {statuses.map((s) => (
                                    <SelectItem key={s.value} value={s.value}>
                                        {s.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="flex gap-2">
                            <Button
                                onClick={handleFilter}
                                className="flex-1"
                                variant="default"
                            >
                                Terapkan
                            </Button>
                            <Button
                                onClick={handleReset}
                                variant="outline"
                                className="flex-1"
                            >
                                Reset
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Judul
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Penulis
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Tanggal Publikasi
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Dilihat
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {articles.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-12 text-center"
                                        >
                                            <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                            <p className="mt-2 text-sm text-gray-500">
                                                Tidak ada artikel ditemukan
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    articles.data.map((article) => (
                                        <tr
                                            key={article.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4">
                                                <Link
                                                    href={`/admin/articles/${article.id}/edit`}
                                                    className="font-medium text-terra-600 hover:text-terra-700"
                                                >
                                                    {article.title}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {article.author}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(article.status)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {article.published_at
                                                    ? new Date(
                                                          article.published_at,
                                                      ).toLocaleDateString(
                                                          'id-ID',
                                                          {
                                                              day: 'numeric',
                                                              month: 'short',
                                                              year: 'numeric',
                                                          },
                                                      )
                                                    : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <Eye className="mr-1 h-4 w-4" />
                                                    {article.views}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/admin/articles/${article.id}/edit`}
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            setArticleToDelete(
                                                                article,
                                                            )
                                                        }
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
                        <div className="border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
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
                        <DialogTitle>Hapus Artikel</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus artikel "
                            {articleToDelete?.title}"? Tindakan ini tidak dapat
                            dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" disabled={isDeleting}>
                                Batal
                            </Button>
                        </DialogClose>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Menghapus...' : 'Hapus'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
