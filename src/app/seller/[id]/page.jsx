import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ProductCard from '@/components/ui/ProductCard';
import StarRating from '@/components/ui/StarRating';
import Image from 'next/image';
import { MapPin, Calendar, Globe, ExternalLink } from 'lucide-react';

export const dynamic = 'force-dynamic';

const InstagramIcon = ({  size = 18  }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const XIcon = ({  size = 18  }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
  </svg>
);
import { formatDate } from '@/lib/utils';

export async function generateMetadata({  params  }) {
  const { id } = await params;
  const seller = await prisma.user.findUnique({ where: { id: parseInt(id), role: 'seller' }, select: { name: true } });
  return { title: seller ? `${seller.name}'s Shop` : 'Seller Not Found' };
}

export default async function SellerPage({  params  }) {
  const { id } = await params;
  const seller = await prisma.user.findUnique({
    where: { id: parseInt(id), role: 'seller' },
    select: { id: true, name: true, avatarUrl: true, bio: true, location: true, socialLinks: true, createdAt: true,
      products: { where: { status: 'active' }, include: { images: { where: { isPrimary: true }, take: 1 }, category: { select: { id: true, name: true, slug: true } } }, orderBy: { createdAt: 'desc' } },
    },
  });
  if (!seller) notFound();
  const stats = await prisma.product.aggregate({ where: { sellerId: parseInt(id), status: 'active' }, _avg: { avgRating: true }, _count: true });
  const social = seller.socialLinks;

  return (
    <div className="container-app py-8 pb-16">
      <div className="bg-white rounded-xl shadow-card p-8 mb-10">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {seller.avatarUrl ? (
            <Image src={seller.avatarUrl} alt={seller.name} width={96} height={96} className="w-24 h-24 rounded-full object-cover border-4 border-surface" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white font-bold font-display text-3xl">{seller.name.charAt(0)}</div>
          )}
          <div className="flex-1">
            <h1 className="font-display text-3xl text-primary uppercase mb-2">{seller.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mb-4 font-ui text-sm text-text-muted">
              {seller.location && <span className="flex items-center gap-1"><MapPin size={14} />{seller.location}</span>}
              <span className="flex items-center gap-1"><Calendar size={14} />Joined {formatDate(seller.createdAt)}</span>
            </div>
            {seller.bio && <p className="font-body text-text-muted leading-relaxed mb-4 max-w-2xl">{seller.bio}</p>}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2"><StarRating rating={stats._avg.avgRating || 0} size={16} /><span className="font-ui text-sm text-text-muted">{(stats._avg.avgRating || 0).toFixed(1)}</span></div>
              <span className="font-ui text-sm text-text-muted">{stats._count} product{stats._count !== 1 ? 's' : ''}</span>
            </div>
            {social && (
              <div className="flex items-center gap-3 mt-4">
                {social.instagram && <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-surface hover:bg-cta/10 text-text-muted hover:text-cta transition-colors" aria-label="Instagram"><InstagramIcon size={18} /></a>}
                {social.twitter && <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-surface hover:bg-accent/10 text-text-muted hover:text-text transition-colors" aria-label="X / Twitter"><XIcon size={18} /></a>}
                {social.website && <a href={social.website} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-surface hover:bg-accent/10 text-text-muted hover:text-accent transition-colors" aria-label="Website"><ExternalLink size={18} /></a>}
              </div>
            )}
          </div>
        </div>
      </div>
      <h2 className="font-display text-2xl text-primary uppercase mb-6">Products</h2>
      {seller.products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {seller.products.map((product) => (
            <ProductCard key={product.id} product={{ ...product, price: Number(product.price), seller: { id: seller.id, name: seller.name, avatarUrl: seller.avatarUrl } }} />
          ))}
        </div>
      ) : (
        <p className="font-body text-text-muted text-center py-12">No products listed yet.</p>
      )}
    </div>
  );
}
