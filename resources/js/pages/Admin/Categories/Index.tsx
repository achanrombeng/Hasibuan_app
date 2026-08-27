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
    ChevronDown,
    ChevronRight,
    Filter,
    FolderTree,
    Layers,
    Pencil,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';

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

// Component untuk menampilkan kategori dalam format tree
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
                className={`group flex items-center gap-3 rounded-xl border border-terra-100 bg-white p-4 shadow-sm transition-all hover:shadow-md ${level > 0 ? 'ml-8 border-l-4 border-l-wood/30' : ''
                    }`}
            >
                {/* Expand/Collapse Button */}
                <button
                    onClick={() => hasChildren && toggleExpand(category.id)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${hasChildren
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
                        {level === 0 && hasChildren && (
                            <span className="rounded-full bg-wood/10 px-2 py-0.5 text-xs font-medium text-wood">
                                {category.children.length} sub
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <p className="text-sm text-terra-500">
                            {category.products_count} {category.products_count === 1 ? 'product' : 'products'}
                        </p>
                        {category.description && (
                            <p className="hidden truncate text-sm text-terra-400 md:block">
                                • {category.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Status Badges */}
                <div className="hidden items-center gap-2 md:flex">
                    <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${category.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                            }`}
                    >
                        {category.is_active ? 'Active' : 'Inactive'}
                    </span>
                    {category.is_featured && (
                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                            Featured
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Link
                        href={`/admin/categories/${category.id}/edit`}
                        className="rounded-lg p-2 text-terra-500 transition-colors hover:bg-terra-100 hover:text-terra-700"
                    >
                        <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                        onClick={() => onDeleteClick(category)}
                        className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
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
    const [sortBy, setSortBy] = useState<'name_asc' | 'name_desc' | 'newest' | 'oldest'>('name_asc');
    const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
        null,
    );
    const [isDeleting, setIsDeleting] = useState(false);
    const categoryData = categories.data;

    // Categories are already returned as a tree from the API
    // Just use them directly since they already have children included
    const rootCategories = useMemo(() => {
        return categoryData || [];
    }, [categoryData]);

    // Filter and sort categories
    const filteredCategories = useMemo(() => {
        let result = rootCategories;

        if (search) {
            const searchLower = search.toLowerCase();

            // Filter function that searches in category and children
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
                if (sortBy === 'name_asc') {
                    return a.name.localeCompare(b.name, 'en');
                } else if (sortBy === 'name_desc') {
                    return b.name.localeCompare(a.name, 'en');
                } else if (sortBy === 'newest') {
                    const timeA = a.created_at ? new Date(a.created_at).getTime() : a.id;
                    const timeB = b.created_at ? new Date(b.created_at).getTime() : b.id;
                    return timeB - timeA;
                } else if (sortBy === 'oldest') {
                    const timeA = a.created_at ? new Date(a.created_at).getTime() : a.id;
                    const timeB = b.created_at ? new Date(b.created_at).getTime() : b.id;
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

    const expandAll = () => {
        const allIds = new Set<number>();
        const collectIds = (cats: Category[]) => {
            cats.forEach((cat) => {
                if (cat.children.length > 0) {
                    allIds.add(cat.id);
                    collectIds(cat.children);
                }
            });
        };
        collectIds(rootCategories);
        setExpandedItems(allIds);
    };

    const collapseAll = () => {
        setExpandedItems(new Set());
    };

    // Count stats from the hierarchical data
    const parentCategoriesCount = categoryData.length;
    const childCategoriesCount = categoryData.reduce(
        (acc, cat) => acc + (cat.children?.length || 0),
        0,
    );
    const totalCategories = parentCategoriesCount + childCategoriesCount;

    return (
        <AdminLayout
            breadcrumbs={[{ title: 'Categories', href: '/admin/categories' }]}
        >
            <Head title="Manage Categories" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-terra-900">
                            Manage Categories
                        </h1>
                        <p className="mt-1 text-terra-500">
                            Manage product categories in your store
                        </p>
                    </div>
                    <Link
                        href="/admin/categories/create"
                        className="inline-flex items-center gap-2 rounded-xl bg-wood-dark px-4 py-2.5 font-medium text-white transition-all"
                    >
                        <Plus className="h-5 w-5" />
                        Add Category
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                    <div className="rounded-2xl border border-terra-100 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-wood/10">
                                <FolderTree className="h-5 w-5 text-wood" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-terra-900">
                                    {parentCategoriesCount}
                                </p>
                                <p className="text-sm text-terra-500">
                                    Main Categories
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-terra-100 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100">
                                <Layers className="h-5 w-5 text-teal-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-terra-900">
                                    {childCategoriesCount}
                                </p>
                                <p className="text-sm text-terra-500">
                                    Sub-Categories
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm md:p-6">
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
                            <div className="relative">
                                <Filter className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as 'name_asc' | 'name_desc' | 'newest' | 'oldest')}
                                    className="appearance-none rounded-xl border border-neutral-200 bg-white py-2.5 pr-8 pl-9 text-sm font-medium text-neutral-700 shadow-sm transition-all hover:bg-neutral-50 focus:border-wood focus:ring-2 focus:ring-wood/20 focus:outline-none cursor-pointer"
                                >
                                    <option value="name_asc">Sort by: A - Z</option>
                                    <option value="name_desc">Sort by: Z - A</option>
                                    <option value="newest">Sort by: Newest</option>
                                    <option value="oldest">Sort by: Oldest</option>
                                </select>
                                <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                            </div>
                            <button
                                type="button"
                                onClick={expandAll}
                                className="hidden sm:inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs font-medium text-neutral-700 shadow-sm hover:bg-neutral-50"
                            >
                                Expand All
                            </button>
                            <button
                                type="button"
                                onClick={collapseAll}
                                className="hidden sm:inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-xs font-medium text-neutral-700 shadow-sm hover:bg-neutral-50"
                            >
                                Collapse All
                            </button>
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center rounded-xl bg-[#a67c52] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#8e6843] active:scale-[0.98]"
                            >
                                Search
                            </button>
                        </div>
                    </form>
                </div>

                {/* Categories Tree */}
                <div className="space-y-3">
                    {filteredCategories.map((category) => (
                        <CategoryTreeItem
                            key={category.id}
                            category={category}
                            onDeleteClick={handleDeleteClick}
                            expandedItems={expandedItems}
                            toggleExpand={toggleExpand}
                        />
                    ))}
                </div>

                {filteredCategories.length === 0 && (
                    <div className="rounded-2xl border border-terra-100 bg-white p-12 text-center shadow-sm">
                        <Layers className="mx-auto mb-4 h-12 w-12 text-terra-300" />
                        <h3 className="text-lg font-medium text-terra-900">
                            No categories found
                        </h3>
                        <p className="mt-1 text-terra-500">
                            {search
                                ? 'No categories match your search criteria'
                                : 'Get started by adding a new category'}
                        </p>
                    </div>
                )}
            </div>

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
                                    sub-categories that will also be deleted.
                                </p>
                            </div>
                        )}
                    {categoryToDelete &&
                        categoryToDelete.products_count > 0 && (
                            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                                <p className="text-sm text-amber-800">
                                    <strong>Warning:</strong> This category has {categoryToDelete.products_count}{' '}
                                    linked products. Deleting this category will unassign those products.
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
