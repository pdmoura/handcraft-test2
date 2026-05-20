'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createReviewAction(data) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Must be logged in to review' };
    }

    const { productId, rating, comment, orderItemId } = data;

    if (!productId || !rating || !comment || !orderItemId) {
      return {
        success: false,
        error: 'Product ID, order item ID, rating, and comment are required',
      };
    }

    if (rating < 1 || rating > 5) {
      return {
        success: false,
        error: 'Rating must be between 1 and 5',
      };
    }

    // Verify the order item belongs to the user and hasn't been reviewed
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: parseInt(orderItemId) },
      include: { order: true, review: true },
    });

    if (!orderItem || orderItem.order.userId !== session.id || orderItem.productId !== parseInt(productId)) {
      return {
        success: false,
        error: 'Invalid order item or unauthorized',
      };
    }

    if (orderItem.review) {
      return {
        success: false,
        error: 'You have already reviewed this specific purchase',
      };
    }

    // Check that user isn't reviewing own product
    const product = await prisma.product.findUnique({ where: { id: parseInt(productId) } });
    if (product?.sellerId === session.id) {
      return {
        success: false,
        error: 'You cannot review your own product',
      };
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

    revalidatePath('/account');
    revalidatePath(`/shop/${product?.slug}`);
    return { success: true, data: review };
  } catch (error) {
    console.error('createReviewAction error:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function replyToReviewAction(reviewId, sellerReply) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const rId = parseInt(reviewId, 10);
    if (isNaN(rId)) {
      return { success: false, error: 'Invalid review ID' };
    }

    if (sellerReply === undefined) {
      return { success: false, error: 'sellerReply is required' };
    }

    // Check if review exists and get the product's seller ID
    const review = await prisma.review.findUnique({
      where: { id: rId },
      include: { product: true },
    });

    if (!review) {
      return { success: false, error: 'Review not found' };
    }

    if (review.product.sellerId !== session.id) {
      return { success: false, error: 'Forbidden. Only the seller can reply to this review.' };
    }

    const updatedReview = await prisma.review.update({
      where: { id: rId },
      data: {
        sellerReply: sellerReply === '' ? null : sellerReply,
        sellerReplyAt: sellerReply === '' ? null : new Date(),
      },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } }
      }
    });

    revalidatePath(`/shop/${review.product.slug}`);
    return { success: true, data: updatedReview };
  } catch (error) {
    console.error('replyToReviewAction error:', error);
    return { success: false, error: 'Internal server error' };
  }
}
