import { ApiProduct } from '@/types/shop';
import { Link, router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Check,
    ChevronLeft,
    ChevronRight,
    Eye,
    Heart,
    Loader2,
    Minus,
    Plus,
    ShoppingBag,
    Star,
    X,
} from 'lucide-react';
import { useState } from 'react';

interface QuickViewModalProps {
    product: ApiProduct | null;
    isOpen: boolean;
    onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
    product,
    isOpen,
    onClose,
}) => {
    const [quantity, setQuantity] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [cartSuccess, setCartSuccess] = useState(false);

    if (!product) return null;

    const images = product.images?.length
        ? product.images
        : [
            {
                id: 0,
                image_url:
                    product.primary_image?.image_url ||
                    '/images/placeholder-product.svg',
                alt_text: product.name,
            },
        ];

    const handleAddToCart = async () => {
        setIsAddingToCart(true);

        router.post(
            '/shop/cart',
            { product_id: product.id, quantity },
            {
                preserveScroll: true,
                only: ['cart'],
                onSuccess: () => {
                    setCartSuccess(true);
                    // Show success briefly then close
                    setTimeout(() => {
                        onClose();
                        setCartSuccess(false);
                        setQuantity(1);
                    }, 800);
                },
                onError: (errors) => {
                    console.error('Error adding to cart:', errors);
                },
                onFinish: () => {
                    setIsAddingToCart(false);
                },
            },
        );
    };

    const handleWishlist = async () => {
        router.post(
            `/shop/wishlist/${product.id}`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsWishlisted(!isWishlisted);
                },
                onError: (e) => console.error(e),
            },
        );
    };

    const nextImage = () =>
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    const prevImage = () =>
        setCurrentImageIndex(
            (prev) => (prev - 1 + images.length) % images.length,
        );

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-sm bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="grid md:grid-cols-2">
                            {/* Image Section */}
                            <div className="relative aspect-square bg-sand-50 md:aspect-auto flex items-center justify-center p-4">
                                <img
                                    src={images[currentImageIndex]?.image_url}
                                    alt={product.name}
                                    className="h-full w-full object-scale-down"
                                />
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-sm bg-white/90 text-neutral-900 shadow-lg hover:bg-white"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-sm bg-white/90 text-neutral-900 shadow-lg hover:bg-white"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                                            {images.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() =>
                                                        setCurrentImageIndex(
                                                            idx,
                                                        )
                                                    }
                                                    className={`h-2 w-2 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-neutral-900' : 'bg-white/60'}`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                                {product.has_discount && (
                                    <span className="absolute top-4 left-4 rounded-sm bg-teal-600 px-3 py-1 text-sm font-bold text-white">
                                        -{product.discount_percentage}%
                                    </span>
                                )}
                            </div>

                            {/* Info Section */}
                            <div className="flex max-h-[90vh] flex-col overflow-y-auto p-6 md:max-h-none md:p-8">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-sm bg-neutral-100 text-neutral-900 transition-colors hover:bg-neutral-200"
                                >
                                    <X size={20} />
                                </button>

                                <p className="mb-2 text-sm tracking-wider text-teal-600 uppercase">
                                    {product.category?.name}
                                </p>
                                <h2 className="mb-3 font-serif text-2xl text-neutral-900 md:text-3xl">
                                    {product.name}
                                </h2>

                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star
                                                key={s}
                                                size={16}
                                                className={
                                                    s <=
                                                        Math.round(
                                                            product.average_rating,
                                                        )
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-neutral-200'
                                                }
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-neutral-500">
                                        ({product.review_count} ulasan)
                                    </span>
                                    <span className="text-neutral-300">|</span>
                                    <span className="text-sm text-neutral-500">
                                        {product.sold_count} terjual
                                    </span>
                                </div>

                                <div className="mb-4 border-y border-neutral-100 py-4">
                                    {product.has_discount ? (
                                        <div className="flex items-end gap-3">
                                            <span className="text-2xl font-bold text-neutral-900 md:text-3xl">
                                                {product.final_price_formatted}
                                            </span>
                                            <span className="text-lg text-neutral-400 line-through">
                                                {product.price_formatted}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-2xl font-bold text-neutral-900 md:text-3xl">
                                            {product.price_formatted}
                                        </span>
                                    )}
                                </div>

                                {product.short_description && (
                                    <p className="mb-4 line-clamp-3 text-sm text-neutral-600">
                                        {product.short_description}
                                    </p>
                                )}

                                <div className="mb-4 flex items-center gap-2">
                                    <span
                                        className={`rounded-sm px-3 py-1 text-xs font-medium ${product.is_in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                                    >
                                        {product.is_in_stock
                                            ? `Stok: ${product.stock_quantity}`
                                            : 'Stok Habis'}
                                    </span>
                                </div>

                                {/* Quantity */}
                                <div className="mb-6 flex items-center gap-4">
                                    <span className="text-sm text-neutral-600">
                                        Jumlah:
                                    </span>
                                    <div className="flex items-center rounded-sm border border-neutral-200 text-neutral-900">
                                        <button
                                            onClick={() =>
                                                setQuantity(
                                                    Math.max(1, quantity - 1),
                                                )
                                            }
                                            className="flex h-10 w-10 items-center justify-center border-r border-neutral-200 hover:bg-neutral-50"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="w-12 text-center font-medium">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() =>
                                                setQuantity(
                                                    Math.min(
                                                        product.stock_quantity ||
                                                        99,
                                                        quantity + 1,
                                                    ),
                                                )
                                            }
                                            className="flex h-10 w-10 items-center justify-center border-l border-neutral-200 hover:bg-neutral-50"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-auto flex gap-3">
                                    <a
                                        href={`https://wa.me/?text=${encodeURIComponent(`Hello, I would like to inquire about ${product.name}`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-[#25D366] py-3 font-medium text-white shadow-md transition-colors hover:bg-[#20ba5a]"
                                    >
                                        Inquire via WhatsApp
                                    </a>
                                    <button
                                        onClick={handleWishlist}
                                        className={`flex h-12 w-12 items-center justify-center rounded-sm border transition-colors ${isWishlisted ? 'border-red-200 bg-red-50 text-red-500' : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}
                                    >
                                        <Heart
                                            size={20}
                                            className={
                                                isWishlisted
                                                    ? 'fill-current'
                                                    : ''
                                            }
                                        />
                                    </button>
                                </div>

                                <Link
                                    href={`/shop/products/${product.slug}`}
                                    className="mt-4 flex items-center justify-center gap-2 text-center text-sm text-teal-600 hover:text-teal-700"
                                >
                                    <Eye size={16} />
                                    Show Detail
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default QuickViewModal;
