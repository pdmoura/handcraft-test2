import React from 'react';

/**
 * Reusable animated skeleton placeholder for layouts
 * Supports custom shapes, sizes, and pulsing effects
 */
export default function Skeleton({
  className = '',
  width = '100%',
  height = '1rem',
  variant = 'text', // 'text' | 'rect' | 'circle'
  ...props
}) {
  const baseStyles = 'bg-surface-warm animate-pulse';
  
  let variantStyles = '';
  if (variant === 'text') {
    variantStyles = 'rounded-md';
  } else if (variant === 'rect') {
    variantStyles = 'rounded-xl';
  } else if (variant === 'circle') {
    variantStyles = 'rounded-full';
  }

  return (
    <div
      className={`${baseStyles} ${variantStyles} ${className}`}
      style={{
        width,
        height,
        ...props.style,
      }}
      {...props}
    />
  );
}
