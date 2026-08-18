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
import {
    AlertTriangle,
    Calendar,
    Gift,
    Megaphone,
    Pencil,
    Percent,
    Plus,
    Search,
    Trash2,
    Truck,
} from 'lucide-react';
import { useMemo, useState } from 'react';

interface PromoBanner {
    id: number;
    title: string;
    description: string | null;
    cta_text: string;
    cta_link: string;
    icon: 'gift' | 'percent' | 'truck';
    bg_gradient: string;
    display_type: 'banner' | 'popup' | 'both';
    is_active: boolean;
    priority: number;
    starts_at: string | null;
    ends_at: string | null;
    is_currently_active: boolean;
    status_label: string;
    created_at: string;
}

interface PromoBannersIndexProps {
    promoBanners: PromoBanner[];
}

const IconMap = {
    gift: Gift,
    percent: Percent,
    truck: Truck,
};

const displayTypeLabels = {
    banner: 'Banner',
    popup: 'Popup',
    both: 'Keduanya',
};

export default function PromoBannersIndex({
    promoBanners,
}: PromoBannersIndexProps) {
    const [search, setSearch] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [bannerToDelete, setBannerToDelete] = useState<PromoBanner | null>(
        null,
    );
    const [isDeleting, setIsDeleting] = useState(false);
    const [togglingId, setTogglingId] = useState<number | null>(null);

    const filteredBanners = useMemo(() => {
        if (!search) return promoBanners;
        const searchLower = search.toLowerCase();
        return promoBanners.filter(
            (banner) =>
                banner.title.toLowerCase().includes(searchLower) ||
                banner.description?.toLowerCase().includes(searchLower),
        );
    }, [promoBanners, search]);

    const handleDeleteClick = (banner: PromoBanner) => {
        setBannerToDelete(banner);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!bannerToDelete) return;

        setIsDeleting(true);
        router.delete(`/admin/promo-banners/${bannerToDelete.id}`, {
            onFinish: () => {
                setIsDeleting(false);
                setDeleteDialogOpen(false);
                setBannerToDelete(null);
            },
        });
    };

    const handleToggleActive = async (banner: PromoBanner) => {
        setTogglingId(banner.id);

        try {
            const response = await fetch(
                `/admin/promo-banners/${banner.id}/toggle`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN':
                            document.querySelector<HTMLMetaElement>(
                                'meta[name="csrf-token"]',
                            )?.content || '',
                    },
                },
            );

            if (response.ok) {
                router.reload({ only: ['promoBanners'] });
            }
        } catch (error) {
            console.error('Error toggling banner:', error);
        } finally {
            setTogglingId(null);
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const activeCount = promoBanners.filter(
        (b) => b.is_currently_active,
    ).length;
    const scheduledCount = promoBanners.filter(
        (b) => b.status_label === 'Terjadwal',
    ).length;

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Promo Banner', href: '/admin/promo-banners' },
            ]}
        >
            <Head title="Kelola Promo Banner" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900">
                            Kelola Promo Banner
                        </h1>
                        <p className="mt-1 text-neutral-500">
                            Kelola banner dan popup promosi di toko Anda
                        </p>
                    </div>
                    <Link
                        href="/admin/promo-banners/create"
                        className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 font-medium text-white transition-all hover:bg-teal-700"
                    >
                        <Plus className="h-5 w-5" />
                        Tambah Promo
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100">
                                <Megaphone className="h-5 w-5 text-teal-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900">
                                    {promoBanners.length}
                                </p>
                                <p className="text-sm text-neutral-500">
                                    Total Promo
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                                <Megaphone className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900">
                                    {activeCount}
                                </p>
                                <p className="text-sm text-neutral-500">
                                    Sedang Aktif
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                                <Calendar className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-neutral-900">
                                    {scheduledCount}
                                </p>
                                <p className="text-sm text-neutral-500">
                                    Terjadwal
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                    <div className="relative max-w-md">
                        <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Cari promo..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pr-4 pl-10 text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Promo Banners List */}
                <div className="space-y-3">
                    {filteredBanners.map((banner) => {
                        const Icon = IconMap[banner.icon];
                        return (
                            <div
                                key={banner.id}
                                className="group rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
                            >
                                {/* Mobile: Stack layout */}
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                                    {/* Top row: Icon + Info */}
                                    <div className="flex items-center gap-3 sm:flex-1 sm:gap-4">
                                        {/* Preview Icon */}
                                        <div
                                            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br sm:h-12 sm:w-12 sm:rounded-xl ${banner.bg_gradient}`}
                                        >
                                            <Icon className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                                        </div>

                                        {/* Info */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="font-semibold text-neutral-900">
                                                    {banner.title}
                                                </h3>
                                                <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
                                                    {
                                                        displayTypeLabels[
                                                            banner.display_type
                                                        ]
                                                    }
                                                </span>
                                            </div>
                                            {banner.description && (
                                                <p className="mt-0.5 truncate text-sm text-neutral-500">
                                                    {banner.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Actions - Desktop inline, Mobile in row */}
                                        <div className="flex items-center gap-1 sm:hidden">
                                            <button
                                                onClick={() =>
                                                    handleToggleActive(banner)
                                                }
                                                disabled={
                                                    togglingId === banner.id
                                                }
                                                className={`relative h-6 w-11 rounded-full transition-colors ${
                                                    banner.is_active
                                                        ? 'bg-teal-500'
                                                        : 'bg-neutral-300'
                                                } ${togglingId === banner.id ? 'opacity-50' : ''}`}
                                            >
                                                <span
                                                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                                                        banner.is_active
                                                            ? 'translate-x-5'
                                                            : 'translate-x-0'
                                                    }`}
                                                />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Mobile: Status row */}
                                    <div className="flex flex-wrap items-center gap-2 sm:hidden">
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                                banner.status_label === 'Aktif'
                                                    ? 'bg-green-100 text-green-700'
                                                    : banner.status_label ===
                                                        'Terjadwal'
                                                      ? 'bg-amber-100 text-amber-700'
                                                      : banner.status_label ===
                                                          'Berakhir'
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-neutral-100 text-neutral-700'
                                            }`}
                                        >
                                            {banner.status_label}
                                        </span>
                                        {(banner.starts_at ||
                                            banner.ends_at) && (
                                            <span className="flex items-center gap-1 text-xs text-neutral-500">
                                                <Calendar className="h-3 w-3" />
                                                {formatDate(
                                                    banner.starts_at,
                                                )} -{' '}
                                                {formatDate(banner.ends_at)}
                                            </span>
                                        )}
                                        <div className="ml-auto flex items-center gap-1">
                                            <Link
                                                href={`/admin/promo-banners/${banner.id}/edit`}
                                                className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDeleteClick(banner)
                                                }
                                                className="rounded-lg p-1.5 text-red-400 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Desktop: Status & Priority */}
                                    <div className="hidden items-center gap-3 sm:flex">
                                        {(banner.starts_at ||
                                            banner.ends_at) && (
                                            <span className="flex items-center gap-1 text-xs text-neutral-500">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {formatDate(banner.starts_at)} -{' '}
                                                {formatDate(banner.ends_at)}
                                            </span>
                                        )}
                                        <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600">
                                            P: {banner.priority}
                                        </span>
                                        <span
                                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                                banner.status_label === 'Aktif'
                                                    ? 'bg-green-100 text-green-700'
                                                    : banner.status_label ===
                                                        'Terjadwal'
                                                      ? 'bg-amber-100 text-amber-700'
                                                      : banner.status_label ===
                                                          'Berakhir'
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-neutral-100 text-neutral-700'
                                            }`}
                                        >
                                            {banner.status_label}
                                        </span>
                                    </div>

                                    {/* Desktop: Toggle & Actions */}
                                    <div className="hidden items-center gap-2 sm:flex">
                                        <button
                                            onClick={() =>
                                                handleToggleActive(banner)
                                            }
                                            disabled={togglingId === banner.id}
                                            className={`relative h-6 w-11 rounded-full transition-colors ${
                                                banner.is_active
                                                    ? 'bg-teal-500'
                                                    : 'bg-neutral-300'
                                            } ${togglingId === banner.id ? 'opacity-50' : ''}`}
                                        >
                                            <span
                                                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                                                    banner.is_active
                                                        ? 'translate-x-5'
                                                        : 'translate-x-0'
                                                }`}
                                            />
                                        </button>
                                        <Link
                                            href={`/admin/promo-banners/${banner.id}/edit`}
                                            className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Link>
                                        <button
                                            onClick={() =>
                                                handleDeleteClick(banner)
                                            }
                                            className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredBanners.length === 0 && (
                    <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center shadow-sm">
                        <Megaphone className="mx-auto mb-4 h-12 w-12 text-neutral-300" />
                        <h3 className="text-lg font-medium text-neutral-900">
                            Tidak ada promo
                        </h3>
                        <p className="mt-1 text-neutral-500">
                            {search
                                ? 'Tidak ditemukan promo yang sesuai dengan pencarian'
                                : 'Mulai dengan menambahkan promo baru'}
                        </p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <DialogTitle className="text-center">
                            Hapus Promo Banner
                        </DialogTitle>
                        <DialogDescription className="text-center">
                            Apakah Anda yakin ingin menghapus promo{' '}
                            <span className="font-semibold text-neutral-900">
                                "{bannerToDelete?.title}"
                            </span>
                            ? Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 gap-2">
                        <DialogClose asChild>
                            <button
                                type="button"
                                className="flex-1 rounded-xl border border-neutral-200 px-4 py-2.5 font-medium text-neutral-700 transition-colors hover:bg-neutral-50 sm:flex-none"
                            >
                                Batal
                            </button>
                        </DialogClose>
                        <button
                            type="button"
                            onClick={handleConfirmDelete}
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
