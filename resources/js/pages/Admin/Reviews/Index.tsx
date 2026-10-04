import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Check, Clock, Filter, Search, Star, User } from 'lucide-react';
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
    product: { id: 101, name: 'Teak Wood Lounge Chair', image: null },
    user: { id: 1, name: 'Sarah Jenkins' },
    rating: 5,
    title: 'Extremely Comfortable!',
    comment:
      'The quality of the teak wood and finishing is outstanding. Perfect for relaxing.',
    is_approved: true,
    created_at: '2026-08-22',
  },
  {
    id: 2,
    product: { id: 102, name: 'Minimalist 3-Seater Sofa', image: null },
    user: { id: 2, name: 'David Miller' },
    rating: 4,
    title: 'Elegant Design',
    comment: 'Plush cushioning and very neat stitching. Fast delivery.',
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
    filters?.filter && typeof filters.filter === 'object' ? filters.filter : {};
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(filterObj.is_approved || '');
  const [showFilters, setShowFilters] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleApprove = (id: number) => {
    router.patch(`/admin/reviews/${id}/approve`, {}, { preserveScroll: true });
  };

  const handleReject = (id: number) => {
    router.patch(`/admin/reviews/${id}/reject`, {}, { preserveScroll: true });
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

  const handleReset = () => {
    setSearch('');
    setStatusFilter('');
    router.get('/admin/reviews', {}, { preserveState: true });
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
    <AdminLayout breadcrumbs={[{ title: 'Reviews', href: '/admin/reviews' }]}>
      <Head title="Manage Reviews - Coming Soon" />

      <div className="relative min-h-[600px]">
        {/* 1. Full Original Design (Behind Blur Overlay) */}
        <div className="pointer-events-none space-y-6 opacity-60 blur-md filter select-none">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-terra-900">
              Manage Reviews
            </h1>
            <p className="mt-1 text-terra-500">
              Moderate product reviews from customers
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm md:p-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleFilterChange(statusFilter);
              }}
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <div className="relative flex-1">
                <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search reviews..."
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
                  className="inline-flex items-center justify-center rounded-xl bg-[#a67c52] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#8e6843] active:scale-[0.98]"
                >
                  Search
                </button>
              </div>
            </form>

            {showFilters && (
              <div className="mt-4 grid grid-cols-1 gap-4 border-t border-neutral-100 pt-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                    Review Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    className="w-full cursor-pointer rounded-xl border border-neutral-200 bg-neutral-50/50 p-2.5 text-sm text-neutral-900 focus:border-wood focus:bg-white focus:ring-2 focus:ring-wood/20 focus:outline-none"
                  >
                    <option value="">All Statuses</option>
                    <option value="1">Approved</option>
                    <option value="0">Pending</option>
                  </select>
                </div>
                <div className="flex items-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleFilterChange(statusFilter)}
                    className="flex-1 rounded-xl bg-[#a67c52] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#8e6843] sm:flex-none"
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
                          {review.user?.name || 'Anonymous'}
                        </p>
                        <p className="text-sm text-terra-500">
                          {review.created_at}
                        </p>
                      </div>
                    </div>
                    <p className="mb-2 text-sm text-terra-600">
                      Product:{' '}
                      <span className="font-medium text-terra-900">
                        {review.product?.name || '-'}
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
                    <p className="text-terra-700">{review.comment}</p>
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
                      {review.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Glassmorphism Coming Soon Overlay (Centered On Top) */}
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center">
          <div className="mx-auto max-w-md rounded-3xl border border-white/80 bg-white/90 p-8 shadow-2xl backdrop-blur-xl transition-all md:p-10">
            <h2 className="mb-6 font-serif text-4xl font-extrabold text-terra-900 md:text-5xl">
              Coming Soon
            </h2>

            <div className="flex justify-center">
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 rounded-xl bg-terra-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-wood hover:shadow-md"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
