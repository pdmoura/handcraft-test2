'use client';

import InfiniteCarousel from '@/components/ui/InfiniteCarousel';
import ProductCard from '@/components/ui/ProductCard';

/**
 * Client wrapper that renders an infinite carousel of product cards.
 * Receives serialized product data from the server component.
 *
 * @param direction  1 = scrolls left (default), -1 = scrolls right
 * @param edgeFadeBg gradient edge color class (e.g. 'from-background')
 */
export default function LovedThisWeekCarousel({
  products,
  direction = 1,
  edgeFadeBg = 'from-background',
}) {
  if (!products || products.length === 0) return null;

  return (
    <InfiniteCarousel speed={0.4} pauseOnHover direction={direction} edgeFadeBg={edgeFadeBg}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </InfiniteCarousel>
  );
}
