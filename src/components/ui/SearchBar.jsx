'use client';

import { Search, X } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchBar({  placeholder = 'Search handcrafted products...', className = ''  }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');
  const [debouncedQuery, setDebouncedQuery] = useState(searchParams.get('search') || '');

  // Update local query state when URL changes externally
  useEffect(() => {
    setQuery(searchParams.get('search') || '');
  }, [searchParams]);

  // Debounce the input query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  // Trigger search when debounced query changes
  useEffect(() => {
    const currentSearch = searchParams.get('search') || '';
    if (debouncedQuery !== currentSearch) {
      const params = new URLSearchParams(searchParams.toString());
      if (debouncedQuery.trim()) {
        params.set('search', debouncedQuery.trim());
        params.delete('page');
      } else {
        params.delete('search');
      }
      router.push(`/shop?${params.toString()}`);
    }
  }, [debouncedQuery, searchParams, router]);

  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className={`relative ${className}`}>
      <label htmlFor="product-search" className="sr-only">
        Search products
      </label>
      <Search
        size={18}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
      />
      <input
        id="product-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 bg-white border border-border-light rounded-lg font-body text-sm text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-surface transition-colors text-text-muted"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
