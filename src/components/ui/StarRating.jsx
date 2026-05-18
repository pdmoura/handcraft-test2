'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function StarRating({ 
  rating,
  maxRating = 5,
  size = 18,
  interactive = false,
  onChange,
  showValue = false,
  className,
 }) {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

  return (
    <div className={cn('flex items-center gap-1', className)} role={interactive ? 'radiogroup' : 'img'} aria-label={`Rating: ${rating} out of ${maxRating} stars`}>
      {Array.from({ length: maxRating }).map((_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= displayRating;
        const isHalfFilled = !isFilled && starValue - 0.5 <= displayRating;

        if (interactive) {
          return (
            <button
              key={i}
              type="button"
              onClick={() => onChange?.(starValue)}
              onMouseEnter={() => setHoverRating(starValue)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-0.5 cursor-pointer hover:scale-110 transition-transform"
              role="radio"
              aria-checked={starValue === rating}
              aria-label={`${starValue} star${starValue !== 1 ? 's' : ''}`}
            >
              <Star
                size={size}
                className={cn(
                  'transition-colors',
                  isFilled ? 'fill-star text-star' : 'text-border fill-transparent'
                )}
              />
            </button>
          );
        }

        return (
          <Star
            key={i}
            size={size}
            className={cn(
              isFilled
                ? 'fill-star text-star'
                : isHalfFilled
                ? 'fill-star/50 text-star'
                : 'text-border fill-transparent'
            )}
          />
        );
      })}
      {showValue && (
        <span className="ml-1 font-ui text-sm text-text-muted">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
