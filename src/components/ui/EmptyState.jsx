import { PackageOpen } from 'lucide-react';
import Link from 'next/link';
import Button from './Button';

export default function EmptyState({ 
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
 }) {
  const Icon = icon || PackageOpen;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center mb-6">
        <Icon size={36} className="text-text-muted" />
      </div>
      <h3 className="font-display text-xl text-text uppercase mb-2">{title}</h3>
      <p className="font-body text-sm text-text-muted max-w-md mb-6">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button>{actionLabel}</Button>
        </Link>
      )}
      {actionLabel && onAction && !actionHref && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
