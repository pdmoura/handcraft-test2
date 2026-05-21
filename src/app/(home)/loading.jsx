import React from 'react';
import Skeleton from '@/components/ui/Skeleton';

export default function RootLoading() {
  return (
    <div className="w-full">
      {/* ===== HERO SKELETON ===== */}
      <section className="bg-primary/95 py-20 md:py-32 overflow-hidden relative">
        <div className="container-app relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-3xl flex-1 w-full space-y-6">
              <div className="flex items-center gap-2">
                <Skeleton width="1.25rem" height="1.25rem" variant="circle" className="bg-white/20" />
                <Skeleton width="10rem" height="1rem" className="bg-white/20" />
              </div>
              <div className="space-y-3">
                <Skeleton width="85%" height="3rem" className="bg-white/20" variant="rect" />
                <Skeleton width="60%" height="3rem" className="bg-white/20" variant="rect" />
              </div>
              <div className="space-y-2 pt-2">
                <Skeleton width="90%" height="1.25rem" className="bg-white/20" />
                <Skeleton width="80%" height="1.25rem" className="bg-white/20" />
                <Skeleton width="45%" height="1.25rem" className="bg-white/20" />
              </div>
              <div className="flex gap-4 pt-6">
                <Skeleton width="10rem" height="3.5rem" className="bg-white/20 rounded-full" />
                <Skeleton width="10rem" height="3.5rem" className="bg-white/20 rounded-full" />
              </div>
            </div>
            <div className="hidden lg:block w-[400px] h-[400px] shrink-0 bg-white/10 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES SKELETON ===== */}
      <section className="py-16 md:py-24 container-app">
        <div className="text-center mb-12 flex flex-col items-center">
          <Skeleton width="15rem" height="2.25rem" className="mb-3" variant="rect" />
          <Skeleton width="22rem" height="1rem" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-card p-4 space-y-3 border border-border-light">
              <Skeleton width="100%" height="0" className="aspect-[4/3] rounded-lg" variant="rect" />
              <div className="space-y-2">
                <Skeleton width="70%" height="1.25rem" />
                <Skeleton width="40%" height="0.85rem" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PRODUCTS SKELETON ===== */}
      <section className="py-16 md:py-24 bg-surface-warm">
        <div className="container-app">
          <div className="flex items-end justify-between mb-12">
            <div className="space-y-2">
              <Skeleton width="12rem" height="2rem" variant="rect" />
              <Skeleton width="18rem" height="1rem" />
            </div>
            <Skeleton width="6rem" height="1.25rem" className="hidden md:block" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-card p-4 space-y-4 border border-border-light">
                <Skeleton width="100%" height="0" className="aspect-square rounded-lg" variant="rect" />
                <div className="space-y-2">
                  <Skeleton width="50%" height="0.75rem" />
                  <Skeleton width="90%" height="1.25rem" />
                  <Skeleton width="40%" height="1.15rem" />
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-border-light">
                  <Skeleton width="1.75rem" height="1.75rem" variant="circle" />
                  <Skeleton width="60%" height="0.85rem" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
