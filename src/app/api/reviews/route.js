import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ success: false, error: 'productId is required' }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: { productId: parseInt(productId) },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error('Reviews GET error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Must be logged in to review' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, rating, comment, orderItemId } = body;

    if (!productId || !rating || !comment || !orderItemId) {
      return NextResponse.json(
        { success: false, error: 'Product ID, order item ID, rating, and comment are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Verify the order item belongs to the user and hasn't been reviewed
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: parseInt(orderItemId) },
      include: { order: true, review: true },
    });

    if (!orderItem || orderItem.order.userId !== session.id || orderItem.productId !== parseInt(productId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid order item or unauthorized' },
        { status: 403 }
      );
    }

    if (orderItem.review) {
      return NextResponse.json(
        { success: false, error: 'You have already reviewed this specific purchase' },
        { status: 409 }
      );
    }

    // Check that user isn't reviewing own product
    const product = await prisma.product.findUnique({ where: { id: parseInt(productId) } });
    if (product?.sellerId === session.id) {
      return NextResponse.json(
        { success: false, error: 'You cannot review your own product' },
        { status: 400 }
      );
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        productId: parseInt(productId),
        userId: session.id,
        orderItemId: parseInt(orderItemId),
        rating: parseInt(rating),
        comment,
      },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    // Update product avg rating
    const stats = await prisma.review.aggregate({
      where: { productId: parseInt(productId) },
      _avg: { rating: true },
      _count: true,
    });

    await prisma.product.update({
      where: { id: parseInt(productId) },
      data: {
        avgRating: stats._avg.rating || 0,
        reviewCount: stats._count,
      },
    });

    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error) {
    console.error('Reviews POST error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
