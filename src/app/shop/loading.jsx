import React from 'react';
import Skeleton from '@/components/ui/Skeleton';

export default function ShopLoading() {
  return (
    <div className="container-app py-4 animate-fade-in">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 mb-6 mt-2">
        <Skeleton width="3rem" height="1rem" />
        <span className="text-text-muted">/</span>
        <Skeleton width="4rem" height="1rem" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8 pb-16">
        {/* Sidebar Filters Skeleton */}
        <aside className="lg:w-64 shrink-0">
          <div className="bg-white rounded-xl shadow-card p-6 sticky top-20 border border-border-light">
            <div className="flex items-center justify-between mb-6">
              <Skeleton width="6rem" height="1.5rem" variant="rect" />
            </div>

            {/* Categories list skeleton */}
            <div className="mb-6 space-y-4">
              <Skeleton width="4rem" height="1.1rem" />
              <div className="space-y-3 pl-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton width="70%" height="0.85rem" />
                    <Skeleton width="15%" height="0.85rem" />
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range Filter skeleton */}
            <div className="mb-6 space-y-3">
              <Skeleton width="6rem" height="1.1rem" />
              <div className="flex items-center gap-2">
                <Skeleton width="100%" height="2.25rem" variant="rect" />
                <span className="text-text-muted">—</span>
                <Skeleton width="100%" height="2.25rem" variant="rect" />
              </div>
            </div>

            {/* Rating Filter skeleton */}
            <div className="space-y-3">
              <Skeleton width="4rem" height="1.1rem" />
              <Skeleton width="100%" height="1.5rem" variant="rect" />
            </div>
          </div>
        </aside>

        {/* Main Content Skeleton */}
        <div className="flex-1 min-w-0">
          {/* Top Bar Skeleton */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="w-full sm:w-auto sm:flex-1 sm:max-w-md">
              {/* Search Bar Skeleton */}
              <Skeleton width="100%" height="2.5rem" variant="rect" />
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <Skeleton width="5rem" height="1rem" />
              <Skeleton width="8rem" height="2.5rem" variant="rect" />
            </div>
          </div>

          {/* Products Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-card p-4 space-y-4 border border-border-light">
                {/* Image placeholder */}
                <Skeleton width="100%" height="0" className="aspect-square rounded-lg" variant="rect" />
                
                {/* Category & Title */}
                <div className="space-y-2">
                  <Skeleton width="40%" height="0.75rem" />
                  <Skeleton width="90%" height="1.25rem" />
                  <Skeleton width="30%" height="1.15rem" />
                </div>
                
                {/* Seller & Rating */}
                <div className="flex items-center gap-2 pt-3 border-t border-border-light">
                  <Skeleton width="1.75rem" height="1.75rem" variant="circle" />
                  <Skeleton width="50%" height="0.85rem" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
