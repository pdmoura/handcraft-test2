'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/providers/CartProvider';
import { useToast } from '@/components/providers/ToastProvider';
import Button from '@/components/ui/Button';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { formatPrice } from '@/lib/utils';
import { CheckCircle, Package } from 'lucide-react';
import Link from 'next/link';
import { createOrderAction } from '@/lib/actions/orders';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { showToast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [form, setForm] = useState({
    fullName: '', address: '', city: '', state: '', zipCode: '', country: 'United States',
  });

  useEffect(() => {
    if (!orderPlaced && items.length === 0) {
      router.push('/cart');
    }
  }, [items.length, orderPlaced, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.address || !form.city || !form.state || !form.zipCode) {
      showToast('Please fill in all fields', 'warning');
      return;
    }
    setIsSubmitting(true);
    try {
      const data = await createOrderAction(form);
      if (data.success) {
        clearCart();
        setOrderPlaced(true);
        showToast('Order placed successfully!', 'success');
      } else {
        showToast(data.error || 'Checkout failed', 'error');
      }
    } catch { showToast('Network error', 'error'); }
    finally { setIsSubmitting(false); }
  };


  if (orderPlaced) {
    return (
      <div className="container-app py-16 text-center animate-fade-in-up">
        <CheckCircle size={64} className="text-success mx-auto mb-6" />
        <h1 className="font-display text-3xl text-primary uppercase mb-4">Order Confirmed!</h1>
        <p className="font-body text-text-muted mb-8 max-w-md mx-auto">Thank you for your purchase. Your order is being prepared by our artisans.</p>
        <div className="flex justify-center gap-4">
          <Link href="/account"><Button variant="outline">View Orders</Button></Link>
          <Link href="/shop"><Button>Continue Shopping</Button></Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  const inputClass = "w-full px-4 py-3 border border-border-light rounded-lg font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all";

  return (
    <div className="container-app py-4">
      <Breadcrumb items={[{ label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />
      <h1 className="font-display text-3xl text-primary uppercase mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-16">
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-xl shadow-card p-6 md:p-8">
          <h2 className="font-display text-xl text-primary uppercase mb-6">Shipping Address</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="font-ui text-sm font-medium text-text block mb-1.5">Full Name</label>
              <input id="fullName" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className={inputClass} required />
            </div>
            <div>
              <label htmlFor="address" className="font-ui text-sm font-medium text-text block mb-1.5">Street Address</label>
              <input id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputClass} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="font-ui text-sm font-medium text-text block mb-1.5">City</label>
                <input id="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputClass} required />
              </div>
              <div>
                <label htmlFor="state" className="font-ui text-sm font-medium text-text block mb-1.5">State</label>
                <input id="state" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className={inputClass} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="zipCode" className="font-ui text-sm font-medium text-text block mb-1.5">ZIP Code</label>
                <input id="zipCode" value={form.zipCode} onChange={(e) => setForm({ ...form, zipCode: e.target.value })} className={inputClass} required />
              </div>
              <div>
                <label htmlFor="country" className="font-ui text-sm font-medium text-text block mb-1.5">Country</label>
                <input id="country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className={inputClass} />
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-surface-warm rounded-lg flex items-center gap-3">
            <Package size={20} className="text-text-muted shrink-0" />
            <p className="font-ui text-xs text-text-muted">This is a demo checkout. No real payment will be processed.</p>
          </div>
          <Button type="submit" isLoading={isSubmitting} className="w-full mt-6" size="lg">Place Order</Button>
        </form>
        <div>
          <div className="bg-white rounded-xl shadow-card p-6 sticky top-20">
            <h2 className="font-display text-lg text-primary uppercase mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between font-body text-sm">
                  <span className="text-text-muted truncate mr-2">{item.product?.title} × {item.quantity}</span>
                  <span className="font-medium shrink-0">{formatPrice(Number(item.product?.price || 0) * item.quantity)}</span>
                </div>
              ))}
            </div>
            <hr className="border-border-light mb-3" />
            <div className="flex justify-between font-body text-lg">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-primary">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
