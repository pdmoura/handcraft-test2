'use client';
import Image from 'next/image';
import { useAuth } from '@/components/providers/AuthProvider';
import { useToast } from '@/components/providers/ToastProvider';
import { useEffect, useState } from 'react';
import { formatPrice, formatDate } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import { Package, Upload, Trash2, AlertTriangle, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import CloudinaryUploadButton from '@/components/ui/CloudinaryUploadButton';
import Link from 'next/link';

export default function AccountPage() {
  const { user, isLoading: authLoading, refreshUser } = useAuth();
  const { showToast } = useToast();
  
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Profile Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarUrl(user.avatarUrl);
      
      fetch('/api/orders')
        .then(r => r.json())
        .then(d => { if (d.success) setOrders(d.data || []); })
        .finally(() => setLoadingOrders(false));
    } else {
      setLoadingOrders(false);
    }
  }, [user]);

  if (authLoading) return <PageLoader />;

  if (!user) {
    return (
      <div className="container-app py-20 text-center">
        <h1 className="font-display text-2xl text-primary">Please login to view this page.</h1>
      </div>
    );
  }

  const statusVariant = (s) => s === 'delivered' ? 'success' : s === 'confirmed' ? 'accent' : s === 'shipped' ? 'warning' : 'default';

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, avatarUrl })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Profile updated successfully!', 'success');
        refreshUser(); // Refresh global user state
      } else {
        showToast(data.error || 'Failed to update profile', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch('/api/auth/me', { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Account deleted permanently.', 'success');
        window.location.href = '/'; // Hard redirect to clear all states
      } else {
        showToast(data.error || 'Failed to delete account', 'error');
        setIsDeleting(false);
      }
    } catch {
      showToast('Network error', 'error');
      setIsDeleting(false);
    }
  };

  return (
    <div className="container-app py-8 pb-16">
      <h1 className="font-display text-3xl text-primary uppercase mb-8">My Account</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Settings */}
        <div className="bg-white rounded-xl shadow-card p-6 lg:col-span-1 h-fit">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl text-primary uppercase">Profile Settings</h2>
            <Badge variant={user.role === 'seller' ? 'accent' : 'default'} size="sm">
              Type: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Badge>
          </div>
          
          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4 pb-6 border-b border-border-light">
              <div className="relative group">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt="Avatar" width={96} height={96} className="w-24 h-24 rounded-full object-cover shadow-sm border-2 border-white" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white font-bold font-display text-3xl shadow-sm">
                    {name.charAt(0) || user.name.charAt(0)}
                  </div>
                )}
                
                <CloudinaryUploadButton
                  onUpload={(url) => setAvatarUrl(url)}
                >
                  {({ open }) => (
                    <button 
                      type="button" 
                      onClick={() => open()}
                      className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Upload className="text-white w-6 h-6" />
                    </button>
                  )}
                </CloudinaryUploadButton>
              </div>

              <div className="flex gap-2">
                <CloudinaryUploadButton
                  onUpload={(url) => setAvatarUrl(url)}
                  disabledFallback={<button type="button" disabled className="font-ui text-xs font-semibold text-text-light">Change Photo</button>}
                >
                  {({ open }) => (
                    <button type="button" onClick={() => open()} className="font-ui text-xs font-semibold text-accent hover:text-accent-hover">
                      Change Photo
                    </button>
                  )}
                </CloudinaryUploadButton>
                {avatarUrl && (
                  <>
                    <span className="text-border-light">|</span>
                    <button type="button" onClick={() => setAvatarUrl(null)} className="font-ui text-xs font-semibold text-error hover:text-red-700">
                      Remove
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Inputs */}
            <div>
              <label className="font-ui text-sm text-text-muted block mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-border-light rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                required
              />
            </div>
            
            <div>
              <label className="font-ui text-sm text-text-muted block mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-border-light rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                required
              />
            </div>

            <Button type="submit" isLoading={isSaving} className="w-full">
              Save Changes
            </Button>
          </form>

          {/* Danger Zone */}
          <div className="mt-12 pt-6 border-t border-border-light">
            <h3 className="font-display text-lg text-error uppercase mb-2">Danger Zone</h3>
            <p className="font-body text-xs text-text-muted mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 font-ui text-sm font-semibold text-error hover:text-white border border-error hover:bg-error px-4 py-2 rounded-lg transition-colors w-full justify-center"
            >
              <Trash2 size={16} /> Delete Account
            </button>
          </div>
        </div>

        {/* Right Column: Order History */}
        <div className="lg:col-span-2">
          <h2 className="font-display text-xl text-primary uppercase mb-4">Order History</h2>
          {loadingOrders ? <PageLoader /> : orders.length === 0 ? (
            <EmptyState icon={Package} title="No Orders Yet" description="Your order history will appear here." actionLabel="Start Shopping" actionHref="/shop" />
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <Link key={order.id} href={`/account/orders/${order.id}`} className="block bg-white rounded-xl shadow-card p-5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-ui text-sm font-medium text-text group-hover:text-primary transition-colors">Order #{order.id}</span>
                    <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
                  </div>
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-text-muted">{formatDate(order.createdAt)}</span>
                    <span className="font-semibold">{formatPrice(order.totalAmount)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-border-light">
              <h3 className="font-display text-lg text-primary uppercase flex items-center gap-2">
                <AlertTriangle className="text-warning" size={20} /> Confirm Deletion
              </h3>
              <button onClick={() => setShowDeleteModal(false)} className="text-text-muted hover:text-text">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="font-body text-text-muted mb-4">
                Are you absolutely sure you want to delete your account? This action cannot be undone.
              </p>
              {user?.role === 'seller' && (
                <p className="font-body text-error text-sm font-semibold mb-6 bg-error/10 p-3 rounded-lg border border-error/20">
                  Warning: As a seller, deleting your account will also permanently delete all your products and reviews.
                </p>
              )}
              <div className="flex gap-3 mt-6">
                <Button variant="outline" className="flex-1" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </Button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="flex-1 bg-error hover:bg-red-700 text-white font-body font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete Account'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
