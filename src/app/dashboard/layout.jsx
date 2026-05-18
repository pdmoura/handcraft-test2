'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, User } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/products', label: 'Products', icon: Package },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
];

export default function DashboardLayout({  children  }) {
  const pathname = usePathname();
  return (
    <div className="container-app py-6 pb-28 lg:pb-16">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl shadow-card p-5 sticky top-24 min-h-[calc(100vh-8rem)] flex flex-col border border-border-light">
            <h3 className="font-display text-xs text-text-muted uppercase tracking-widest mb-6 px-2">Seller Hub</h3>
            <nav className="flex lg:flex-col gap-2 flex-1" aria-label="Dashboard navigation">
              {navItems.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
                return (
                  <Link key={href} href={href} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm whitespace-nowrap transition-all ${isActive ? 'bg-primary/5 text-primary font-bold shadow-sm' : 'text-text-muted hover:bg-surface hover:text-text'}`}>
                    <Icon size={18} className={isActive ? 'text-primary' : ''} />{label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Mobile Bottom Tab Bar */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border-light z-50 px-2 py-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]" aria-label="Mobile navigation">
          <div className="flex justify-around items-center">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
              return (
                <Link key={href} href={href} className={`flex flex-col items-center justify-center gap-1 w-full p-2 rounded-xl transition-colors ${isActive ? 'text-primary' : 'text-text-muted'}`}>
                  <div className={`p-1.5 rounded-full ${isActive ? 'bg-primary/10' : ''}`}>
                    <Icon size={20} className={isActive ? 'text-primary' : 'text-text-muted'} />
                  </div>
                  <span className={`font-ui text-[10px] uppercase font-bold tracking-wider ${isActive ? 'text-primary' : 'text-text-muted'}`}>{label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
