import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request,
  { params }
) {
  try {
    const { id } = await params;
    const seller = await prisma.user.findUnique({
      where: { id: parseInt(id), role: 'seller' },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        bio: true,
        location: true,
        socialLinks: true,
        createdAt: true,
        products: {
          where: { status: 'active' },
          include: {
            images: { where: { isPrimary: true }, take: 1 },
            category: { select: { name: true, slug: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!seller) {
      return NextResponse.json({ success: false, error: 'Seller not found' }, { status: 404 });
    }

    // Calculate stats
    const stats = await prisma.product.aggregate({
      where: { sellerId: parseInt(id), status: 'active' },
      _avg: { avgRating: true },
      _count: true,
    });

    return NextResponse.json({
      success: true,
      data: {
        ...seller,
        stats: {
          totalProducts: stats._count,
          avgRating: stats._avg.avgRating || 0,
        },
      },
    });
  } catch (error) {
    console.error('Seller GET error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
