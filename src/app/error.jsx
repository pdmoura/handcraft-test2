'use client';

import { useEffect, useState } from 'react';
import { Database, AlertTriangle, RefreshCw, Home, Terminal } from 'lucide-react';
import Link from 'next/link';

export default function RootErrorBoundary({ error, reset }) {
  const [isDatabaseError, setIsDatabaseError] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    // Log the error to console or external monitoring
    console.error('Unhandled runtime error:', error);

    // Detect if this is a database or network connectivity issue
    const errString = (error?.message || error?.stack || '').toLowerCase();
    const errName = (error?.name || '').toLowerCase();
    
    if (
      errString.includes('prisma') ||
      errString.includes('database') ||
      errString.includes('connect') ||
      errString.includes('pool') ||
      errString.includes('sqlite') ||
      errString.includes('postgres') ||
      errString.includes('pg') ||
      errString.includes('connection') ||
      errName.includes('prisma')
    ) {
      setIsDatabaseError(true);
    }
  }, [error]);

  const handleRetry = async () => {
    setIsResetting(true);
    try {
      // Execute Next.js reset trigger to reload the segment
      reset();
    } catch (e) {
      console.error('Reset failed:', e);
    } finally {
      // Keep loading transition visible briefly for UX feel
      setTimeout(() => {
        setIsResetting(false);
      }, 800);
    }
  };

  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center px-4 py-16 bg-gradient-to-b from-surface-warm to-background">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-card p-8 md:p-12 border border-border-light text-center relative overflow-hidden animate-fade-in-up">
        
        {/* Curved Warm Backdrop Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-accent/40 via-cta/40 to-primary/40" />

        {isDatabaseError ? (
          /* ===== DATABASE OFFLINE MODE ===== */
          <div className="space-y-6">
            <div className="relative mx-auto w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center text-accent animate-pulse">
              <Database size={48} className="stroke-[1.5]" />
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1.5 shadow-dropdown text-cta border border-border-light">
                <AlertTriangle size={18} className="fill-current" />
              </div>
            </div>

            <div className="space-y-3">
              <span className="font-ui text-xs font-bold text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full">
                Service Offline
              </span>
              <h1 className="font-display text-3xl md:text-4xl text-primary uppercase">
                Database Connection Issue
              </h1>
              <p className="font-body text-text-muted max-w-md mx-auto leading-relaxed">
                We are currently experiencing a brief connectivity timeout with our database. The Handcrafted marketplace data is temporarily offline.
              </p>
            </div>

            <div className="bg-surface-warm rounded-xl p-5 border border-border-light max-w-md mx-auto text-left space-y-2">
              <h3 className="font-ui text-xs font-bold text-text uppercase tracking-wider">What does this mean?</h3>
              <p className="font-body text-xs text-text-muted leading-relaxed">
                Our servers are up and running, but the database connection hasn&apos;t completed successfully. Please check back shortly or retry using the action below.
              </p>
            </div>
          </div>
        ) : (
          /* ===== GENERAL RUNTIME EXCEPTION MODE ===== */
          <div className="space-y-6">
            <div className="relative mx-auto w-24 h-24 bg-cta/10 rounded-full flex items-center justify-center text-cta">
              <AlertTriangle size={48} className="stroke-[1.5]" />
            </div>

            <div className="space-y-3">
              <span className="font-ui text-xs font-bold text-cta uppercase tracking-widest bg-cta/10 px-3 py-1 rounded-full">
                Application Error
              </span>
              <h1 className="font-display text-3xl md:text-4xl text-primary uppercase">
                Something Went Wrong
              </h1>
              <p className="font-body text-text-muted max-w-md mx-auto leading-relaxed">
                An unexpected error occurred while loading this page. Our team has been notified.
              </p>
            </div>
          </div>
        )}

        {/* ===== CONTROLS ===== */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <button
            onClick={handleRetry}
            disabled={isResetting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-white font-body font-semibold px-8 py-3.5 rounded-full shadow-button hover:shadow-button-hover active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none"
          >
            <RefreshCw size={18} className={`${isResetting ? 'animate-spin' : ''}`} />
            {isResetting ? 'Checking connection...' : 'Try Again'}
          </button>
          
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-border-light text-text hover:bg-surface-warm font-body font-semibold px-8 py-3 rounded-full transition-all"
          >
            <Home size={18} />
            Go Home
          </Link>
        </div>

        {/* ===== DEVELOPER DETAILED LOGS (Gracefully Collapsed) ===== */}
        <div className="mt-12 pt-6 border-t border-border-light">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="inline-flex items-center gap-2 text-xs font-ui font-semibold text-text-muted hover:text-text transition-colors"
          >
            <Terminal size={14} />
            {showDetails ? 'Hide technical logs' : 'Show technical logs'}
          </button>

          {showDetails && (
            <div className="mt-4 p-4 bg-slate-950 text-slate-200 rounded-xl font-mono text-xs text-left overflow-x-auto max-h-48 border border-slate-800 shadow-inner select-text">
              <div className="text-rose-400 font-bold mb-1">
                Error name: {error?.name || 'UnknownException'}
              </div>
              <div className="text-slate-400 whitespace-pre-wrap">
                {error?.message || error?.stack || 'No detailed error logs provided.'}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
