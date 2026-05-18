'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function SortDropdownContent({  initialSort  }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <select
      defaultValue={initialSort}
      onChange={(e) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', e.target.value);
        params.delete('page');
        router.push(`/shop?${params.toString()}`);
      }}
      className="px-3 py-2 border border-border-light rounded-lg font-ui text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/30"
      aria-label="Sort products"
    >
      <option value="newest">Newest</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
      <option value="rating">Top Rated</option>
    </select>
  );
}

export default function SortDropdown({  initialSort  }) {
  return (
    <Suspense fallback={<div className="w-32 h-10 animate-shimmer rounded-lg" />}>
      <SortDropdownContent initialSort={initialSort} />
    </Suspense>
  );
}
