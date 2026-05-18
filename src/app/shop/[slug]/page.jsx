import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import Breadcrumb from '@/components/ui/Breadcrumb';
import StarRating from '@/components/ui/StarRating';
import Badge from '@/components/ui/Badge';
import { formatPrice, formatDate } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ShieldCheck, Package } from 'lucide-react';
import AddToCartButton from './AddToCartButton';
import ReviewSection from './ReviewSection';
import ProductGallery from './ProductGallery';

export const dynamic = 'force-dynamic';

export async function generateMetadata({  params  }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: true, category: true },
  });
  if (!product) return { title: 'Product Not Found' };

  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
  const ogImage = primaryImage?.url || '/images/placeholder-product.jpg';
  const descriptionSnippet = product.description.length > 160 ? `${product.description.substring(0, 157)}...` : product.description;
  const keywords = [...product.tags, product.category?.name, 'Handmade', 'Artisan', 'Handcrafted Haven'].filter(Boolean);

  return {
    title: `${product.title} | Handcrafted Haven`,
    description: descriptionSnippet,
    keywords,
    openGraph: {
      title: product.title,
      description: descriptionSnippet,
      url: `/shop/${slug}`,
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: descriptionSnippet,
      images: [ogImage],
    },
  };
}

export default async function ProductPage({  params  }) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { displayOrder: 'asc' } },
      seller: {
        select: { id: true, name: true, avatarUrl: true, bio: true, location: true },
      },
      category: true,
      reviews: {
        include: {
          user: { select: { id: true, name: true, avatarUrl: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!product) notFound();

  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: primaryImage?.url,
    offers: {
      '@type': 'Offer',
      price: Number(product.price),
      priceCurrency: 'USD',
      availability: product.inventoryQty > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
    aggregateRating: product.reviewCount > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.avgRating,
      reviewCount: product.reviewCount,
    } : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container-app py-4">
        <Breadcrumb
          items={[
            { label: 'Shop', href: '/shop' },
            { label: product.category?.name || 'Product', href: `/shop?category=${product.category?.slug}` },
            { label: product.title },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 pb-16">
          {/* Image Gallery */}
          <ProductGallery images={product.images} title={product.title} />

          {/* Product Info */}
          <div className="animate-fade-in-up">
            {product.category && (
              <Link href={`/shop?category=${product.category.slug}`}>
                <Badge variant="accent" size="md">{product.category.name}</Badge>
              </Link>
            )}

            <h1 className="font-display text-3xl md:text-4xl text-primary uppercase mt-3 mb-4">
              {product.title}
            </h1>

            {/* Rating & Stock */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6">
              <div className="flex items-center gap-2">
                <StarRating rating={Number(product.avgRating)} showValue />
                <span className="font-ui text-sm text-text-muted">
                  ({product.reviewCount} review{product.reviewCount !== 1 ? 's' : ''})
                </span>
              </div>
              
              <span className="hidden sm:inline text-border">•</span>

              <div className="flex items-center gap-1.5 uppercase tracking-wide">
                <Package size={14} className={product.inventoryQty > 0 ? 'text-success' : 'text-error'} />
                <span className={`font-ui text-xs font-semibold ${product.inventoryQty > 0 ? 'text-success' : 'text-error'}`}>
                  {product.inventoryQty > 0 ? `${product.inventoryQty} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Price */}
            <p className="text-3xl font-body font-bold text-primary mb-6">
              {formatPrice(Number(product.price))}
            </p>

            {/* Description */}
            <div className="font-body text-text-muted leading-relaxed mb-8 whitespace-pre-line">
              {product.description}
            </div>

            {/* Add to Cart */}
            <AddToCartButton
              productId={product.id}
              maxQty={product.inventoryQty}
              disabled={product.inventoryQty <= 0 || product.status === 'sold_out'}
            />

            {/* Trust Badges */}
            <div className="flex flex-col xl:flex-row gap-3 mt-6">
              <div className="flex-1 flex items-center gap-3 bg-white border border-border-light rounded-lg px-4 py-3 shadow-xs">
                <ShieldCheck size={18} className="text-accent shrink-0" />
                <span className="font-ui text-xs text-text-muted font-medium">Made by hand by an independent artisan.</span>
              </div>
              <div className="flex-1 flex items-center gap-3 bg-white border border-border-light rounded-lg px-4 py-3 shadow-xs">
                <Package size={18} className="text-accent shrink-0" />
                <span className="font-ui text-xs text-text-muted font-medium">Ships in 3-5 business days, plastic-free.</span>
              </div>
            </div>

            {/* Seller Info */}
            {product.seller && (
              <div className="mt-8 p-6 bg-white rounded-xl shadow-card">
                <div className="flex items-center gap-4">
                  {product.seller.avatarUrl ? (
                    <Image
                      src={product.seller.avatarUrl}
                      alt={product.seller.name}
                      width={56}
                      height={56}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white font-bold font-ui text-lg">
                      {product.seller.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/seller/${product.seller.id}`}
                      className="font-body font-semibold text-text hover:text-accent transition-colors"
                    >
                      {product.seller.name}
                    </Link>
                    {product.seller.location && (
                      <p className="flex items-center gap-1 font-ui text-xs text-text-muted mt-0.5">
                        <MapPin size={12} />
                        {product.seller.location}
                      </p>
                    )}
                  </div>
                  <Link
                    href={`/seller/${product.seller.id}`}
                    className="text-sm font-body font-medium text-accent hover:text-accent-hover transition-colors"
                  >
                    View Shop
                  </Link>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border-light">
                  <ShieldCheck size={14} className="text-success" />
                  <span className="font-ui text-xs text-text-muted">Verified Seller</span>
                </div>
              </div>
            )}

            {/* Tags (Moved to bottom) */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="px-3 py-1">#{tag.toLowerCase()}</Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewSection
          productId={product.id}
          sellerId={product.sellerId}
          reviews={product.reviews.map(r => ({
            ...r,
            createdAt: r.createdAt.toISOString(),
            sellerReplyAt: r.sellerReplyAt ? r.sellerReplyAt.toISOString() : null,
          }))}
          avgRating={Number(product.avgRating)}
          reviewCount={product.reviewCount}
        />
      </div>
    </>
  );
}
