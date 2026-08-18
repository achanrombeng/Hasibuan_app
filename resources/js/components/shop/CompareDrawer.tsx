import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GitCompare, Trash2, Star, ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useCompare } from '@/contexts/CompareContext';

export const CompareDrawer: React.FC = () => {
    const { compareItems, removeFromCompare, clearCompare, maxItems } = useCompare();
    const [isExpanded, setIsExpanded] = useState(false);

    if (compareItems.length === 0) return null;

    return (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-terra-200 shadow-2xl">
            {/* Toggle Bar */}
            <button onClick={() => setIsExpanded(!isExpanded)} className="w-full flex items-center justify-between px-6 py-3 bg-terra-900 text-white hover:bg-wood-dark transition-colors">
                <div className="flex items-center gap-3">
                    <GitCompare size={20} />
                    <span className="font-medium">Bandingkan Produk ({compareItems.length}/{maxItems})</span>
                </div>
                {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </button>

            {/* Expanded Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                {compareItems.map((product) => (
                                    <div key={product.id} className="relative bg-sand-50 rounded-sm p-3">
                                        <button onClick={() => removeFromCompare(product.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 z-10">
                                            <X size={14} />
                                        </button>
                                        <div className="aspect-square rounded-lg overflow-hidden mb-2">
                                            <img src={product.primary_image?.image_url || product.images?.[0]?.image_url || '/images/placeholder-product.svg'} alt={product.name} className="w-full h-full object-cover" />
                                        </div>
                                        <h4 className="text-sm font-medium text-terra-900 line-clamp-2 mb-1">{product.name}</h4>
                                        <p className="text-sm font-bold text-wood-dark">{product.final_price_formatted}</p>
                                    </div>
                                ))}
                                {/* Empty Slots */}
                                {Array.from({ length: maxItems - compareItems.length }).map((_, i) => (
                                    <div key={`empty-${i}`} className="aspect-square bg-terra-50 rounded-sm border-2 border-dashed border-terra-200 flex items-center justify-center">
                                        <span className="text-sm text-terra-400">Tambah produk</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between">
                                <button onClick={clearCompare} className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm">
                                    <Trash2 size={16} />Hapus Semua
                                </button>
                                <Link href={`/shop/compare?ids=${compareItems.map(p => p.id).join(',')}`} className={`px-6 py-3 rounded-full font-medium transition-colors ${compareItems.length >= 2 ? 'bg-terra-900 text-white hover:bg-wood-dark' : 'bg-terra-200 text-terra-400 cursor-not-allowed'}`}>
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

