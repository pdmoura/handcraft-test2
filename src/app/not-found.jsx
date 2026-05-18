import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center animate-fade-in-up">
        <p className="font-display text-8xl text-cta mb-4">404</p>
        <h1 className="font-display text-3xl text-primary uppercase mb-3">Page Not Found</h1>
        <p className="font-body text-text-muted mb-8 max-w-md mx-auto">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <div className="flex justify-center gap-4">
          <Link href="/" className="inline-flex items-center gap-2 bg-cta hover:bg-cta-hover text-text font-body font-semibold px-6 py-3 rounded-full transition-colors"><Home size={18} /> Go Home</Link>
          <Link href="/shop" className="inline-flex items-center gap-2 border-2 border-primary text-primary font-body font-semibold px-6 py-3 rounded-full hover:bg-primary hover:text-white transition-colors"><Search size={18} /> Browse Shop</Link>
        </div>
      </div>
    </div>
  );
}
