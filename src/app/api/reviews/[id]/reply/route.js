import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PUT(
  request,
  { params }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const reviewId = parseInt(resolvedParams.id, 10);
    if (isNaN(reviewId)) {
      return NextResponse.json({ success: false, error: 'Invalid review ID' }, { status: 400 });
    }

    const body = await request.json();
    const { sellerReply } = body;

    if (sellerReply === undefined) {
      return NextResponse.json({ success: false, error: 'sellerReply is required' }, { status: 400 });
    }

    // Check if review exists and get the product's seller ID
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: { product: true },
    });

    if (!review) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }

    if (review.product.sellerId !== session.id) {
      return NextResponse.json({ success: false, error: 'Forbidden. Only the seller can reply to this review.' }, { status: 403 });
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        sellerReply: sellerReply === '' ? null : sellerReply,
        sellerReplyAt: sellerReply === '' ? null : new Date(),
      },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } }
      }
    });

    return NextResponse.json({ success: true, data: updatedReview });
  } catch (error) {
    console.error('Reply to review error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
