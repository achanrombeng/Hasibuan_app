import { formatPrice } from '@/data/constants';
import { CartItem } from '@/types/shop';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Loader2, Tag, X } from 'lucide-react';
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

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cart,
  onBack,
  onSuccess,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponState | null>(null);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal >= 5000000 ? 0 : 150000;
  const discount = appliedCoupon?.discount || 0;
  const total = subtotal + shipping - discount;

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;

    setCouponLoading(true);
    // Simulate API call - in real implementation, call backend to validate coupon
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Demo coupons for testing
    const demoCoupons: Record<
      string,
      { discount: number; type: 'fixed' | 'percent' }
    > = {
      DISCOUNT10: { discount: 10, type: 'percent' },
      DISCOUNT50K: { discount: 50000, type: 'fixed' },
      WELCOME: { discount: 15, type: 'percent' },
      RONICA100: { discount: 100000, type: 'fixed' },
    };

    const coupon = demoCoupons[couponInput.toUpperCase()];
    if (coupon) {
      const discountAmount =
        coupon.type === 'percent'
          ? Math.round((subtotal * coupon.discount) / 100)
          : coupon.discount;
      setAppliedCoupon({
        code: couponInput.toUpperCase(),
        discount: discountAmount,
        isValid: true,
        message:
          coupon.type === 'percent'
            ? `Discount ${coupon.discount}%`
            : `Discount ${formatPrice(coupon.discount)}`,
      });
    } else {
      setAppliedCoupon({
        code: couponInput,
        discount: 0,
        isValid: false,
        message: 'Invalid coupon code',
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
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-terra-600 transition-colors hover:text-terra-900"
        >
          <ArrowLeft size={20} />
          <span>Back to Cart</span>
        </button>

        <h1 className="mb-12 font-serif text-5xl text-terra-900">Checkout</h1>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="space-y-8 lg:col-span-7">
            <div>
              <h2 className="mb-6 font-serif text-2xl text-terra-900">
                Contact Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="col-span-1 rounded-sm border border-terra-200 p-4 transition-colors focus:border-wood focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="col-span-1 rounded-sm border border-terra-200 p-4 transition-colors focus:border-wood focus:outline-none"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="col-span-2 rounded-sm border border-terra-200 p-4 transition-colors focus:border-wood focus:outline-none"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="col-span-2 rounded-sm border border-terra-200 p-4 transition-colors focus:border-wood focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <h2 className="mb-6 font-serif text-2xl text-terra-900">
                Shipping Address
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Address"
                  className="w-full rounded-sm border border-terra-200 p-4 transition-colors focus:border-wood focus:outline-none"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    className="rounded-sm border border-terra-200 p-4 transition-colors focus:border-wood focus:outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="State / Province"
                    className="rounded-sm border border-terra-200 p-4 transition-colors focus:border-wood focus:outline-none"
                    required
                  />
                </div>
                <input
                  type="text"
                  placeholder="Postal Code"
                  className="w-full rounded-sm border border-terra-200 p-4 transition-colors focus:border-wood focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <h2 className="mb-6 font-serif text-2xl text-terra-900">
                Payment Method
              </h2>
              <div className="space-y-3">
                {[
                  'Bank Transfer',
                  'Credit/Debit Card',
                  'E-Wallet',
                  'Cash on Delivery (COD)',
                ].map((method) => (
                  <label
                    key={method}
                    className="flex cursor-pointer items-center gap-4 rounded-sm border border-terra-200 p-4 transition-colors hover:border-wood"
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method}
                      className="h-5 w-5 accent-wood"
                      defaultChecked={method === 'Bank Transfer'}
                    />
                    <span className="text-terra-700">{method}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-full bg-terra-900 py-5 text-lg font-medium text-white transition-colors hover:bg-wood"
            >
              <Check size={22} />
              Complete Order
            </button>
          </form>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 rounded-sm bg-sand-50 p-8">
              <h2 className="mb-6 font-serif text-2xl text-terra-900">
                Order Summary
              </h2>

              <div className="custom-scrollbar mb-6 max-h-60 space-y-4 overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-sm bg-terra-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-terra-900">
                        {item.name}
                      </h4>
                      <p className="text-sm text-terra-500">
                        Qty: {item.quantity}
                      </p>
                      <p className="font-medium text-terra-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Input */}
              <div className="mb-6 border-t border-terra-200 pt-6">
                <h3 className="mb-3 flex items-center gap-2 font-medium text-terra-900">
                  <Tag size={18} className="text-wood" />
                  Coupon Code
                </h3>
                {appliedCoupon?.isValid ? (
                  <div className="flex items-center justify-between rounded-sm border border-green-200 bg-green-50 p-4">
                    <div>
                      <p className="font-medium text-green-700">
                        {appliedCoupon.code}
                      </p>
                      <p className="text-sm text-green-600">
                        {appliedCoupon.message}
                      </p>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="rounded-full p-2 transition-colors hover:bg-green-100"
                    >
                      <X size={18} className="text-green-700" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 rounded-sm border border-terra-200 p-3 text-sm transition-colors focus:border-wood focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponInput.trim()}
                      className="flex items-center gap-2 rounded-sm bg-terra-900 px-4 py-3 text-white transition-colors hover:bg-wood disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {couponLoading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        'Apply'
                      )}
                    </button>
                  </div>
                )}
                {appliedCoupon && !appliedCoupon.isValid && (
                  <p className="mt-2 text-sm text-red-500">
                    {appliedCoupon.message}
                  </p>
                )}
              </div>

              <div className="space-y-3 border-t border-terra-200 pt-6">
                <div className="flex justify-between text-terra-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-terra-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-terra-200 pt-3 font-serif text-xl text-terra-900">
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
