'use client';
import { useAuth } from '@/components/providers/AuthProvider';
import { useToast } from '@/components/providers/ToastProvider';
import { useState, useEffect } from 'react';
import { Store, MapPin, AlignLeft, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { useRouter } from 'next/navigation';

export default function SellPage() {
  const { user, isLoading, refreshUser } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/register?role=seller');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return <PageLoader />;

  const handleUpgrade = async (e) => {
    e.preventDefault();
    if (!bio.trim() || !location.trim()) {
      showToast('Please provide a bio and location', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'seller', bio, location }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Welcome to the Artisan Community! Your seller account is ready.', 'success');
        await refreshUser();
        router.push('/dashboard');
      } else {
        showToast(data.error || 'Failed to upgrade account', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-warm pb-20">
      {/* Hero Section */}
      <section className="bg-primary py-20 px-4 text-center">
        <div className="container-app max-w-3xl">
          <Store size={48} className="text-cta mx-auto mb-6" />
          <h1 className="font-display text-4xl md:text-5xl text-white uppercase mb-6">
            Become an Artisan Seller
          </h1>
          <p className="font-body text-lg text-white/80 leading-relaxed mb-8">
            Join our community of creators, makers, and dreamers. Open your shop on Handcrafted Haven and share your passion with customers who value quality and sustainability.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container-app max-w-2xl -mt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-card p-8 md:p-12">
          
          {/* State 1: Already a Seller */}
          {user.role === 'seller' ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Store size={32} className="text-success" />
              </div>
              <h2 className="font-display text-2xl text-primary uppercase mb-3">You&apos;re already a seller!</h2>
              <p className="font-body text-text-muted mb-8">
                Your shop is active and ready for business. Go to your dashboard to manage your products.
              </p>
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto px-12">Go to Dashboard</Button>
              </Link>
            </div>
          ) 
          
          /* State 3: Buyer Upgrading to Seller */
          : (
            <div>
              <div className="text-center mb-10">
                <h2 className="font-display text-2xl text-primary uppercase mb-3">Set Up Your Shop</h2>
                <p className="font-body text-text-muted">
                  Tell us a bit about yourself and where you craft your goods. This information will be displayed on your shop profile.
                </p>
              </div>

              <form onSubmit={handleUpgrade} className="space-y-6">
                <div>
                  <label htmlFor="bio" className="font-ui text-sm font-bold text-text mb-2 flex items-center gap-2">
                    <AlignLeft size={16} className="text-text-muted" /> Your Artisan Story (Bio)
                  </label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    placeholder="E.g., I've been crafting wooden bowls for 10 years, sourcing timber sustainably..."
                    className="w-full px-4 py-3 border border-border-light rounded-xl font-body text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/30"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="location" className="font-ui text-sm font-bold text-text mb-2 flex items-center gap-2">
                    <MapPin size={16} className="text-text-muted" /> Workshop Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="E.g., Portland, Oregon"
                    className="w-full px-4 py-3 border border-border-light rounded-xl font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                    required
                  />
                </div>

                <div className="pt-6 border-t border-border-light">
                  <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
                    Create Seller Account
                  </Button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
