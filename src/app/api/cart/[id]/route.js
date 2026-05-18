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

    const { id } = await params;
    const body = await request.json();
    const { quantity } = body;

    if (!quantity || quantity < 1) {
      return NextResponse.json({ success: false, error: 'Valid quantity is required' }, { status: 400 });
    }

    const cartItem = await prisma.cartItem.findUnique({ where: { id: parseInt(id) } });
    if (!cartItem || cartItem.userId !== session.id) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    const updated = await prisma.cartItem.update({
      where: { id: parseInt(id) },
      data: { quantity },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Cart PUT error:', error);
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
    const cartItem = await prisma.cartItem.findUnique({ where: { id: parseInt(id) } });
    if (!cartItem || cartItem.userId !== session.id) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    await prisma.cartItem.delete({ where: { id: parseInt(id) } });

    return NextResponse.json({ success: true, message: 'Item removed' });
  } catch (error) {
    console.error('Cart DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
