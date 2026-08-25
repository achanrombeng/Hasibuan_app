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

const DEMO_REVIEWS: Review[] = [
    {
        id: 1,
        product: { id: 101, name: 'Kursi Santai Kayu Jati', image: null },
        user: { id: 1, name: 'Siti Rahayu' },
        rating: 5,
        title: 'Sangat Nyaman!',
        comment: 'Kualitas kayu jati dan finishingnya sangat luar biasa. Nyaman sekali untuk santai.',
        is_approved: true,
        created_at: '2026-08-22',
    },
    {
        id: 2,
        product: { id: 102, name: 'Sofa Minimalis 3 Dudukan', image: null },
        user: { id: 2, name: 'Budi Santoso' },
        rating: 4,
        title: 'Desain Elegan',
        comment: 'Busa empuk dan jahitan sangat rapi. Pengiriman cepat sampai.',
        is_approved: false,
        created_at: '2026-08-20',
    },
];

export default function ReviewsIndex({
    reviews,
    filters,
    next_page_url,
}: ReviewsIndexProps & { next_page_url: string | null }) {
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

    const displayReviews = reviews && reviews.length > 0 ? reviews : DEMO_REVIEWS;

    return (
        <AdminLayout
            breadcrumbs={[{ title: 'Reviews', href: '/admin/reviews' }]}
        >
            <Head title="Manage Reviews - Coming Soon" />

            <div className="relative min-h-[600px]">
                {/* 1. Full Original Design (Behind Blur Overlay) */}
                <div className="space-y-6 filter blur-md select-none pointer-events-none opacity-60">
                    {/* Header */}
                    <div>
                        <h1 className="text-2xl font-bold text-terra-900">
                            Manage Reviews
                        </h1>
                        <p className="mt-1 text-terra-500">
                            Moderate product reviews from customers
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
                                All Statuses
                            </option>
                            <option value="1" className="bg-white text-terra-900">
                                Approved
                            </option>
                            <option value="0" className="bg-white text-terra-900">
                                Pending Approval
                            </option>
                        </select>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-4">
                        {displayReviews.map((review) => (
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
                                                        'Anonymous'}
                                                </p>
                                                <p className="text-sm text-terra-500">
                                                    {review.created_at}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="mb-2 text-sm text-terra-600">
                                            Product:{' '}
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
                                                ? 'Approved'
                                                : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Glassmorphism Coming Soon Overlay (Centered On Top) */}
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center">
                    <div className="mx-auto max-w-md rounded-3xl border border-white/80 bg-white/90 p-8 md:p-10 shadow-2xl backdrop-blur-xl transition-all">
                        <h2 className="mb-6 font-serif text-4xl font-extrabold text-terra-900 md:text-5xl">
                            Coming Soon
                        </h2>

                        <div className="flex justify-center">
                            <Link
                                href="/admin"
                                className="inline-flex items-center gap-2 rounded-xl bg-terra-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-wood hover:shadow-md"
                            >
                                Kembali ke Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
