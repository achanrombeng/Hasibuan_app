import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Check,
    ChevronDown,
    ChevronRight,
    Filter,
    FolderTree,
    GripVertical,
    Layers,
    Package,
    Pencil,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    products_count: number;
    is_active: boolean;
    is_featured: boolean;
    sort_order: number;
    parent_id: number | null;
    parent: Category | null;
    children: Category[];
    created_at: string;
}

interface CategoriesIndexProps {
    categories: {
        data: Category[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        meta?: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
}

// Component to render categories in tree format
function CategoryTreeItem({
    category,
    level = 0,
    onDeleteClick,
    expandedItems,
    toggleExpand,
}: {
    category: Category;
    level?: number;
    onDeleteClick: (category: Category) => void;
    expandedItems: Set<number>;
    toggleExpand: (id: number) => void;
}) {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedItems.has(category.id);

    return (
        <>
            <div
                className={`group flex items-center gap-3 rounded-xl border border-terra-100 bg-white p-4 shadow-sm transition-all hover:shadow-md ${
                    level > 0 ? 'ml-8 border-l-4 border-l-wood/30' : ''
                }`}
            >
                {/* Expand/Collapse Button */}
                <button
                    onClick={() => hasChildren && toggleExpand(category.id)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                        hasChildren
                            ? 'bg-terra-100 text-terra-600 hover:bg-terra-200'
                            : 'cursor-default bg-terra-50 text-terra-300'
                    }`}
                    disabled={!hasChildren}
                >
                    {hasChildren ? (
                        isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )
                    ) : (
                        <Layers className="h-4 w-4" />
                    )}
                </button>

                {/* Category Icon */}
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-wood/10">
                    {level === 0 ? (
                        <FolderTree className="h-5 w-5 text-wood" />
                    ) : (
                        <Layers className="h-5 w-5 text-wood" />
                    )}
                </div>

                {/* Category Info */}
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className="truncate font-semibold text-terra-900">
                            {category.name}
                        </h3>
                        {/* Sort Order Badge */}
                        <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs font-mono font-medium text-neutral-600">
                            #{category.sort_order ?? 0}
                        </span>
                        {level === 0 && hasChildren && (
                            <span className="rounded-full bg-wood/10 px-2 py-0.5 text-xs font-medium text-wood">
                                {category.children.length} sub
                            </span>
                        )}
                        {!category.is_active && (
                            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                                Inactive
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <p className="text-sm text-terra-500">
                            {category.products_count}{' '}
                            {category.products_count === 1 ? 'product' : 'products'}
                        </p>
                        {category.description && (
                            <p className="hidden truncate text-sm text-terra-400 md:block">
                                • {category.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Link
                        href={`/admin/categories/${category.id}/edit`}
                        className="rounded-lg p-2 text-terra-500 transition-colors hover:bg-terra-100 hover:text-terra-700"
                        title="Edit Category"
                    >
                        <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                        onClick={() => onDeleteClick(category)}
                        className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        title="Delete Category"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Children */}
            {hasChildren && isExpanded && (
                <div className="mt-2 space-y-2">
                    {category.children.map((child) => (
                        <CategoryTreeItem
                            key={child.id}
                            category={child}
                            level={level + 1}
                            onDeleteClick={onDeleteClick}
                            expandedItems={expandedItems}
                            toggleExpand={toggleExpand}
                        />
                    ))}
                </div>
            )}
        </>
    );
}

export default function CategoriesIndex({ categories }: CategoriesIndexProps) {
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<
        'custom' | 'name_asc' | 'name_desc' | 'newest' | 'oldest'
    >('custom');
    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
        null,
    );
    const [isDeleting, setIsDeleting] = useState(false);

    // Reorder Modal State
    const [reorderDialogOpen, setReorderDialogOpen] = useState(false);
    const [reorderList, setReorderList] = useState<Category[]>([]);
    const [isSavingOrder, setIsSavingOrder] = useState(false);

    const categoryData = categories.data;

    const rootCategories = useMemo(() => {
        return categoryData || [];
    }, [categoryData]);

    // Initialize reorder list when modal opens
    const openReorderModal = () => {
        const sorted = [...rootCategories].sort(
            (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
        );
        setReorderList(sorted);
        setReorderDialogOpen(true);
    };

    const moveItem = (index: number, direction: 'up' | 'down') => {
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= reorderList.length) return;

        const updated = [...reorderList];
        const temp = updated[index];
        updated[index] = updated[targetIndex];
        updated[targetIndex] = temp;

        setReorderList(updated);
    };

    const handleSaveOrder = () => {
        setIsSavingOrder(true);
        const payload = reorderList.map((cat, idx) => ({
            id: cat.id,
            sort_order: idx + 1,
        }));

        router.post(
            '/admin/categories/reorder',
            { items: payload },
            {
                preserveScroll: true,
                onFinish: () => {
                    setIsSavingOrder(false);
                    setReorderDialogOpen(false);
                },
            },
        );
    };

    // Filter and sort categories
    const filteredCategories = useMemo(() => {
        let result = rootCategories;

        if (search) {
            const searchLower = search.toLowerCase();

            const filterCategory = (cat: Category): Category | null => {
                const matchesSelf = cat.name.toLowerCase().includes(searchLower);
                const filteredChildren = cat.children
                    .map(filterCategory)
                    .filter((c): c is Category => c !== null);

                if (matchesSelf || filteredChildren.length > 0) {
                    return {
                        ...cat,
                        children: matchesSelf ? cat.children : filteredChildren,
                    };
                }
                return null;
            };

            result = rootCategories
                .map(filterCategory)
                .filter((c): c is Category => c !== null);
        }

        // Recursive sort function
        const sortTree = (cats: Category[]): Category[] => {
            const copy = cats.map((cat) => ({
                ...cat,
                children: cat.children ? sortTree(cat.children) : [],
            }));

            return copy.sort((a, b) => {
                if (sortBy === 'custom') {
                    return (a.sort_order ?? 0) - (b.sort_order ?? 0);
                } else if (sortBy === 'name_asc') {
                    return a.name.localeCompare(b.name, 'en');
                } else if (sortBy === 'name_desc') {
                    return b.name.localeCompare(a.name, 'en');
                } else if (sortBy === 'newest') {
                    const timeA = a.created_at
                        ? new Date(a.created_at).getTime()
                        : a.id;
                    const timeB = b.created_at
                        ? new Date(b.created_at).getTime()
                        : b.id;
                    return timeB - timeA;
                } else if (sortBy === 'oldest') {
                    const timeA = a.created_at
                        ? new Date(a.created_at).getTime()
                        : a.id;
                    const timeB = b.created_at
                        ? new Date(b.created_at).getTime()
                        : b.id;
                    return timeA - timeB;
                }
                return 0;
            });
        };

        return sortTree(result);
    }, [rootCategories, search, sortBy]);

    const handleDeleteClick = (category: Category) => {
        setCategoryToDelete(category);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!categoryToDelete) return;

        setIsDeleting(true);
        router.delete(`/admin/categories/${categoryToDelete.id}`, {
            onFinish: () => {
                setIsDeleting(false);
                setDeleteDialogOpen(false);
                setCategoryToDelete(null);
            },
        });
    };

    const toggleExpand = (id: number) => {
        setExpandedItems((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const totalCategories = categoryData.length;
    const totalProductsCount = categoryData.reduce(
        (acc, cat) => acc + (cat.products_count || 0),
        0,
    );

    return (
        <AdminLayout
            breadcrumbs={[{ title: 'Categories', href: '/admin/categories' }]}
        >
            <Head title="Manage Product Categories" />

            <div className="flex h-[calc(100dvh-5.5rem)] flex-col gap-4 sm:h-[calc(100dvh-7rem)] sm:gap-6">
                {/* Fixed Top Section */}
                <div className="shrink-0 space-y-4 sm:space-y-6">
                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-terra-900">
                                Manage Categories
                            </h1>
                            <p className="mt-1 text-terra-500">
                                Manage names, photos, and order of product categories in your store
                            </p>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <button
                                type="button"
                                onClick={openReorderModal}
                                className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 font-medium text-neutral-700 shadow-sm transition-all hover:bg-neutral-50 hover:border-neutral-400"
                            >
                                <ArrowUpDown className="h-4 w-4 text-[#a67c52]" />
                                Reorder Categories
                            </button>
                            <Link
                                href="/admin/categories/create"
                                className="inline-flex items-center gap-2 rounded-xl bg-wood-dark px-4 py-2.5 font-medium text-white shadow-sm transition-all hover:bg-wood"
                            >
                                <Plus className="h-5 w-5" />
                                Add Category
                            </Link>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Total Categories */}
                        <div className="rounded-2xl border border-terra-100 bg-white p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-terra-100">
                                    <Layers className="h-5 w-5 text-terra-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-terra-900">
                                        {totalCategories}
                                    </p>
                                    <p className="text-sm text-terra-500">
                                        Total Categories
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Total Products Linked */}
                        <div className="rounded-2xl border border-terra-100 bg-white p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-wood/10">
                                    <Package className="h-5 w-5 text-wood" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-terra-900">
                                        {totalProductsCount}
                                    </p>
                                    <p className="text-sm text-terra-500">
                                        Total Linked Products
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="rounded-2xl border border-neutral-200/80 bg-white p-3.5 shadow-sm">
                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className="flex flex-col gap-3 sm:flex-row sm:items-center"
                        >
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                                <input
                                    type="text"
                                    placeholder="Search categories..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 py-2.5 pr-4 pl-10 text-sm text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-wood focus:bg-white focus:ring-2 focus:ring-wood/20 focus:outline-none"
                                />
                            </div>
                            <div className="flex items-center gap-2.5">
                                <div className="relative inline-flex items-center">
                                    <Filter className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-neutral-600" />
                                    <select
                                        aria-label="Sort by"
                                        value={sortBy}
                                        onChange={(e) =>
                                            setSortBy(
                                                e.target.value as
                                                    | 'custom'
                                                    | 'name_asc'
                                                    | 'name_desc'
                                                    | 'newest'
                                                    | 'oldest',
                                            )
                                        }
                                        className="cursor-pointer appearance-none rounded-xl border border-neutral-200 bg-white py-2.5 pr-8 pl-9.5 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50 focus:border-wood focus:ring-2 focus:ring-wood/20 focus:outline-none"
                                    >
                                        <option value="custom">Custom Order</option>
                                        <option value="name_asc">Name (A-Z)</option>
                                        <option value="name_desc">Name (Z-A)</option>
                                        <option value="newest">Newest</option>
                                        <option value="oldest">Oldest</option>
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Scrollable Categories List */}
                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
                    {filteredCategories.map((category) => (
                        <CategoryTreeItem
                            key={category.id}
                            category={category}
                            onDeleteClick={handleDeleteClick}
                            expandedItems={expandedItems}
                            toggleExpand={toggleExpand}
                        />
                    ))}

                    {filteredCategories.length === 0 && (
                        <div className="rounded-2xl border border-terra-100 bg-white p-12 text-center shadow-sm">
                            <Layers className="mx-auto mb-4 h-12 w-12 text-terra-300" />
                            <h3 className="text-lg font-medium text-terra-900">
                                No categories found
                            </h3>
                            <p className="mt-1 text-terra-500">
                                {search
                                    ? 'No categories matched your search'
                                    : 'Get started by adding a new category'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Reorder Categories Modal */}
            <Dialog open={reorderDialogOpen} onOpenChange={setReorderDialogOpen}>
                <DialogContent className="max-h-[90vh] sm:max-w-xl flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ArrowUpDown className="h-5 w-5 text-[#a67c52]" />
                            Reorder Categories (Navbar & List)
                        </DialogTitle>
                        <DialogDescription>
                            Use the up (▲) and down (▼) arrow buttons to arrange category display order. This directly affects the navbar dropdown menu and shop catalog.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto pr-1 py-2 space-y-2">
                        {reorderList.map((cat, idx) => (
                            <div
                                key={cat.id}
                                className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-neutral-50/70 p-3.5 transition-all hover:bg-white hover:border-neutral-300"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#a67c52]/15 text-xs font-bold text-[#a67c52]">
                                        {idx + 1}
                                    </span>
                                    <div className="min-w-0 truncate">
                                        <p className="font-semibold text-neutral-900 truncate">
                                            {cat.name}
                                        </p>
                                        <p className="text-xs text-neutral-500">
                                            {cat.products_count} {cat.products_count === 1 ? 'product' : 'products'}
                                            {cat.children && cat.children.length > 0
                                                ? ` • ${cat.children.length} subcategories`
                                                : ''}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <button
                                        type="button"
                                        disabled={idx === 0}
                                        onClick={() => moveItem(idx, 'up')}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 transition-colors hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed"
                                        title="Move Up"
                                    >
                                        <ArrowUp className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        disabled={idx === reorderList.length - 1}
                                        onClick={() => moveItem(idx, 'down')}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 transition-colors hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed"
                                        title="Move Down"
                                    >
                                        <ArrowDown className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <DialogFooter className="mt-4 gap-2 pt-2 border-t border-neutral-100">
                        <DialogClose asChild>
                            <button
                                type="button"
                                className="flex-1 rounded-xl border border-neutral-300 px-4 py-2.5 font-medium text-neutral-700 transition-colors hover:bg-neutral-50 sm:flex-none"
                            >
                                Cancel
                            </button>
                        </DialogClose>
                        <button
                            type="button"
                            onClick={handleSaveOrder}
                            disabled={isSavingOrder}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#a67c52] px-5 py-2.5 font-medium text-white shadow-sm transition-all hover:bg-[#8e6843] active:scale-[0.98] disabled:opacity-50"
                        >
                            <Check className="h-4 w-4" />
                            {isSavingOrder ? 'Saving...' : 'Save New Order'}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <DialogTitle className="text-center">
                            Delete Category
                        </DialogTitle>
                        <DialogDescription className="text-center">
                            Are you sure you want to delete category{' '}
                            <span className="font-semibold text-terra-900">
                                "{categoryToDelete?.name}"
                            </span>
                            ? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    {categoryToDelete &&
                        categoryToDelete.children &&
                        categoryToDelete.children.length > 0 && (
                            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                                <p className="text-sm text-red-800">
                                    <strong>Warning:</strong> This category has {categoryToDelete.children.length}{' '}
                                    subcategories that will also be deleted.
                                </p>
                            </div>
                        )}
                    {categoryToDelete &&
                        categoryToDelete.products_count > 0 && (
                            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                                <p className="text-sm text-amber-800">
                                    <strong>Warning:</strong> This category is linked to {categoryToDelete.products_count}{' '}
                                    {categoryToDelete.products_count === 1 ? 'product' : 'products'}.
                                </p>
                            </div>
                        )}
                    <DialogFooter className="mt-4 gap-2">
                        <DialogClose asChild>
                            <button
                                type="button"
                                className="flex-1 rounded-xl border border-terra-200 px-4 py-2.5 font-medium text-terra-700 transition-colors hover:bg-terra-50 sm:flex-none"
                            >
                                Cancel
                            </button>
                        </DialogClose>
                        <button
                            type="button"
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                            className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50 sm:flex-none"
                        >
                            {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
