import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    BarChart3,
    Box,
    DollarSign,
    Globe,
    Layers,
    Package,
    Pencil,
    Tag,
    Truck,
} from 'lucide-react';

interface ProductImage {
    id: number;
    image_url: string;
    url: string;
    alt_text: string | null;
    is_primary: boolean;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    sku: string;
    short_description: string | null;
    description: string | null;
    specifications: Record<string, string> | null;
    price: number;
    price_formatted: string;
    compare_price: number | null;
    compare_price_formatted: string | null;
    cost_price: number | null;
    cost_price_formatted: string | null;
    final_price_formatted: string;
    has_discount: boolean;
    discount_percentage: number | null;
    stock_quantity: number;
    low_stock_threshold: number;
    track_stock: boolean;
    allow_backorder: boolean;
    is_pre_order: boolean;
    weight: number | null;
    dimensions: { length?: number; width?: number; height?: number } | null;
    shipping_class: string | null;
    material: string | null;
    color: string | null;
    sold_count: number;
    view_count: number;
    category: { id: number; name: string } | null;
    status: { value: string; label: string };
    sale_type: { value: string; label: string };
    is_featured: boolean;
    is_new_arrival: boolean;
    meta_title: string | null;
    meta_description: string | null;
    meta_keywords: string | null;
    images: ProductImage[];
    primary_image: ProductImage | null;
    created_at: string;
    updated_at: string;
}

interface ShowProductProps {
    product: Product;
}

const shippingClassLabels: Record<string, string> = {
    free_shipping: 'Gratis Ongkir',
    flat_rate: 'Tarif Tetap',
    local_pickup: 'Ambil di Tempat',
};

export default function ShowProduct({ product }: ShowProductProps) {
    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Produk', href: '/admin/products' },
                {
                    title: product.name,
                    href: `/admin/products/${product.id}`,
                },
            ]}
        >
            <Head title={product.name} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/products"
                            className="rounded-lg p-2 text-terra-600 transition-colors hover:bg-terra-100"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-terra-900">
                                {product.name}
                            </h1>
                            <p className="mt-1 text-terra-500">
                                SKU: {product.sku}
                            </p>
                        </div>
                    </div>
                    <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="inline-flex items-center gap-2 rounded-xl bg-terra-900 px-4 py-2.5 font-medium text-white transition-all hover:bg-wood-dark"
                    >
                        <Pencil className="h-4 w-4" />
                        Edit Produk
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="rounded-xl border border-terra-100 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-wood/10">
                                <Package className="h-5 w-5 text-wood" />
                            </div>
                            <div>
                                <p className="text-sm text-terra-500">Stok</p>
                                <p className="text-lg font-bold text-terra-900">
                                    {product.stock_quantity}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-terra-100 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                <Tag className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-terra-500">
                                    Terjual
                                </p>
                                <p className="text-lg font-bold text-terra-900">
                                    {product.sold_count}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-terra-100 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                                <BarChart3 className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-terra-500">
                                    Dilihat
                                </p>
                                <p className="text-lg font-bold text-terra-900">
                                    {product.view_count}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-xl border border-terra-100 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                                <Layers className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-terra-500">
                                    Kategori
                                </p>
                                <p className="text-lg font-bold text-terra-900">
                                    {product.category?.name || '-'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Product Info */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Product Images */}
                        <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-lg font-semibold text-terra-900">
                                Gambar Produk
                            </h2>
                            {product.images && product.images.length > 0 ? (
                                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                    {product.images.map((image) => (
                                        <div
                                            key={image.id}
                                            className={`relative aspect-square overflow-hidden rounded-xl border-2 ${image.is_primary ? 'border-terra-500' : 'border-terra-100'}`}
                                        >
                                            <img
                                                src={
                                                    image.image_url || image.url
                                                }
                                                alt={
                                                    image.alt_text ||
                                                    product.name
                                                }
                                                className="h-full w-full object-cover"
                                            />
                                            {image.is_primary && (
                                                <span className="absolute top-2 left-2 rounded-md bg-terra-900 px-2 py-1 text-xs text-white">
                                                    Utama
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex h-40 items-center justify-center rounded-xl bg-terra-50">
                                    <div className="text-center text-terra-400">
                                        <Package className="mx-auto mb-2 h-12 w-12" />
                                        <p>Tidak ada gambar</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-lg font-semibold text-terra-900">
                                Deskripsi Produk
                            </h2>
                            {product.short_description && (
                                <p className="mb-4 text-sm text-terra-500 italic">
                                    {product.short_description}
                                </p>
                            )}
                            <p className="leading-relaxed text-terra-600">
                                {product.description || 'Tidak ada deskripsi'}
                            </p>
                        </div>

                        {/* Harga */}
                        <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-terra-500" />
                                <h2 className="text-lg font-semibold text-terra-900">
                                    Informasi Harga
                                </h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                <div>
                                    <p className="text-sm text-terra-500">
                                        Harga Jual
                                    </p>
                                    <p className="text-xl font-bold text-terra-900">
                                        {product.price_formatted}
                                    </p>
                                </div>
                                {product.has_discount && (
                                    <div>
                                        <p className="text-sm text-terra-500">
                                            Harga Diskon
                                        </p>
                                        <p className="text-xl font-bold text-green-600">
                                            {product.final_price_formatted}
                                        </p>
                                    </div>
                                )}
                                {product.compare_price_formatted && (
                                    <div>
                                        <p className="text-sm text-terra-500">
                                            Harga Coret
                                        </p>
                                        <p className="text-xl text-terra-400 line-through">
                                            {product.compare_price_formatted}
                                        </p>
                                    </div>
                                )}
                                {product.cost_price_formatted && (
                                    <div>
                                        <p className="text-sm text-terra-500">
                                            Harga Modal
                                        </p>
                                        <p className="text-xl text-terra-700">
                                            {product.cost_price_formatted}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Inventori */}
                        <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center gap-2">
                                <Box className="h-5 w-5 text-terra-500" />
                                <h2 className="text-lg font-semibold text-terra-900">
                                    Inventori
                                </h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                <div>
                                    <p className="text-sm text-terra-500">
                                        Stok
                                    </p>
                                    <p className="text-lg font-bold text-terra-900">
                                        {product.stock_quantity}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-terra-500">
                                        Batas Stok Rendah
                                    </p>
                                    <p className="text-lg font-bold text-terra-900">
                                        {product.low_stock_threshold}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`h-2 w-2 rounded-full ${product.track_stock ? 'bg-green-500' : 'bg-terra-300'}`}
                                        />
                                        <span className="text-sm text-terra-600">
                                            Lacak Stok:{' '}
                                            {product.track_stock
                                                ? 'Aktif'
                                                : 'Nonaktif'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`h-2 w-2 rounded-full ${product.allow_backorder ? 'bg-green-500' : 'bg-terra-300'}`}
                                        />
                                        <span className="text-sm text-terra-600">
                                            Backorder:{' '}
                                            {product.allow_backorder
                                                ? 'Ya'
                                                : 'Tidak'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`h-2 w-2 rounded-full ${product.is_pre_order ? 'bg-blue-500' : 'bg-terra-300'}`}
                                        />
                                        <span className="text-sm text-terra-600">
                                            Pre-Order:{' '}
                                            {product.is_pre_order
                                                ? 'Ya'
                                                : 'Tidak'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pengiriman */}
                        <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center gap-2">
                                <Truck className="h-5 w-5 text-terra-500" />
                                <h2 className="text-lg font-semibold text-terra-900">
                                    Pengiriman
                                </h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                <div>
                                    <p className="text-sm text-terra-500">
                                        Berat
                                    </p>
                                    <p className="text-lg font-bold text-terra-900">
                                        {product.weight
                                            ? `${product.weight} kg`
                                            : '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-terra-500">
                                        Dimensi (P x L x T)
                                    </p>
                                    <p className="text-lg font-bold text-terra-900">
                                        {product.dimensions?.length ||
                                        product.dimensions?.width ||
                                        product.dimensions?.height
                                            ? `${product.dimensions.length || 0} x ${product.dimensions.width || 0} x ${product.dimensions.height || 0} cm`
                                            : '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-terra-500">
                                        Kelas Pengiriman
                                    </p>
                                    <p className="text-lg font-bold text-terra-900">
                                        {product.shipping_class
                                            ? (shippingClassLabels[
                                                  product.shipping_class
                                              ] || product.shipping_class)
                                            : '-'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Atribut */}
                        {(product.material ||
                            product.color ||
                            (product.specifications &&
                                Object.keys(product.specifications).length >
                                    0)) && (
                            <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-lg font-semibold text-terra-900">
                                    Atribut
                                </h2>
                                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                    {product.material && (
                                        <div>
                                            <p className="text-sm text-terra-500">
                                                Material
                                            </p>
                                            <p className="font-medium text-terra-900">
                                                {product.material}
                                            </p>
                                        </div>
                                    )}
                                    {product.color && (
                                        <div>
                                            <p className="text-sm text-terra-500">
                                                Warna
                                            </p>
                                            <p className="font-medium text-terra-900">
                                                {product.color}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                {product.specifications &&
                                    Object.keys(product.specifications).length >
                                        0 && (
                                        <div className="mt-4 border-t border-terra-100 pt-4">
                                            <p className="mb-2 text-sm font-medium text-terra-500">
                                                Spesifikasi
                                            </p>
                                            <dl className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                                {Object.entries(
                                                    product.specifications,
                                                ).map(([key, value]) => (
                                                    <div
                                                        key={key}
                                                        className="flex gap-2 text-sm"
                                                    >
                                                        <dt className="min-w-[120px] text-terra-500">
                                                            {key}
                                                        </dt>
                                                        <dd className="font-medium text-terra-900">
                                                            {value}
                                                        </dd>
                                                    </div>
                                                ))}
                                            </dl>
                                        </div>
                                    )}
                            </div>
                        )}

                        {/* SEO */}
                        {(product.meta_title ||
                            product.meta_description ||
                            product.meta_keywords) && (
                            <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                                <div className="mb-4 flex items-center gap-2">
                                    <Globe className="h-5 w-5 text-terra-500" />
                                    <h2 className="text-lg font-semibold text-terra-900">
                                        SEO
                                    </h2>
                                </div>
                                <div className="space-y-3">
                                    {product.meta_title && (
                                        <div>
                                            <p className="text-sm text-terra-500">
                                                Meta Title
                                            </p>
                                            <p className="font-medium text-terra-900">
                                                {product.meta_title}
                                            </p>
                                        </div>
                                    )}
                                    {product.meta_description && (
                                        <div>
                                            <p className="text-sm text-terra-500">
                                                Meta Description
                                            </p>
                                            <p className="text-terra-700">
                                                {product.meta_description}
                                            </p>
                                        </div>
                                    )}
                                    {product.meta_keywords && (
                                        <div>
                                            <p className="text-sm text-terra-500">
                                                Meta Keywords
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {product.meta_keywords
                                                    .split(',')
                                                    .map(
                                                        (
                                                            keyword: string,
                                                            idx: number,
                                                        ) => (
                                                            <span
                                                                key={idx}
                                                                className="rounded-full bg-terra-100 px-3 py-1 text-sm text-terra-700"
                                                            >
                                                                {keyword.trim()}
                                                            </span>
                                                        ),
                                                    )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-lg font-semibold text-terra-900">
                                Status
                            </h2>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-terra-600">
                                        Status Produk
                                    </span>
                                    <span
                                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${product.status.value === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                                    >
                                        {product.status.label}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-terra-600">
                                        Tipe Penjualan
                                    </span>
                                    <span className="rounded-full bg-terra-100 px-2.5 py-1 text-xs font-medium text-terra-700">
                                        {product.sale_type.label}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-terra-600">
                                        Produk Unggulan
                                    </span>
                                    <span
                                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${product.is_featured ? 'bg-wood/20 text-wood-dark' : 'bg-terra-100 text-terra-600'}`}
                                    >
                                        {product.is_featured ? 'Ya' : 'Tidak'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-terra-600">
                                        Produk Baru
                                    </span>
                                    <span
                                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${product.is_new_arrival ? 'bg-blue-100 text-blue-700' : 'bg-terra-100 text-terra-600'}`}
                                    >
                                        {product.is_new_arrival
                                            ? 'Ya'
                                            : 'Tidak'}
                                    </span>
                                </div>
                                {product.discount_percentage && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-terra-600">
                                            Diskon
                                        </span>
                                        <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                                            {product.discount_percentage}%
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-lg font-semibold text-terra-900">
                                Tanggal
                            </h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-terra-500">
                                        Dibuat
                                    </span>
                                    <span className="text-terra-900">
                                        {new Date(
                                            product.created_at,
                                        ).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-terra-500">
                                        Diperbarui
                                    </span>
                                    <span className="text-terra-900">
                                        {new Date(
                                            product.updated_at,
                                        ).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
