'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getOrdersAction() {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                slug: true,
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: orders };
  } catch (error) {
    console.error('getOrdersAction error:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function createOrderAction(shippingAddress) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

    if (!shippingAddress) {
      return { success: false, error: 'Shipping address is required' };
    }

    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.id },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return { success: false, error: 'Cart is empty' };
    }

    // Calculate total and validate stock
    let totalAmount = 0;
    for (const item of cartItems) {
      if (item.product.status !== 'active' || item.product.inventoryQty < item.quantity) {
        return {
          success: false,
          error: `${item.product.title} is out of stock or has insufficient quantity`,
        };
      }
      totalAmount += Number(item.product.price) * item.quantity;
    }

    // Create order with items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: session.id,
          status: 'confirmed',
          totalAmount,
          shippingAddress,
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: Number(item.product.price),
            })),
          },
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  images: { where: { isPrimary: true }, take: 1 },
                },
              },
            },
          },
        },
      });

      // Update inventory
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            inventoryQty: { decrement: item.quantity },
          },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({ where: { userId: session.id } });

      return newOrder;
    });

    revalidatePath('/account');
    revalidatePath('/dashboard/products'); // in case inventory changed
    return { success: true, data: order };
  } catch (error) {
    console.error('createOrderAction error:', error);
    return { success: false, error: 'Internal server error' };
  }
}
