import { SEOHead } from '@/components/seo';
import { ProductImagePlaceholder } from '@/components/shop';
import { ShopLayout } from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import { ApiProduct } from '@/types/shop';
import { Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    GitCompare,
    Loader2,
    Minus,
    ShoppingBag,
    Star,
    X,
} from 'lucide-react';
import { useState } from 'react';

interface Props {
    products: ApiProduct[];
}

export default function Compare({ products }: Props) {
    const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
    const siteName = siteSettings?.site_name || 'Ronica';
    const [addingToCart, setAddingToCart] = useState<number | null>(null);
    const [cartSuccess, setCartSuccess] = useState<number | null>(null);

    const handleRemove = (productId: number) => {
        const newIds = products
            .filter((p) => p.id !== productId)
            .map((p) => p.id)
            .join(',');
        if (newIds) {
            router.get(`/shop/compare?ids=${newIds}`);
        } else {
            router.visit('/shop/products');
        }
    };

    const handleAddToCart = async (productId: number) => {
        setAddingToCart(productId);

        router.post(
            '/shop/cart',
            { product_id: productId, quantity: 1 },
            {
                preserveScroll: true,
                only: ['cart'],
                onSuccess: () => {
                    setCartSuccess(productId);
                    setTimeout(() => setCartSuccess(null), 1500);
                },
                onError: (errors) => {
                    console.error('Error adding to cart:', errors);
                },
                onFinish: () => {
                    setAddingToCart(null);
                },
            },
        );
    };

    // Collect all unique specs from products
    const allSpecs = new Set<string>();
    products.forEach((p) => {
        if (p.specifications) {
            Object.keys(p.specifications).forEach((key) => allSpecs.add(key));
        }
    });

    return (
        <>
            <SEOHead
                title="Bandingkan Produk"
                description={`Bandingkan spesifikasi dan harga produk furnitur di ${siteName}. Pilih produk terbaik sesuai kebutuhan Anda.`}
                noindex={true}
            />
            <div className="bg-noise" />
            <ShopLayout>
                <main className="min-h-screen bg-sand-50 pt-28 pb-20">
                    <div className="mx-auto max-w-[1400px] px-6 md:px-12">
                        {/* Header */}
                        <div className="mb-8 flex items-center gap-4">
                            <Link
                                href="/shop/products"
                                className="rounded-full p-2 transition-colors hover:bg-terra-100"
                            >
                                <ArrowLeft size={24} />
                            </Link>
                            <div>
                                <h1 className="flex items-center gap-3 font-serif text-3xl text-terra-900">
                                    <GitCompare
                                        size={32}
                                        className="text-wood"
                                    />
                                    Bandingkan Produk
                                </h1>
                                <p className="mt-1 text-terra-500">
                                    {products.length} produk dipilih
                                </p>
                            </div>
                        </div>

                        {products.length < 2 ? (
                            <div className="rounded-sm bg-white py-20 text-center">
                                <GitCompare
                                    size={48}
                                    className="mx-auto mb-4 text-terra-300"
                                />
                                <h3 className="mb-2 text-xl font-medium text-terra-900">
                                    Select at least 2 products
                                </h3>
                                <p className="mb-6 text-terra-500">
                                    Add products to compare features
                                </p>
                                <Link
                                    href="/shop/products"
                                    className="inline-flex items-center gap-2 rounded-full bg-terra-900 px-6 py-3 text-white hover:bg-wood-dark"
                                >
                                    View Products
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-sm border border-terra-100 bg-white">
                                <div
                                    className="grid"
                                    style={{
                                        gridTemplateColumns: `200px repeat(${products.length}, 1fr)`,
                                    }}
                                >
                                    <div className="bg-terra-50 p-4 font-medium text-terra-700">
                                        Product
                                    </div>
                                    {products.map((product) => (
                                        <div
                                            key={product.id}
                                            className="relative border-l border-terra-100 p-4"
                                        >
                                            <button
                                                onClick={() =>
                                                    handleRemove(product.id)
                                                }
                                                className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-terra-100 text-terra-600 transition-colors hover:bg-red-100 hover:text-red-500"
                                            >
                                                <X size={16} />
                                            </button>
                                            <div className="mb-3 aspect-square overflow-hidden rounded-sm bg-sand-50 flex items-center justify-center">
                                                {product.primary_image?.image_url || product.images?.[0]?.image_url ? (
                                                    <img
                                                        src={
                                                            product.primary_image?.image_url ||
                                                            product.images?.[0]?.image_url
                                                        }
                                                        alt={product.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <ProductImagePlaceholder
                                                        name={product.name}
                                                        sku={product.sku}
                                                        category={product.category?.name}
                                                        size="sm"
                                                    />
                                                )}
                                            </div>
                                            <Link
                                                href={`/shop/products/${product.slug}`}
                                                className="line-clamp-2 font-medium text-terra-900 hover:text-wood"
                                            >
                                                {product.name}
                                            </Link>
                                            <p className="mt-1 text-sm text-terra-500">
                                                {product.category?.name}
                                            </p>
                                        </div>
                                    ))}
                                </div>



                                {/* Rating */}
                                <CompareRow
                                    label="Rating"
                                    products={products}
                                    render={(p) => (
                                        <div className="flex items-center gap-2">
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star
                                                        key={s}
                                                        size={16}
                                                        className={
                                                            s <=
                                                                Math.round(
                                                                    p.average_rating,
                                                                )
                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                : 'text-terra-200'
                                                        }
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-terra-500">
                                                ({p.review_count})
                                            </span>
                                        </div>
                                    )}
                                />

                                {/* Stock */}
                                <CompareRow
                                    label="Stok"
                                    products={products}
                                    render={(p) => (
                                        <span
                                            className={`rounded-full px-3 py-1 text-sm ${p.is_in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                                        >
                                            {p.is_in_stock
                                                ? 'Tersedia'
                                                : 'Habis'}
                                        </span>
                                    )}
                                />

                                {/* Specifications */}
                                {Array.from(allSpecs).map((spec) => (
                                    <CompareRow
                                        key={spec}
                                        label={spec}
                                        products={products}
                                        render={(p) => {
                                            const value =
                                                p.specifications?.[spec];
                                            if (
                                                value === 'true' ||
                                                value === 'yes' ||
                                                value === 'Ya'
                                            )
                                                return (
                                                    <Check
                                                        size={20}
                                                        className="text-green-500"
                                                    />
                                                );
                                            if (
                                                value === 'false' ||
                                                value === 'no' ||
                                                value === 'Tidak' ||
                                                !value
                                            )
                                                return (
                                                    <Minus
                                                        size={20}
                                                        className="text-terra-300"
                                                    />
                                                );
                                            return (
                                                <span className="text-terra-700">
                                                    {value}
                                                </span>
                                            );
                                        }}
                                    />
                                ))}

                                {/* Add to Cart */}
                                <div
                                    className="grid border-t border-terra-100"
                                    style={{
                                        gridTemplateColumns: `200px repeat(${products.length}, 1fr)`,
                                    }}
                                >
                                    <div className="bg-terra-50 p-4"></div>
                                    {products.map((product) => (
                                        <div
                                            key={product.id}
                                            className="border-l border-terra-100 p-4"
                                        >
                                            <button
                                                onClick={() =>
                                                    handleAddToCart(product.id)
                                                }
                                                disabled={
                                                    !product.is_in_stock ||
                                                    addingToCart ===
                                                    product.id ||
                                                    cartSuccess === product.id
                                                }
                                                className={`flex w-full items-center justify-center gap-2 rounded-full py-3 transition-colors disabled:cursor-not-allowed ${cartSuccess === product.id
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-terra-900 text-white hover:bg-wood-dark disabled:opacity-50'
                                                    }`}
                                            >
                                                {cartSuccess === product.id ? (
                                                    <>
                                                        <Check size={18} />
                                                        Ditambahkan!
                                                    </>
                                                ) : addingToCart ===
                                                    product.id ? (
                                                    <>
                                                        <Loader2
                                                            size={18}
                                                            className="animate-spin"
                                                        />
                                                        Menambahkan...
                                                    </>
                                                ) : (
                                                    <>
                                                        <ShoppingBag
                                                            size={18}
                                                        />
                                                        Tambah ke Keranjang
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </ShopLayout>
        </>
    );
}

function CompareRow({
    label,
    products,
    render,
}: {
    label: string;
    products: ApiProduct[];
    render: (p: ApiProduct) => React.ReactNode;
}) {
    return (
        <div
            className="grid border-t border-terra-100"
            style={{
                gridTemplateColumns: `200px repeat(${products.length}, 1fr)`,
            }}
        >
            <div className="bg-terra-50 p-4 font-medium text-terra-700">
                {label}
            </div>
            {products.map((product) => (
                <div key={product.id} className="border-l border-terra-100 p-4">
                    {render(product)}
                </div>
            ))}
        </div>
    );
}
