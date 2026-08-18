import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ApiProduct } from '@/types/shop';

interface CompareContextType {
    compareItems: ApiProduct[];
    addToCompare: (product: ApiProduct) => boolean;
    removeFromCompare: (productId: number) => void;
    clearCompare: () => void;
    isInCompare: (productId: number) => boolean;
    maxItems: number;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const MAX_COMPARE_ITEMS = 4;
const STORAGE_KEY = 'latif_compare_items';

export function CompareProvider({ children }: { children: ReactNode }) {
    const [compareItems, setCompareItems] = useState<ApiProduct[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setCompareItems(JSON.parse(stored));
            }
        } catch (e) {
            console.error('Failed to load compare items:', e);
        }
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(compareItems));
        } catch (e) {
            console.error('Failed to save compare items:', e);
        }
    }, [compareItems]);

    const addToCompare = (product: ApiProduct): boolean => {
        if (compareItems.length >= MAX_COMPARE_ITEMS) {
            return false;
        }
        if (compareItems.some(item => item.id === product.id)) {
            return true; // Already in compare
        }
        setCompareItems(prev => [...prev, product]);
        return true;
    };

    const removeFromCompare = (productId: number) => {
        setCompareItems(prev => prev.filter(item => item.id !== productId));
    };

    const clearCompare = () => {
        setCompareItems([]);
    };

    const isInCompare = (productId: number): boolean => {
        return compareItems.some(item => item.id === productId);
    };

    return (
        <CompareContext.Provider value={{
            compareItems,
            addToCompare,
            removeFromCompare,
            clearCompare,
            isInCompare,
            maxItems: MAX_COMPARE_ITEMS,
        }}>
            {children}
        </CompareContext.Provider>
    );
}

export function useCompare() {
    const context = useContext(CompareContext);
    if (context === undefined) {
        throw new Error('useCompare must be used within a CompareProvider');
    }
    return context;
}

