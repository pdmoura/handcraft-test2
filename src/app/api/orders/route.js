import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
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

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('Orders GET error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { shippingAddress } = body;

    if (!shippingAddress) {
      return NextResponse.json({ success: false, error: 'Shipping address is required' }, { status: 400 });
    }

    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.id },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ success: false, error: 'Cart is empty' }, { status: 400 });
    }

    // Calculate total and validate stock
    let totalAmount = 0;
    for (const item of cartItems) {
      if (item.product.status !== 'active' || item.product.inventoryQty < item.quantity) {
        return NextResponse.json(
          { success: false, error: `${item.product.title} is out of stock or has insufficient quantity` },
          { status: 400 }
        );
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

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    console.error('Orders POST error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
