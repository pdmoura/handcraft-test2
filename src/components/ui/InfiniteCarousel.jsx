'use client';

import { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Infinite auto-scrolling carousel with pause-on-hover,
 * draggable scroll, and optional nav arrows.
 *
 * @param direction  1 = scrolls left (default), -1 = scrolls right
 * @param edgeFadeBg CSS class for gradient edge color (e.g. 'from-surface-warm')
 */
export default function InfiniteCarousel({
  children,
  speed = 0.5,
  pauseOnHover = true,
  direction = 1,
  edgeFadeBg = 'from-background',
}) {
  const trackRef = useRef(null);
  const animationRef = useRef(null);
  const scrollPos = useRef(0);
  const isPaused = useRef(false);
  const isDragging = useRef(false);
  const dragStart = useRef(0);
  const dragScrollStart = useRef(0);
  const [showControls, setShowControls] = useState(false);

  // Duplicate children into track for seamless looping
  const items = Array.isArray(children) ? children : [children];

  // Use a ref for the animation function to avoid self-reference lint issues
  const animateFn = useRef(null);

  useEffect(() => {
    animateFn.current = () => {
      const track = trackRef.current;
      if (!track) return;

      if (!isPaused.current && !isDragging.current) {
        scrollPos.current += speed * direction;

        const halfWidth = track.scrollWidth / 2;

        // Wrap in both directions
        if (scrollPos.current >= halfWidth) {
          scrollPos.current -= halfWidth;
        } else if (scrollPos.current < 0) {
          scrollPos.current += halfWidth;
        }

        track.style.transform = `translateX(-${scrollPos.current}px)`;
      }

      animationRef.current = requestAnimationFrame(animateFn.current);
    };

    animationRef.current = requestAnimationFrame(animateFn.current);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [speed, direction]);

  const handleMouseEnter = () => {
    if (pauseOnHover) isPaused.current = true;
    setShowControls(true);
  };

  const handleMouseLeave = () => {
    isPaused.current = false;
    isDragging.current = false;
    setShowControls(false);
  };

  // Drag support
  const handlePointerDown = (e) => {
    isDragging.current = true;
    dragStart.current = e.clientX;
    dragScrollStart.current = scrollPos.current;
    e.currentTarget.style.cursor = 'grabbing';
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    const delta = dragStart.current - e.clientX;
    const track = trackRef.current;
    if (!track) return;

    let newPos = dragScrollStart.current + delta;
    const halfWidth = track.scrollWidth / 2;

    // Wrap
    if (newPos < 0) newPos += halfWidth;
    if (newPos >= halfWidth) newPos -= halfWidth;

    scrollPos.current = newPos;
    track.style.transform = `translateX(-${scrollPos.current}px)`;
  };

  const handlePointerUp = (e) => {
    isDragging.current = false;
    e.currentTarget.style.cursor = 'grab';
  };

  // Arrow nav: jump by one card width dynamically
  const nudge = (dir) => {
    const track = trackRef.current;
    if (!track || !track.firstElementChild) return;
    
    // Calculate exact jump distance based on card width + gap (24px for gap-6)
    const jumpPx = track.firstElementChild.offsetWidth + 24;
    const halfWidth = track.scrollWidth / 2;

    let target = scrollPos.current + dir * jumpPx;
    if (target < 0) target += halfWidth;
    if (target >= halfWidth) target -= halfWidth;

    // Smooth jump
    const start = scrollPos.current;
    const diff = target - start;
    const duration = 400;
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      scrollPos.current = start + diff * eased;
      track.style.transform = `translateX(-${scrollPos.current}px)`;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  return (
    <div
      className="relative overflow-hidden select-none px-4 md:px-8 lg:px-16"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => { isDragging.current = false; }}
      style={{ cursor: 'grab' }}
    >
      {/* Gradient fade edges */}
      <div className={`pointer-events-none absolute inset-y-0 left-0 w-16 md:w-24 z-10 bg-gradient-to-r ${edgeFadeBg} to-transparent`} />
      <div className={`pointer-events-none absolute inset-y-0 right-0 w-16 md:w-24 z-10 bg-gradient-to-l ${edgeFadeBg} to-transparent`} />

      {/* Track: two copies of children for seamless loop */}
      <div
        ref={trackRef}
        className="flex gap-6 will-change-transform"
        style={{ width: 'max-content' }}
      >
        {items.map((child, i) => (
          <div key={`a-${i}`} className="shrink-0 w-[220px] sm:w-[300px]">
            {child}
          </div>
        ))}
        {items.map((child, i) => (
          <div key={`b-${i}`} className="shrink-0 w-[220px] sm:w-[300px]" aria-hidden="true">
            {child}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => nudge(-1)}
        className={`absolute left-4 md:left-8 lg:left-16 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 shadow-card flex items-center justify-center text-primary hover:bg-cta hover:text-white transition-all ${showControls ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
        aria-label="Previous"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => nudge(1)}
        className={`absolute right-4 md:right-8 lg:right-16 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 shadow-card flex items-center justify-center text-primary hover:bg-cta hover:text-white transition-all ${showControls ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
        aria-label="Next"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
