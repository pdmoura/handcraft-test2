'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingCart, User, LogOut, LayoutDashboard, Store } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { usePathname } from 'next/navigation';
import { useCart } from '@/components/providers/CartProvider';

export default function MobileMenu({  isOpen, onClose, navLinks  }) {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const menuRef = useRef(null);
  const pathname = usePathname();

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const firstFocusable = menuRef.current.querySelector(
        'button, a, input, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="overlay md:hidden" onClick={onClose} aria-hidden="true" />

      {/* Drawer */}
      <div
        ref={menuRef}
        className="fixed inset-y-0 right-0 w-[300px] max-w-[85vw] bg-white z-50 animate-slide-in-right shadow-modal md:hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-light">
          <span className="font-display text-lg text-primary uppercase">Menu</span>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface transition-colors text-text"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-4 bg-surface-warm border-b border-border-light">
            <div className="flex items-center gap-3">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt=""
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold font-ui">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-body text-sm font-semibold text-text">{user.name}</p>
                <p className="font-ui text-xs text-text-muted">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-4" aria-label="Mobile navigation">
          <ul className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className={`flex items-center px-4 py-3 rounded-lg font-body text-base transition-colors ${
                      isActive 
                        ? "bg-primary/5 text-primary font-bold" 
                        : "text-text hover:bg-surface"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}

            {/* Cart */}
            <li>
              <Link
                href="/cart"
                onClick={onClose}
                className={`flex items-center justify-between px-4 py-3 rounded-lg font-body text-base transition-colors ${
                  pathname.startsWith('/cart')
                    ? "bg-primary/5 text-primary font-bold"
                    : "text-text hover:bg-surface"
                }`}
              >
                <span className="flex items-center gap-3">
                  <ShoppingCart size={18} />
                  Cart
                </span>
                {count > 0 && (
                  <span className="bg-cta text-text text-xs font-ui font-bold rounded-full px-2 py-0.5">
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </Link>
            </li>

            {/* Sell */}
            <li>
              <Link
                href={user?.role === 'seller' ? '/dashboard' : '/sell'}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-body text-base font-semibold transition-colors ${
                  pathname.startsWith('/dashboard') || pathname.startsWith('/sell')
                    ? "bg-primary/5 text-primary font-bold"
                    : "text-cta hover:bg-surface"
                }`}
              >
                <Store size={18} />
                {user?.role === 'seller' ? 'Dashboard' : 'Start Selling'}
              </Link>
            </li>

            {/* Account links */}
            {user && (
              <>
                <li className="pt-2 border-t border-border-light mt-2">
                  <Link
                    href="/account"
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-body text-base transition-colors ${
                      pathname.startsWith('/account')
                        ? "bg-primary/5 text-primary font-bold"
                        : "text-text hover:bg-surface"
                    }`}
                  >
                    <User size={18} />
                    My Account
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border-light">
          {user ? (
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg font-body text-base text-error hover:bg-error-light transition-colors"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          ) : (
            <div className="space-y-2">
              <Link
                href="/auth/login"
                onClick={onClose}
                className="block w-full text-center bg-cta hover:bg-cta-hover text-text font-body font-semibold py-3 rounded-lg transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                onClick={onClose}
                className="block w-full text-center border-2 border-primary text-primary font-body font-semibold py-3 rounded-lg hover:bg-primary hover:text-white transition-colors"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
