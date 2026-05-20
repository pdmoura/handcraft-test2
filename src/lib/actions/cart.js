'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getCartAction() {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const items = await prisma.cartItem.findMany({
      where: { userId: session.id },
      include: {
        product: {
          include: {
            images: { where: { isPrimary: true }, take: 1 },
            seller: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: items };
  } catch (error) {
    console.error('getCartAction error:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function addToCartAction(productId, quantity = 1) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    if (!productId) {
      return { success: false, error: 'Product ID is required' };
    }

    // Check product exists and is in stock
    const product = await prisma.product.findUnique({ where: { id: parseInt(productId) } });
    if (!product || product.status !== 'active') {
      return { success: false, error: 'Product not available' };
    }

    // Upsert cart item
    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: session.id,
          productId: parseInt(productId),
        },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        userId: session.id,
        productId: parseInt(productId),
        quantity,
      },
      include: {
        product: {
          include: {
            images: { where: { isPrimary: true }, take: 1 },
          },
        },
      },
    });

    revalidatePath('/cart');
    return { success: true, data: cartItem };
  } catch (error) {
    console.error('addToCartAction error:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function updateCartQuantityAction(cartItemId, quantity) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    if (!quantity || quantity < 1) {
      return { success: false, error: 'Valid quantity is required' };
    }

    const cartItem = await prisma.cartItem.findUnique({ where: { id: parseInt(cartItemId) } });
    if (!cartItem || cartItem.userId !== session.id) {
      return { success: false, error: 'Not found' };
    }

    const updated = await prisma.cartItem.update({
      where: { id: parseInt(cartItemId) },
      data: { quantity },
    });

    revalidatePath('/cart');
    return { success: true, data: updated };
  } catch (error) {
    console.error('updateCartQuantityAction error:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function removeCartItemAction(cartItemId) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const cartItem = await prisma.cartItem.findUnique({ where: { id: parseInt(cartItemId) } });
    if (!cartItem || cartItem.userId !== session.id) {
      return { success: false, error: 'Not found' };
    }

    await prisma.cartItem.delete({ where: { id: parseInt(cartItemId) } });

    revalidatePath('/cart');
    return { success: true, message: 'Item removed' };
  } catch (error) {
    console.error('removeCartItemAction error:', error);
    return { success: false, error: 'Internal server error' };
  }
}
