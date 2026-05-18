'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Phone } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  if (pathname.startsWith('/dashboard')) {
    return null;
  }

  return (
    <footer className="bg-primary text-white border-t border-primary-dark mt-auto" role="contentinfo">
      {/* Main Footer */}
      <div className="container-app py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 text-center sm:text-left">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-3 flex flex-col items-center sm:items-start">
            <Link href="/" className="inline-flex items-center gap-3 mb-4 hover:opacity-90 transition-opacity">
              <Image src="/logo-idea-1.png" alt="Handcrafted Haven" width={240} height={64} className="object-contain shrink-0 rounded-xl h-16 w-auto max-w-[240px]" />
              <span className="font-display text-xl uppercase tracking-wider text-white">
                Handcrafted Haven
              </span>
            </Link>
            <p className="font-body text-sm text-white/80 leading-relaxed mb-6">
              A community-driven marketplace connecting artisans with customers who value
              handmade, sustainable products.
            </p>

          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-sm uppercase tracking-wider mb-4 text-cta">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: '/shop', label: 'Shop All' },
                { href: '/categories', label: 'Categories' },
                { href: '/about', label: 'About Us' },
                { href: '/auth/register?role=seller', label: 'Become a Seller' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-white/80 hover:text-cta transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-sm uppercase tracking-wider mb-4 text-cta">
              Legal
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: '/terms', label: 'Terms of Service' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/shipping', label: 'Shipping Policy' },
                { href: '/returns', label: 'Returns & Refunds' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-white/80 hover:text-cta transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="font-display text-sm uppercase tracking-wider mb-4 text-cta">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start justify-center sm:justify-start gap-3 font-body text-sm text-white/80">
                <Mail size={16} className="shrink-0 mt-0.5" />
                <span>hello@handcraftedhaven.com</span>
              </li>
              <li className="flex items-start justify-center sm:justify-start gap-3 font-body text-sm text-white/80">
                <Phone size={16} className="shrink-0 mt-0.5" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-start justify-center sm:justify-start gap-3 font-body text-sm text-white/80">
                <MapPin size={16} className="shrink-0 mt-0.5" />
                <span>Portland, Oregon, USA</span>
              </li>
            </ul>
          </div>
          {/* Follow */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-sm uppercase tracking-wider mb-4 text-cta">
              Follow
            </h3>
            <div className="flex justify-center sm:justify-start gap-3">
              <a href="#" className="flex items-center justify-center w-10 h-10 border border-white/20 rounded-xl text-white/80 hover:border-cta hover:text-cta transition-colors" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="flex items-center justify-center w-10 h-10 border border-white/20 rounded-xl text-white/80 hover:border-cta hover:text-cta transition-colors" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#" className="flex items-center justify-center w-10 h-10 border border-white/20 rounded-xl text-white/80 hover:border-cta hover:text-cta transition-colors" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
            </div>
          </div>
          
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-app py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center">
          <p className="font-ui text-xs text-white/60">
            &copy; {currentYear} Handcrafted Haven. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
