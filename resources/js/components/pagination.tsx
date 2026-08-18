import { Link, router } from '@inertiajs/react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  from: number;
  to: number;
  total: number;
  per_page?: number;
  links?: PaginationLink[];
}

interface PaginationProps {
  links?: PaginationLink[]; // Made optional
  meta?: PaginationMeta;
  // For raw paginator (not resource collection), the fields are at the root
  paginator?: PaginationMeta & { data?: any[] };
  className?: string;
  showPerPage?: boolean;
}

// Helper function to get visible page numbers (limit to 5 on desktop, 3 on mobile-ish logic)
function getVisiblePages(
  currentPage: number,
  lastPage: number,
): (number | string)[] {
  const delta = 2; // Show 2 pages on each side of current page
  const pages: (number | string)[] = [];

  if (lastPage <= 7) {
    // Show all pages if total is 7 or less
    for (let i = 1; i <= lastPage; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);

    // Calculate range around current page
    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(lastPage - 1, currentPage + delta);

    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
      pages.push('...');
    }

    // Add pages in range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (rangeEnd < lastPage - 1) {
      pages.push('...');
    }

    // Always show last page
    pages.push(lastPage);
  }

  return pages;
}

export default function Pagination({
  links,
  meta,
  paginator,
  className = '',
  showPerPage = true,
}: PaginationProps) {
  // Normalize data
  const currentMeta = meta || paginator;
  const currentLinks = links || paginator?.links || [];

  // If no links or only 1 page, hide
  if (currentLinks.length === 0 || !currentMeta || currentMeta.last_page <= 1)
    return null;

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const url = new URL(window.location.href);
    url.searchParams.set('per_page', e.target.value);
    url.searchParams.set('page', '1'); // Reset to page 1

    router.visit(url.toString(), {
      preserveScroll: true,
      preserveState: true,
    });
  };

  const getPageUrl = (page: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', String(page));
    return url.toString();
  };

  const visiblePages = getVisiblePages(
    currentMeta.current_page,
    currentMeta.last_page,
  );
  const isFirstPage = currentMeta.current_page === 1;
  const isLastPage = currentMeta.current_page === currentMeta.last_page;

  // Find prev and next links from Laravel pagination
  const prevLink = currentLinks.find((_, index) => index === 0);
  const nextLink = currentLinks.find(
    (_, index) => index === currentLinks.length - 1,
  );

  return (
    <div
      className={`flex flex-col items-center justify-between gap-4 border-t border-neutral-100 px-4 py-4 sm:flex-row sm:px-6 ${className}`}
    >
      {/* Left side - Info and Per Page (hidden on mobile to save space) */}
      <div className="hidden items-center gap-4 sm:flex">
        {/* Info Text */}
        {currentMeta && (
          <div className="text-sm text-neutral-500">
            Menampilkan{' '}
            <span className="font-medium text-neutral-900">
              {currentMeta.from || 0}
            </span>{' '}
            -{' '}
            <span className="font-medium text-neutral-900">
              {currentMeta.to || 0}
            </span>{' '}
            dari{' '}
            <span className="font-medium text-neutral-900">
              {currentMeta.total}
            </span>
          </div>
        )}

        {/* Per Page Dropdown */}
        {showPerPage && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-500">Tampilkan</span>
            <select
              value={currentMeta?.per_page || 15}
              onChange={handlePerPageChange}
              className="rounded-lg border-neutral-200 bg-neutral-50 py-1 pr-8 pl-2 text-sm focus:border-teal-600 focus:ring-teal-600"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        )}
      </div>

      {/* Mobile info */}
      <div className="text-sm text-neutral-500 sm:hidden">
        Halaman {currentMeta.current_page} dari {currentMeta.last_page}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1">
        {/* First Page */}
        <Link
          href={isFirstPage ? '#' : getPageUrl(1)}
          preserveScroll
          className={`rounded-lg p-2 text-neutral-500 transition-colors ${
            isFirstPage
              ? 'cursor-not-allowed opacity-40'
              : 'hover:bg-neutral-100'
          }`}
          as="button"
          disabled={isFirstPage}
          aria-label="First page"
        >
          <ChevronsLeft className="h-5 w-5" />
        </Link>

        {/* Previous Page */}
        <Link
          href={prevLink?.url || '#'}
          preserveScroll
          className={`rounded-lg p-2 text-neutral-500 transition-colors ${
            !prevLink?.url
              ? 'cursor-not-allowed opacity-40'
              : 'hover:bg-neutral-100'
          }`}
          as="button"
          disabled={!prevLink?.url}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>

        {/* Page Numbers - Desktop */}
        <div className="hidden items-center gap-1 sm:flex">
          {visiblePages.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 text-neutral-400"
                >
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            const isActive = pageNum === currentMeta.current_page;

            return (
              <Link
                key={pageNum}
                href={getPageUrl(pageNum)}
                preserveScroll
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-teal-600 text-white'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                {pageNum}
              </Link>
            );
          })}
        </div>

        {/* Page Numbers - Mobile (only show current) */}
        <div className="flex items-center gap-1 sm:hidden">
          <span className="flex h-9 min-w-[36px] items-center justify-center rounded-lg bg-teal-600 px-2 text-sm font-medium text-white">
            {currentMeta.current_page}
          </span>
        </div>

        {/* Next Page */}
        <Link
          href={nextLink?.url || '#'}
          preserveScroll
          className={`rounded-lg p-2 text-neutral-500 transition-colors ${
            !nextLink?.url
              ? 'cursor-not-allowed opacity-40'
              : 'hover:bg-neutral-100'
          }`}
          as="button"
          disabled={!nextLink?.url}
          aria-label="Next page"
        >
          <ChevronRight className="h-5 w-5" />
        </Link>

        {/* Last Page */}
        <Link
          href={isLastPage ? '#' : getPageUrl(currentMeta.last_page)}
          preserveScroll
          className={`rounded-lg p-2 text-neutral-500 transition-colors ${
            isLastPage
              ? 'cursor-not-allowed opacity-40'
              : 'hover:bg-neutral-100'
          }`}
          as="button"
          disabled={isLastPage}
          aria-label="Last page"
        >
          <ChevronsRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
