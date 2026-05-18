import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Pagination({  currentPage, totalPages, baseUrl, searchParams = {}  }) {
  if (totalPages <= 1) return null;

  const buildUrl = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }

    return pages;
  };

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-8" aria-label="Pagination">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={buildUrl(currentPage - 1)}
          className="p-2 rounded-lg hover:bg-surface text-text-muted hover:text-text transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft size={20} />
        </Link>
      ) : (
        <span className="p-2 text-border-light cursor-not-allowed" aria-disabled="true">
          <ChevronLeft size={20} />
        </span>
      )}

      {/* Page Numbers */}
      {getPageNumbers().map((page, i) =>
        page === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 py-1 font-ui text-sm text-text-muted">
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={buildUrl(page)}
            className={cn(
              'min-w-[36px] h-9 flex items-center justify-center rounded-lg font-ui text-sm font-medium transition-all',
              page === currentPage
                ? 'bg-primary text-white shadow-xs'
                : 'text-text hover:bg-surface'
            )}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </Link>
        )
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={buildUrl(currentPage + 1)}
          className="p-2 rounded-lg hover:bg-surface text-text-muted hover:text-text transition-colors"
          aria-label="Next page"
        >
          <ChevronRight size={20} />
        </Link>
      ) : (
        <span className="p-2 text-border-light cursor-not-allowed" aria-disabled="true">
          <ChevronRight size={20} />
        </span>
      )}
    </nav>
  );
}
