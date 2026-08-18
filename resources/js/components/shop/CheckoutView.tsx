import { motion } from 'framer-motion';
import { ArrowLeft, Check, Tag, X, Loader2 } from 'lucide-react';
import { formatPrice } from '@/data/constants';
import { CartItem } from '@/types/shop';
import { useState } from 'react';

interface CheckoutViewProps {
    cart: CartItem[];
    onBack: () => void;
    onSuccess: () => void;
}

interface CouponState {
    code: string;
    discount: number;
    isValid: boolean;
    message: string;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ cart, onBack, onSuccess }) => {
    const [couponInput, setCouponInput] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState<CouponState | null>(null);

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= 5000000 ? 0 : 150000;
    const discount = appliedCoupon?.discount || 0;
    const total = subtotal + shipping - discount;

    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) return;

        setCouponLoading(true);
        // Simulate API call - in real implementation, call backend to validate coupon
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Demo coupons for testing
        const demoCoupons: Record<string, { discount: number; type: 'fixed' | 'percent' }> = {
            'DISKON10': { discount: 10, type: 'percent' },
            'DISKON50K': { discount: 50000, type: 'fixed' },
            'WELCOME': { discount: 15, type: 'percent' },
            'LATIF100': { discount: 100000, type: 'fixed' },
        };

        const coupon = demoCoupons[couponInput.toUpperCase()];
        if (coupon) {
            const discountAmount = coupon.type === 'percent'
                ? Math.round(subtotal * coupon.discount / 100)
                : coupon.discount;
            setAppliedCoupon({
                code: couponInput.toUpperCase(),
                discount: discountAmount,
                isValid: true,
                message: coupon.type === 'percent' ? `Diskon ${coupon.discount}%` : `Diskon ${formatPrice(coupon.discount)}`,
            });
        } else {
            setAppliedCoupon({
                code: couponInput,
                discount: 0,
                isValid: false,
                message: 'Kode kupon tidak valid',
            });
        }
        setCouponLoading(false);
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponInput('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSuccess();
    };

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
                    <span>Kembali ke Keranjang</span>
                </button>

                <h1 className="font-serif text-5xl text-terra-900 mb-12">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Checkout Form */}
                    <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">
                        <div>
                            <h2 className="font-serif text-2xl text-terra-900 mb-6">Informasi Kontak</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="Nama Depan" className="col-span-1 p-4 border border-terra-200 rounded-sm focus:outline-none focus:border-wood transition-colors" required />
                                <input type="text" placeholder="Nama Belakang" className="col-span-1 p-4 border border-terra-200 rounded-sm focus:outline-none focus:border-wood transition-colors" required />
                                <input type="email" placeholder="Email" className="col-span-2 p-4 border border-terra-200 rounded-sm focus:outline-none focus:border-wood transition-colors" required />
                                <input type="tel" placeholder="Nomor Telepon" className="col-span-2 p-4 border border-terra-200 rounded-sm focus:outline-none focus:border-wood transition-colors" required />
                            </div>
                        </div>

                        <div>
                            <h2 className="font-serif text-2xl text-terra-900 mb-6">Alamat Pengiriman</h2>
                            <div className="space-y-4">
                                <input type="text" placeholder="Alamat Lengkap" className="w-full p-4 border border-terra-200 rounded-sm focus:outline-none focus:border-wood transition-colors" required />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="Kota" className="p-4 border border-terra-200 rounded-sm focus:outline-none focus:border-wood transition-colors" required />
                                    <input type="text" placeholder="Provinsi" className="p-4 border border-terra-200 rounded-sm focus:outline-none focus:border-wood transition-colors" required />
                                </div>
                                <input type="text" placeholder="Kode Pos" className="w-full p-4 border border-terra-200 rounded-sm focus:outline-none focus:border-wood transition-colors" required />
                            </div>
                        </div>

                        <div>
                            <h2 className="font-serif text-2xl text-terra-900 mb-6">Metode Pembayaran</h2>
                            <div className="space-y-3">
                                {['Transfer Bank', 'Kartu Kredit/Debit', 'E-Wallet', 'COD (Bayar di Tempat)'].map((method) => (
                                    <label key={method} className="flex items-center gap-4 p-4 border border-terra-200 rounded-sm cursor-pointer hover:border-wood transition-colors">
                                        <input type="radio" name="payment" value={method} className="w-5 h-5 accent-wood" defaultChecked={method === 'Transfer Bank'} />
                                        <span className="text-terra-700">{method}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-terra-900 text-white py-5 rounded-full font-medium hover:bg-wood transition-colors flex items-center justify-center gap-3 text-lg">
                            <Check size={22} />
                            Selesaikan Pesanan
                        </button>
                    </form>

                    {/* Order Summary */}
                    <div className="lg:col-span-5">
                        <div className="bg-sand-50 rounded-sm p-8 sticky top-32">
                            <h2 className="font-serif text-2xl text-terra-900 mb-6">Ringkasan Pesanan</h2>

                            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-20 h-24 bg-terra-100 rounded-sm overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-terra-900 font-medium text-sm">{item.name}</h4>
                                            <p className="text-terra-500 text-sm">Qty: {item.quantity}</p>
                                            <p className="text-terra-900 font-medium">{formatPrice(item.price * item.quantity)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Coupon Input */}
                            <div className="border-t border-terra-200 pt-6 mb-6">
                                <h3 className="font-medium text-terra-900 mb-3 flex items-center gap-2">
                                    <Tag size={18} className="text-wood" />
                                    Kode Kupon
                                </h3>
                                {appliedCoupon?.isValid ? (
                                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-sm p-4">
                                        <div>
                                            <p className="font-medium text-green-700">{appliedCoupon.code}</p>
                                            <p className="text-sm text-green-600">{appliedCoupon.message}</p>
                                        </div>
                                        <button onClick={handleRemoveCoupon} className="p-2 hover:bg-green-100 rounded-full transition-colors">
                                            <X size={18} className="text-green-700" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={couponInput}
                                            onChange={(e) => setCouponInput(e.target.value)}
                                            placeholder="Masukkan kode kupon"
                                            className="flex-1 p-3 border border-terra-200 rounded-sm focus:outline-none focus:border-wood transition-colors text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleApplyCoupon}
                                            disabled={couponLoading || !couponInput.trim()}
                                            className="px-4 py-3 bg-terra-900 text-white rounded-sm hover:bg-wood transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {couponLoading ? <Loader2 size={16} className="animate-spin" /> : 'Pakai'}
                                        </button>
                                    </div>
                                )}
                                {appliedCoupon && !appliedCoupon.isValid && (
                                    <p className="text-sm text-red-500 mt-2">{appliedCoupon.message}</p>
                                )}
                            </div>

                            <div className="border-t border-terra-200 pt-6 space-y-3">
                                <div className="flex justify-between text-terra-600">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-terra-600">
                                    <span>Ongkir</span>
                                    <span>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Diskon</span>
                                        <span>-{formatPrice(discount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-xl font-serif text-terra-900 pt-3 border-t border-terra-200">
                                    <span>Total</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CheckoutView;

