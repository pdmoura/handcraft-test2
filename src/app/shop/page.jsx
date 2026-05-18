import { Suspense } from 'react';
import prisma from '@/lib/prisma';
import ProductCard from '@/components/ui/ProductCard';
import SearchBar from '@/components/ui/SearchBar';
import Pagination from '@/components/ui/Pagination';
import Breadcrumb from '@/components/ui/Breadcrumb';
import EmptyState from '@/components/ui/EmptyState';
import { ProductCardSkeleton } from '@/components/ui/LoadingSpinner';
import { Search } from 'lucide-react';
import SortDropdown from '@/components/ui/SortDropdown';
import RatingSlider from '@/components/ui/RatingSlider';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Shop',
  description: 'Browse our collection of unique handcrafted products from talented artisans.',
};

export default async function ShopPage({  searchParams  }) {
  const params = await searchParams;
  const page = parseInt((params.page) || '1');
  const pageSize = 12;
  const category = params.category;
  const search = params.search;
  const sort = params.sort;
  const minPrice = params.minPrice ? parseFloat(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : undefined;
  const minRating = params.minRating ? parseFloat(params.minRating) : undefined;

  // Build where clause
  const where = { status: 'active' };
  if (category) where.category = { slug: category };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { category: { name: { contains: search, mode: 'insensitive' } } },
      { tags: { has: search.toLowerCase() } },
    ];
  }
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) (where.price).gte = minPrice;
    if (maxPrice) (where.price).lte = maxPrice;
  }
  if (minRating) where.avgRating = { gte: minRating };

  // Build orderBy
  let orderBy = { createdAt: 'desc' };
  if (sort === 'price_asc') orderBy = { price: 'asc' };
  else if (sort === 'price_desc') orderBy = { price: 'desc' };
  else if (sort === 'rating') orderBy = { avgRating: 'desc' };

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        seller: { select: { id: true, name: true, avatarUrl: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      include: { _count: { select: { products: { where: { status: 'active' } } } } },
      orderBy: { name: 'asc' },
    }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  // Build current search params for pagination
  const currentParams = {};
  if (category) currentParams.category = category;
  if (search) currentParams.search = search;
  if (sort) currentParams.sort = sort;
  if (minPrice) currentParams.minPrice = minPrice.toString();
  if (maxPrice) currentParams.maxPrice = maxPrice.toString();
  if (minRating) currentParams.minRating = minRating.toString();

  return (
    <div className="container-app py-4">
      <Breadcrumb items={[{ label: 'Shop' }]} />

      <div className="flex flex-col lg:flex-row gap-8 pb-16">
        {/* Sidebar Filters */}
        <aside className="lg:w-64 shrink-0">
          <div className="bg-white rounded-xl shadow-card p-6 sticky top-20">
            <h2 className="font-display text-lg text-primary uppercase mb-4">Filters</h2>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="font-body font-semibold text-sm text-text mb-3">Category</h3>
              <div className="space-y-2">
                <Link
                  href="/shop"
                  className={`block font-body text-sm transition-colors ${!category ? 'text-cta font-semibold' : 'text-text-muted hover:text-text'}`}
                >
                  All Categories
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${cat.slug}${sort ? `&sort=${sort}` : ''}${search ? `&search=${search}` : ''}`}
                    className={`block font-body text-sm transition-colors ${category === cat.slug ? 'text-cta font-semibold' : 'text-text-muted hover:text-text'}`}
                  >
                    {cat.name}
                    <span className="text-text-light ml-1">({cat._count.products})</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-body font-semibold text-sm text-text mb-3">Price Range</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  defaultValue={minPrice}
                  className="w-full px-3 py-2 border border-border-light rounded-md font-ui text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                  aria-label="Minimum price"
                  id="min-price"
                />
                <span className="text-text-muted">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  defaultValue={maxPrice}
                  className="w-full px-3 py-2 border border-border-light rounded-md font-ui text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                  aria-label="Maximum price"
                  id="max-price"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h3 className="font-body font-semibold text-sm text-text mb-3">Rating</h3>
              <Suspense fallback={<div className="h-8 animate-shimmer rounded-lg" />}>
                <RatingSlider initialRating={minRating} />
              </Suspense>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="w-full sm:w-auto sm:flex-1 sm:max-w-md">
              <Suspense fallback={<div className="h-10 animate-shimmer rounded-lg" />}>
                <SearchBar />
              </Suspense>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-ui text-sm text-text-muted whitespace-nowrap">
                {total} product{total !== 1 ? 's' : ''}
              </span>
              <SortDropdown initialSort={sort || 'newest'} />
            </div>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 stagger-children">
                {products.map((product) => (
                  <ProductCard key={product.id} product={{
                    ...product,
                    price: Number(product.price),
                  }} />
                ))}
              </div>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                baseUrl="/shop"
                searchParams={currentParams}
              />
            </>
          ) : (
            <EmptyState
              icon={Search}
              title="No Products Found"
              description="Try adjusting your filters or search terms to find what you're looking for."
              actionLabel="Clear Filters"
              actionHref="/shop"
            />
          )}
        </div>
      </div>
    </div>
  );
}
