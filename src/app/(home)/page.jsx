import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Leaf, Heart, Star, TrendingUp, MapPin, Store } from 'lucide-react';
import prisma from '@/lib/prisma';
import LovedThisWeekCarousel from '@/components/ui/LovedThisWeekCarousel';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const lovedProducts = await prisma.product.findMany({
    where: { status: 'active', avgRating: { gte: 1 } },
    orderBy: [{ avgRating: 'desc' }, { reviewCount: 'desc' }],
    take: 12,
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      seller: { select: { id: true, name: true, avatarUrl: true } },
      category: { select: { id: true, name: true, slug: true } },
    },
  });

  const lovedProductIds = lovedProducts.map((p) => p.id);

  const [featuredProducts, activeSellers] = await Promise.all([
    prisma.product.findMany({
      where: {
        status: 'active',
        id: { notIn: lovedProductIds },
      },
      orderBy: { createdAt: 'desc' },
      take: 12,
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        seller: { select: { id: true, name: true, avatarUrl: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    }),
    prisma.user.findMany({
      where: { role: 'seller' },
      take: 6,
      select: {
        id: true,
        name: true,
        bio: true,
        avatarUrl: true,
        location: true,
      }
    }),
  ]);

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-cta/20 via-transparent to-accent/20" />
        </div>
        <div className="container-app relative z-10 py-20 md:py-32 lg:py-40">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
            <div className="max-w-3xl flex-1 w-full">
              <div className="flex items-center gap-2 mb-6 animate-fade-in">
                <Leaf size={20} className="text-cta" />
                <span className="font-ui text-sm text-white/70 uppercase tracking-widest">
                  Handmade with love
                </span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white uppercase leading-tight mb-6 animate-fade-in-up">
                Discover Unique
                <span className="text-cta block">Handcrafted Treasures</span>
              </h1>
              <p className="font-body text-lg md:text-xl text-white/80 max-w-xl mb-10 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                Connect directly with talented artisans and find one-of-a-kind pieces that tell a story. Every purchase supports independent creators.
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <Link
                  href="/shop"
                  className="group inline-flex items-center gap-2 bg-cta hover:bg-cta-hover text-text font-body font-semibold px-8 py-3.5 rounded-full transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                >
                  Shop Now
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/auth/register?role=seller"
                  className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-body font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 transition-all"
                >
                  Start Selling
                </Link>
              </div>
            </div>
            
            <div className="hidden lg:flex flex-1 justify-end items-center w-full animate-fade-in" style={{ animationDelay: '300ms' }}>
              <Image
                src="/logo-hero.png" 
                alt="Handcrafted Haven Artwork" 
                width={500}
                height={500}
                className="w-full max-w-[500px] h-auto object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Decorative shapes */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full h-auto">
            <path
              fill="var(--color-background)"
              d="M0,64L48,58.7C96,53,192,43,288,42.7C384,43,480,53,576,58.7C672,64,768,64,864,58.7C960,53,1056,43,1152,42.7C1248,43,1344,53,1392,58.7L1440,64L1440,80L1392,80C1344,80,1248,80,1152,80C1056,80,960,80,864,80C768,80,672,80,576,80C480,80,384,80,288,80C192,80,96,80,48,80L0,80Z"
            />
          </svg>
        </div>
      </section>

      {/* ===== LOVED THIS WEEK ===== */}
      <section className="py-16 md:py-24">
        <div className="container-app mb-10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Heart size={20} className="text-cta fill-cta" />
              <span className="font-ui text-sm text-text-muted uppercase tracking-widest">
                Community favorites
              </span>
            </div>
            <h2 className="font-display text-5xl md:text-6xl text-primary uppercase mb-3">
              Loved This Week
            </h2>
            <p className="font-body text-text-muted max-w-lg mx-auto">
              The most loved handcrafted pieces chosen by our community
            </p>
          </div>
          <LovedThisWeekCarousel products={lovedProducts.map((p) => ({
            ...p,
            price: Number(p.price),
            status: p.status,
            createdAt: p.createdAt.toISOString(),
            updatedAt: p.updatedAt.toISOString(),
          }))} />
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      {featuredProducts.length > 0 && (
        <section className="py-16 md:py-24 bg-surface-warm">
          <div className="container-app mb-10">
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={20} className="text-accent" />
                  <span className="font-ui text-sm text-text-muted uppercase tracking-widest">
                    Fresh from artisans
                  </span>
                </div>
                <h2 className="font-display text-5xl md:text-6xl text-primary uppercase mb-3">
                  Newest Arrivals
                </h2>
                <p className="font-body text-text-muted">
                  Fresh creations from our talented artisans
                </p>
              </div>
              <Link
                href="/shop"
                className="group hidden md:inline-flex items-center gap-2 font-body font-semibold text-accent hover:text-accent-hover transition-colors"
              >
                View All
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <LovedThisWeekCarousel
              products={featuredProducts.map((product) => ({
                ...product,
                price: Number(product.price),
                status: product.status,
                createdAt: product.createdAt.toISOString(),
                updatedAt: product.updatedAt.toISOString(),
              }))}
              direction={-1}
              edgeFadeBg="from-surface-warm"
            />

            <div className="md:hidden mt-8 text-center">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 bg-cta hover:bg-cta-hover text-text font-body font-semibold px-6 py-3 rounded-full transition-colors"
              >
                View All Products
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== SELLER CTA ===== */}
      <section className="py-16 md:py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-cta/30 to-accent/30" />
        </div>
        <div className="container-app relative z-10 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Star size={24} className="text-star" />
              <TrendingUp size={24} className="text-cta" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-white uppercase mb-4">
              Share Your Craft With the World
            </h2>
            <p className="font-body text-lg text-white/80 mb-8">
              Join our community of artisans. Create your shop, list your products, and connect with customers who appreciate handmade quality.
            </p>
            <Link
              href="/auth/register?role=seller"
              className="group inline-flex items-center gap-2 bg-cta hover:bg-cta-hover text-text font-body font-semibold px-8 py-3.5 rounded-full transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              Start Selling Today
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== MEET OUR ARTISANS ===== */}
      <section className="py-16 md:py-24">
        <div className="container-app max-w-5xl">
          <h2 className="font-display text-3xl md:text-4xl text-primary uppercase text-center mb-4">Meet Our Artisans</h2>
          <p className="font-body text-text-muted text-center max-w-2xl mx-auto mb-12">
            Discover the talented creators behind the handcrafted goods you love.
          </p>

          {activeSellers.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-8">
              {activeSellers.map((seller) => (
                <div key={seller.id} className="w-full md:w-[calc(33.333%-1.333rem)] bg-white rounded-2xl shadow-card p-5 sm:p-6 flex flex-row md:flex-col items-center md:items-center text-left md:text-center gap-4 md:gap-0 group hover:-translate-y-1 transition-all duration-300 hover:shadow-card-hover">
                  <div className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-full overflow-hidden md:mb-4 border-4 border-surface-warm group-hover:border-accent/20 transition-colors">
                    {seller.avatarUrl ? (
                      <Image src={seller.avatarUrl} alt={seller.name} fill sizes="96px" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary flex items-center justify-center text-white font-display text-2xl md:text-3xl">
                        {seller.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col md:items-center">
                    <h3 className="font-display text-lg md:text-xl text-primary uppercase mb-1 truncate md:overflow-visible md:whitespace-normal w-full">{seller.name}</h3>
                    {seller.location && (
                      <p className="font-ui text-xs font-semibold text-accent flex items-center gap-1 mb-2 md:mb-3">
                        <MapPin size={12} className="shrink-0" /> <span className="truncate">{seller.location}</span>
                      </p>
                    )}
                    <p className="font-body text-sm text-text-muted line-clamp-2 md:line-clamp-3 mb-3 md:mb-4 leading-relaxed">
                      {seller.bio || "An artisan on Handcrafted Haven creating unique handmade goods."}
                    </p>
                    <Link href={`/seller/${seller.id}`} className="mt-auto inline-flex items-center gap-2 font-ui text-sm font-semibold text-primary hover:text-accent transition-colors w-fit">
                      <Store size={16} /> Visit Shop
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center bg-white p-8 rounded-xl shadow-card">
              <p className="font-body text-text-muted">More artisans will be featured here soon!</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
