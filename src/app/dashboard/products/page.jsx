import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { formatPrice, formatDate } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { Plus, Edit, Package } from 'lucide-react';
import DeleteProductButton from './DeleteProductButton';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'My Products' };

export default async function ProductsPage() {
  const session = await getSession();
  if (!session || session.role !== 'seller') redirect('/');

  const products = await prisma.product.findMany({
    where: { sellerId: session.id },
    include: { images: { where: { isPrimary: true }, take: 1 }, category: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const statusVariant = (s) => s === 'active' ? 'success' : s === 'draft' ? 'default' : 'error';

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="font-display text-2xl text-primary uppercase">My Products</h1>
        <Link href="/dashboard/products/new"><Button className="w-full sm:w-auto"><Plus size={18} /> Add Product</Button></Link>
      </div>
      {products.length === 0 ? (
        <EmptyState icon={Package} title="No Products Yet" description="Start listing your handcrafted products!" actionLabel="Add First Product" actionHref="/dashboard/products/new" />
      ) : (
        <>
          {/* Mobile Card List */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {products.map((p) => (
              <div key={p.id} className="bg-white rounded-xl shadow-card p-4 flex gap-4">
                <Link href={`/shop/${p.slug}`} className="shrink-0">
                  <Image src={p.images[0]?.url || '/images/placeholder-product.jpg'} alt="" width={80} height={80} className="w-20 h-20 rounded-lg object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/shop/${p.slug}`}>
                    <h3 className="font-body text-base font-semibold text-text line-clamp-1 mb-1">{p.title}</h3>
                  </Link>
                  <div className="flex items-center gap-2 mb-2 font-ui text-sm text-text-muted">
                    <span className="font-bold text-text">{formatPrice(Number(p.price))}</span>
                    <span>•</span>
                    <span className="truncate">{p.category?.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant={statusVariant(p.status)} size="sm">{p.status}</Badge>
                    <div className="flex items-center gap-4">
                      <Link href={`/dashboard/products/${p.id}/edit`} className="text-accent hover:text-accent-hover transition-colors" aria-label="Edit"><Edit size={16} /></Link>
                      <DeleteProductButton productId={p.id} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface">
                  <tr className="font-ui text-xs text-text-muted uppercase tracking-wider">
                    <th className="px-6 py-3">Product</th><th className="px-6 py-3">Category</th><th className="px-6 py-3">Price</th><th className="px-6 py-3">Stock</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-surface/50 transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/shop/${p.slug}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                          <Image src={p.images[0]?.url || '/images/placeholder-product.jpg'} alt="" width={40} height={40} className="w-10 h-10 rounded-md object-cover" />
                          <span className="font-body text-sm font-medium text-text line-clamp-1">{p.title}</span>
                        </Link>
                      </td>
                      <td className="px-6 py-4 font-ui text-sm text-text-muted">{p.category?.name}</td>
                      <td className="px-6 py-4 font-body text-sm font-semibold">{formatPrice(Number(p.price))}</td>
                      <td className="px-6 py-4 font-ui text-sm">{p.inventoryQty}</td>
                      <td className="px-6 py-4"><Badge variant={statusVariant(p.status)}>{p.status}</Badge></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <Link href={`/dashboard/products/${p.id}/edit`} className="inline-flex items-center gap-1 text-accent hover:text-accent-hover font-ui text-sm transition-colors"><Edit size={14} /> Edit</Link>
                          <DeleteProductButton productId={p.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
