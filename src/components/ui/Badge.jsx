import { cn } from '@/lib/utils';

const variantClasses = {
  default: 'bg-surface text-text-muted',
  primary: 'bg-primary text-white',
  accent: 'bg-accent/10 text-accent',
  success: 'bg-success-light text-success',
  warning: 'bg-warning-light text-warning',
  error: 'bg-error-light text-error',
  outline: 'border border-border text-text-muted',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-xs',
};

export default function Badge({  children, variant = 'default', size = 'sm', className  }) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-ui font-medium rounded-full whitespace-nowrap',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
}
