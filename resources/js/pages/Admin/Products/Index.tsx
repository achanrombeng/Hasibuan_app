import Pagination from '@/components/pagination';
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
    Eye,
    Filter,
    Package,
    Pencil,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface Product {
    id: number;
    name: string;
    slug: string;
    sku: string;
    price: number;
    price_formatted: string;
    stock_quantity: number;
    status: { value: string; label: string };
    sale_type: { value: string; label: string };
    category: { id: number; name: string } | null;
    primary_image: { id: number; image_url: string } | null;
    images: Array<{ id: number; image_url: string }>;
    created_at: string;
}

interface Category {
    id: number;
    name: string;
}

interface ProductsIndexProps {
    products: {
        data: Product[];
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
    filters?: { filter?: Record<string, string> };
}

export default function ProductsIndex({
    products,
    filters,
    categories,
    statuses,
    saleTypes,
}: ProductsIndexProps & {
    categories: { data: Category[] };
    statuses: { value: string; name: string }[];
    saleTypes: { value: string; name: string }[];
}) {
    // Safely get filter values
    const filterObj =
        filters?.filter && typeof filters.filter === 'object'
            ? filters.filter
            : {};

    const [search, setSearch] = useState(filterObj.name || '');
    const [category, setCategory] = useState(filterObj.category_id || 'all');
    const [status, setStatus] = useState(filterObj.status || 'all');
    const [saleType, setSaleType] = useState(filterObj.sale_type || 'all');
    const [isFeatured, setIsFeatured] = useState(
        filterObj.is_featured || 'all',
    );
    const [showFilters, setShowFilters] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(
        null,
    );
    const [isDeleting, setIsDeleting] = useState(false);

    const productData = products.data;

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        const params: Record<string, string> = {};
        if (search) params['filter[name]'] = search;
        if (category && category !== 'all')
            params['filter[category_id]'] = category;
        if (status && status !== 'all') params['filter[status]'] = status;
        if (saleType && saleType !== 'all')
            params['filter[sale_type]'] = saleType;
        if (isFeatured && isFeatured !== 'all')
            params['filter[is_featured]'] = isFeatured;

        router.get('/admin/products', params, { preserveState: true });
    };

    const handleReset = () => {
        setSearch('');
        setCategory('all');
        setStatus('all');
        setSaleType('all');
        setIsFeatured('all');
        router.get('/admin/products', {}, { preserveState: true });
    };

    const confirmDelete = (product: Product) => {
        setProductToDelete(product);
    };

    const handleDelete = () => {
        if (productToDelete) {
            setIsDeleting(true);
            router.delete(`/admin/products/${productToDelete.id}`, {
                onFinish: () => {
                    setIsDeleting(false);
                    setProductToDelete(null);
                },
            });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-700';
            case 'draft':
                return 'bg-gray-100 text-gray-700';
            case 'archived':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <AdminLayout
            breadcrumbs={[{ title: 'Produk', href: '/admin/products' }]}
        >
            <Head title="Kelola Produk" />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-terra-900">
                            Kelola Produk
                        </h1>
                        <p className="mt-1 text-terra-500">
                            Kelola semua produk di toko Anda
                        </p>
                    </div>
                    <Link
                        href="/admin/products/create"
                        className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 font-medium text-white transition-all hover:bg-teal-700"
                    >
                        <Plus className="h-5 w-5" /> Tambah Produk
                    </Link>
                </div>

                {/* Filters */}
                <div className="rounded-2xl border border-neutral-200/80 bg-white p-3.5 shadow-sm">
                    <form
                        onSubmit={handleSearch}
                        className="flex flex-col gap-3 sm:flex-row sm:items-center"
                    >
                        <div className="relative flex-1">
                            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Cari produk..."
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
                                Cari
                            </button>
                        </div>
                    </form>

                    {showFilters && (
                        <div className="grid animate-in grid-cols-1 gap-4 border-t border-terra-100 pt-4 duration-200 slide-in-from-top-2 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-terra-700">
                                    Kategori
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) =>
                                        setCategory(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-terra-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-wood/50 focus:outline-none"
                                >
                                    <option value="all">Semua Kategori</option>
                                    {categories.data.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-terra-700">
                                    Status
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full rounded-lg border border-terra-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-wood/50 focus:outline-none"
                                >
                                    <option value="all">Semua Status</option>
                                    {statuses.map((s) => (
                                        <option key={s.value} value={s.value}>
                                            {s.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-end gap-2">
                                <button
                                    onClick={() => handleSearch()}
                                    className="flex-1 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700 sm:flex-none"
                                >
                                    Terapkan
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="flex-1 rounded-lg border border-terra-200 px-4 py-2 text-sm font-medium text-terra-600 transition-colors hover:bg-terra-50 sm:flex-none"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Products Table */}
                <div className="overflow-hidden rounded-2xl border border-terra-100 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-terra-100 bg-sand-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-terra-600">
                                        Produk
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-terra-600">
                                        SKU
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-terra-600">
                                        Kategori
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-terra-600">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-right text-sm font-medium text-terra-600">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-terra-100">
                                {productData.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="py-12 text-center text-terra-500"
                                        >
                                            Belum ada produk
                                        </td>
                                    </tr>
                                ) : (
                                    productData.map((product) => (
                                        <tr
                                            key={product.id}
                                            className="transition-colors hover:bg-sand-50/50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-terra-100">
                                                        {(() => {
                                                            const imageUrl =
                                                                product
                                                                    .primary_image
                                                                    ?.image_url ||
                                                                (product.images &&
                                                                product.images
                                                                    .length > 0
                                                                    ? product
                                                                          .images[0]
                                                                          .image_url
                                                                    : null);
                                                            return imageUrl ? (
                                                                <img
                                                                    src={
                                                                        imageUrl
                                                                    }
                                                                    alt={
                                                                        product.name
                                                                    }
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <Package className="h-6 w-6 text-terra-400" />
                                                            );
                                                        })()}
                                                    </div>
                                                    <p className="font-medium text-terra-900">
                                                        {product.name}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-terra-600">
                                                {product.sku}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-terra-600">
                                                {product.category?.name || '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(product.status.value)}`}
                                                >
                                                    {product.status.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/products/${product.id}`}
                                                        className="rounded-lg p-2 text-terra-500 transition-colors hover:bg-terra-100"
                                                        title="Lihat"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/products/${product.id}/edit`}
                                                        className="rounded-lg p-2 text-terra-500 transition-colors hover:bg-terra-100"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            confirmDelete(
                                                                product,
                                                            )
                                                        }
                                                        className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <Pagination
                        links={products.meta.links}
                        meta={products.meta}
                        className="border-t border-terra-100 px-6 py-4"
                    />
                </div>
            </div>

            <Dialog
                open={!!productToDelete}
                onOpenChange={(open) => !open && setProductToDelete(null)}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <DialogTitle className="text-center">
                            Hapus Produk
                        </DialogTitle>
                        <DialogDescription className="text-center">
                            Apakah Anda yakin ingin menghapus produk{' '}
                            <span className="font-semibold text-terra-900">
                                "{productToDelete?.name}"
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
