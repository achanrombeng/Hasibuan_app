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
import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    Check,
    Clock,
    Star,
    Trash2,
    User,
    X,
} from 'lucide-react';
import { useState } from 'react';

interface Review {
    id: number;
    product: { id: number; name: string; image: string | null } | null;
    user: { id: number; name: string } | null;
    rating: number;
    title: string | null;
    comment: string;
    is_approved: boolean;
    created_at: string;
}

interface ReviewsIndexProps {
    reviews: Review[];
    filters?: { filter?: Record<string, string> };
}

export default function ReviewsIndex({
    reviews,
    filters,
    next_page_url,
}: ReviewsIndexProps & { next_page_url: string | null }) {
    // Safely get filter value - check if filter is an object
    const filterObj =
        filters?.filter && typeof filters.filter === 'object'
            ? filters.filter
            : {};
    const [statusFilter, setStatusFilter] = useState(
        filterObj.is_approved || '',
    );
    const [loadingMore, setLoadingMore] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleApprove = (id: number) => {
        router.patch(
            `/admin/reviews/${id}/approve`,
            {},
            { preserveScroll: true },
        );
    };

    const handleReject = (id: number) => {
        router.patch(
            `/admin/reviews/${id}/reject`,
            {},
            { preserveScroll: true },
        );
    };

    const confirmDelete = (review: Review) => {
        setReviewToDelete(review);
    };

    const handleDelete = () => {
        if (reviewToDelete) {
            setIsDeleting(true);
            router.delete(`/admin/reviews/${reviewToDelete.id}`, {
                preserveScroll: true,
                onFinish: () => {
                    setIsDeleting(false);
                    setReviewToDelete(null);
                },
            });
        }
    };

    const handleFilterChange = (value: string) => {
        setStatusFilter(value);
        router.get(
            '/admin/reviews',
            value ? { 'filter[is_approved]': value } : {},
            { preserveState: true },
        );
    };

    const loadMore = () => {
        if (next_page_url && !loadingMore) {
            setLoadingMore(true);
            router.get(
                next_page_url,
                {},
                {
                    preserveState: true,
                    preserveScroll: true,
                    only: ['reviews', 'next_page_url'],
                    onFinish: () => setLoadingMore(false),
                },
            );
        }
    };

    return (
        <AdminLayout
            breadcrumbs={[{ title: 'Ulasan', href: '/admin/reviews' }]}
        >
            <Head title="Kelola Ulasan" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-terra-900">
                        Kelola Ulasan
                    </h1>
                    <p className="mt-1 text-terra-500">
                        Moderasi ulasan produk dari pelanggan
                    </p>
                </div>

                {/* Filters */}
                <div className="rounded-2xl border border-terra-100 bg-white p-4 shadow-sm">
                    <select
                        value={statusFilter}
                        onChange={(e) => handleFilterChange(e.target.value)}
                        className="rounded-xl border border-terra-200 bg-white px-4 py-2.5 text-terra-900 transition-all focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none"
                    >
                        <option value="" className="bg-white text-terra-900">
                            Semua Status
                        </option>
                        <option value="1" className="bg-white text-terra-900">
                            Disetujui
                        </option>
                        <option value="0" className="bg-white text-terra-900">
                            Belum Disetujui
                        </option>
                    </select>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                    {reviews.length === 0 ? (
                        <div className="rounded-2xl border border-terra-100 bg-white p-12 text-center shadow-sm">
                            <Star className="mx-auto mb-4 h-12 w-12 text-terra-300" />
                            <h3 className="text-lg font-medium text-terra-900">
                                Tidak ada ulasan
                            </h3>
                            <p className="mt-1 text-terra-500">
                                Belum ada ulasan yang perlu dimoderasi
                            </p>
                        </div>
                    ) : (
                        <>
                            {reviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm"
                                >
                                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                                        <div className="flex-1">
                                            <div className="mb-2 flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-wood/10">
                                                    <User className="h-5 w-5 text-wood" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-terra-900">
                                                        {review.user?.name ||
                                                            'Anonim'}
                                                    </p>
                                                    <p className="text-sm text-terra-500">
                                                        {review.created_at}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="mb-2 text-sm text-terra-600">
                                                Produk:{' '}
                                                <span className="font-medium text-terra-900">
                                                    {review.product?.name ||
                                                        '-'}
                                                </span>
                                            </p>
                                            <div className="mb-3 flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`h-4 w-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-terra-200'}`}
                                                    />
                                                ))}
                                            </div>
                                            {review.title && (
                                                <p className="mb-1 font-medium text-terra-900">
                                                    {review.title}
                                                </p>
                                            )}
                                            <p className="text-terra-700">
                                                {review.comment}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${review.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                                            >
                                                {review.is_approved ? (
                                                    <Check className="h-3.5 w-3.5" />
                                                ) : (
                                                    <Clock className="h-3.5 w-3.5" />
                                                )}
                                                {review.is_approved
                                                    ? 'Disetujui'
                                                    : 'Menunggu'}
                                            </span>
                                            <div className="flex gap-2">
                                                {!review.is_approved && (
                                                    <button
                                                        onClick={() =>
                                                            handleApprove(
                                                                review.id,
                                                            )
                                                        }
                                                        className="rounded-lg bg-green-50 p-2 text-green-600 transition-colors hover:bg-green-100"
                                                        title="Setujui"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </button>
                                                )}
                                                {review.is_approved && (
                                                    <button
                                                        onClick={() =>
                                                            handleReject(
                                                                review.id,
                                                            )
                                                        }
                                                        className="rounded-lg bg-yellow-50 p-2 text-yellow-600 transition-colors hover:bg-yellow-100"
                                                        title="Batalkan Persetujuan"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() =>
                                                        confirmDelete(review)
                                                    }
                                                    className="rounded-lg bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Infinite Scroll Sentinel */}
                            {next_page_url ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: false, margin: '100px' }}
                                    onViewportEnter={loadMore}
                                    className="flex justify-center py-8"
                                >
                                    {loadingMore && (
                                        <div className="flex items-center gap-2 text-terra-500">
                                            <div className="h-2 w-2 animate-bounce rounded-full bg-terra-400 [animation-delay:-0.3s]"></div>
                                            <div className="h-2 w-2 animate-bounce rounded-full bg-terra-400 [animation-delay:-0.15s]"></div>
                                            <div className="h-2 w-2 animate-bounce rounded-full bg-terra-400"></div>
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <div className="py-8 text-center text-sm text-terra-400">
                                    Semua ulasan telah ditampilkan
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <Dialog
                open={!!reviewToDelete}
                onOpenChange={(open) => !open && setReviewToDelete(null)}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <DialogTitle className="text-center">
                            Hapus Ulasan
                        </DialogTitle>
                        <DialogDescription className="text-center">
                            Apakah Anda yakin ingin menghapus ulasan dari{' '}
                            <span className="font-semibold text-terra-900">
                                "{reviewToDelete?.user?.name || 'Anonim'}"
                            </span>{' '}
                            untuk produk{' '}
                            <span className="font-semibold text-terra-900">
                                "{reviewToDelete?.product?.name || '-'}"
                            </span>
                            ? Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 gap-2">
                        <DialogClose asChild>
                            <button
                                type="button"
                                className="flex-1 rounded-xl border border-terra-200 px-4 py-2.5 font-medium text-terra-700 transition-colors hover:bg-terra-50 sm:flex-none"
                            >
                                Batal
                            </button>
                        </DialogClose>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50 sm:flex-none"
                        >
                            {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
