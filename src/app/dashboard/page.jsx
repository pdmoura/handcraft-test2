import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Package, ShoppingCart, Star, DollarSign, Plus } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Dashboard' };

export default async function DashboardPage() {
  const session = await getSession();
  if (!session || session.role !== 'seller') redirect('/');

  const [productCount, orderItems, reviewStats] = await Promise.all([
    prisma.product.count({ where: { sellerId: session.id } }),
    prisma.orderItem.findMany({ where: { product: { sellerId: session.id } }, select: { quantity: true, unitPrice: true } }),
    prisma.product.aggregate({ where: { sellerId: session.id }, _avg: { avgRating: true } }),
  ]);

  const totalOrders = orderItems.length;
  const totalRevenue = orderItems.reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0);
  const avgRating = reviewStats._avg.avgRating || 0;

  const stats = [
    { icon: Package, label: 'Products', value: productCount, color: 'bg-accent/10 text-accent' },
    { icon: ShoppingCart, label: 'Orders', value: totalOrders, color: 'bg-success-light text-success' },
    { icon: Star, label: 'Avg Rating', value: avgRating.toFixed(1), color: 'bg-warning-light text-warning' },
    { icon: DollarSign, label: 'Revenue', value: formatPrice(totalRevenue), color: 'bg-cta/10 text-cta' },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-primary uppercase">Dashboard</h1>
          <p className="font-body text-text-muted text-sm mt-1">Welcome back, {session.name}!</p>
        </div>
        <Link href="/dashboard/products/new"><Button className="w-full sm:w-auto"><Plus size={18} /> Add Product</Button></Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 stagger-children">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white rounded-xl shadow-card p-5">
            <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}><Icon size={20} /></div>
            <p className="font-body font-bold text-2xl text-text">{value}</p>
            <p className="font-ui text-xs text-text-muted">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
