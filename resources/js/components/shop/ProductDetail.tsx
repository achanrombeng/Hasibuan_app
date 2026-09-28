import { formatPrice } from '@/data/constants';
import { Product } from '@/types/shop';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from 'lucide-react';
import { useState } from 'react';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  addToCart: (product: Product) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  onBack,
  addToCart,
}) => {
  const [selectedQty, setSelectedQty] = useState(1);

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
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="flex aspect-[4/5] items-center justify-center overflow-hidden rounded-sm bg-terra-100 p-3">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-scale-down"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="h-fit lg:sticky lg:top-32">
            <span className="text-xs font-medium tracking-widest text-wood uppercase">
              {product.category}
            </span>
            <h1 className="mt-2 mb-4 font-serif text-5xl text-terra-900">
              {product.name}
            </h1>

            <div className="mb-6 flex items-center gap-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-500 text-yellow-500'
                        : 'text-terra-200'
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-terra-500">
                {product.rating} / 5
              </span>
            </div>

            <p className="mb-6 font-serif text-3xl text-terra-900">
              {formatPrice(product.price)}
            </p>

            <p className="mb-8 leading-relaxed text-terra-600">
              {product.description}
            </p>

            {/* Features */}
            <div className="mb-8">
              <h3 className="mb-4 font-medium text-terra-900">Key Features</h3>
              <div className="flex flex-wrap gap-2">
                {product.features.map((feature, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-terra-100 px-4 py-2 text-sm text-terra-700"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8 flex items-center gap-6">
              <span className="font-medium text-terra-700">Quantity</span>
              <div className="flex items-center rounded-lg border border-terra-200 text-terra-900">
                <button
                  onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                  className="p-3 text-terra-900 transition-colors hover:bg-terra-50"
                >
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center font-medium text-terra-900">
                  {selectedQty}
                </span>
                <button
                  onClick={() => setSelectedQty(selectedQty + 1)}
                  className="p-3 text-terra-900 transition-colors hover:bg-terra-50"
                >
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
              className="flex w-full items-center justify-center gap-3 rounded-full bg-terra-900 py-5 text-lg font-medium text-white transition-colors hover:bg-wood"
            >
              <ShoppingBag size={22} />
              Add to Cart
            </button>

            {/* Delivery Info */}
            <div className="mt-8 space-y-4 rounded-sm bg-sand-50 p-6">
              <div className="flex items-center gap-4">
                <Truck className="text-wood" size={24} />
                <div>
                  <p className="font-medium text-terra-900">Free Shipping</p>
                  <p className="text-sm text-terra-500">
                    For orders over Rp 5,000,000
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <ShieldCheck className="text-wood" size={24} />
                <div>
                  <p className="font-medium text-terra-900">5-Year Warranty</p>
                  <p className="text-sm text-terra-500">
                    For structural integrity
                  </p>
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
