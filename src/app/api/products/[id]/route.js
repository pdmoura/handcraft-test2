import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(
  request,
  { params }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        seller: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            bio: true,
            location: true,
          },
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

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Product GET error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request,
  { params }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const productId = parseInt(id);

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.sellerId !== session.id) {
      return NextResponse.json({ success: false, error: 'Not found or unauthorized' }, { status: 404 });
    }

    const body = await request.json();
    const { title, description, price, categoryId, tags, inventoryQty, status, images } = body;

    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(categoryId && { categoryId: parseInt(categoryId) }),
        ...(tags && { tags }),
        ...(inventoryQty !== undefined && { inventoryQty: parseInt(inventoryQty) }),
        ...(status && { status }),
      },
      include: {
        images: true,
        category: true,
      },
    });

    // Handle images if provided
    if (images) {
      await prisma.productImage.deleteMany({ where: { productId } });
      await prisma.productImage.createMany({
        data: images.map((img, i) => ({
          productId,
          url: img.url,
          publicId: img.publicId || null,
          displayOrder: i,
          isPrimary: i === 0,
        })),
      });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Product PUT error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request,
  { params }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const productId = parseInt(id);

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.sellerId !== session.id) {
      return NextResponse.json({ success: false, error: 'Not found or unauthorized' }, { status: 404 });
    }

    await prisma.product.delete({ where: { id: productId } });

    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Product DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
