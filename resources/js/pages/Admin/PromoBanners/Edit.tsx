import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, ChevronDown, Gift, Percent, Truck } from 'lucide-react';

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
}

interface EditPromoBannerProps {
    promoBanner: PromoBanner;
}

const iconOptions = [
    { value: 'percent', label: 'Diskon', icon: Percent },
    { value: 'gift', label: 'Hadiah', icon: Gift },
    { value: 'truck', label: 'Pengiriman', icon: Truck },
];

const displayTypeOptions = [
    { value: 'banner', label: 'Banner (Header)' },
    { value: 'popup', label: 'Popup (Modal)' },
    { value: 'both', label: 'Keduanya' },
];

const gradientOptions = [
    {
        value: 'from-teal-700 to-teal-900',
        label: 'Teal',
        preview: 'bg-gradient-to-r from-teal-700 to-teal-900',
    },
    {
        value: 'from-amber-500 to-orange-600',
        label: 'Amber',
        preview: 'bg-gradient-to-r from-amber-500 to-orange-600',
    },
    {
        value: 'from-rose-500 to-pink-600',
        label: 'Rose',
        preview: 'bg-gradient-to-r from-rose-500 to-pink-600',
    },
    {
        value: 'from-violet-600 to-purple-700',
        label: 'Violet',
        preview: 'bg-gradient-to-r from-violet-600 to-purple-700',
    },
    {
        value: 'from-blue-600 to-indigo-700',
        label: 'Blue',
        preview: 'bg-gradient-to-r from-blue-600 to-indigo-700',
    },
    {
        value: 'from-emerald-600 to-green-700',
        label: 'Emerald',
        preview: 'bg-gradient-to-r from-emerald-600 to-green-700',
    },
];

function formatDateTimeLocal(isoString: string | null): string {
    if (!isoString) return '';
    const date = new Date(isoString);
    // Format to YYYY-MM-DDTHH:mm for datetime-local input
    return date.toISOString().slice(0, 16);
}

export default function EditPromoBanner({ promoBanner }: EditPromoBannerProps) {
    const { data, setData, processing, errors } = useForm<{
        title: string;
        description: string;
        cta_text: string;
        cta_link: string;
        icon: string;
        bg_gradient: string;
        display_type: string;
        is_active: boolean;
        priority: number;
        starts_at: string;
        ends_at: string;
    }>({
        title: promoBanner.title,
        description: promoBanner.description || '',
        cta_text: promoBanner.cta_text,
        cta_link: promoBanner.cta_link,
        icon: promoBanner.icon,
        bg_gradient: promoBanner.bg_gradient,
        display_type: promoBanner.display_type,
        is_active: promoBanner.is_active,
        priority: promoBanner.priority,
        starts_at: formatDateTimeLocal(promoBanner.starts_at),
        ends_at: formatDateTimeLocal(promoBanner.ends_at),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.put(`/admin/promo-banners/${promoBanner.id}`, data, {
            onError: (errors) => {
                console.error('Form errors:', errors);
            },
        });
    };

    const SelectedIcon =
        iconOptions.find((i) => i.value === data.icon)?.icon || Percent;

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Promo Banner', href: '/admin/promo-banners' },
                {
                    title: 'Edit Promo',
                    href: `/admin/promo-banners/${promoBanner.id}/edit`,
                },
            ]}
        >
            <Head title="Edit Promo Banner" />

            <div className="mx-auto max-w-4xl space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/promo-banners"
                        className="rounded-lg p-2 text-neutral-600 transition-colors hover:bg-neutral-100"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900">
                            Edit Promo Banner
                        </h1>
                        <p className="mt-1 text-neutral-500">
                            Perbarui promo banner "{promoBanner.title}"
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Preview */}
                    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
                        <h2 className="mb-4 text-lg font-semibold text-neutral-900">
                            Preview
                        </h2>
                        <div
                            className={`flex flex-wrap items-center justify-center gap-2 rounded-xl bg-gradient-to-r px-3 py-3 text-white sm:gap-3 sm:px-4 ${data.bg_gradient}`}
                        >
                            <SelectedIcon size={18} className="flex-shrink-0" />
                            <span className="font-medium">
                                {data.title || 'Judul Promo'}
                            </span>
                            {data.description && (
                                <span className="hidden opacity-90 sm:inline">
                                    - {data.description}
                                </span>
                            )}
                            <span className="rounded-full bg-white/20 px-3 py-1 text-sm">
                                {data.cta_text || 'Lihat Sekarang'}
                            </span>
                        </div>
                    </div>

                    {/* Main Form */}
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                        <div className="space-y-6">
                            {/* Title */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-neutral-700">
                                    Judul Promo *
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                                    placeholder="Contoh: Flash Sale! 🔥"
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-neutral-700">
                                    Deskripsi
                                </label>
                                <input
                                    type="text"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                                    placeholder="Contoh: Diskon hingga 70% untuk produk pilihan"
                                />
                            </div>

                            {/* CTA Text & Link */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-neutral-700">
                                        Teks Tombol
                                    </label>
                                    <input
                                        type="text"
                                        value={data.cta_text}
                                        onChange={(e) =>
                                            setData('cta_text', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                                        placeholder="Lihat Sekarang"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-neutral-700">
                                        Link Tujuan
                                    </label>
                                    <input
                                        type="text"
                                        value={data.cta_link}
                                        onChange={(e) =>
                                            setData('cta_link', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                                        placeholder="/shop/products"
                                    />
                                </div>
                            </div>

                            {/* Icon Selection */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-neutral-700">
                                    Ikon
                                </label>
                                <div className="flex flex-wrap gap-2 sm:gap-3">
                                    {iconOptions.map((option) => {
                                        const Icon = option.icon;
                                        return (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() =>
                                                    setData(
                                                        'icon',
                                                        option.value,
                                                    )
                                                }
                                                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 transition-all sm:px-4 sm:py-3 ${
                                                    data.icon === option.value
                                                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                                                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                                                }`}
                                            >
                                                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                                                <span className="text-sm font-medium">
                                                    {option.label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Gradient Selection */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-neutral-700">
                                    Warna Gradien
                                </label>
                                <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                                    {gradientOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() =>
                                                setData(
                                                    'bg_gradient',
                                                    option.value,
                                                )
                                            }
                                            className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-all ${
                                                data.bg_gradient ===
                                                option.value
                                                    ? 'border-teal-500 bg-teal-50'
                                                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                                            }`}
                                        >
                                            <div
                                                className={`h-8 w-full rounded-lg ${option.preview}`}
                                            />
                                            <span className="text-xs font-medium text-neutral-600">
                                                {option.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Display Type */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-neutral-700">
                                    Tipe Tampilan
                                </label>
                                <div className="relative">
                                    <select
                                        value={data.display_type}
                                        onChange={(e) =>
                                            setData(
                                                'display_type',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full appearance-none rounded-xl border border-neutral-200 bg-neutral-50 py-3 pr-10 pl-4 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                                    >
                                        {displayTypeOptions.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                        <ChevronDown className="h-5 w-5 text-neutral-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Priority */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-neutral-700">
                                    Prioritas
                                </label>
                                <p className="mb-2 text-sm text-neutral-500">
                                    Promo dengan prioritas lebih tinggi akan
                                    ditampilkan lebih dulu
                                </p>
                                <input
                                    type="number"
                                    value={data.priority}
                                    onChange={(e) =>
                                        setData(
                                            'priority',
                                            parseInt(e.target.value) || 0,
                                        )
                                    }
                                    min={0}
                                    max={100}
                                    className="w-32 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                                />
                            </div>

                            {/* Date Range */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-neutral-700">
                                        Tanggal Mulai
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={data.starts_at}
                                        onChange={(e) =>
                                            setData('starts_at', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                                    />
                                    <p className="mt-1 text-xs text-neutral-500">
                                        Kosongkan untuk langsung aktif
                                    </p>
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-neutral-700">
                                        Tanggal Berakhir
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={data.ends_at}
                                        onChange={(e) =>
                                            setData('ends_at', e.target.value)
                                        }
                                        className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 transition-all focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
                                    />
                                    {errors.ends_at && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.ends_at}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-neutral-500">
                                        Kosongkan untuk tidak ada batas waktu
                                    </p>
                                </div>
                            </div>

                            {/* Active Checkbox */}
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={data.is_active}
                                    onChange={(e) =>
                                        setData('is_active', e.target.checked)
                                    }
                                    className="h-5 w-5 rounded border-neutral-300 text-teal-600 focus:ring-teal-500"
                                />
                                <label
                                    htmlFor="is_active"
                                    className="text-sm font-medium text-neutral-700"
                                >
                                    Aktifkan promo ini
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
                        <Link
                            href="/admin/promo-banners"
                            className="rounded-xl border border-neutral-200 px-6 py-3 text-center font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-xl bg-teal-600 px-6 py-3 font-medium text-white transition-colors hover:bg-teal-700 disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
