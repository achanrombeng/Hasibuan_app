import {
    CustomCursor,
    Footer,
    Header,
    WhatsAppButton,
} from '@/components/shop';
import { useTranslation } from '@/hooks/use-translation';
import { SiteSettings } from '@/types';
import { ApiCategory } from '@/types/shop';
import { router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';

interface CartItem {
    id: number;
    product_id: number;
    quantity: number;
    price: number;
    subtotal: number;
    product: {
        id: number;
        name: string;
        slug: string;
        price: number;
        final_price: number;
        has_discount?: boolean;
        discount_percentage?: number;
        primary_image: {
            image_url: string;
        } | null;
        category: {
            name: string;
        } | null;
    } | null;
}

interface SharedCart {
    id: number | null;
    items_count: number;
    items: CartItem[];
    subtotal: number;
}

interface ShopLayoutProps {
    children: ReactNode;
    showFooter?: boolean;
    showWhatsApp?: boolean;
    whatsAppMessage?: string;
    bannerVisible?: boolean;
    featuredCategories?: ApiCategory[];
}

export function ShopLayout({
    children,
    showFooter = true,
    showWhatsApp = true,
    whatsAppMessage = "Hello, I'd like to inquire about a product",
    bannerVisible = false,
    featuredCategories = [],
}: ShopLayoutProps) {
    const {
        cart,
        siteSettings,
        featuredCategories: sharedCategories,
        flash,
    } = usePage<{
        cart: SharedCart;
        siteSettings: SiteSettings;
        featuredCategories: ApiCategory[];
        flash?: any;
    }>().props;
    const { t } = useTranslation();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [updatingItem, setUpdatingItem] = useState<number | null>(null);

    const whatsAppPhone = siteSettings?.contact_whatsapp || '';

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
        if (flash?.info) {
            toast.info(flash.info);
        }
        if (flash?.warning) {
            toast.warning(flash.warning);
        }
    }, [flash]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const handleUpdateQuantity = async (
        itemId: number,
        newQuantity: number,
    ) => {
        if (newQuantity < 1) return;
        setUpdatingItem(itemId);

        router.put(
            `/shop/cart/${itemId}`,
            { quantity: newQuantity },
            {
                preserveScroll: true,
                only: ['cart'],
                onFinish: () => setUpdatingItem(null),
                onError: (errors) => {
                    console.error('Error updating cart:', errors);
                    setUpdatingItem(null);
                },
            },
        );
    };

    const handleRemoveItem = async (itemId: number) => {
        setUpdatingItem(itemId);

        router.delete(`/shop/cart/${itemId}`, {
            preserveScroll: true,
            only: ['cart'],
            onFinish: () => setUpdatingItem(null),
            onError: (errors) => {
                console.error('Error removing item:', errors);
                setUpdatingItem(null);
            },
        });
    };

    const handleCheckout = () => {
        setIsCartOpen(false);
        router.visit('/shop/checkout');
    };

    return (
        <>
            <Toaster position="top-right" richColors />
            {/* Custom Cursor - smooth following effect like realteakfurniture.com */}
            <CustomCursor />

            <Header
                cartCount={cart?.items_count || 0}
                onCartClick={() => setIsCartOpen(true)}
                onLogoClick={() => router.visit('/shop')}
                bannerVisible={bannerVisible}
                featuredCategories={
                    featuredCategories.length > 0
                        ? featuredCategories
                        : sharedCategories
                }
            />

            {children}

            {showFooter && <Footer />}

            {showWhatsApp && (
                <WhatsAppButton
                    phoneNumber={whatsAppPhone}
                    message={whatsAppMessage}
                />
            )}

            {/* Cart Drawer */}
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCartOpen(false)}
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{
                                type: 'spring',
                                damping: 25,
                                stiffness: 200,
                            }}
                            className="fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-neutral-100 p-6">
                                <h2 className="font-display text-xl font-semibold text-neutral-800">
                                    {t('shop.cart.title')}
                                </h2>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="rounded-sm p-2 transition-colors hover:bg-neutral-100"
                                >
                                    <X size={22} className="text-neutral-600" />
                                </button>
                            </div>

                            {/* Cart Items */}
                            <div className="flex-1 overflow-y-auto p-6">
                                {!cart?.items || cart.items.length === 0 ? (
                                    <div className="flex h-full flex-col items-center justify-center text-center">
                                        <ShoppingBag
                                            size={56}
                                            className="mb-6 text-neutral-200"
                                        />
                                        <h3 className="mb-2 font-display text-lg font-medium text-neutral-800">
                                            {t('shop.cart.empty_title')}
                                        </h3>
                                        <p className="text-neutral-500">
                                            {t('shop.cart.empty_description')}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {cart.items.map((item) => (
                                            <div
                                                key={item.id}
                                                className={`flex gap-4 border-b border-neutral-100 pb-4 last:border-0 ${
                                                    updatingItem === item.id
                                                        ? 'opacity-50'
                                                        : ''
                                                }`}
                                            >
                                                <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-sm bg-neutral-100">
                                                    <img
                                                        src={
                                                            item.product
                                                                ?.primary_image
                                                                ?.image_url ||
                                                            '/images/placeholder-product.svg'
                                                        }
                                                        alt={
                                                            item.product
                                                                ?.name ||
                                                            'Product'
                                                        }
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="truncate font-medium text-neutral-800">
                                                        {item.product?.name ||
                                                            'Unknown Product'}
                                                    </h4>
                                                    {item.product?.category && (
                                                        <p className="text-sm text-neutral-500">
                                                            {
                                                                item.product
                                                                    .category
                                                                    .name
                                                            }
                                                        </p>
                                                    )}
                                                    {/* Price with discount support */}
                                                    <div className="mt-1 flex flex-wrap items-center gap-2">
                                                        <span className="font-semibold text-teal-600">
                                                            {formatPrice(
                                                                item.price,
                                                            )}
                                                        </span>
                                                        {item.product
                                                            ?.has_discount &&
                                                            item.product
                                                                ?.price >
                                                                item.price && (
                                                                <>
                                                                    <span className="text-sm text-neutral-400 line-through">
                                                                        {formatPrice(
                                                                            item
                                                                                .product
                                                                                .price,
                                                                        )}
                                                                    </span>
                                                                    <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-600">
                                                                        -
                                                                        {
                                                                            item
                                                                                .product
                                                                                .discount_percentage
                                                                        }
                                                                        %
                                                                    </span>
                                                                </>
                                                            )}
                                                    </div>
                                                    <div className="mt-2 flex items-center gap-3">
                                                        <div className="flex items-center rounded-sm border border-neutral-200">
                                                            <button
                                                                onClick={() =>
                                                                    handleUpdateQuantity(
                                                                        item.id,
                                                                        item.quantity -
                                                                            1,
                                                                    )
                                                                }
                                                                disabled={
                                                                    updatingItem ===
                                                                        item.id ||
                                                                    item.quantity <=
                                                                        1
                                                                }
                                                                className="flex h-8 w-8 items-center justify-center text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
                                                            >
                                                                <Minus
                                                                    size={14}
                                                                />
                                                            </button>
                                                            <span className="w-8 text-center text-sm font-medium text-neutral-800">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() =>
                                                                    handleUpdateQuantity(
                                                                        item.id,
                                                                        item.quantity +
                                                                            1,
                                                                    )
                                                                }
                                                                disabled={
                                                                    updatingItem ===
                                                                    item.id
                                                                }
                                                                className="flex h-8 w-8 items-center justify-center text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
                                                            >
                                                                <Plus
                                                                    size={14}
                                                                />
                                                            </button>
                                                        </div>
                                                        <button
                                                            onClick={() =>
                                                                handleRemoveItem(
                                                                    item.id,
                                                                )
                                                            }
                                                            disabled={
                                                                updatingItem ===
                                                                item.id
                                                            }
                                                            className="rounded-sm p-2 text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            {cart?.items && cart.items.length > 0 && (
                                <div className="space-y-4 border-t border-neutral-100 bg-neutral-50 p-6">
                                    <div className="flex items-center justify-between text-lg">
                                        <span className="text-neutral-600">
                                            {t('shop.cart.subtotal')}
                                        </span>
                                        <span className="font-semibold text-neutral-800">
                                            {formatPrice(cart.subtotal)}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleCheckout}
                                        className="flex w-full items-center justify-center gap-2 rounded-sm bg-teal-500 py-4 font-medium text-white transition-colors hover:bg-teal-600"
                                    >
                                        {t('shop.cart.proceed_to_checkout')}
                                        <ArrowRight size={18} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsCartOpen(false);
                                            router.visit('/shop/cart');
                                        }}
                                        className="w-full rounded-sm border border-neutral-200 py-3 font-medium text-neutral-700 transition-colors hover:bg-white"
                                    >
                                        {t('shop.cart.view_cart')}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

export default ShopLayout;
