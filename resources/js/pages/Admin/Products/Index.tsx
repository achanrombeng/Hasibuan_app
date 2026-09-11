import ProductBulkImageModal from '@/components/admin/ProductBulkImageModal';
import ProductImportModal from '@/components/admin/ProductImportModal';
import Pagination from '@/components/pagination';
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
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  FileEdit,
  FileSpreadsheet,
  Filter,
  Image as ImageIcon,
  Images,
  Loader2,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  status: { value: string; label: string };
  category: { id: number; name: string } | null;
  primary_image: { id: number; image_url: string } | null;
  images: Array<{ id: number; image_url: string }>;
  images_count?: number;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
}

interface ProductsIndexProps {
  products: {
    data: Product[];
    links: {
      first?: string;
      last?: string;
      prev?: string;
      next?: string;
    };
    meta: {
      current_page: number;
      last_page: number;
      from: number;
      to: number;
      total: number;
      links: Array<{
        url: string | null;
        label: string;
        active: boolean;
      }>;
    };
  };
  stats?: {
    total: number;
    active: number;
    draft: number;
  };
  filters?: { filter?: Record<string, string> };
}

export default function ProductsIndex({
  products,
  stats,
  filters,
  categories,
  statuses,
  saleTypes,
}: ProductsIndexProps & {
  categories: { data: Category[] };
  statuses: { value: string; name: string }[];
  saleTypes: { value: string; name: string }[];
}) {
  const { url } = usePage();

  // Safely get filter values
  const filterObj =
    filters?.filter && typeof filters.filter === 'object' ? filters.filter : {};

  const currentSearchTerm =
    filterObj.search || filterObj.name || filterObj.sku || '';

  const [search, setSearch] = useState(currentSearchTerm);
  const [category, setCategory] = useState(filterObj.category_id || 'all');
  const [status, setStatus] = useState(filterObj.status || 'all');
  const [isFeatured, setIsFeatured] = useState(filterObj.is_featured || 'all');
  const hasActiveFilters = Boolean(
    (filterObj.category_id && filterObj.category_id !== 'all') ||
      (filterObj.status && filterObj.status !== 'all') ||
      (filterObj.is_featured && filterObj.is_featured !== 'all'),
  );
  const [showFilters, setShowFilters] = useState(hasActiveFilters);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showBulkImageModal, setShowBulkImageModal] = useState(false);

  const productData = products.data;

  const isInitialMount = useRef(true);
  const lastSentSearchRef = useRef(currentSearchTerm);
  const [isSearching, setIsSearching] = useState(false);

  // Sync state if filters prop changes from external navigation (e.g. back/forward or return from edit)
  useEffect(() => {
    const newSearch =
      filterObj.search || filterObj.name || filterObj.sku || '';
    const newCategory = filterObj.category_id || 'all';
    const newStatus = filterObj.status || 'all';
    const newFeatured = filterObj.is_featured || 'all';

    if (newSearch !== search) {
      lastSentSearchRef.current = newSearch;
      setSearch(newSearch);
    }
    if (newCategory !== category) {
      setCategory(newCategory);
    }
    if (newStatus !== status) {
      setStatus(newStatus);
    }
    if (newFeatured !== isFeatured) {
      setIsFeatured(newFeatured);
    }
  }, [filters]);

  // Keep last active query in sessionStorage so Show/Edit back buttons can restore exact state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const queryIdx = url.indexOf('?');
      if (queryIdx !== -1) {
        sessionStorage.setItem('admin_products_last_query', url.substring(queryIdx));
      }
    }
  }, [url]);

  // Auto sync search input with debounce only when user types
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (search === lastSentSearchRef.current) {
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      lastSentSearchRef.current = search;
      const params: Record<string, string> = {};
      if (search.trim()) params['filter[name]'] = search.trim();
      if (category && category !== 'all')
        params['filter[category_id]'] = category;
      if (status && status !== 'all') params['filter[status]'] = status;
      if (isFeatured && isFeatured !== 'all')
        params['filter[is_featured]'] = isFeatured;

      const currentParams =
        typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search)
          : null;
      const perPage = currentParams?.get('per_page');
      if (perPage) params['per_page'] = perPage;

      router.get('/admin/products', params, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
        onFinish: () => setIsSearching(false),
      });
    }, 350);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSearching(true);
    lastSentSearchRef.current = search;

    const params: Record<string, string> = {};
    if (search.trim()) params['filter[name]'] = search.trim();
    if (category && category !== 'all')
      params['filter[category_id]'] = category;
    if (status && status !== 'all') params['filter[status]'] = status;
    if (isFeatured && isFeatured !== 'all')
      params['filter[is_featured]'] = isFeatured;

    const currentParams =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search)
        : null;
    const perPage = currentParams?.get('per_page');
    if (perPage) params['per_page'] = perPage;

    router.get('/admin/products', params, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
      onFinish: () => setIsSearching(false),
    });
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setIsSearching(true);
    const params: Record<string, string> = {};
    if (search.trim()) params['filter[name]'] = search.trim();
    if (newCategory && newCategory !== 'all')
      params['filter[category_id]'] = newCategory;
    if (status && status !== 'all') params['filter[status]'] = status;
    if (isFeatured && isFeatured !== 'all')
      params['filter[is_featured]'] = isFeatured;

    const currentParams =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search)
        : null;
    const perPage = currentParams?.get('per_page');
    if (perPage) params['per_page'] = perPage;

    router.get('/admin/products', params, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
      onFinish: () => setIsSearching(false),
    });
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setIsSearching(true);
    const params: Record<string, string> = {};
    if (search.trim()) params['filter[name]'] = search.trim();
    if (category && category !== 'all')
      params['filter[category_id]'] = category;
    if (newStatus && newStatus !== 'all') params['filter[status]'] = newStatus;
    if (isFeatured && isFeatured !== 'all')
      params['filter[is_featured]'] = isFeatured;

    const currentParams =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search)
        : null;
    const perPage = currentParams?.get('per_page');
    if (perPage) params['per_page'] = perPage;

    router.get('/admin/products', params, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
      onFinish: () => setIsSearching(false),
    });
  };

  const handleClearSearch = () => {
    setSearch('');
    lastSentSearchRef.current = '';
    const params: Record<string, string> = {};
    if (category && category !== 'all')
      params['filter[category_id]'] = category;
    if (status && status !== 'all') params['filter[status]'] = status;
    if (isFeatured && isFeatured !== 'all')
      params['filter[is_featured]'] = isFeatured;

    const currentParams =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search)
        : null;
    const perPage = currentParams?.get('per_page');
    if (perPage) params['per_page'] = perPage;

    router.get('/admin/products', params, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  };

  const handleReset = () => {
    setSearch('');
    lastSentSearchRef.current = '';
    setCategory('all');
    setStatus('all');
    setIsFeatured('all');
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('admin_products_last_query');
    }
    router.get('/admin/products', {}, { preserveState: true, replace: true });
  };

  const confirmDelete = (product: Product) => {
    setProductToDelete(product);
  };

  const handleDelete = () => {
    if (productToDelete) {
      setIsDeleting(true);
      router.delete(`/admin/products/${productToDelete.id}`, {
        preserveScroll: true,
        preserveState: true,
        onFinish: () => {
          setIsDeleting(false);
          setProductToDelete(null);
        },
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'draft':
        return 'bg-gray-100 text-gray-700';
      case 'archived':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: { value: string; label: string }) => {
    switch (status.value) {
      case 'active':
        return 'Active';
      case 'draft':
        return 'Draft';
      case 'inactive':
        return 'Inactive';
      case 'out_of_stock':
        return 'Out of Stock';
      case 'discontinued':
        return 'Discontinued';
      default:
        return status.label || status.value;
    }
  };

  return (
    <AdminLayout breadcrumbs={[{ title: 'Products', href: '/admin/products' }]}>
      <Head title="Manage Products" />
      <div className="flex h-[calc(100dvh-5.5rem)] flex-col gap-4 sm:h-[calc(100dvh-7rem)] sm:gap-6">
        {/* Fixed Top Section (Header & Filters) */}
        <div className="shrink-0 space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-terra-900">
                Manage Products
              </h1>
              <p className="mt-1 text-terra-500">
                Manage all products in your shop
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowBulkImageModal(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-sand-300 bg-sand-50/80 px-4 py-2.5 text-sm font-semibold text-terra-900 shadow-sm transition-all hover:bg-sand-100 active:scale-[0.98]"
              >
                <Images className="h-4 w-4 text-terra-800" />
                <span>Bulk Upload Photos</span>
              </button>
              <button
                type="button"
                onClick={() => setShowImportModal(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-terra-200 bg-white px-4 py-2.5 text-sm font-semibold text-terra-900 shadow-sm transition-all hover:bg-terra-50/70 active:scale-[0.98]"
              >
                <FileSpreadsheet className="h-4 w-4 text-terra-700" />
                <span>Import Excel</span>
              </button>
              <Link
                href={`/admin/products/create?return_to=${encodeURIComponent(url)}`}
                className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 font-medium text-white transition-all hover:bg-teal-700"
              >
                <Plus className="h-5 w-5" /> Add Product
              </Link>
            </div>
          </div>

          {/* Stats Cards: Total, Active, Draft */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {/* Total Product */}
            <button
              type="button"
              onClick={() => handleStatusChange('all')}
              className={`group flex items-center justify-between rounded-2xl border p-4 text-left shadow-sm transition-all duration-200 hover:shadow-md ${
                status === 'all'
                  ? 'border-wood/50 bg-sand-50/80 ring-2 ring-wood/15'
                  : 'border-terra-100 bg-white hover:border-terra-200'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-wood/10 text-wood transition-transform group-hover:scale-105">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium tracking-wider text-terra-500 uppercase">
                    Total Product
                  </p>
                  <p className="text-2xl font-bold text-terra-900">
                    {stats?.total ?? products.meta.total}
                  </p>
                </div>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${
                  status === 'all'
                    ? 'bg-wood text-white'
                    : 'bg-sand-100 text-terra-600 group-hover:bg-sand-200'
                }`}
              >
                All
              </span>
            </button>

            {/* Active Product */}
            <button
              type="button"
              onClick={() => handleStatusChange('active')}
              className={`group flex items-center justify-between rounded-2xl border p-4 text-left shadow-sm transition-all duration-200 hover:shadow-md ${
                status === 'active'
                  ? 'border-emerald-500/50 bg-emerald-50/70 ring-2 ring-emerald-500/15'
                  : 'border-terra-100 bg-white hover:border-terra-200'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 transition-transform group-hover:scale-105">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium tracking-wider text-terra-500 uppercase">
                    Active Product
                  </p>
                  <p className="text-2xl font-bold text-emerald-700">
                    {stats?.active ?? 0}
                  </p>
                </div>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${
                  status === 'active'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200'
                }`}
              >
                Active
              </span>
            </button>

            {/* Draft Product */}
            <button
              type="button"
              onClick={() => handleStatusChange('draft')}
              className={`group flex items-center justify-between rounded-2xl border p-4 text-left shadow-sm transition-all duration-200 hover:shadow-md ${
                status === 'draft'
                  ? 'border-amber-500/50 bg-amber-50/70 ring-2 ring-amber-500/15'
                  : 'border-terra-100 bg-white hover:border-terra-200'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 transition-transform group-hover:scale-105">
                  <FileEdit className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium tracking-wider text-terra-500 uppercase">
                    Draft Product
                  </p>
                  <p className="text-2xl font-bold text-amber-700">
                    {stats?.draft ?? 0}
                  </p>
                </div>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${
                  status === 'draft'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-100 text-amber-700 group-hover:bg-amber-200'
                }`}
              >
                Draft
              </span>
            </button>
          </div>

          {/* Filters */}
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-3.5 shadow-sm">
            <form
              onSubmit={handleSearch}
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <div className="relative flex-1">
                <div className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-neutral-400">
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin text-teal-600" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Search products by name or SKU..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 py-2.5 pr-10 pl-10 text-sm text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-wood focus:bg-white focus:ring-2 focus:ring-wood/20 focus:outline-none"
                />
                {search.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700"
                    title="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium shadow-sm transition-colors ${
                    showFilters
                      ? 'border-neutral-300 bg-neutral-100 text-neutral-900'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <Filter className="h-4 w-4 text-neutral-600" /> Filter
                </button>
              </div>
            </form>

            {showFilters && (
              <div className="grid animate-in grid-cols-1 gap-4 border-t border-terra-100 pt-4 duration-200 slide-in-from-top-2 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-terra-700">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full rounded-lg border border-terra-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-wood/50 focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    {categories.data.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-terra-700">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full rounded-lg border border-terra-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-wood/50 focus:outline-none"
                  >
                    <option value="all">All Status</option>
                    {statuses.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end gap-2">
                  <button
                    onClick={handleReset}
                    className="flex-1 cursor-pointer rounded-lg border border-terra-200 px-4 py-2 text-sm font-medium text-terra-600 transition-colors hover:bg-terra-50 sm:flex-none"
                  >
                    Reset Filter
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Products Table Container */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-terra-100 bg-white shadow-sm">
          <div className="flex-1 overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 z-10 border-b border-terra-100 bg-sand-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-terra-600">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-terra-600">
                    SKU
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-terra-600">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-terra-600">
                    Total Images
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-terra-600">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-terra-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-terra-100">
                {productData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-terra-500"
                    >
                      No products yet
                    </td>
                  </tr>
                ) : (
                  productData.map((product) => (
                    <tr
                      key={product.id}
                      className="transition-colors hover:bg-sand-50/50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-terra-100">
                            {(() => {
                              const imageUrl =
                                product.primary_image?.image_url ||
                                (product.images && product.images.length > 0
                                  ? product.images[0].image_url
                                  : null);
                              return imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Package className="h-6 w-6 text-terra-400" />
                              );
                            })()}
                          </div>
                          <p className="font-medium text-terra-900">
                            {product.name}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-terra-600">
                        {product.sku}
                      </td>
                      <td className="px-6 py-4 text-sm text-terra-600">
                        {product.category?.name || '-'}
                      </td>
                      <td className="px-6 py-4">
                        {(() => {
                          const totalImg =
                            product.images_count ??
                            product.images?.length ??
                            0;
                          return (
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${
                                totalImg > 0
                                  ? 'border border-sand-200/80 bg-sand-100/80 text-terra-800'
                                  : 'border border-amber-200/70 bg-amber-50 text-amber-700'
                              }`}
                            >
                              <ImageIcon className="h-3.5 w-3.5 opacity-70" />
                              <span>
                                {totalImg} {totalImg === 1 ? 'image' : 'images'}
                              </span>
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(product.status.value)}`}
                        >
                          {getStatusLabel(product.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${product.id}?return_to=${encodeURIComponent(url)}`}
                            className="rounded-lg p-2 text-terra-500 transition-colors hover:bg-terra-100"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/admin/products/${product.id}/edit?return_to=${encodeURIComponent(url)}`}
                            className="rounded-lg p-2 text-terra-500 transition-colors hover:bg-terra-100"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => confirmDelete(product)}
                            className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="shrink-0">
            <Pagination
              links={products.meta.links}
              meta={products.meta}
              className="border-t border-terra-100 px-6 py-4"
            />
          </div>
        </div>
      </div>

      <Dialog
        open={!!productToDelete}
        onOpenChange={(open) => !open && setProductToDelete(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <DialogTitle className="text-center">Delete Product</DialogTitle>
            <DialogDescription className="text-center">
              Are you sure you want to delete product{' '}
              <span className="font-semibold text-terra-900">
                "{productToDelete?.name}"
              </span>
              ? Action cannot be undone.
            </DialogDescription>
          </DialogHeader>
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
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50 sm:flex-none"
            >
              {isDeleting ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ProductImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />

      <ProductBulkImageModal
        isOpen={showBulkImageModal}
        onClose={() => setShowBulkImageModal(false)}
      />
    </AdminLayout>
  );
}
