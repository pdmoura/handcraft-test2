import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '12');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minRating = searchParams.get('minRating');
    const sellerId = searchParams.get('sellerId');

    // Build where clause
    const where = { status: 'active' };

    if (category) {
      where.category = { slug: category };
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search.toLowerCase() } },
      ];
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) (where.price).gte = parseFloat(minPrice);
      if (maxPrice) (where.price).lte = parseFloat(maxPrice);
    }
    if (minRating) {
      where.avgRating = { gte: parseFloat(minRating) };
    }
    if (sellerId) {
      where.sellerId = parseInt(sellerId);
    }

    // Build orderBy
    let orderBy = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    else if (sort === 'price_desc') orderBy = { price: 'desc' };
    else if (sort === 'rating') orderBy = { avgRating: 'desc' };
    else if (sort === 'newest') orderBy = { createdAt: 'desc' };

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          images: { orderBy: { displayOrder: 'asc' }, take: 1 },
          seller: { select: { id: true, name: true, avatarUrl: true } },
          category: { select: { id: true, name: true, slug: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'seller') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, price, categoryId, tags, inventoryQty, images, status } = body;

    if (!title || !description || !price || !categoryId) {
      return NextResponse.json(
        { success: false, error: 'Title, description, price, and category are required' },
        { status: 400 }
      );
    }

    // Generate unique slug
    let slug = slugify(title);
    const existingSlug = await prisma.product.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    const product = await prisma.product.create({
      data: {
        sellerId: session.id,
        categoryId: parseInt(categoryId),
        title,
        slug,
        description,
        price: parseFloat(price),
        inventoryQty: parseInt(inventoryQty) || 0,
        tags: tags || [],
        status: status || 'active',
        images: images?.length
          ? {
              create: images.map((img, i) => ({
                url: img.url,
                publicId: img.publicId || null,
                displayOrder: i,
                isPrimary: i === 0,
              })),
            }
          : undefined,
      },
      include: {
        images: true,
        category: true,
        seller: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error('Products POST error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
