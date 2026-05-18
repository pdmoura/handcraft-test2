'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function RatingSlider({  initialRating = 0  }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rating, setRating] = useState(initialRating);
  const [debouncedRating, setDebouncedRating] = useState(initialRating);

  // Sync state with URL params
  useEffect(() => {
    const minRating = searchParams.get('minRating');
    if (minRating) {
      setRating(Number(minRating));
      setDebouncedRating(Number(minRating));
    } else {
      setRating(0);
      setDebouncedRating(0);
    }
  }, [searchParams]);

  // Debounce rating changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedRating(rating);
    }, 400);
    return () => clearTimeout(timer);
  }, [rating]);

  // Push to router when debounced rating changes
  useEffect(() => {
    const currentRating = searchParams.get('minRating');
    const expectedRating = currentRating ? Number(currentRating) : 0;
    
    if (debouncedRating !== expectedRating) {
      const params = new URLSearchParams(searchParams.toString());
      if (debouncedRating > 0) {
        params.set('minRating', debouncedRating.toString());
        params.delete('page');
      } else {
        params.delete('minRating');
      }
      router.push(`/shop?${params.toString()}`);
    }
  }, [debouncedRating, searchParams, router]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-sm font-ui text-text font-medium mb-1">
        <span>Any</span>
        <span>5 Stars</span>
      </div>
      <input
        type="range"
        min="0"
        max="5"
        step="1"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="w-full h-2 bg-border-light rounded-lg appearance-none cursor-pointer accent-cta"
        aria-label="Filter by minimum rating"
      />
      <div className="text-center font-ui text-sm font-medium text-cta mt-2 min-h-[24px]">
        {rating > 0 ? (
          <span className="flex items-center justify-center gap-1">
            <span className="tracking-widest">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
            <span className="text-text-muted text-xs">& up</span>
          </span>
        ) : (
          <span className="text-text-muted">All Ratings</span>
        )}
      </div>
    </div>
  );
}
