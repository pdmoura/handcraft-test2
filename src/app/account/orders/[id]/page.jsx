import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { formatPrice, formatDate } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MapPin, Package } from 'lucide-react';
import OrderReviewClient from './OrderReviewClient';

export const dynamic = 'force-dynamic';

export default async function OrderDetailsPage({  params  }) {
  const session = await getSession();
  if (!session) redirect('/auth/login');

  const resolvedParams = await params;
  const orderId = parseInt(resolvedParams.id, 10);
  if (isNaN(orderId)) redirect('/account');

  const order = await prisma.order.findUnique({
    where: { id: orderId, userId: session.id },
    include: {
      items: {
        include: {
          product: { 
            include: { 
              seller: { select: { name: true } },
              images: { where: { isPrimary: true }, take: 1 }
            } 
          },
          review: true,
        }
      }
    }
  });

  if (!order) redirect('/account');

  const address = order.shippingAddress;
  const statusVariant = (s) => s === 'delivered' ? 'success' : s === 'confirmed' ? 'accent' : s === 'shipped' ? 'warning' : 'default';

  return (
    <div className="container-app py-8 pb-16">
      <Link href="/account" className="inline-flex items-center gap-2 text-text-muted hover:text-primary font-ui text-sm mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to My Account
      </Link>

      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border-light bg-surface flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl text-primary uppercase flex items-center gap-3">
              Order #{order.id}
              <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
            </h1>
            <p className="font-body text-sm text-text-muted mt-1">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <div className="text-left md:text-right">
            <p className="font-ui text-sm text-text-muted">Total Amount</p>
            <p className="font-body text-2xl font-bold text-primary">{formatPrice(Number(order.totalAmount))}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border-light">
          {/* Items */}
          <div className="p-6 md:col-span-2">
            <h2 className="font-display text-lg text-primary uppercase mb-4 flex items-center gap-2">
              <Package size={20} /> Items Ordered
            </h2>
            <div className="space-y-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 rounded-xl border border-border-light bg-surface-warm">
                  <Image
                    src={item.product.images[0]?.url || '/images/placeholder-product.jpg'} 
                    alt={item.product.title} 
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Link href={`/shop/${item.product.slug}`} className="font-body font-semibold text-text hover:text-accent transition-colors line-clamp-1">
                        {item.product.title}
                      </Link>
                      <p className="font-ui text-xs text-text-muted mt-0.5">Sold by {item.product.seller.name}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-body text-sm">Qty: {item.quantity}</span>
                        <span className="font-body font-bold">{formatPrice(Number(item.unitPrice))}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-border-light">
                      <OrderReviewClient 
                        orderItemId={item.id} 
                        productId={item.product.id} 
                        hasReviewed={!!item.review} 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Details */}
          <div className="p-6">
            <h2 className="font-display text-lg text-primary uppercase mb-4 flex items-center gap-2">
              <MapPin size={20} /> Shipping Details
            </h2>
            <div className="bg-surface p-4 rounded-lg">
              <p className="font-body font-semibold text-text mb-1">{address.fullName}</p>
              <p className="font-body text-sm text-text-muted leading-relaxed">
                {address.addressLine1}
                {address.addressLine2 && <><br />{address.addressLine2}</>}
                <br />
                {address.city}, {address.state} {address.postalCode}
                <br />
                {address.country}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
