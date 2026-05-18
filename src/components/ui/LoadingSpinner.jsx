import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({  size = 24, className = '', label = 'Loading...'  }) {
  return (
    <div className={`flex items-center justify-center ${className}`} role="status" aria-label={label}>
      <Loader2 size={size} className="animate-spin text-primary" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <Loader2 size={40} className="animate-spin text-primary" />
        <p className="font-body text-sm text-text-muted">Loading...</p>
      </div>
    </div>
  );
}

export function Skeleton({  className = ''  }) {
  return (
    <div className={`animate-shimmer rounded-md ${className}`} aria-hidden="true" />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-card" aria-hidden="true">
      <Skeleton className="aspect-square" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </div>
  );
}
