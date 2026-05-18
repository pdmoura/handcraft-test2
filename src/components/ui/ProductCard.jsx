import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function ProductCard({  product  }) {
  const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
  const imageUrl = primaryImage?.url || '/images/placeholder-product.jpg';

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-surface">
        <Image
          src={imageUrl}
          alt={product.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.status === 'sold_out' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-text font-ui font-bold text-sm px-4 py-1.5 rounded-full">
              Sold Out
            </span>
          </div>
        )}
        {product.inventoryQty > 0 && product.inventoryQty <= 5 && product.status !== 'sold_out' && (
          <span className="absolute top-3 left-3 bg-warning text-white font-ui text-xs font-bold px-2.5 py-1 rounded-full">
            Only {product.inventoryQty} left
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Category */}
        {product.category && (
          <span className="font-ui text-xs text-accent uppercase tracking-wider">
            {product.category.name}
          </span>
        )}

        {/* Title */}
        <h3 className="font-body font-semibold text-text text-base mt-1 line-clamp-1 group-hover:text-primary transition-colors">
          {product.title}
        </h3>

        {/* Seller */}
        {product.seller && (
          <p className="font-ui text-xs text-text-muted mt-0.5">
            by {product.seller.name}
          </p>
        )}

        {/* Rating & Price */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1">
            <Star size={14} className="fill-star text-star" />
            <span className="font-ui text-xs text-text-muted">
              {Number(product.avgRating).toFixed(1)} ({product.reviewCount})
            </span>
          </div>
          <span className="font-body font-bold text-lg text-primary">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </Link>
  );
}
