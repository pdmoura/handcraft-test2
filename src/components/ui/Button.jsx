import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const variantClasses = {
  primary: 'bg-cta hover:bg-cta-hover text-text shadow-xs hover:shadow-card',
  secondary: 'bg-primary hover:bg-primary-light text-white shadow-xs hover:shadow-card',
  outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
  ghost: 'text-text hover:bg-surface',
  danger: 'bg-error hover:bg-red-700 text-white',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-lg gap-2',
  lg: 'px-7 py-3 text-base rounded-lg gap-2.5',
};

export default function Button({ 
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className,
  disabled,
  ...props
 }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-body font-semibold transition-all duration-200 cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        'active:scale-[0.97]',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}
