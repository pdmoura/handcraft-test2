import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumb({  items  }) {
  return (
    <nav className="flex items-center gap-1.5 py-4" aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 font-ui text-sm">
        <li>
          <Link href="/" className="text-text-muted hover:text-accent transition-colors flex items-center">
            <Home size={14} />
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <ChevronRight size={14} className="text-border" />
            {item.href && i < items.length - 1 ? (
              <Link href={item.href} className="text-text-muted hover:text-accent transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-text font-medium" aria-current={i === items.length - 1 ? 'page' : undefined}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
