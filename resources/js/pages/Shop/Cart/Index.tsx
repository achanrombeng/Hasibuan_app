import { ProductImagePlaceholder } from '@/components/shop';
import { useTranslation } from '@/hooks/use-translation';
import { ShopLayout } from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Bookmark,
    Minus,
    Plus,
    ShoppingBag,
    ShoppingCart,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface ProductImage {
    id: number;
    url: string;
    is_primary: boolean;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    sku?: string;
    price_formatted: string;
    final_price_formatted: string;
    has_discount: boolean;
    images: ProductImage[];
}

interface CartItem {
    id: number;
    product_id: number;
    quantity: number;
    unit_price_formatted: string;
    subtotal_formatted: string;
    is_saved_for_later: boolean;
    product: Product;
}

interface Cart {
    id: number;
    items_count: number;
    saved_items_count: number;
    subtotal_formatted: string;
    items: CartItem[];
    saved_items: CartItem[];
}

interface Props {
    cart: Cart | null;
}

export default function CartIndex({ cart }: Props) {
    const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
    const siteName = siteSettings?.site_name || 'Ronica';
    const { t } = useTranslation();
    const [loading, setLoading] = useState<number | null>(null);

    const updateQuantity = (itemId: number, quantity: number) => {
        if (quantity < 1) return;
        setLoading(itemId);
        router.put(
            `/shop/cart/${itemId}`,
            { quantity },
            {
                preserveScroll: true,
                onFinish: () => setLoading(null),
            },
        );
    };

    const removeItem = (itemId: number) => {
        setLoading(itemId);
        router.delete(`/shop/cart/${itemId}`, {
            preserveScroll: true,
            onFinish: () => setLoading(null),
        });
    };

    const saveForLater = (itemId: number) => {
        setLoading(itemId);
        router.post(
            `/shop/cart/${itemId}/save-for-later`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setLoading(null),
            },
        );
    };

    const moveToCart = (itemId: number) => {
        setLoading(itemId);
        router.post(
            `/shop/cart/${itemId}/move-to-cart`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setLoading(null),
            },
        );
    };

    const getProductImage = (product: Product) => {
        const primary = product.images?.find((img) => img.is_primary);
        return primary?.url || product.images?.[0]?.url || '';
    };

    return (
        <>
            <Head title={`${t('shop.cart.title')} - ${siteName}`} />
            <div className="bg-noise" />
            <ShopLayout>
                <main className="min-h-screen bg-sand-50 pt-8 pb-20">
                    <div className="mx-auto max-w-7xl px-6 md:px-12">
                        <Link
                            href="/shop/products"
                            className="mb-6 inline-flex items-center gap-2 text-terra-600 hover:text-terra-900"
                        >
                            <ArrowLeft className="h-4 w-4" /> {t('shop.cart.continue_shopping')}
                        </Link>

                        <h1 className="mb-8 font-serif text-3xl text-terra-900">
                            {t('shop.cart.shopping_cart')}
                        </h1>

                        {!cart || cart.items.length === 0 ? (
                            <div className="rounded-sm bg-white p-12 text-center">
                                <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-terra-200" />
                                <h2 className="mb-2 font-serif text-2xl text-terra-900">
                                    {t('shop.cart.empty_title')}
                                </h2>
                                <p className="mb-6 text-teal-600">
                                    {t('shop.cart.empty_description')}
                                </p>
                                <Link
                                    href="/shop/products"
                                    className="inline-flex items-center gap-2 rounded-sm bg-teal-600 px-6 py-3 text-white transition-colors hover:bg-teal-700"
                                >
                                    {t('shop.cart.continue_shopping')}{' '}
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        ) : (
                            <div className="grid gap-8 lg:grid-cols-3">
                                {/* Cart Items */}
                                <div className="space-y-4 lg:col-span-2">
                                    {cart.items.map((item) => (
                                        <CartItemCard
                                            key={item.id}
                                            item={item}
                                            loading={loading === item.id}
                                            onUpdateQuantity={updateQuantity}
                                            onRemove={removeItem}
                                            onSaveForLater={saveForLater}
                                            getProductImage={getProductImage}
                                        />
                                    ))}

                                    {/* Saved for Later */}
                                    {cart.saved_items.length > 0 && (
                                        <div className="mt-8">
                                            <h2 className="mb-4 flex items-center gap-2 font-serif text-xl text-terra-900">
                                                <Bookmark className="h-5 w-5" />{' '}
                                                {t('shop.cart.saved_items')} (
                                                {cart.saved_items.length})
                                            </h2>
                                            <div className="space-y-4">
                                                {cart.saved_items.map(
                                                    (item) => (
                                                        <SavedItemCard
                                                            key={item.id}
                                                            item={item}
                                                            loading={
                                                                loading ===
                                                                item.id
                                                            }
                                                            onMoveToCart={
                                                                moveToCart
                                                            }
                                                            onRemove={
                                                                removeItem
                                                            }
                                                            getProductImage={
                                                                getProductImage
                                                            }
                                                        />
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Order Summary */}
                                <div className="lg:col-span-1">
                                    <div className="sticky top-28 rounded-sm bg-white p-6">
                                        <h2 className="mb-4 font-serif text-xl text-terra-900">
                                            {t('shop.checkout.order_summary')}
                                        </h2>
                                        <div className="mb-6 space-y-3">
                                            <div className="flex justify-between text-terra-600">
                                                <span>
                                                    {t('shop.cart.subtotal')} ({cart.items_count}{' '}
                                                    {t('common.items')})
                                                </span>
                                                <span>
                                                    {cart.subtotal_formatted}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm text-terra-500">
                                                <span>{t('shop.checkout.shipping_cost')}</span>
                                                <span>
                                                    {t('shop.cart.shipping_note')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mb-6 border-t border-terra-100 pt-4">
                                            <div className="flex justify-between">
                                                <span className="font-medium text-terra-900">
                                                    {t('common.total')}
                                                </span>
                                                <span className="font-serif text-2xl text-terra-900">
                                                    {cart.subtotal_formatted}
                                                </span>
                                            </div>
                                        </div>
                                        <Link
                                            href="/shop/checkout"
                                            className="block w-full rounded-sm bg-teal-600 py-4 text-center font-medium text-white transition-colors hover:bg-teal-700"
                                        >
                                            {t('shop.cart.proceed_to_checkout')}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </ShopLayout>
        </>
    );
}

interface CartItemCardProps {
    item: CartItem;
    loading: boolean;
    onUpdateQuantity: (id: number, qty: number) => void;
    onRemove: (id: number) => void;
    onSaveForLater: (id: number) => void;
    getProductImage: (product: Product) => string;
}

function CartItemCard({
    item,
    loading,
    onUpdateQuantity,
    onRemove,
    onSaveForLater,
    getProductImage,
}: CartItemCardProps) {
    const { t } = useTranslation();
    const imgUrl = getProductImage(item.product);

    return (
        <div
            className={`flex gap-4 rounded-sm bg-white p-4 ${loading ? 'opacity-50' : ''}`}
        >
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-terra-100 flex items-center justify-center">
                <Link href={`/shop/products/${item.product.slug}`} className="h-full w-full">
                    {imgUrl ? (
                        <img
                            src={imgUrl}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <ProductImagePlaceholder
                            name={item.product.name}
                            sku={item.product.sku}
                            size="sm"
                        />
                    )}
                </Link>
            </div>
            <div className="flex flex-1 flex-col justify-between">
                <div>
                    <div className="flex items-start justify-between">
                        <Link
                            href={`/shop/products/${item.product.slug}`}
                            className="line-clamp-2 font-medium text-terra-900 transition-colors hover:text-wood"
                        >
                            {item.product.name}
                        </Link>
                        <span className="ml-4 font-serif text-lg whitespace-nowrap text-terra-900">
                            {item.subtotal_formatted}
                        </span>
                    </div>

                    <div className="mt-1">
                        {item.product.has_discount ? (
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-terra-900">
                                    {item.product.final_price_formatted}
                                </span>
                                <span className="text-sm text-terra-400 line-through">
                                    {item.product.price_formatted}
                                </span>
                            </div>
                        ) : (
                            <span className="font-medium text-terra-900">
                                {item.unit_price_formatted}
                            </span>
                        )}
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center rounded-sm border border-terra-200 text-terra-900">
                        <button
                            onClick={() =>
                                onUpdateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={loading || item.quantity <= 1}
                            className="p-1 px-2 transition-colors hover:bg-terra-50 disabled:opacity-50"
                        >
                            <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-3 text-sm font-medium text-terra-900">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() =>
                                onUpdateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={loading}
                            className="p-1 px-2 transition-colors hover:bg-terra-50 disabled:opacity-50"
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => onRemove(item.id)}
                            disabled={loading}
                            className="flex items-center gap-1 text-sm text-red-500 transition-colors hover:text-red-600"
                        >
                            <Trash2 className="h-4 w-4" />{' '}
                            <span className="hidden sm:inline">{t('common.delete')}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface SavedItemCardProps {
    item: CartItem;
    loading: boolean;
    onMoveToCart: (id: number) => void;
    onRemove: (id: number) => void;
    getProductImage: (product: Product) => string;
}

function SavedItemCard({
    item,
    loading,
    onMoveToCart,
    onRemove,
    getProductImage,
}: SavedItemCardProps) {
    const { t } = useTranslation();
    const imgUrl = getProductImage(item.product);

    return (
        <div
            className={`flex gap-4 rounded-sm bg-white p-4 ${loading ? 'opacity-50' : ''}`}
        >
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-terra-100 flex items-center justify-center">
                <Link href={`/shop/products/${item.product.slug}`} className="h-full w-full">
                    {imgUrl ? (
                        <img
                            src={imgUrl}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <ProductImagePlaceholder
                            name={item.product.name}
                            sku={item.product.sku}
                            size="sm"
                        />
                    )}
                </Link>
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                    <Link
                        href={`/shop/products/${item.product.slug}`}
                        className="line-clamp-1 font-medium text-terra-900 transition-colors hover:text-wood"
                    >
                        {item.product.name}
                    </Link>
                    <span className="text-sm text-terra-600">
                        {item.unit_price_formatted}
                    </span>
                </div>
                <div className="mt-2 flex items-center gap-4">
                    <button
                        onClick={() => onMoveToCart(item.id)}
                        disabled={loading}
                        className="flex items-center gap-1 text-sm text-wood transition-colors hover:text-terra-900"
                    >
                        <ShoppingCart className="h-4 w-4" /> {t('shop.cart.move_to_cart')}
                    </button>
                    <button
                        onClick={() => onRemove(item.id)}
                        disabled={loading}
                        className="flex items-center gap-1 text-sm text-red-500 transition-colors hover:text-red-600"
                    >
                        <Trash2 className="h-4 w-4" /> {t('common.delete')}
                    </button>
                </div>
            </div>
        </div>
    );
}
