import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
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

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('Cart GET error:', error);
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
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 });
    }

    // Check product exists and is in stock
    const product = await prisma.product.findUnique({ where: { id: parseInt(productId) } });
    if (!product || product.status !== 'active') {
      return NextResponse.json({ success: false, error: 'Product not available' }, { status: 404 });
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

    return NextResponse.json({ success: true, data: cartItem }, { status: 201 });
  } catch (error) {
    console.error('Cart POST error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
