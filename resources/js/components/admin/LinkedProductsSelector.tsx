import React, { useMemo, useState } from 'react';
import { Layers, Plus, Search, Trash2, X, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';

export interface ProductOption {
    id: number;
    name: string;
    sku: string;
    category?: { name: string } | null;
}

interface LinkedProductsSelectorProps {
    allProducts: ProductOption[];
    selectedIds: number[];
    onChange: (ids: number[]) => void;
}

export const LinkedProductsSelector: React.FC<LinkedProductsSelectorProps> = ({
    allProducts = [],
    selectedIds = [],
    onChange,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Map for fast product lookup
    const productsMap = useMemo(() => {
        const map = new Map<number, ProductOption>();
        allProducts.forEach((p) => map.set(p.id, p));
        return map;
    }, [allProducts]);

    // Currently selected products in order
    const selectedProducts = useMemo(() => {
        return selectedIds
            .map((id) => productsMap.get(id))
            .filter((p): p is ProductOption => p !== undefined);
    }, [selectedIds, productsMap]);

    // Available unselected products filtered by search
    const filteredAvailable = useMemo(() => {
        const selectedSet = new Set(selectedIds);
        const query = searchQuery.toLowerCase().trim();

        return allProducts
            .filter((p) => !selectedSet.has(p.id))
            .filter((p) => {
                if (!query) return true;
                return (
                    p.name.toLowerCase().includes(query) ||
                    p.sku.toLowerCase().includes(query)
                );
            });
    }, [allProducts, selectedIds, searchQuery]);

    const handleAdd = (id: number) => {
        if (!selectedIds.includes(id)) {
            onChange([...selectedIds, id]);
        }
        setSearchQuery('');
    };

    const handleRemove = (id: number) => {
        onChange(selectedIds.filter((item) => item !== id));
    };

    const handleMoveUp = (index: number) => {
        if (index === 0) return;
        const next = [...selectedIds];
        const temp = next[index - 1];
        next[index - 1] = next[index];
        next[index] = temp;
        onChange(next);
    };

    const handleMoveDown = (index: number) => {
        if (index === selectedIds.length - 1) return;
        const next = [...selectedIds];
        const temp = next[index + 1];
        next[index + 1] = next[index];
        next[index] = temp;
        onChange(next);
    };

    return (
        <div className="rounded-2xl border border-terra-100 bg-white p-6 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-terra-100 pb-4">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-wood/10 text-wood">
                        <Layers size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-terra-900">
                            Linked / Collection Products
                        </h2>
                        <p className="text-xs text-terra-500">
                            Select other products included in this collection/set (they will be automatically hyperlinked on the store page).
                        </p>
                    </div>
                </div>

                <span className="inline-flex items-center rounded-full bg-terra-50 px-3 py-1 text-xs font-semibold text-terra-700">
                    {selectedIds.length} Products Linked
                </span>
            </div>

            {/* Product Selector Dropdown / Search */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-terra-700">
                    Add Products to This Collection
                </label>
                <div className="relative">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Search
                                size={18}
                                className="absolute top-1/2 left-3.5 -translate-y-1/2 text-terra-400"
                            />
                            <input
                                type="text"
                                placeholder="Search product name or SKU..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setIsDropdownOpen(true);
                                }}
                                onFocus={() => setIsDropdownOpen(true)}
                                className="w-full rounded-xl border border-terra-200 bg-sand-50 py-2.5 pr-4 pl-10 text-sm text-terra-900 transition-all placeholder:text-terra-400 focus:border-wood focus:ring-2 focus:ring-wood/30 focus:outline-none"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-terra-400 hover:text-terra-600"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Autocomplete Dropdown */}
                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 z-30 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-terra-100 bg-white p-2 shadow-xl">
                            {filteredAvailable.length > 0 ? (
                                <div className="space-y-1">
                                    {filteredAvailable.map((prod) => (
                                        <button
                                            key={prod.id}
                                            type="button"
                                            onClick={() => {
                                                handleAdd(prod.id);
                                                setIsDropdownOpen(false);
                                            }}
                                            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-terra-50 hover:text-wood"
                                        >
                                            <div className="min-w-0 pr-3">
                                                <p className="font-medium text-terra-900 truncate">
                                                    {prod.name}
                                                </p>
                                                <p className="text-xs text-terra-500">
                                                    SKU: {prod.sku}
                                                </p>
                                            </div>
                                            <span className="inline-flex items-center gap-1 rounded-md bg-wood/10 px-2 py-1 text-xs font-semibold text-wood shrink-0">
                                                <Plus size={13} />
                                                Select
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="px-3 py-4 text-center text-xs text-terra-400">
                                    {allProducts.length === 0
                                        ? 'No other products available yet.'
                                        : 'No matching products found or all products have been selected.'}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Selected Products List */}
            {selectedProducts.length > 0 ? (
                <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-terra-500">
                        Selected Products ({selectedProducts.length})
                    </label>
                    <div className="space-y-2">
                        {selectedProducts.map((prod, index) => (
                            <div
                                key={prod.id}
                                className="flex items-center justify-between rounded-xl border border-terra-100 bg-sand-50/70 p-3 transition-all hover:border-terra-200"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-terra-200/60 text-xs font-bold text-terra-700 shrink-0">
                                        {index + 1}
                                    </span>
                                    <div className="min-w-0">
                                        <p className="font-medium text-sm text-terra-900 truncate">
                                            {prod.name}
                                        </p>
                                        <p className="text-xs text-terra-500">
                                            SKU: {prod.sku}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                    {/* Ordering buttons */}
                                    <button
                                        type="button"
                                        onClick={() => handleMoveUp(index)}
                                        disabled={index === 0}
                                        title="Move up"
                                        className="rounded-lg p-1.5 text-terra-400 hover:bg-white hover:text-terra-700 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                                    >
                                        <ArrowUp size={15} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleMoveDown(index)}
                                        disabled={index === selectedProducts.length - 1}
                                        title="Move down"
                                        className="rounded-lg p-1.5 text-terra-400 hover:bg-white hover:text-terra-700 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                                    >
                                        <ArrowDown size={15} />
                                    </button>
                                    {/* Remove button */}
                                    <button
                                        type="button"
                                        onClick={() => handleRemove(prod.id)}
                                        title="Remove from collection"
                                        className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 ml-1 cursor-pointer"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-terra-200 p-6 text-center">
                    <p className="text-sm font-medium text-terra-600">
                        No products linked to this collection yet.
                    </p>
                    <p className="mt-1 text-xs text-terra-400">
                        Use the search box above if this product is a set or bundle containing multiple items.
                    </p>
                </div>
            )}
        </div>
    );
};
