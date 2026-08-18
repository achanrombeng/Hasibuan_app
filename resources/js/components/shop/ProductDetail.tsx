import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Minus, Plus, ArrowLeft, Truck, ShieldCheck } from 'lucide-react';
import { formatPrice } from '@/data/constants';
import { Product } from '@/types/shop';

interface ProductDetailProps {
    product: Product;
    onBack: () => void;
    addToCart: (product: Product) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, addToCart }) => {
    const [selectedQty, setSelectedQty] = useState(1);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen pt-32 pb-20"
        >
            <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-terra-600 hover:text-terra-900 mb-8 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Kembali</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-[4/5] bg-terra-100 rounded-sm overflow-hidden">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="lg:sticky lg:top-32 h-fit">
                        <span className="text-wood uppercase text-xs font-medium tracking-widest">{product.category}</span>
                        <h1 className="font-serif text-5xl text-terra-900 mt-2 mb-4">{product.name}</h1>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} size={18} className={i < Math.floor(product.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-terra-200'} />
                                ))}
                            </div>
                            <span className="text-terra-500 text-sm">{product.rating} / 5</span>
                        </div>

                        <p className="text-3xl font-serif text-terra-900 mb-6">{formatPrice(product.price)}</p>

                        <p className="text-terra-600 leading-relaxed mb-8">{product.description}</p>

                        {/* Features */}
                        <div className="mb-8">
                            <h3 className="font-medium text-terra-900 mb-4">Fitur Utama</h3>
                            <div className="flex flex-wrap gap-2">
                                {product.features.map((feature, i) => (
                                    <span key={i} className="px-4 py-2 bg-terra-100 text-terra-700 rounded-full text-sm">
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-6 mb-8">
                            <span className="text-terra-700 font-medium">Jumlah</span>
                            <div className="flex items-center border border-terra-200 rounded-lg text-terra-900">
                                <button onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))} className="p-3 hover:bg-terra-50 transition-colors text-terra-900">
                                    <Minus size={18} />
                                </button>
                                <span className="w-12 text-center font-medium text-terra-900">{selectedQty}</span>
                                <button onClick={() => setSelectedQty(selectedQty + 1)} className="p-3 hover:bg-terra-50 transition-colors text-terra-900">
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={() => {
                                for (let i = 0; i < selectedQty; i++) {
                                    addToCart(product);
                                }
                            }}
                            className="w-full bg-terra-900 text-white py-5 rounded-full font-medium hover:bg-wood transition-colors flex items-center justify-center gap-3 text-lg"
                        >
                            <ShoppingBag size={22} />
                            Tambahkan ke Keranjang
                        </button>

                        {/* Delivery Info */}
                        <div className="mt-8 p-6 bg-sand-50 rounded-sm space-y-4">
                            <div className="flex items-center gap-4">
                                <Truck className="text-wood" size={24} />
                                <div>
                                    <p className="font-medium text-terra-900">Gratis Pengiriman</p>
                                    <p className="text-sm text-terra-500">Untuk pembelian di atas Rp 5.000.000</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <ShieldCheck className="text-wood" size={24} />
                                <div>
                                    <p className="font-medium text-terra-900">Garansi 5 Tahun</p>
                                    <p className="text-sm text-terra-500">Untuk kerusakan struktural</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductDetail;

