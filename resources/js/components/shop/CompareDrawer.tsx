import { useCompare } from '@/contexts/CompareContext';
import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp, GitCompare, Trash2, X } from 'lucide-react';
import { useState } from 'react';

import { ProductImagePlaceholder } from '@/components/shop/ProductImagePlaceholder';

export const CompareDrawer: React.FC = () => {
  const { compareItems, removeFromCompare, clearCompare, maxItems } =
    useCompare();
  const [isExpanded, setIsExpanded] = useState(false);

  if (compareItems.length === 0) return null;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className="fixed right-0 bottom-0 left-0 z-40 border-t border-terra-200 bg-white shadow-2xl"
    >
      {/* Toggle Bar */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between bg-terra-900 px-6 py-3 text-white transition-colors hover:bg-wood-dark"
      >
        <div className="flex items-center gap-3">
          <GitCompare size={20} />
          <span className="font-medium">
            Bandingkan Produk ({compareItems.length}/{maxItems})
          </span>
        </div>
        {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6">
              <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                {compareItems.map((product) => {
                  const imgUrl =
                    product.primary_image?.image_url ||
                    product.images?.[0]?.image_url;
                  return (
                    <div
                      key={product.id}
                      className="relative rounded-sm bg-sand-50 p-3"
                    >
                      <button
                        onClick={() => removeFromCompare(product.id)}
                        className="absolute -top-2 -right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                      <div className="mb-2 flex aspect-square items-center justify-center overflow-hidden rounded-lg">
                        {imgUrl ? (
                          <img
                            src={imgUrl}
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
                      <h4 className="mb-1 line-clamp-2 text-sm font-medium text-terra-900">
                        {product.name}
                      </h4>
                      <span className="text-xs text-terra-500">
                        {product.category?.name}
                      </span>
                    </div>
                  );
                })}
                {/* Empty Slots */}
                {Array.from({ length: maxItems - compareItems.length }).map(
                  (_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="flex aspect-square items-center justify-center rounded-sm border-2 border-dashed border-terra-200 bg-terra-50"
                    >
                      <span className="text-sm text-terra-400">
                        Tambah produk
                      </span>
                    </div>
                  ),
                )}
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={clearCompare}
                  className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600"
                >
                  <Trash2 size={16} />
                  Hapus Semua
                </button>
                <Link
                  href={`/shop/compare?ids=${compareItems.map((p) => p.id).join(',')}`}
                  className={`rounded-full px-6 py-3 font-medium transition-colors ${compareItems.length >= 2 ? 'bg-terra-900 text-white hover:bg-wood-dark' : 'cursor-not-allowed bg-terra-200 text-terra-400'}`}
                >
                  Bandingkan {compareItems.length} Produk
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CompareDrawer;
