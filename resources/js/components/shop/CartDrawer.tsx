import { formatPrice } from '@/data/constants';
import { CartItem } from '@/types/shop';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bookmark,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  X,
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  savedItems?: CartItem[];
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  saveForLater?: (id: string) => void;
  moveToCart?: (id: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  savedItems = [],
  removeFromCart,
  updateQty,
  saveForLater,
  moveToCart,
  onCheckout,
}) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-terra-100 p-6">
              <h2 className="font-serif text-2xl text-terra-900">
                Shopping Cart
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 transition-colors hover:bg-terra-50"
              >
                <X size={24} className="text-terra-600" />
              </button>
            </div>

            <div className="custom-scrollbar flex-1 overflow-y-auto p-6">
              {cart.length === 0 && savedItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingBag size={64} className="mb-6 text-terra-200" />
                  <h3 className="mb-2 font-serif text-xl text-terra-900">
                    Cart is Empty
                  </h3>
                  <p className="text-terra-500">
                    Start shopping to add items to your cart.
                  </p>
                </div>
              ) : (
                <>
                  {/* Active Cart Items */}
                  {cart.length > 0 && (
                    <div className="mb-6 space-y-4">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-4 border-b border-terra-100 pb-4 last:border-0"
                        >
                          <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-sm bg-terra-100">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <span className="text-xs font-medium text-wood uppercase">
                                {item.category}
                              </span>
                              <h4 className="mt-0.5 text-sm leading-tight font-medium text-terra-900">
                                {item.name}
                              </h4>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center rounded-lg border border-terra-200">
                                <button
                                  onClick={() =>
                                    updateQty(item.id, item.quantity - 1)
                                  }
                                  className="p-1.5 transition-colors hover:bg-terra-50"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="w-6 text-center text-sm font-medium">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQty(item.id, item.quantity + 1)
                                  }
                                  className="p-1.5 transition-colors hover:bg-terra-50"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                              <span className="text-sm font-medium text-terra-900">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                            {saveForLater && (
                              <button
                                onClick={() => saveForLater(item.id)}
                                className="mt-1 flex items-center gap-1 text-xs text-terra-500 hover:text-wood"
                              >
                                <Bookmark size={12} /> Save for later
                              </button>
                            )}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="self-start text-terra-400 transition-colors hover:text-red-500"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Saved for Later Section */}
                  {savedItems.length > 0 && (
                    <div className="mt-6 border-t border-terra-200 pt-6">
                      <h3 className="mb-4 flex items-center gap-2 font-medium text-terra-700">
                        <Bookmark size={16} /> Saved for Later (
                        {savedItems.length})
                      </h3>
                      <div className="space-y-4">
                        {savedItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex gap-3 rounded-sm border-b border-terra-100 bg-sand-50 p-3 pb-4 last:border-0"
                          >
                            <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-terra-100">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="line-clamp-2 text-sm font-medium text-terra-900">
                                {item.name}
                              </h4>
                              <p className="mt-1 text-sm font-medium text-wood-dark">
                                {formatPrice(item.price)}
                              </p>
                              {moveToCart && (
                                <button
                                  onClick={() => moveToCart(item.id)}
                                  className="mt-2 flex items-center gap-1 text-xs text-wood hover:text-terra-900"
                                >
                                  <ShoppingCart size={12} /> Move to cart
                                </button>
                              )}
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="self-start text-terra-400 transition-colors hover:text-red-500"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-terra-100 bg-sand-50 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-terra-600">Subtotal</span>
                  <span className="font-serif text-2xl text-terra-900">
                    {formatPrice(total)}
                  </span>
                </div>
                <p className="mb-4 text-xs text-terra-500">
                  Shipping calculated at checkout
                </p>
                <button
                  onClick={onCheckout}
                  className="w-full rounded-full bg-terra-900 py-4 font-medium text-white transition-colors hover:bg-wood"
                >
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
